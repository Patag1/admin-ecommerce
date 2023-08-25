import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function GET(
  _req: Request,
  { params }: { params: { bbId: string } }
) {
  try {
    const { bbId } = params

    if (!bbId) {
      return new NextResponse('Billboard not found', { status: 404 })
    }

    const billboard = db.billboard.findUnique({
      where: { id: bbId },
    })

    return NextResponse.json(billboard)
  } catch (error) {
    console.log('[BILLBOARD_GET]: ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; bbId: string } }
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    const { label, imageUrl } = await req.json()

    if (!label) {
      return new NextResponse('Label is required', { status: 400 })
    }

    if (!imageUrl) {
      return new NextResponse('Image is required', { status: 400 })
    }

    const { storeId, bbId } = params

    if (!storeId) {
      return new NextResponse('Store not found', { status: 404 })
    }

    if (!bbId) {
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

    const billboard = db.billboard.updateMany({
      where: { id: bbId },
      data: {
        label,
        imageUrl,
      },
    })

    return NextResponse.json(billboard)
  } catch (error) {
    console.log('[BILLBOARD_PATCH]: ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; bbId: string } }
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    const { storeId, bbId } = params

    if (!storeId) {
      return new NextResponse('Store not found', { status: 404 })
    }

    if (!bbId) {
      return new NextResponse('Billboard not found', { status: 404 })
    }

    const billboard = db.billboard.deleteMany({
      where: { id: bbId },
    })

    return NextResponse.json(billboard)
  } catch (error) {
    console.log('[BILLBOARD_DELETE]: ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
