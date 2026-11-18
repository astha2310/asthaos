import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

const tintMap = {
  sky: 'bg-sky',
  lavender: 'bg-lavender',
  blush: 'bg-blush',
  mint: 'bg-mint',
} as const

export function TagChip({
  tint = 'lavender',
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
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs text-navy ring-1 ring-navy/10',
        mono ? 'font-mono' : 'font-sans font-medium',
        tintMap[tint],
      )}
    >
      {children}
    </span>
  )
}
