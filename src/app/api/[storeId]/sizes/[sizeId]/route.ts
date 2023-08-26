import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function GET(
  _req: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    const { sizeId } = params

    if (!sizeId) {
      return new NextResponse('Size not found', { status: 404 })
    }

    const size = await db.size.findUnique({
      where: { id: sizeId },
    })

    return NextResponse.json(size)
  } catch (error) {
    console.log('[SIZE_GET]: ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    const { name, value } = await req.json()

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    if (!value) {
      return new NextResponse('Value is required', { status: 400 })
    }

    const { storeId, sizeId } = params

    if (!storeId) {
      return new NextResponse('Store not found', { status: 404 })
    }

    if (!sizeId) {
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

    const size = await db.size.updateMany({
      where: { id: sizeId },
      data: {
        name,
        value,
      },
    })

    return NextResponse.json(size)
  } catch (error) {
    console.log('[SIZE_PATCH]: ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    const { storeId, sizeId } = params

    if (!storeId) {
      return new NextResponse('Store not found', { status: 404 })
    }

    if (!sizeId) {
      return new NextResponse('Size not found', { status: 404 })
    }

    const size = await db.size.deleteMany({
      where: { id: sizeId },
    })

    return NextResponse.json(size)
  } catch (error) {
    console.log('[SIZE_DELETE]: ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
