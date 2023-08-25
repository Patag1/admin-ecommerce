import { FC } from 'react'
import ModalProvider from './ModalProvider'

interface ProviderProps {
  children: React.ReactNode
}

const Provider: FC<ProviderProps> = ({ children }) => {
  return (
    <>
      {children}
      <ModalProvider />
    </>
  )
}

export default Provider
