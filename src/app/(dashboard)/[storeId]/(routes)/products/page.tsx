import { FC } from 'react'
import { db } from '@/lib/db'
import { ProductColumn } from './components/columns'
import { format } from 'date-fns'
import ProductClient from './components/client'
import { priceFormatter } from '@/lib/utils'

interface pageProps {
  params: { storeId: string }
}

const page: FC<pageProps> = async ({ params }) => {
  const { storeId } = params

  const products = await db.product.findMany({
    where: { storeId },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedProducts: ProductColumn[] = products.map((p) => ({
    id: p.id,
    name: p.name,
    isFeatured: p.isFeatured,
    isArchived: p.isArchived,
    price: priceFormatter.format(p.price.toNumber()),
    category: p.category.name,
    size: p.size.name,
    color: p.color.value,
    createdAt: format(p.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <div className="flex flex-col">
      <div className="p-8 pt-6 flex-1 space-y-4">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  )
}

export default page
