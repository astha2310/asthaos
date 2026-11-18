'use client'

import { ShieldCheck, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function LoginToast() {
  const [phase, setPhase] = useState<'in' | 'out' | 'gone'>('in')

  useEffect(() => {
    if (phase === 'in') {
      const timer = window.setTimeout(() => setPhase('out'), 5000)
      return () => window.clearTimeout(timer)
    }
    if (phase === 'out') {
      const timer = window.setTimeout(() => setPhase('gone'), 400)
      return () => window.clearTimeout(timer)
    }
  }, [phase])

  if (phase === 'gone') return null

  return (
    <div
      role="status"
      className={cn(
        'glass fixed top-16 right-3 z-[70] flex w-80 max-w-[calc(100vw-1.5rem)] items-start gap-3 rounded-2xl p-4 shadow-window transition-all duration-400 animate-in fade-in slide-in-from-right-8 motion-reduce:transition-none',
        phase === 'out' && 'translate-x-8 opacity-0',
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-mint text-navy">
        <ShieldCheck className="size-5" aria-hidden="true" />
      </span>
      <div className="flex flex-1 flex-col gap-0.5">
        <p className="text-sm font-semibold text-foreground">New login detected: Recruiter.</p>
        <p className="text-sm text-muted-foreground">Welcome to AsthaOS.</p>
      </div>
      <button
        type="button"
        onClick={() => setPhase('out')}
        className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-card/70 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
      >
        <X className="size-4" aria-hidden="true" />
        <span className="sr-only">Dismiss notification</span>
      </button>
    </div>
  )
}
