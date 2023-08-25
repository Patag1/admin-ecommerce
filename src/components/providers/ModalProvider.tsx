'use client'

import { FC, useEffect, useState } from 'react'
import StoreModal from '../modals/StoreModal'

interface ModalProviderProps {}

const ModalProvider: FC<ModalProviderProps> = ({}) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      <StoreModal />
    </>
  )
}

export default ModalProvider
