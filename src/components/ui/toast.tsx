import { FC } from 'react'

interface toastProps {
  text: string
}

const Toast: FC<toastProps> = ({ text }) => {
  return <div>{text}</div>
}

export default Toast