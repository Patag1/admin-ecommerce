'use client'

import { FC } from 'react'
import { useParams, useRouter } from 'next/navigation'

import Header from '@/components/ui/header'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { CategoryColumn, columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import ApiList from '@/components/ui/api-list'

interface CategoryClientProps {
  data: CategoryColumn[]
}

const CategoryClient: FC<CategoryClientProps> = ({ data }) => {
  const { storeId } = useParams()

  const router = useRouter()

  return (
    <>
      <div className="flex justify-between items-center">
        <Header
          title={`Categories (${data.length})`}
          desc="Manage categories for your store"
        />
        <Button onClick={() => router.push(`/${storeId}/categories/new`)}>
          <Plus className="w-4 h-4 mr-2" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Separator />
      <Header title="API" desc="API calls for categories" />
      <Separator />
      <ApiList entityName="categories" entityIdName="categoryId" />
    </>
  )
}

export default CategoryClient
