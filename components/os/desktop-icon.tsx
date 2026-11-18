'use client'

import { Fragment, useRef } from 'react'
import { cn } from '@/lib/utils'
import { tintClasses, type AppDef } from './apps'

type DesktopIconProps = {
  app: AppDef
  variant: 'desktop' | 'mobile'
  selected: boolean
  onSelect: (id: string) => void
  onOpen: (app: AppDef) => void
}

export function DesktopIcon({ app, variant, selected, onSelect, onOpen }: DesktopIconProps) {
  const pointerType = useRef<string>('mouse')
  const Icon = app.icon
  const isMobile = variant === 'mobile'

  return (
    <button
      id={`icon-${app.id}`}
      type="button"
      aria-label={app.kind === 'link' ? `${app.label} (opens in a new tab)` : app.label}
      aria-describedby={isMobile ? undefined : 'icon-hint'}
      onPointerDown={(event) => {
        pointerType.current = event.pointerType
      }}
      onClick={(event) => {
        const fromKeyboard = event.detail === 0
        if (isMobile || fromKeyboard || pointerType.current !== 'mouse') onOpen(app)
        else onSelect(app.id)
      }}
      onDoubleClick={() => {
        if (!isMobile && pointerType.current === 'mouse') onOpen(app)
      }}
      className={cn(
        'group flex flex-col items-center gap-1.5 rounded-2xl outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
        isMobile ? 'w-full p-1' : 'w-28 p-2',
        selected && !isMobile && 'bg-card/50',
      )}
    >
      <span
        className={cn(
          'flex items-center justify-center rounded-2xl shadow-soft transition-transform group-hover:-translate-y-0.5 motion-reduce:transition-none',
          isMobile ? 'size-16' : 'size-14',
          tintClasses[app.tint],
        )}
      >
        <Icon className={isMobile ? 'size-7' : 'size-6'} aria-hidden="true" />
      </span>
      <span
        className={cn(
          'line-clamp-2 max-w-full rounded-md py-0.5 text-center font-mono text-xs break-words',
          isMobile ? 'px-0' : 'px-1.5',
          selected && !isMobile ? 'bg-primary text-primary-foreground' : 'text-foreground',
        )}
      >
        {app.label.split(/(?<=[_.])/).map((part, index) => (
          <Fragment key={index}>
            {index > 0 && <wbr />}
            {part}
          </Fragment>
        ))}
      </span>
    </button>
  )
}
