import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { FC } from 'react'

interface layoutProps {
  children: React.ReactNode
  params: { storeId: string }
}

const layout: FC<layoutProps> = async ({ children, params }) => {
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const store = await db.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  })

  if (!store) {
    redirect('/')
  }

  return (
    <>
      <nav>this is a navbar</nav>
      {children}
    </>
  )
}

export default layout
