import { FC } from 'react'
import { db } from '@/lib/db'
import BillboardForm from './components/BillboardForm'

interface pageProps {
  params: { bbId: string }
}

const page: FC<pageProps> = async ({ params }) => {
  const { bbId } = params

  const billboard = await db.billboard.findFirst({
    where: { id: bbId },
  })

  return (
    <div className="flex flex-col">
      <div className="p-8 pt-6 flex-1 space-y-4">
        <BillboardForm initData={billboard} />
      </div>
    </div>
  )
}

export default page
