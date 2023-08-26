'use client'

import { FC, useState } from 'react'
import { SizeColumn } from './columns'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import AlertModal from '@/components/modals/AlertModal'

interface CellActionProps {
  data: SizeColumn
}

const CellAction: FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const { storeId } = useParams()

  const router = useRouter()

  const onCopy = () => {
    navigator.clipboard.writeText(data.id)
    toast('Size id copied to clipboard')
  }

  const onDelete = async () => {
    if (loading) return

    setLoading(true)

    try {
      await axios.delete(`/api/${storeId}/sizes/${data.id}`)
      router.refresh()
      toast('Size deleted')
    } catch (error) {
      toast('Make sure you removed all products using this size first')
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        loading={loading}
        onConfirm={onDelete}
        onClose={() => setOpen(false)}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-8 h-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={onCopy}>
            <Copy className="w-4 h-4 mr-2" />
            Copy id
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/${storeId}/sizes/${data.id}`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default CellAction
