'use client'

import {
  ArrowLeft,
  ChartColumn,
  ExternalLink,
  Eye,
  Folder,
  FolderGit2,
  FolderOpen,
  Pin,
  Play,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { FOLDERS, PROJECTS, type FolderId, type LinkKind, type Project } from './data'
import { TagChip } from './tag-chip'

type View = 'all' | 'pinned' | FolderId

const linkIcons: Record<LinkKind, LucideIcon> = {
  github: FolderGit2,
  report: ChartColumn,
  demo: Play,
  prototype: Eye,
}

const PINNED = PROJECTS.filter((project) => project.pinned)

export function ProjectsApp() {
  const [view, setView] = useState<View>('all')
  const [openId, setOpenId] = useState<string | null>(null)
  const lastCardId = useRef<string | null>(null)
  const detailHeadingRef = useRef<HTMLHeadingElement>(null)
  const openProject = PROJECTS.find((project) => project.id === openId)

  useEffect(() => {
    if (openId) {
      detailHeadingRef.current?.focus()
    } else if (lastCardId.current) {
      document.getElementById(`card-${lastCardId.current}`)?.focus()
    }
  }, [openId])

  const sidebarItems: { id: View; label: string; count: number; icon: LucideIcon }[] = [
    { id: 'all', label: 'all_projects', count: PROJECTS.length, icon: FolderOpen },
    { id: 'pinned', label: 'pinned', count: PINNED.length, icon: Pin },
    ...FOLDERS.map((folder) => ({
      id: folder.id as View,
      label: folder.label,
      count: PROJECTS.filter((project) => project.folder === folder.id).length,
      icon: Folder,
    })),
  ]

  const sections =
    view === 'all'
      ? [
          { id: 'pinned', title: 'Pinned', projects: PINNED },
          ...FOLDERS.map((folder) => ({
            id: folder.id,
            title: folder.label,
            projects: PROJECTS.filter((project) => project.folder === folder.id),
          })),
        ]
      : view === 'pinned'
        ? [{ id: 'pinned', title: 'Pinned', projects: PINNED }]
        : [
            {
              id: view,
              title: FOLDERS.find((folder) => folder.id === view)?.label ?? view,
              projects: PROJECTS.filter((project) => project.folder === view),
            },
          ]

  const path = openProject
    ? `~/projects/${openProject.folder ?? 'pinned'}/${openProject.id}`
    : `~/projects/${view === 'all' ? '' : sidebarItems.find((item) => item.id === view)?.label}`

  return (
    <div className="@container flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center gap-2 border-b border-border bg-titlebar px-3 py-2">
        {openProject && (
          <button
            type="button"
            onClick={() => setOpenId(null)}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-foreground hover:bg-card/70 focus-visible:outline-2 focus-visible:outline-ring"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back
          </button>
        )}
        <p className="min-w-0 flex-1 truncate rounded-lg bg-background/60 px-3 py-1 font-mono text-xs text-muted-foreground">
          <span className="sr-only">Current path: </span>
          {path}
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col @2xl:flex-row">
        <nav
          aria-label="Project folders"
          className={cn(
            'shrink-0 border-border bg-titlebar/60 @2xl:w-56 @2xl:border-r',
            openProject ? 'hidden @2xl:block' : 'border-b @2xl:border-b-0',
          )}
        >
          <ul className="flex gap-1 overflow-x-auto p-2 @2xl:flex-col @2xl:overflow-x-visible">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const current = view === item.id
              return (
                <li key={item.id} className="shrink-0">
                  <button
                    type="button"
                    aria-current={current ? 'true' : undefined}
                    onClick={() => {
                      setView(item.id)
                      setOpenId(null)
                      lastCardId.current = null
                    }}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left font-mono text-xs whitespace-nowrap focus-visible:outline-2 focus-visible:outline-ring',
                      current ? 'bg-sky text-navy' : 'text-foreground hover:bg-card/70',
                    )}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    <span className="flex-1 truncate">{item.label}</span>
                    <span className={cn('text-[11px]', current ? 'text-navy/70' : 'text-muted-foreground')}>
                      {item.count}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="min-h-0 flex-1 overflow-auto bg-background/50">
          {openProject ? (
            <ProjectDetail project={openProject} headingRef={detailHeadingRef} />
          ) : (
            <div className="flex flex-col gap-6 p-4">
              <h2 className="sr-only">Projects</h2>
              {sections.map((section) => (
                <section key={section.id} aria-labelledby={`sec-${section.id}`} className="flex flex-col gap-3">
                  <h3
                    id={`sec-${section.id}`}
                    className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wide text-muted-foreground"
                  >
                    {section.id === 'pinned' ? (
                      <Pin className="size-3.5" aria-hidden="true" />
                    ) : (
                      <Folder className="size-3.5" aria-hidden="true" />
                    )}
                    {section.title}
                  </h3>
                  <ul className="grid gap-3 @lg:grid-cols-2 @4xl:grid-cols-3">
                    {section.projects.map((project) => (
                      <li key={project.id}>
                        <ProjectCard
                          project={project}
                          onOpen={() => {
                            lastCardId.current = project.id
                            setOpenId(project.id)
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <button
      id={`card-${project.id}`}
      type="button"
      onClick={onOpen}
      className="group flex h-full w-full flex-col gap-3 rounded-xl border border-border bg-card/70 p-4 text-left shadow-soft transition-colors hover:border-ring/60 hover:bg-card focus-visible:outline-2 focus-visible:outline-ring"
    >
      <span className="flex items-start justify-between gap-3">
        <span
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-lg text-navy',
            project.pinned ? 'bg-blush' : 'bg-sky',
          )}
        >
          <FolderGit2 className="size-4" aria-hidden="true" />
        </span>
        {project.pinned && (
          <span className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
            <Pin className="size-3" aria-hidden="true" />
            pinned
          </span>
        )}
      </span>
      <span className="font-sans text-base font-semibold leading-snug text-foreground text-balance">
        {project.name}
      </span>
      <span className="text-sm leading-relaxed text-muted-foreground text-pretty">{project.summary}</span>
      {project.stats.length > 0 && (
        <span className="mt-auto font-mono text-xs text-foreground">{project.stats[0]}</span>
      )}
    </button>
  )
}

function ProjectDetail({
  project,
  headingRef,
}: {
  project: Project
  headingRef: React.RefObject<HTMLHeadingElement | null>
}) {
  return (
    <article className="flex max-w-3xl flex-col gap-5 p-5">
      <header className="flex flex-col gap-2">
        {project.pinned && (
          <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
            <Pin className="size-3.5" aria-hidden="true" />
            pinned project
          </span>
        )}
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="font-sans text-2xl font-semibold leading-tight text-foreground text-balance outline-none"
        >
          {project.name}
        </h2>
      </header>

      <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-foreground">
        {project.description.map((paragraph) => (
          <p key={paragraph} className="text-pretty">
            {paragraph}
          </p>
        ))}
      </div>

      {project.stats.length > 0 && (
        <section aria-labelledby={`stats-${project.id}`} className="flex flex-col gap-2">
          <h3 id={`stats-${project.id}`} className="font-mono text-xs font-semibold text-muted-foreground">
            key_numbers
          </h3>
          <ul className="flex flex-wrap gap-2">
            {project.stats.map((stat) => (
              <li
                key={stat}
                className="rounded-lg bg-mint px-3 py-1.5 font-mono text-xs font-semibold text-navy ring-1 ring-navy/10"
              >
                {stat}
              </li>
            ))}
          </ul>
        </section>
      )}

      {project.tools.length > 0 && (
        <section aria-labelledby={`tools-${project.id}`} className="flex flex-col gap-2">
          <h3 id={`tools-${project.id}`} className="font-mono text-xs font-semibold text-muted-foreground">
            tools
          </h3>
          <ul className="flex flex-wrap gap-2">
            {project.tools.map((tool) => (
              <li key={tool}>
                <TagChip tint="lavender">{tool}</TagChip>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex flex-wrap gap-2 pt-1">
        {project.links.map((link, index) => {
          const Icon = linkIcons[link.kind]
          return (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold shadow-soft transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none',
                index === 0 ? 'bg-navy text-sky dark:bg-sky dark:text-navy' : 'bg-blush text-navy',
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {link.label}
              <ExternalLink className="size-3.5 opacity-70" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )
        })}
      </div>
    </article>
  )
}
