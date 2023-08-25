import { FC } from 'react'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import SettingsForm from './components/SettingsForm'

interface pageProps {
  params: { storeId: string }
}

const page: FC<pageProps> = async ({ params }) => {
  const { storeId } = params
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const store = await db.store.findFirst({
    where: { id: storeId, userId },
  })

  if (!store) {
    redirect('/')
  }

  return (
    <div className="flex flex-col">
      <div className="p-8 pt-6 flex-1 space-y-4">
        <SettingsForm initData={store} />
      </div>
    </div>
  )
}

export default page
