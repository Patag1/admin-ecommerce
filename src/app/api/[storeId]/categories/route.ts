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

    const categories = await db.category.findMany({
      where: { storeId },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.log('[CATEGORIES_GET]: ', error)
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

    const { name, bbId } = await req.json()

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    if (!bbId) {
      return new NextResponse('Billboard is required', { status: 400 })
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

    const category = await db.category.create({
      data: {
        name,
        bbId,
        storeId,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.log('[CATEGORIES_POST]: ', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
