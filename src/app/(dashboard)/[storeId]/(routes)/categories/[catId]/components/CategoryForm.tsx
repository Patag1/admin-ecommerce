'use client'

import { FC, useState } from 'react'
import { Billboard, Category } from '@prisma/client'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'

import Header from '@/components/ui/header'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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

interface CategoryFormProps {
  billboards: Billboard[]
  initData: Category | null
}

const formSchema = z.object({
  name: z.string().min(1),
  bbId: z.string().min(1),
})

type CategoryFormValues = z.infer<typeof formSchema>

const CategoryForm: FC<CategoryFormProps> = ({ billboards, initData }) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const { storeId, catId } = useParams()

  const router = useRouter()

  const title = initData ? 'Edit category' : 'Create category'
  const desc = initData ? 'Edit a category' : 'Add a new category'
  const toastMessage = initData ? 'Category updated' : 'Category created'
  const action = initData ? 'Save changes' : 'Create'

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initData || {
      name: '',
      bbId: '',
    },
  })

  const onSubmit = async (data: CategoryFormValues) => {
    if (loading) return

    setLoading(true)

    try {
      if (initData) {
        await axios.patch(`/api/${storeId}/categories/${catId}`, data)
      } else {
        await axios.post(`/api/${storeId}/categories`, data)
      }
      router.refresh()
      router.push(`/${storeId}/categories`)
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
      await axios.delete(`/api/${storeId}/categories/${catId}`)
      router.refresh()
      router.push(`/${storeId}/categories`)
      toast('Category deleted')
    } catch (error) {
      toast(
        'Make sure you removed all products using this category first'
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
                      placeholder="Category name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bbId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a billboard"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((b, i) => (
                        <SelectItem key={i} value={b.id}>
                          {b.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

export default CategoryForm
