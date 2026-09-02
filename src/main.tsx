import { lazy, Suspense } from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ConvexAuthProvider } from './lib/convex-auth'
import { LanguageProvider } from './lib/language'
import { RootErrorBoundary } from './components/RootErrorBoundary'
import { ToolbarErrorBoundary } from './components/ToolbarErrorBoundary'
import { VlyToolbar } from './components/VlyToolbar'
import { RouteSyncer } from './components/RouteSyncer'
import { RequireAuth } from './components/RequireAuth'
import './index.css'

const Landing = lazy(() => import('./pages/Landing'))
const PeakDetail = lazy(() => import('./pages/PeakDetail'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const NotFound = lazy(() => import('./pages/NotFound'))

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f5f0eb]">
      <div className="clay-card p-8 text-center">
        <div className="text-4xl mb-4 clay-float">⛰️</div>
        <p className="text-[#999] text-sm">AlatauPeaks</p>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
      <ToolbarErrorBoundary>
        <VlyToolbar />
        <ConvexAuthProvider>
          <LanguageProvider>
            <BrowserRouter>
              <RouteSyncer />
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/auth" element={<AuthPage redirectAfterAuth="/dashboard" />} />
                  <Route path="/peak/:id" element={<PeakDetail />} />
                  <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </LanguageProvider>
        </ConvexAuthProvider>
      </ToolbarErrorBoundary>
    </RootErrorBoundary>
  </StrictMode>
)
