'use client'

import { cn } from '@/lib/utils'
import { APP_BY_ID, tintClasses } from './apps'
import type { WinState } from './os-window'

type DockProps = {
  wins: WinState[]
  activeId: string | null
  isMobile: boolean
  onRestore: (id: string) => void
}

export function Dock({ wins, activeId, isMobile, onRestore }: DockProps) {
  return (
    <nav aria-label="Open windows" className="relative z-30 flex justify-center px-3 pt-2 pb-3">
      <div className="glass flex min-h-16 items-center rounded-3xl px-3 py-2 shadow-soft">
        {wins.length === 0 ? (
          <p className="px-3 font-mono text-xs text-muted-foreground">
            {isMobile ? 'Tap an app to open it' : 'Double-click an icon to open it'}
          </p>
        ) : (
          <ul className="flex items-center gap-1.5">
            {wins.map((win) => {
              const app = APP_BY_ID[win.id]
              const Icon = app.icon
              const isActive = win.id === activeId
              return (
                <li key={win.id} className="relative">
                  <button
                    id={`dock-${win.id}`}
                    type="button"
                    onClick={() => onRestore(win.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className="group flex flex-col items-center gap-1 rounded-2xl p-1 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span
                      className={cn(
                        'flex size-11 items-center justify-center rounded-xl transition-transform group-hover:-translate-y-1 motion-reduce:transition-none',
                        tintClasses[app.tint],
                        win.minimized && 'opacity-60',
                      )}
                    >
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn('size-1 rounded-full', isActive ? 'bg-foreground' : 'bg-muted-foreground/50')}
                    />
                    <span className="sr-only">
                      {win.minimized ? 'Restore' : 'Show'} {app.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-primary px-2 py-1 font-mono text-xs whitespace-nowrap text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                    >
                      {app.label}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </nav>
  )
}
