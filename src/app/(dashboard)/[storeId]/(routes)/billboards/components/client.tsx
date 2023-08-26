'use client'

import { FC } from 'react'
import { useParams, useRouter } from 'next/navigation'

import Header from '@/components/ui/header'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { BillboardColumn, columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import ApiList from '@/components/ui/api-list'

interface BillboardClientProps {
  data: BillboardColumn[]
}

const BillboardClient: FC<BillboardClientProps> = ({ data }) => {
  const { storeId } = useParams()

  const router = useRouter()

  return (
    <>
      <div className="flex justify-between items-center">
        <Header
          title={`Billboards (${data.length})`}
          desc="Manage billboards for your store"
        />
        <Button onClick={() => router.push(`/${storeId}/billboards/new`)}>
          <Plus className="w-4 h-4 mr-2" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="label" columns={columns} data={data} />
      <Separator />
      <Header title="API" desc="API calls for billboards" />
      <Separator />
      <ApiList entityName="billboards" entityIdName="billboardId" />
    </>
  )
}

export default BillboardClient
