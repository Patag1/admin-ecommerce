import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { name } = await req.json()

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    const { storeId } = params

    if (!storeId) {
      return new NextResponse('Store not found', { status: 404 })
    }

    const store = db.store.updateMany({
      where: { id: storeId, userId },
      data: {
        name,
      },
    })

    return NextResponse.json(store)
  } catch (error) {
    console.log('[STORE_PATCH]: ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { storeId } = params

    if (!storeId) {
      return new NextResponse('Store not found', { status: 404 })
    }

    const store = db.store.deleteMany({
      where: { id: storeId, userId },
    })

    return NextResponse.json(store)
  } catch (error) {
    console.log('[STORE_DELETE]: ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
