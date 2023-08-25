import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function GET(
  _req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { storeId } = params

    if (!storeId) {
      return new NextResponse('Store not found', { status: 404 })
    }

    const billboards = await db.billboard.findMany({
      where: { storeId },
    })

    return NextResponse.json(billboards)
  } catch (error) {
    console.log('[BILLBOARDS_GET]', error)
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

    const { label, imageUrl } = await req.json()

    if (!label) {
      return new NextResponse('Label is required', { status: 400 })
    }

    if (!imageUrl) {
      return new NextResponse('Image is required', { status: 400 })
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

    const billboard = await db.billboard.create({
      data: {
        label,
        imageUrl,
        storeId,
      },
    })

    return NextResponse.json(billboard)
  } catch (error) {
    console.log('[BILLBOARDS_POST]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
