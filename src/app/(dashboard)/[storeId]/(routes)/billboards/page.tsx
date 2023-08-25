import { FC } from 'react'
import BillboardClient from './components/BillboardClient'

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="flex flex-col">
      <div className="p-8 pt-6 flex-1 space-y-4">
        <BillboardClient />
      </div>
    </div>
  )
}

export default page
