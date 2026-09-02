import { type ReactNode } from 'react'

export function ConvexAuthProvider({ children }: { children: ReactNode }) {
  // Convex is wired in the app shell but not used by AlatauPeaks pages
  return <>{children}</>
}
