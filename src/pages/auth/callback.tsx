import { handleCallback } from '@/modules/auth/auth'
import React, { useEffect } from 'react'

export default function callback() {
  useEffect(() => {
    handleCallback()
  }, [])

  return <div></div>
}
