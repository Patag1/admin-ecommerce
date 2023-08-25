'use client'

import { FC } from 'react'
import { useParams, useRouter } from 'next/navigation'

import Header from '@/components/ui/header'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

interface BillboardClientProps {}

const BillboardClient: FC<BillboardClientProps> = ({}) => {
  const { storeId } = useParams()

  const router = useRouter()
  
  return (
    <>
      <div className="flex justify-between items-center">
        <Header
          title="Billboards (0)"
          desc="Manage billboards for your store"
        />
        <Button size="icon" onClick={() => router.push(`/${storeId}/billboards/new`)}>
          <Plus className="w-4 h-4 mr-2" />
          Add new
        </Button>
      </div>
      <Separator />
    </>
  )
}

export default BillboardClient
