'use client'

import { ArrowLeft, LockKeyhole, Maximize2, Minimize2, Minus, X, type LucideIcon } from 'lucide-react'
import { useEffect, useRef, type PointerEvent } from 'react'
import { cn } from '@/lib/utils'
import type { AppDef } from './apps'

export type WinState = {
  id: string
  z: number
  x: number
  y: number
  minimized: boolean
  maximized: boolean
}

type OsWindowProps = {
  app: AppDef
  win: WinState
  active: boolean
  isMobile: boolean
  getBounds: () => DOMRect | undefined
  onFocus: (id: string) => void
  onClose: (id: string) => void
  onMinimize: (id: string) => void
  onToggleMax: (id: string) => void
  onMove: (id: string, x: number, y: number) => void
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export function OsWindow({
  app,
  win,
  active,
  isMobile,
  getBounds,
  onFocus,
  onClose,
  onMinimize,
  onToggleMax,
  onMove,
}: OsWindowProps) {
  const ref = useRef<HTMLElement>(null)
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null)
  const titleId = `win-title-${app.id}`
  const Icon = app.icon

  useEffect(() => {
    if (!active || win.minimized) return
    const el = ref.current
    if (el && !el.contains(document.activeElement)) el.focus({ preventScroll: true })
  }, [active, win.minimized])

  const shared = {
    ref,
    role: 'dialog' as const,
    'aria-labelledby': titleId,
    tabIndex: -1,
    hidden: win.minimized,
    onPointerDownCapture: () => !active && onFocus(app.id),
    onFocus: () => !active && onFocus(app.id),
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        if (isMobile) onMinimize(app.id)
        else onClose(app.id)
      }
    },
  }

  if (isMobile) {
    return (
      <section
        {...shared}
        style={{ zIndex: win.z }}
        className="wallpaper pointer-events-auto absolute inset-0 flex flex-col outline-none animate-in fade-in slide-in-from-bottom-6 duration-300"
      >
        <header className="glass m-2 flex h-14 shrink-0 items-center gap-2 rounded-2xl px-2 shadow-soft">
          <button
            type="button"
            onClick={() => onMinimize(app.id)}
            className="flex size-10 items-center justify-center rounded-xl text-foreground hover:bg-card/70 focus-visible:outline-2 focus-visible:outline-ring"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
            <span className="sr-only">Back to home screen</span>
          </button>
          <span id={titleId} className="flex flex-1 items-center gap-2 truncate font-mono text-sm text-foreground">
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            {app.label}
          </span>
          <button
            type="button"
            onClick={() => onClose(app.id)}
            className="flex size-10 items-center justify-center rounded-xl text-foreground hover:bg-card/70 focus-visible:outline-2 focus-visible:outline-ring"
          >
            <X className="size-5" aria-hidden="true" />
            <span className="sr-only">Close {app.label}</span>
          </button>
        </header>
        <div className="mx-2 mb-2 flex flex-1 flex-col overflow-hidden rounded-2xl border border-glass-border bg-window">
          <WindowBody app={app} />
        </div>
      </section>
    )
  }

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (win.maximized || event.button !== 0) return
    if ((event.target as HTMLElement).closest('button')) return
    drag.current = { px: event.clientX, py: event.clientY, x: win.x, y: win.y }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    const start = drag.current
    if (!start) return
    const bounds = getBounds()
    const width = ref.current?.offsetWidth ?? 560
    const maxX = (bounds?.width ?? window.innerWidth) - 96
    const maxY = (bounds?.height ?? window.innerHeight) - 44
    onMove(
      app.id,
      clamp(start.x + event.clientX - start.px, 96 - width, maxX),
      clamp(start.y + event.clientY - start.py, 0, maxY),
    )
  }

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    drag.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <section
      {...shared}
      style={
        win.maximized
          ? { zIndex: win.z }
          : {
              zIndex: win.z,
              left: win.x,
              top: win.y,
              width: 'min(560px, calc(100% - 32px))',
              height: 'min(380px, calc(100% - 32px))',
            }
      }
      className={cn(
        'pointer-events-auto absolute flex flex-col overflow-hidden rounded-2xl border border-glass-border bg-window backdrop-blur-xl outline-none animate-in fade-in zoom-in-95 duration-200',
        win.maximized && 'inset-2',
        active ? 'shadow-window' : 'shadow-soft',
      )}
    >
      <div
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={(event) => {
          if (!(event.target as HTMLElement).closest('button')) onToggleMax(app.id)
        }}
        className={cn(
          'flex h-11 shrink-0 touch-none items-center gap-3 border-b border-border bg-titlebar px-3 select-none',
          !win.maximized && 'cursor-grab active:cursor-grabbing',
        )}
      >
        <div className="group/dots flex items-center gap-1">
          <WindowDot label={`Close ${app.label}`} color="bg-blush" icon={X} onClick={() => onClose(app.id)} />
          <WindowDot
            label={`Minimize ${app.label}`}
            color="bg-lavender"
            icon={Minus}
            onClick={() => onMinimize(app.id)}
          />
          <WindowDot
            label={win.maximized ? `Restore ${app.label} size` : `Maximize ${app.label}`}
            color="bg-mint"
            icon={win.maximized ? Minimize2 : Maximize2}
            onClick={() => onToggleMax(app.id)}
          />
        </div>
        <span
          id={titleId}
          className={cn(
            'flex flex-1 items-center justify-center gap-2 truncate font-mono text-sm',
            active ? 'text-foreground' : 'text-muted-foreground',
          )}
        >
          <Icon className="size-4 shrink-0" aria-hidden="true" />
          {app.label}
        </span>
        <span className="w-16" aria-hidden="true" />
      </div>
      <WindowBody app={app} />
    </section>
  )
}

function WindowDot({
  label,
  color,
  icon: Icon,
  onClick,
}: {
  label: string
  color: string
  icon: LucideIcon
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex size-5 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className={cn('flex size-3.5 items-center justify-center rounded-full ring-1 ring-navy/20', color)}>
        <Icon
          className="size-2.5 text-navy opacity-0 transition-opacity group-focus-within/dots:opacity-100 group-hover/dots:opacity-100"
          strokeWidth={3}
          aria-hidden="true"
        />
      </span>
    </button>
  )
}

function WindowBody({ app }: { app: AppDef }) {
  return (
    <div className="flex flex-1 flex-col gap-5 overflow-auto p-6">
      <h2 className="font-mono text-xl font-semibold text-foreground">{app.label}</h2>
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-background/40 p-4">
        <p role="status" className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
          <LockKeyhole className="size-4" aria-hidden="true" />
          Decrypting contents...
        </p>
        <div
          role="progressbar"
          aria-label={`Decrypting ${app.label}`}
          className="relative h-2 overflow-hidden rounded-full bg-lavender/60"
        >
          <div className="shimmer-bar absolute inset-y-0 left-0 w-2/5 rounded-full" />
        </div>
        <p className="font-mono text-xs text-muted-foreground">cipher: AES-256-GCM · integrity: verified</p>
      </div>
    </div>
  )
}
