'use client'

import { FC } from 'react'
import { useParams, useRouter } from 'next/navigation'

import Header from '@/components/ui/header'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { SizeColumn, columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import ApiList from '@/components/ui/api-list'

interface SizeClientProps {
  data: SizeColumn[]
}

const SizeClient: FC<SizeClientProps> = ({ data }) => {
  const { storeId } = useParams()
  const router = useRouter()

  return (
    <>
      <div className="flex justify-between items-center">
        <Header
          title={`Sizes (${data.length})`}
          desc="Manage sizes for your store"
        />
        <Button onClick={() => router.push(`/${storeId}/sizes/new`)}>
          <Plus className="w-4 h-4 mr-2" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Separator />
      <Header title="API" desc="API calls for sizes" />
      <Separator />
      <ApiList entityName="sizes" entityIdName="sizeId" />
    </>
  )
}

export default SizeClient
