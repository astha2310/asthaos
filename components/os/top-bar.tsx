'use client'

import { Lock, LockKeyhole, Moon, Shield, ShieldCheck, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type TopBarProps = {
  stealth: boolean
  onToggleStealth: () => void
  onLock: () => void
}

export function TopBar({ stealth, onToggleStealth, onLock }: TopBarProps) {
  return (
    <header className="glass relative z-30 mx-2 mt-2 grid h-12 grid-cols-[1fr_auto] items-center gap-3 rounded-2xl px-3 shadow-soft md:mx-3 md:grid-cols-[1fr_auto_1fr] md:px-4">
      <div className="flex items-center gap-2 justify-self-start font-semibold tracking-tight text-foreground">
        <span className="flex size-7 items-center justify-center rounded-lg bg-sky text-navy">
          <Shield className="size-4" aria-hidden="true" />
        </span>
        AsthaOS
      </div>

      <ThreatPill className="hidden md:flex" />

      <div className="flex items-center gap-1.5 justify-self-end md:gap-2">
        <Clock />
        <span
          className="flex size-8 items-center justify-center rounded-full bg-mint text-navy"
          title="Secure session"
        >
          <LockKeyhole className="size-4" aria-hidden="true" />
          <span className="sr-only">Secure session active</span>
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={stealth}
          onClick={onToggleStealth}
          className="flex h-8 items-center gap-2 rounded-full px-2 text-sm font-medium text-foreground transition-colors hover:bg-card/70 focus-visible:outline-2 focus-visible:outline-ring"
        >
          {stealth ? (
            <Moon className="size-4" aria-hidden="true" />
          ) : (
            <Sun className="size-4" aria-hidden="true" />
          )}
          <span className="sr-only lg:not-sr-only lg:whitespace-nowrap">Stealth Mode</span>
          <span
            aria-hidden="true"
            className={cn(
              'relative flex h-5 w-9 items-center rounded-full p-0.5 transition-colors',
              stealth ? 'bg-lavender' : 'bg-foreground/15',
            )}
          >
            <span
              className={cn(
                'size-4 rounded-full bg-navy shadow-soft transition-transform motion-reduce:transition-none',
                stealth && 'translate-x-4',
              )}
            />
          </span>
        </button>
        <button
          type="button"
          onClick={onLock}
          className="flex h-8 items-center gap-1.5 rounded-full bg-primary px-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
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
        'items-center gap-2 rounded-full bg-mint px-3 py-1 text-xs font-medium text-navy shadow-soft',
        className,
      )}
    >
      <ShieldCheck className="size-3.5" aria-hidden="true" />
      <span>
        Threat level: <strong className="font-semibold">LOW</strong> · Candidate is hireable
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
