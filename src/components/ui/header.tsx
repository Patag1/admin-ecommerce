import { FC } from 'react'

interface HeaderProps {
  title: string
  desc: string
}

const Header: FC<HeaderProps> = ({ title, desc }) => {
  return (
    <div className="flex flex-col justify-between items-start">
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  )
}

export default Header
