'use client'

import { FC, useState } from 'react'
import { Size } from '@prisma/client'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'

import Header from '@/components/ui/header'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'react-hot-toast'
import AlertModal from '@/components/modals/AlertModal'
import ImageUpload from '@/components/ui/image-upload'

interface SizeFormProps {
  initData: Size | null
}

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
})

type SizeFormValues = z.infer<typeof formSchema>

const SizeForm: FC<SizeFormProps> = ({ initData }) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const { storeId, sizeId } = useParams()

  const router = useRouter()

  const title = initData ? 'Edit size' : 'Create size'
  const desc = initData ? 'Edit a size' : 'Add a new size'
  const toastMessage = initData ? 'Size updated' : 'Size created'
  const action = initData ? 'Save changes' : 'Create'

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initData || {
      name: '',
      value: '',
    },
  })

  const onSubmit = async (data: SizeFormValues) => {
    if (loading) return

    setLoading(true)

    try {
      if (initData) {
        await axios.patch(`/api/${storeId}/sizes/${sizeId}`, data)
      } else {
        await axios.post(`/api/${storeId}/sizes`, data)
      }
      router.refresh()
      router.push(`/${storeId}/sizes`)
      toast(toastMessage)
    } catch (error) {
      toast('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {
    if (loading) return

    setLoading(true)

    try {
      await axios.delete(`/api/${storeId}/sizes/${sizeId}`)
      router.refresh()
      router.push(`/${storeId}/sizes`)
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
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex justify-between items-center">
        <Header title={title} desc={desc} />
        {initData && (
          <Button
            size={'sm'}
            variant={'destructive'}
            onClick={() => setOpen(true)}
            disabled={loading}
          >
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Size name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Size value"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  )
}

export default SizeForm
