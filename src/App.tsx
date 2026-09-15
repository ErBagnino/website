import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'

const Home = lazy(() => import('./pages/Home'))
const Tech = lazy(() => import('./pages/Tech'))
const Travel = lazy(() => import('./pages/Travel'))
const Flowers = lazy(() => import('./pages/Flowers'))

function LoadingScreen() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-void">
      <span className="font-display text-xs uppercase tracking-[0.3em] text-accent/70">Caricamento...</span>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <div className="scanline-overlay" />
      <div className="noise-vignette" />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tech" element={<Tech />} />
          <Route path="/travel" element={<Travel />} />
          <Route path="/flowers" element={<Flowers />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
