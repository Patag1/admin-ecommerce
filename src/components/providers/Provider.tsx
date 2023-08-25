import { FC } from 'react'
import { Toaster } from 'sonner'
import ModalProvider from './ModalProvider'

interface ProviderProps {
  children: React.ReactNode
}

const Provider: FC<ProviderProps> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster position="bottom-center" />
      <ModalProvider />
    </>
  )
}

export default Provider
