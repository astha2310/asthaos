import {
  Cpu,
  FileDown,
  FileText,
  Fish,
  FolderOpen,
  KeyRound,
  ScrollText,
  SquareTerminal,
  Trash2,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react'

export type AppTint = 'cyber' | 'plasma' | 'flare' | 'terminal'

export type AppDef = {
  id: string
  label: string
  icon: LucideIcon
  tint: AppTint
  kind: 'window' | 'link'
  href?: string
}

export const tintClasses: Record<AppTint, string> = {
  cyber: 'bg-cyber/15 text-cyber ring-1 ring-cyber/30',
  plasma: 'bg-plasma/20 text-plasma-soft ring-1 ring-plasma/40',
  flare: 'bg-flare/15 text-flare-soft ring-1 ring-flare/35',
  terminal: 'bg-terminal text-cyber ring-1 ring-cyber/40',
}

export const RESUME_URL = '/resume.pdf'

export const APPS: AppDef[] = [
  { id: 'about', label: 'about_me.txt', icon: FileText, tint: 'cyber', kind: 'window' },
  { id: 'experience', label: 'experience.log', icon: ScrollText, tint: 'plasma', kind: 'window' },
  { id: 'projects', label: 'projects/', icon: FolderOpen, tint: 'cyber', kind: 'window' },
  { id: 'skills', label: 'skills.exe', icon: Cpu, tint: 'cyber', kind: 'window' },
  { id: 'certs', label: 'certs.key', icon: KeyRound, tint: 'flare', kind: 'window' },
  { id: 'resume', label: 'resume.pdf', icon: FileDown, tint: 'plasma', kind: 'link', href: RESUME_URL },
  { id: 'terminal', label: 'terminal', icon: SquareTerminal, tint: 'terminal', kind: 'window' },
  { id: 'phish', label: 'spot_the_phish.app', icon: Fish, tint: 'cyber', kind: 'window' },
  { id: 'danger', label: 'do_not_open.exe', icon: TriangleAlert, tint: 'flare', kind: 'window' },
  { id: 'bin', label: 'Recycle Bin', icon: Trash2, tint: 'plasma', kind: 'window' },
]

export const APP_BY_ID: Record<string, AppDef> = Object.fromEntries(APPS.map((app) => [app.id, app]))
