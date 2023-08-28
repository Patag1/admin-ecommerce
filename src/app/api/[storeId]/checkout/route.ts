import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { storeId } = params

  if (!storeId) {
    return new NextResponse('Store not found', { status: 404 })
  }

  const { prodIds } = await req.json()

  if (!prodIds || !prodIds.length) {
    return new NextResponse('No products provided', { status: 400 })
  }

  const products = await db.product.findMany({
    where: {
      id: {
        in: prodIds,
      },
    },
  })

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []

  products.forEach((prod) => {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: 'USD',
        product_data: {
          name: prod.name,
        },
        unit_amount: prod.price.toNumber() * 100,
      },
    })
  })

  const order = await db.order.create({
    data: {
      storeId,
      isPaid: false,
      orderItems: {
        create: prodIds.map((prodId: string) => ({
          product: {
            connect: {
              id: prodId,
            },
          },
        })),
      },
    },
  })

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    billing_address_collection: 'required',
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    metadata: {
      orderId: order.id,
    },
  })

  return NextResponse.json({ url: session.url }, { headers: corsHeaders })
}
