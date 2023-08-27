import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function GET(
  _req: Request,
  { params }: { params: { prodId: string } }
) {
  try {
    const { prodId } = params

    if (!prodId) {
      return new NextResponse('Product not found', { status: 404 })
    }

    const product = await db.product.findUnique({
      where: { id: prodId },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log('[PRODUCT_GET]: ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; prodId: string } }
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
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

    const { storeId, prodId } = params

    if (!storeId) {
      return new NextResponse('Store not found', { status: 404 })
    }

    if (!prodId) {
      return new NextResponse('Billboard not found', { status: 404 })
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

    console.log('ANTES: ', price)

    await db.product.update({
      where: { id: prodId },
      data: {
        name,
        price,
        isFeatured,
        isArchived,
        catId,
        sizeId,
        colorId,
        images: {
          deleteMany: {},
        },
      },
    })

    const product = await db.product.update({
      where: { id: prodId },
      data: {
        images: {
          createMany: {
            data: [...images.map((img: { url: string }) => img)],
          },
        },
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log('[PRODUCT_PATCH]: ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; prodId: string } }
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    const { storeId, prodId } = params

    if (!storeId) {
      return new NextResponse('Store not found', { status: 404 })
    }

    if (!prodId) {
      return new NextResponse('Product not found', { status: 404 })
    }

    const product = await db.product.deleteMany({
      where: { id: prodId },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log('[PRODUCT_DELETE]: ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
