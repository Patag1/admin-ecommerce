import { FC } from 'react'
import { db } from '@/lib/db'
import { SizeColumn } from './components/columns'
import { format } from 'date-fns'
import SizeClient from './components/client'

interface pageProps {
  params: { storeId: string }
}

const page: FC<pageProps> = async ({ params }) => {
  const { storeId } = params

  const sizes = await db.size.findMany({
    where: { storeId },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedSizes: SizeColumn[] = sizes.map((s) => ({
    id: s.id,
    name: s.name,
    value: s.value,
    createdAt: format(s.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <div className="flex flex-col">
      <div className="p-8 pt-6 flex-1 space-y-4">
        <SizeClient data={formattedSizes} />
      </div>
    </div>
  )
}

export default page
