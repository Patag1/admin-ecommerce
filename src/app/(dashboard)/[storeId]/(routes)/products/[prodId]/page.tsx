import { FC } from 'react'
import { db } from '@/lib/db'
import ProductForm from './components/ProductForm'

interface pageProps {
  params: { storeId: string; prodId: string }
}

const page: FC<pageProps> = async ({ params }) => {
  const { storeId, prodId } = params

  const product = await db.product.findFirst({
    where: { id: prodId },
    include: { images: true },
  })

  const categories = await db.category.findMany({
    where: { storeId },
  })
  
  const sizes = await db.size.findMany({
    where: { storeId },
  })
  
  const colors = await db.color.findMany({
    where: { storeId },
  })

  return (
    <div className="flex flex-col">
      <div className="p-8 pt-6 flex-1 space-y-4">
        <ProductForm
          initData={product}
          categories={categories}
          sizes={sizes}
          colors={colors}
        />
      </div>
    </div>
  )
}

export default page
