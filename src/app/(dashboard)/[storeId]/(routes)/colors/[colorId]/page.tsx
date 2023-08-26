import { FC } from 'react'
import { db } from '@/lib/db'
import ColorForm from './components/ColorForm'

interface pageProps {
  params: { colorId: string }
}

const page: FC<pageProps> = async ({ params }) => {
  const { colorId } = params

  const color = await db.color.findFirst({
    where: { id: colorId },
  })

  return (
    <div className="flex flex-col">
      <div className="p-8 pt-6 flex-1 space-y-4">
        <ColorForm initData={color} />
      </div>
    </div>
  )
}

export default page
