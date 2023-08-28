import { FC } from 'react'
import MainNav from './MainNav'
import { UserButton, auth } from '@clerk/nextjs'
import StoreSwitcher from './StoreSwitcher'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { ThemeToggle } from '../ui/theme-toggle'

interface NavbarProps {}

const Navbar: FC<NavbarProps> = async ({}) => {
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const stores = await db.store.findMany({
    where: { userId },
  })

  return (
    <div className="border-b">
      <div className="h-16 px-4 flex items-center">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  )
}

export default Navbar
