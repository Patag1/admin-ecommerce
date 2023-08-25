'use client'

import { FC, useState } from 'react'
import { Billboard } from '@prisma/client'
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
import { toast } from 'sonner'
import Toast from '@/components/ui/toast'
import AlertModal from '@/components/modals/AlertModal'
import ImageUpload from '@/components/ui/image-upload'

interface BillboardFormProps {
  initData: Billboard | null
}

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
})

type BillboardFormValues = z.infer<typeof formSchema>

const BillboardForm: FC<BillboardFormProps> = ({ initData }) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const { storeId, bbId } = useParams()

  const router = useRouter()

  const title = initData ? 'Edit billboard' : 'Create billboard'
  const desc = initData ? 'Edit a billboard' : 'Add a new billboard'
  const toastMessage = initData ? 'Billboard updated' : 'Billboard created'
  const action = initData ? 'Save changes' : 'Create'

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initData || {
      label: '',
      imageUrl: '',
    },
  })

  const onSubmit = async (data: BillboardFormValues) => {
    if (loading) return

    setLoading(true)

    try {
      if (initData) {
        await axios.patch(`/api/${storeId}/billboards/${bbId}`, data)
      } else {
        await axios.post(`/api/${storeId}/billboards`, data)
      }
      router.refresh()
      router.push(`/${storeId}/billboards`)
      toast(<Toast text={toastMessage} />)
    } catch (error) {
      toast(<Toast text="Something went wrong" />)
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {
    if (loading) return

    setLoading(true)

    try {
      await axios.delete(`/api/${storeId}/billboards/${bbId}`)
      router.refresh()
      router.push('/')
      toast(<Toast text="Billboard deleted" />)
    } catch (error) {
      toast(
        <Toast text="Make sure you removed all categories using this billboard first" />
      )
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
            disabled={loading}
            variant={'destructive'}
            size={'sm'}
            onClick={() => setOpen(true)}
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
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange('')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Billboard label"
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
      <Separator />
    </>
  )
}

export default BillboardForm
