import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

const tintMap = {
  cyber: 'bg-cyber/12 text-cyber ring-cyber/30',
  plasma: 'bg-plasma/18 text-plasma-soft ring-plasma/40',
  flare: 'bg-flare/15 text-flare-soft ring-flare/35',
  blue: 'bg-signal/20 text-sky-200 ring-signal/50',
} as const

export function TagChip({
  tint = 'plasma',
  mono = true,
  children,
}: {
  tint?: keyof typeof tintMap
  mono?: boolean
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs ring-1',
        mono ? 'font-mono' : 'font-sans font-medium',
        tintMap[tint],
      )}
    >
      {children}
    </span>
  )
}
