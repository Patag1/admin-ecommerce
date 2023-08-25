'use client'

import { FC } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './dialog'

interface ModalProps {
  title: string
  desc?: string
  isOpen: boolean
  onClose: () => void
  children?: React.ReactNode
}

export const Modal: FC<ModalProps> = ({
  title,
  desc,
  isOpen,
  onClose,
  children,
}) => {
  const onChange = (open: boolean) => !open && onClose()

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {desc && <DialogDescription>{desc}</DialogDescription>}
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  )
}
