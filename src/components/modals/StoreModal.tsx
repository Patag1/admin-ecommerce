'use client'

import { FC, useState } from 'react'
import * as z from 'zod'
import { useModal } from '@/hooks/useModal'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Modal } from '../ui/modal'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { toast } from 'react-hot-toast'

interface StoreModalProps {}

const formSchema = z.object({
  name: z.string().min(1),
})

const StoreModal: FC<StoreModalProps> = ({}) => {
  const [loading, setLoading] = useState(false)

  const { isOpen, onClose } = useModal()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (loading) return
    setLoading(true)
    try {
      const response = await axios.post('/api/stores', values)
      window.location.assign(`/${response.data.id}`)
    } catch (_error) {
      toast('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="Create store" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4 py-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="E-commerce"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-6 space-x-2 flex justify-end items-center w-full">
              <Button
                variant={'outline'}
                onClick={onClose}
                type="button"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  )
}

export default StoreModal
