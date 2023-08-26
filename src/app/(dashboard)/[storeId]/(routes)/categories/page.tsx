import { FC } from 'react'
import { db } from '@/lib/db'
import { CategoryColumn } from './components/columns'
import { format } from 'date-fns'
import CategoryClient from './components/client'

interface pageProps {
  params: { storeId: string }
}

const page: FC<pageProps> = async ({ params }) => {
  const { storeId } = params

  const categories = await db.category.findMany({
    where: { storeId },
    include: { billboard: true },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedCategories: CategoryColumn[] = categories.map((c) => ({
    id: c.id,
    name: c.name,
    bbLabel: c.billboard.label,
    createdAt: format(c.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <div className="flex flex-col">
      <div className="p-8 pt-6 flex-1 space-y-4">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  )
}

export default page
