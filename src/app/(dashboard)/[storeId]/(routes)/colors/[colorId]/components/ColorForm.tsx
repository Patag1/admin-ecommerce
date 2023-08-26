'use client'

import { FC, useState } from 'react'
import { Color } from '@prisma/client'
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

interface SizeFormProps {
  initData: Color | null
}

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(4).regex(/^#/, {
    message: 'Color must be a valid hex color',
  }),
})

type SizeFormValues = z.infer<typeof formSchema>

const SizeForm: FC<SizeFormProps> = ({ initData }) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const { storeId, colorId } = useParams()

  const router = useRouter()

  const title = initData ? 'Edit color' : 'Create color'
  const desc = initData ? 'Edit a color' : 'Add a new color'
  const toastMessage = initData ? 'Color updated' : 'Color created'
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
        await axios.patch(`/api/${storeId}/colors/${colorId}`, data)
      } else {
        await axios.post(`/api/${storeId}/colors`, data)
      }
      router.refresh()
      router.push(`/${storeId}/colors`)
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
      await axios.delete(`/api/${storeId}/colors/${colorId}`)
      router.refresh()
      router.push(`/${storeId}/colors`)
      toast('color deleted')
    } catch (error) {
      toast('Make sure you removed all products using this color first')
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
            size={'icon'}
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
                      placeholder="Color name"
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
                    <div className="flex items-center gap-x-4">
                      <Input disabled={loading} placeholder="HEX" {...field} />
                      <div
                        className="p-4 border rounded-full transition-colors duration-300 ease-in-out"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
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
