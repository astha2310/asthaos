'use client'

import { createContext, useContext } from 'react'

export type OsNotice = { title: string; body?: string }

type OsContextValue = {
  openApp: (id: string) => void
  closeApp: (id: string) => void
  notify: (notice: OsNotice) => void
}

export const OsContext = createContext<OsContextValue | null>(null)

export function useOs() {
  const value = useContext(OsContext)
  if (!value) throw new Error('useOs must be used inside the AsthaOS desktop')
  return value
}

export const CONTACT = {
  email: 'asthaspatel2002@gmail.com',
  linkedin: 'https://www.linkedin.com/in/asthap23',
  interviewMailto: 'mailto:asthaspatel2002@gmail.com?subject=Interview%20with%20Astha',
}
