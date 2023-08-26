import { FC } from 'react'
import { Toaster } from 'react-hot-toast'
import ModalProvider from './ModalProvider'

interface ProviderProps {
  children: React.ReactNode
}

const Provider: FC<ProviderProps> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster position="bottom-right" />
      <ModalProvider />
    </>
  )
}

export default Provider
