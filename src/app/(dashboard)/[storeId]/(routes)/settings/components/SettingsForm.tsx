'use client'

import { FC, useState } from 'react'
import { Store } from '@prisma/client'
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
import ApiAlert from '@/components/ui/api-alert'
import { useOrigin } from '@/hooks/useOrigin'

interface SettingsFormProps {
  initData: Store
}

const formSchema = z.object({
  name: z.string().min(1),
})

type SettingsFormValues = z.infer<typeof formSchema>

const SettingsForm: FC<SettingsFormProps> = ({ initData }) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const { storeId } = useParams()

  const router = useRouter()

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initData,
  })

  const onSubmit = async (data: SettingsFormValues) => {
    if (loading) return

    setLoading(true)

    try {
      await axios.patch(`/api/stores/${storeId}`, data)
      router.refresh()
      toast(<Toast text="Store updated" />)
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
      await axios.delete(`/api/stores/${storeId}`)
      router.refresh()
      router.push('/')
      toast(<Toast text="Store deleted" />)
    } catch (error) {
      toast(
        <Toast text="Make sure you removed all products and categories first" />
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
        <Header title="Settings" desc="Manage store preferences" />
        <Button
          disabled={loading}
          variant={'destructive'}
          size={'sm'}
          onClick={() => setOpen(true)}
        >
          <Trash className="w-4 h-4" />
        </Button>
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
                      placeholder="Store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            Save changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert title="NEXT_PUBLIC_API_URL" desc={`${useOrigin()}/api/${storeId}`} variant="public" />
    </>
  )
}

export default SettingsForm
