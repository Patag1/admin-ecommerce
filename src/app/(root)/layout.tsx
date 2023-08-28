import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { FC } from 'react'

interface SetupLayoutProps {
  children: React.ReactNode
}

const SetupLayout: FC<SetupLayoutProps> = async ({ children }) => {
  console.log('ERROR 1')
  const { userId } = auth()
  console.log('ERROR 2')

  if (!userId) {
    redirect('/sign-in')
  }

  const store = await db.store.findFirst({
    where: { userId },
  })
  console.log('ERROR 3')

  if (store) {
    redirect(`/${store.id}`)
  }

  return (
    <>{children}</>
  )
}

export default SetupLayout
