'use client'

import { FC, useState } from 'react'
import { Store } from '@prisma/client'
import { useModal } from '@/hooks/useModal'
import { useParams, useRouter } from 'next/navigation'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import {
  Check,
  ChevronsUpDown,
  PlusCircle,
  Store as StoreIcon,
} from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '../ui/command'

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[]
}

const StoreSwitcher: FC<StoreSwitcherProps> = ({
  className,
  items = [],
}: StoreSwitcherProps) => {
  const { onOpen } = useModal()
  const { storeId } = useParams()
  const router = useRouter()

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }))

  const currentStore = formattedItems.find((item) => item.value === storeId)

  const [open, setOpen] = useState(false)

  const onStoreSelect = (store: { label: string; value: string }) => {
    setOpen(false)
    router.push(`/${store.value}`)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
          className={cn('w-[200px] justify-between', className)}
        >
          <StoreIcon className="w-4 h-4 mr-2" />
          {currentStore?.label}
          <ChevronsUpDown className="w-4 h-4 ml-auto shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search store..." />
            <CommandEmpty>No store found</CommandEmpty>
            <CommandGroup heading="Stores">
              {formattedItems.map((store, i) => (
                <CommandItem
                  key={i}
                  onSelect={() => onStoreSelect(store)}
                  className="text-sm"
                >
                  <StoreIcon className="w-4 h-4 mr-2" />
                  {store.label}
                  <Check
                    className={cn(
                      'w-4 h-4 ml-auto',
                      currentStore?.value === store.value
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  onOpen()
                }}
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Create store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default StoreSwitcher
