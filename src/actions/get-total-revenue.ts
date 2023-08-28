import { db } from '@/lib/db'

export const getTotalRevenue = async (storeId: string) => {
  const paidOrders = await db.order.findMany({
    where: { storeId, isPaid: true },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  })

  const totalRevenue = paidOrders.reduce((acc0, order) => {
    const total = order.orderItems.reduce((acc1, prod) => {
      return acc1 + prod.product.price.toNumber()
    }, 0)

    return acc0 + total
  }, 0)

  return totalRevenue
}
