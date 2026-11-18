'use client'

import { Binary, Lock, LockKeyhole, Shield, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type TopBarProps = {
  matrix: boolean
  onToggleMatrix: () => void
  onLock: () => void
}

export function TopBar({ matrix, onToggleMatrix, onLock }: TopBarProps) {
  return (
    <header className="glass relative z-30 mx-2 mt-2 grid h-12 grid-cols-[1fr_auto] items-center gap-3 rounded-2xl px-3 shadow-soft md:mx-3 md:grid-cols-[1fr_auto_1fr] md:px-4">
      <div className="flex items-center gap-2 justify-self-start font-semibold tracking-tight">
        <span className="bg-brand-gradient flex size-7 items-center justify-center rounded-lg text-midnight">
          <Shield className="size-4" aria-hidden="true" />
        </span>
        <span className="text-brand-gradient">AsthaOS</span>
      </div>

      <ThreatPill className="hidden md:flex" />

      <div className="flex items-center gap-1.5 justify-self-end md:gap-2">
        <Clock />
        <span
          className="flex size-8 items-center justify-center rounded-full bg-cyber/15 text-cyber ring-1 ring-cyber/30"
          title="Secure session"
        >
          <LockKeyhole className="size-4" aria-hidden="true" />
          <span className="sr-only">Secure session active</span>
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={matrix}
          onClick={onToggleMatrix}
          className="flex h-8 items-center gap-2 rounded-full px-2 text-sm font-medium text-foreground transition-colors hover:bg-card focus-visible:outline-2 focus-visible:outline-ring"
        >
          <Binary className={cn('size-4', matrix && 'text-cyber')} aria-hidden="true" />
          <span className="sr-only lg:not-sr-only lg:whitespace-nowrap">Matrix Mode</span>
          <span
            aria-hidden="true"
            className={cn(
              'relative flex h-5 w-9 items-center rounded-full p-0.5 ring-1 transition-colors',
              matrix ? 'bg-cyber/30 ring-cyber/60' : 'bg-foreground/10 ring-foreground/20',
            )}
          >
            <span
              className={cn(
                'size-4 rounded-full shadow-soft transition-transform motion-reduce:transition-none',
                matrix ? 'translate-x-4 bg-cyber' : 'bg-muted-foreground',
              )}
            />
          </span>
        </button>
        <button
          type="button"
          onClick={onLock}
          className="flex h-8 items-center gap-1.5 rounded-full bg-primary px-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <Lock className="size-3.5" aria-hidden="true" />
          <span className="sr-only lg:not-sr-only">Lock</span>
        </button>
      </div>
    </header>
  )
}

export function ThreatPill({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        'bg-brand-gradient items-center gap-2 rounded-full p-px text-xs font-medium shadow-soft',
        className,
      )}
    >
      <span className="flex items-center gap-2 rounded-full bg-midnight/85 px-3 py-1 text-foreground">
        <ShieldCheck className="size-3.5 text-cyber" aria-hidden="true" />
        <span>
          Threat level: <strong className="font-semibold text-cyber">LOW</strong> · Candidate is hireable
        </span>
      </span>
    </p>
  )
}

function Clock() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const interval = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  if (!now) return <span className="w-16" aria-hidden="true" />

  return (
    <time
      dateTime={now.toISOString()}
      className="px-1 font-mono text-xs whitespace-nowrap text-foreground tabular-nums md:text-sm"
    >
      <span className="hidden xl:inline">
        {now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
        {' · '}
      </span>
      {now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
    </time>
  )
}
