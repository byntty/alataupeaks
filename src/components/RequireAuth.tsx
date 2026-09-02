import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

interface Props {
  children: ReactNode
}

export function RequireAuth({ children }: Props) {
  // Auth is wired but not enforced for AlatauPeaks
  // For now, always allow access
  return <>{children}</>
}
