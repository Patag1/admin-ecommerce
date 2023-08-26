import { FC } from 'react'
import { db } from '@/lib/db'
import { ColorColumn } from './components/columns'
import { format } from 'date-fns'
import ColorClient from './components/client'

interface pageProps {
  params: { storeId: string }
}

const page: FC<pageProps> = async ({ params }) => {
  const { storeId } = params

  const colors = await db.color.findMany({
    where: { storeId },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedColors: ColorColumn[] = colors.map((c) => ({
    id: c.id,
    name: c.name,
    value: c.value,
    createdAt: format(c.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <div className="flex flex-col">
      <div className="p-8 pt-6 flex-1 space-y-4">
        <ColorClient data={formattedColors} />
      </div>
    </div>
  )
}

export default page
