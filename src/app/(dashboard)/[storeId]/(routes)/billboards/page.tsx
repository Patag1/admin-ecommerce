import { FC } from 'react'
import { db } from '@/lib/db'
import { BillboardColumn } from './components/columns'
import { format } from 'date-fns'
import BillboardClient from './components/client'

interface pageProps {
  params: { storeId: string }
}

const page: FC<pageProps> = async ({ params }) => {
  const { storeId } = params

  const billboards = await db.billboard.findMany({
    where: { storeId },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedBillboards: BillboardColumn[] = billboards.map((b) => ({
    id: b.id,
    label: b.label,
    createdAt: format(b.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <div className="flex flex-col">
      <div className="p-8 pt-6 flex-1 space-y-4">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  )
}

export default page
