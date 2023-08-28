import { FC } from 'react'
import { Toaster } from 'react-hot-toast'
import ModalProvider from './ModalProvider'
import { ThemeProvider } from './ThemeProvider'

interface ProviderProps {
  children: React.ReactNode
}

const Provider: FC<ProviderProps> = ({ children }) => {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <Toaster position="bottom-right" />
        <ModalProvider />
      </ThemeProvider>
    </>
  )
}

export default Provider
