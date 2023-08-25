import { FC, useEffect, useState } from 'react'
import { Modal } from '../ui/modal'
import { Button } from '../ui/button'

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  loading: boolean
}

const AlertModal: FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      <Modal
        title="Are you sure?"
        desc="This action cannot be undone"
        isOpen={isOpen}
        onClose={onClose}
      />
      <div className="w-full pt-6 space-x-2 flex justify-end items-center">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </>
  )
}

export default AlertModal
