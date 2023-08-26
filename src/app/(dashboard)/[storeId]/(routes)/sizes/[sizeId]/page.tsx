import { FC } from 'react'
import { db } from '@/lib/db'
import SizeForm from './components/SizeForm'

interface pageProps {
  params: { sizeId: string }
}

const page: FC<pageProps> = async ({ params }) => {
  const { sizeId } = params

  const size = await db.size.findFirst({
    where: { id: sizeId },
  })

  return (
    <div className="flex flex-col">
      <div className="p-8 pt-6 flex-1 space-y-4">
        <SizeForm initData={size} />
      </div>
    </div>
  )
}

export default page
