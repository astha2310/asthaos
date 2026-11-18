'use client'

import { ShieldCheck, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import type { OsNotice } from './os-context'

type OsToastProps = OsNotice & { onGone: () => void }

export function OsToast({ title, body, onGone }: OsToastProps) {
  const [phase, setPhase] = useState<'in' | 'out'>('in')

  useEffect(() => {
    const timer =
      phase === 'in' ? window.setTimeout(() => setPhase('out'), 5000) : window.setTimeout(onGone, 400)
    return () => window.clearTimeout(timer)
  }, [phase, onGone])

  return (
    <div
      role="status"
      className={cn(
        'glass fixed top-16 right-3 z-[70] flex w-80 max-w-[calc(100vw-1.5rem)] items-start gap-3 rounded-2xl p-4 shadow-window transition-all duration-400 animate-in fade-in slide-in-from-right-8 motion-reduce:transition-none',
        phase === 'out' && 'translate-x-8 opacity-0',
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-cyber/15 text-cyber">
        <ShieldCheck className="size-5" aria-hidden="true" />
      </span>
      <div className="flex flex-1 flex-col gap-0.5">
        <p className="text-sm font-semibold text-pretty text-foreground">{title}</p>
        {body && <p className="text-sm text-pretty text-muted-foreground">{body}</p>}
      </div>
      <button
        type="button"
        onClick={() => setPhase('out')}
        className="flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-card/70 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
      >
        <X className="size-4" aria-hidden="true" />
        <span className="sr-only">Dismiss notification</span>
      </button>
    </div>
  )
}
