import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { storeId } = params

    if (!storeId) {
      return new NextResponse('Store not found', { status: 404 })
    }

    const { searchParams } = new URL(req.url)

    const catId = searchParams.get('catId') || undefined
    const sizeId = searchParams.get('sizeId') || undefined
    const colorId = searchParams.get('colorId') || undefined
    const isFeatured = searchParams.get('isFeatured')

    const products = await db.product.findMany({
      where: {
        storeId,
        catId,
        sizeId,
        colorId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.log('[PRODUCTS_GET]: ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    const { storeId } = params

    if (!storeId) {
      return new NextResponse('Store not found', { status: 404 })
    }

    const {
      name,
      price,
      isFeatured,
      isArchived,
      images,
      catId,
      sizeId,
      colorId,
    } = await req.json()

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    if (!price) {
      return new NextResponse('Price is required', { status: 400 })
    }

    if (!images || !images.length) {
      return new NextResponse('At least one image is required', { status: 400 })
    }

    if (!catId) {
      return new NextResponse('Category is required', { status: 400 })
    }

    if (!sizeId) {
      return new NextResponse('Size is required', { status: 400 })
    }

    if (!colorId) {
      return new NextResponse('Size is required', { status: 400 })
    }

    const storeByUserId = await db.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    })

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    const product = await db.product.create({
      data: {
        name,
        price,
        isFeatured,
        isArchived,
        catId,
        sizeId,
        colorId,
        storeId,
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image),
            ],
          },
        },
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log('[PRODUCTS_POST]: ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
