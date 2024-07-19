import { Popup } from '@/components/popup'
import { useState } from 'react'

export default function Home() {
  const [isOpen, setIsOpen] = useState(true)

  const handleClose = () => {
    setIsOpen(false)
  }

  return isOpen ? <Popup onClose={handleClose} /> : null
}