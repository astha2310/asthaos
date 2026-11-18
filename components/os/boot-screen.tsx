'use client'

import { ChevronsRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

const LINES: { label: string; status?: string; tone: string }[] = [
  { label: 'AsthaOS v2026 booting...', tone: 'text-plasma-soft' },
  { label: 'Loading firewall...', status: 'OK', tone: 'text-cyber' },
  { label: 'Checking MFA module...', status: 'OK', tone: 'text-cyber' },
  { label: 'Encrypting secrets...', status: 'OK', tone: 'text-cyber' },
  { label: 'All systems secure.', tone: 'text-flare-soft' },
]

const FULL_LINES = LINES.map((line) => (line.status ? `${line.label} ${line.status}` : line.label))
const TOTAL_CHARS = FULL_LINES.reduce((sum, line) => sum + line.length, 0)
const TICK_MS = 24
const HOLD_TICKS = 16

export function BootScreen({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onDoneRef.current()
      return
    }
    const interval = window.setInterval(() => {
      setCount((value) => Math.min(value + 1, TOTAL_CHARS + HOLD_TICKS))
    }, TICK_MS)

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onDoneRef.current()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearInterval(interval)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  useEffect(() => {
    if (count >= TOTAL_CHARS + HOLD_TICKS) onDoneRef.current()
  }, [count])

  let remaining = count
  let cursorPlaced = false

  return (
    <div className="wallpaper fixed inset-0 flex flex-col p-6 md:p-12">
      <p className="sr-only" role="status">
        AsthaOS is booting. Press Escape or use the Skip button to continue to sign in.
      </p>
      <button
        type="button"
        autoFocus
        onClick={onDone}
        className="ml-auto flex items-center gap-1 rounded-full border border-cyber/40 px-3 py-1.5 font-mono text-xs text-cyber transition-colors hover:bg-cyber/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyber"
      >
        Skip
        <ChevronsRight className="size-3.5" aria-hidden="true" />
      </button>

      <div className="mx-auto mt-auto mb-auto flex w-full max-w-xl flex-col gap-2 font-mono text-sm md:text-base" aria-hidden="true">
        {LINES.map((line, index) => {
          const full = FULL_LINES[index]
          const visible = Math.max(0, Math.min(remaining, full.length))
          remaining -= full.length
          const isTyping = !cursorPlaced && visible < full.length
          if (isTyping) cursorPlaced = true
          if (visible === 0 && !isTyping) return null

          const labelPart = full.slice(0, Math.min(visible, line.label.length))
          const statusPart = visible > line.label.length ? full.slice(line.label.length, visible) : ''

          return (
            <p key={line.label} className={cn('leading-relaxed', line.tone)}>
              <span className="mr-2 text-muted-foreground">{'>'}</span>
              {labelPart}
              {statusPart && <span className="font-semibold text-cyber">{statusPart}</span>}
              {isTyping && <span className="caret ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-flare" />}
            </p>
          )
        })}
        {!cursorPlaced && <span className="caret ml-5 inline-block h-4 w-2 bg-flare" />}
      </div>
    </div>
  )
}
