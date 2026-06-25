'use client'

import { useEffect } from 'react'

export default function HideSiteChrome() {
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `.site-header, .site-footer { display: none !important; }`
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return null
}