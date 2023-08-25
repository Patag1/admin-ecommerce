import { FC } from 'react'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import Navbar from '@/components/navbar/Navbar'

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
      <Navbar />
      {children}
    </>
  )
}

export default layout
