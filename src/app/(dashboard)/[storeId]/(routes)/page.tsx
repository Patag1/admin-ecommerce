import { FC } from 'react'
import Header from '@/components/ui/header'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, DollarSign, Package } from 'lucide-react'
import { priceFormatter } from '@/lib/utils'
import { getTotalRevenue } from '@/actions/get-total-revenue'
import Overview from '@/components/ui/overview'
import { getGraphRevenue } from '@/actions/get-graph-revenue'
import { db } from '@/lib/db'

interface DashboardPageProps {
  params: { storeId: string }
}

const DashboardPage: FC<DashboardPageProps> = async ({ params }) => {
  const { storeId } = params
  console.log('ERROR 4')

  const totalRevenue = await getTotalRevenue(storeId)
  console.log('ERROR 5')

  const salesCount = await db.order.count({
    where: { storeId, isPaid: true },
  })
  console.log('ERROR 6')

  const stockCount = await db.product.count({
    where: { storeId, isArchived: false },
  })
  console.log('ERROR 7')

  const graphRevenue = await getGraphRevenue(storeId)
  console.log('ERROR 8')

  return (
    <div className="flex-col">
      <div className="p-8 pt-6 flex-1 space-y-4">
        <Header title="Dashboard" desc="Overview of your store" />
        <Separator />
        <div className="pt-4 grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2 flex flex-row justify-between items-center space-y-0">
              <CardTitle className="text-sm font-medium">
                Total revenue
              </CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {priceFormatter.format(totalRevenue)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 flex flex-row justify-between items-center space-y-0">
              <CardTitle className="text-sm font-medium">
                Sales
              </CardTitle>
              <CreditCard className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                +{salesCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 flex flex-row justify-between items-center space-y-0">
              <CardTitle className="text-sm font-medium">
                Products in stock
              </CardTitle>
              <Package className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stockCount}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className='col-span-4'>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className='pl-0'>
            <Overview data={graphRevenue} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage
