import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    const { name } = await req.json()

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    const store = await db.store.create({
      data: {
        name,
        userId,
      },
    })
    console.log(userId)
    console.log(store)
    return NextResponse.json(store)
  } catch (error) {
    console.log('[STORES_POST]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}