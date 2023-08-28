'use client'

import { useModal } from '@/hooks/useModal'
import { useEffect } from 'react'

export default function SetupPage() {
  const { isOpen, onOpen } = useModal()

  useEffect(() => {
    !isOpen && onOpen()
  }, [isOpen, onOpen])
  
  return null
}
