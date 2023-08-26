import { FC } from 'react'
import { db } from '@/lib/db'
import CategoryForm from './components/CategoryForm'

interface pageProps {
  params: { storeId: string; catId: string }
}

const page: FC<pageProps> = async ({ params }) => {
  const { storeId, catId } = params

  const category = await db.category.findFirst({
    where: { id: catId },
  })

  const billboards = await db.billboard.findMany({
    where: { storeId },
  })

  return (
    <div className="flex flex-col">
      <div className="p-8 pt-6 flex-1 space-y-4">
        <CategoryForm billboards={billboards} initData={category} />
      </div>
    </div>
  )
}

export default page
