import { FC } from 'react'

interface layoutProps {
  children: React.ReactNode
}

const layout: FC<layoutProps> = ({ children }) => {
  return (
    <div className="h-full flex justify-center items-center">{children}</div>
  )
}

export default layout
