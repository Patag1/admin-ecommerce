'use client'

import { FC } from 'react'
import { useParams, useRouter } from 'next/navigation'

import Header from '@/components/ui/header'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { ProductColumn, columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import ApiList from '@/components/ui/api-list'

interface ProductClientProps {
  data: ProductColumn[]
}

const ProductClient: FC<ProductClientProps> = ({ data }) => {
  const { storeId } = useParams()
  const router = useRouter()

  return (
    <>
      <div className="flex justify-between items-center">
        <Header
          title={`Products (${data.length})`}
          desc="Manage products for your store"
        />
        <Button onClick={() => router.push(`/${storeId}/products/new`)}>
          <Plus className="w-4 h-4 mr-2" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Separator />
      <Header title="API" desc="API calls for products" />
      <Separator />
      <ApiList entityName="products" entityIdName="productId" />
    </>
  )
}

export default ProductClient
