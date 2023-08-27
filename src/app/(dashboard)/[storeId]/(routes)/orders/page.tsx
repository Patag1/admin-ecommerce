import { FC } from 'react'
import { db } from '@/lib/db'
import { OrderColumn } from './components/columns'
import { format } from 'date-fns'
import OrderClient from './components/client'
import { priceFormatter } from '@/lib/utils'

interface pageProps {
  params: { storeId: string }
}

const page: FC<pageProps> = async ({ params }) => {
  const { storeId } = params

  const orders = await db.order.findMany({
    where: { storeId },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedOrders: OrderColumn[] = orders.map((o) => ({
    id: o.id,
    isPaid: o.isPaid,
    phone: o.phone,
    address: o.address,
    products: o.orderItems.map((oItem) => oItem.product.name).join(', '),
    totalPrice: priceFormatter.format(
      o.orderItems.reduce((acc, oItem) => {
        return acc + Number(oItem.product.price)
      }, 0)
    ),
    createdAt: format(o.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <div className="flex flex-col">
      <div className="p-8 pt-6 flex-1 space-y-4">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  )
}

export default page
