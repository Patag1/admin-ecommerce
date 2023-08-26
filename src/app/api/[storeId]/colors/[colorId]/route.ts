import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function GET(
  _req: Request,
  { params }: { params: { colorId: string } }
) {
  try {
    const { colorId } = params

    if (!colorId) {
      return new NextResponse('Color not found', { status: 404 })
    }

    const color = await db.color.findUnique({
      where: { id: colorId },
    })

    return NextResponse.json(color)
  } catch (error) {
    console.log('[COLOR_GET]: ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
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

    const { storeId, colorId } = params

    if (!storeId) {
      return new NextResponse('Store not found', { status: 404 })
    }

    if (!colorId) {
      return new NextResponse('Color not found', { status: 404 })
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

    const color = await db.color.updateMany({
      where: { id: colorId },
      data: {
        name,
        value,
      },
    })

    return NextResponse.json(color)
  } catch (error) {
    console.log('[COLOR_PATCH]: ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    const { storeId, colorId } = params

    if (!storeId) {
      return new NextResponse('Store not found', { status: 404 })
    }

    if (!colorId) {
      return new NextResponse('Color not found', { status: 404 })
    }

    const color = await db.color.deleteMany({
      where: { id: colorId },
    })

    return NextResponse.json(color)
  } catch (error) {
    console.log('[COLOR_DELETE]: ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
