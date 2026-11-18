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

export type AppTint = 'sky' | 'lavender' | 'blush' | 'mint' | 'navy'

export type AppDef = {
  id: string
  label: string
  icon: LucideIcon
  tint: AppTint
  kind: 'window' | 'link'
  href?: string
}

export const tintClasses: Record<AppTint, string> = {
  sky: 'bg-sky text-navy',
  lavender: 'bg-lavender text-navy',
  blush: 'bg-blush text-navy',
  mint: 'bg-mint text-navy',
  navy: 'bg-navy text-mint ring-1 ring-sky/30',
}

export const RESUME_URL = '/resume.pdf'

export const APPS: AppDef[] = [
  { id: 'about', label: 'about_me.txt', icon: FileText, tint: 'sky', kind: 'window' },
  { id: 'experience', label: 'experience.log', icon: ScrollText, tint: 'lavender', kind: 'window' },
  { id: 'projects', label: 'projects/', icon: FolderOpen, tint: 'sky', kind: 'window' },
  { id: 'skills', label: 'skills.exe', icon: Cpu, tint: 'mint', kind: 'window' },
  { id: 'certs', label: 'certs.key', icon: KeyRound, tint: 'blush', kind: 'window' },
  { id: 'resume', label: 'resume.pdf', icon: FileDown, tint: 'lavender', kind: 'link', href: RESUME_URL },
  { id: 'terminal', label: 'terminal', icon: SquareTerminal, tint: 'navy', kind: 'window' },
  { id: 'phish', label: 'spot_the_phish.app', icon: Fish, tint: 'sky', kind: 'window' },
  { id: 'danger', label: 'do_not_open.exe', icon: TriangleAlert, tint: 'blush', kind: 'window' },
  { id: 'bin', label: 'Recycle Bin', icon: Trash2, tint: 'lavender', kind: 'window' },
]

export const APP_BY_ID: Record<string, AppDef> = Object.fromEntries(APPS.map((app) => [app.id, app]))
