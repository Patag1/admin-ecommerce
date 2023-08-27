import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function GET(
  _req: Request,
  { params }: { params: { catId: string } }
) {
  try {
    const { catId } = params

    if (!catId) {
      return new NextResponse('Billboard not found', { status: 404 })
    }

    const category = await db.category.findUnique({
      where: { id: catId },
      include: { billboard: true },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.log('[CATEGORY_GET]: ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; catId: string } }
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    const { name, bbId } = await req.json()

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    if (!bbId) {
      return new NextResponse('Billboard is required', { status: 400 })
    }

    const { storeId, catId } = params

    if (!storeId) {
      return new NextResponse('Store not found', { status: 404 })
    }

    if (!catId) {
      return new NextResponse('Category not found', { status: 404 })
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

    const category = await db.category.updateMany({
      where: { id: catId },
      data: {
        name,
        bbId,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.log('[CATEGORY_PATCH]: ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; catId: string } }
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    const { storeId, catId } = params

    if (!storeId) {
      return new NextResponse('Store not found', { status: 404 })
    }

    if (!catId) {
      return new NextResponse('Category not found', { status: 404 })
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

    const category = await db.category.deleteMany({
      where: { id: catId },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.log('[CATEGORY_DELETE]: ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
