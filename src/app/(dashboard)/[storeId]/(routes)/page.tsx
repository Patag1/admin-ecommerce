import { FC } from 'react'
import { db } from '@/lib/db'

interface DashboardPageProps {
  params: { storeId: string }
}

const DashboardPage: FC<DashboardPageProps> = async ({ params }) => {
  const { storeId } = params

  const store = await db.store.findFirst({
    where: { id: storeId }
  })

  return <div>Active store: {store?.name}</div>
}

export default DashboardPage