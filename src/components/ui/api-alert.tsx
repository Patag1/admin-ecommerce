'use client'

import { FC } from 'react'
import { Alert, AlertDescription, AlertTitle } from './alert'
import { Copy, Server } from 'lucide-react'
import { Badge, BadgeProps } from './badge'
import { Button } from './button'
import { toast } from 'sonner'
import Toast from './toast'

interface ApiAlertProps {
  title: string
  desc: string
  variant: 'public' | 'admin'
}

const textMap: Record<ApiAlertProps['variant'], string> = {
  public: 'Public',
  admin: 'Admin',
}

const variantMap: Record<ApiAlertProps['variant'], BadgeProps['variant']> = {
  public: 'secondary',
  admin: 'destructive',
}

const ApiAlert: FC<ApiAlertProps> = ({ title, desc, variant = 'public' }) => {
  const onCopy = () => {
    navigator.clipboard.writeText(desc)
    toast(<Toast text="API route copied to the clipboard" />)
  }

  return (
    <Alert>
      <Server className="w-4 h-4" />
      <AlertTitle className="flex items-center gap-x-2">
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 flex justify-between items-center">
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2] font-mono text-sm font-semibold">
          {desc}
        </code>
        <Button variant="outline" size="icon" onClick={onCopy}>
          <Copy className="w-4 h-4" />
        </Button>
      </AlertDescription>
    </Alert>
  )
}

export default ApiAlert
