'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useMediaQuery } from '@/hooks/use-media-query'
import { APP_BY_ID, APPS, type AppDef } from './apps'
import { DesktopIcon } from './desktop-icon'
import { Dock } from './dock'
import { LoginToast } from './login-toast'
import { OsWindow, type WinState } from './os-window'
import { StickyNote } from './sticky-note'
import { ThreatPill, TopBar } from './top-bar'

type DesktopProps = {
  stealth: boolean
  onToggleStealth: () => void
  onLock: () => void
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max))

export function Desktop({ stealth, onToggleStealth, onLock }: DesktopProps) {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const [wins, setWins] = useState<WinState[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const zRef = useRef(10)
  const areaRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [])

  const getBounds = useCallback(() => areaRef.current?.getBoundingClientRect(), [])

  const activeId = useMemo(() => {
    const visible = wins.filter((win) => !win.minimized)
    if (visible.length === 0) return null
    return visible.reduce((top, win) => (win.z > top.z ? win : top)).id
  }, [wins])

  const openApp = useCallback((app: AppDef) => {
    if (app.kind === 'link') {
      window.open(app.href, '_blank', 'noopener,noreferrer')
      return
    }
    const rect = areaRef.current?.getBoundingClientRect()
    const z = ++zRef.current
    setWins((prev) => {
      if (prev.some((win) => win.id === app.id)) {
        return prev.map((win) => (win.id === app.id ? { ...win, minimized: false, z } : win))
      }
      const width = rect?.width ?? 1200
      const height = rect?.height ?? 700
      const offset = (prev.length % 6) * 32
      const baseX = width > 960 ? 240 : 24
      return [
        ...prev,
        {
          id: app.id,
          z,
          minimized: false,
          maximized: false,
          x: clamp(baseX + offset, 16, width - 576),
          y: clamp(16 + offset, 16, height - 396),
        },
      ]
    })
  }, [])

  const focusWindow = useCallback((id: string) => {
    const z = ++zRef.current
    setWins((prev) => prev.map((win) => (win.id === id ? { ...win, z, minimized: false } : win)))
  }, [])

  const closeWindow = useCallback((id: string) => {
    setWins((prev) => prev.filter((win) => win.id !== id))
    requestAnimationFrame(() => document.getElementById(`icon-${id}`)?.focus())
  }, [])

  const minimizeWindow = useCallback((id: string) => {
    setWins((prev) => prev.map((win) => (win.id === id ? { ...win, minimized: true } : win)))
    requestAnimationFrame(() => document.getElementById(`dock-${id}`)?.focus())
  }, [])

  const toggleMaximize = useCallback((id: string) => {
    setWins((prev) => prev.map((win) => (win.id === id ? { ...win, maximized: !win.maximized } : win)))
  }, [])

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWins((prev) => prev.map((win) => (win.id === id ? { ...win, x, y } : win)))
  }, [])

  const windows = wins.map((win) => (
    <OsWindow
      key={win.id}
      app={APP_BY_ID[win.id]}
      win={win}
      active={win.id === activeId}
      isMobile={isMobile}
      getBounds={getBounds}
      onFocus={focusWindow}
      onClose={closeWindow}
      onMinimize={minimizeWindow}
      onToggleMax={toggleMaximize}
      onMove={moveWindow}
    />
  ))

  return (
    <div className="wallpaper fixed inset-0 flex flex-col animate-in fade-in duration-700">
      <h1 ref={headingRef} tabIndex={-1} className="sr-only">
        AsthaOS desktop: the portfolio of Astha Patel
      </h1>
      <p id="icon-hint" className="sr-only">
        Press Enter to open. With a mouse, double-click.
      </p>

      <TopBar stealth={stealth} onToggleStealth={onToggleStealth} onLock={onLock} />

      {isMobile ? (
        <main className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 py-4">
          <ThreatPill className="flex self-center" />
          <StickyNote variant="widget" />
          <ul className="grid grid-cols-4 gap-x-2 gap-y-4" aria-label="Apps">
            {APPS.map((app) => (
              <li key={app.id} className="min-w-0">
                <DesktopIcon app={app} variant="mobile" selected={false} onSelect={setSelected} onOpen={openApp} />
              </li>
            ))}
          </ul>
        </main>
      ) : (
        <main
          ref={areaRef}
          className="relative flex flex-1 justify-between overflow-hidden p-4"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) setSelected(null)
          }}
        >
          <ul className="grid h-fit grid-cols-2 gap-x-1 gap-y-2" aria-label="Desktop">
            {APPS.map((app) => (
              <li key={app.id}>
                <DesktopIcon
                  app={app}
                  variant="desktop"
                  selected={selected === app.id}
                  onSelect={setSelected}
                  onOpen={openApp}
                />
              </li>
            ))}
          </ul>
          <div className="pt-4 pr-4">
            <StickyNote variant="desktop" />
          </div>
          <div className="pointer-events-none absolute inset-0 isolate">{windows}</div>
        </main>
      )}

      <Dock wins={wins} activeId={activeId} isMobile={isMobile} onRestore={focusWindow} />

      {isMobile && <div className="pointer-events-none fixed inset-0 isolate z-50">{windows}</div>}

      <LoginToast />
    </div>
  )
}
