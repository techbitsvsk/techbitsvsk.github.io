import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import SkipLink from './components/SkipLink'
import RouteMeta from './components/RouteMeta'
import Home from './pages/Home'
import About from './pages/About'
import Writing from './pages/Writing'
import Projects from './pages/Projects'

/* The six essays are 600–1,400 lines each and most visits read at
   most one of them. Splitting them out keeps the initial bundle to
   the shell plus the landing pages. */
const VoronoiPost = lazy(() => import('./pages/VoronoiPost'))
const VoronoiPost2 = lazy(() => import('./pages/VoronoiPost2'))
const VoronoiPost3 = lazy(() => import('./pages/VoronoiPost3'))
const ArchitectsPost = lazy(() => import('./pages/ArchitectsPost'))
const FabricPost = lazy(() => import('./pages/FabricPost'))
const LineagePost = lazy(() => import('./pages/LineagePost'))

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => { if (!hash) window.scrollTo(0, 0) }, [pathname, hash])
  return null
}

/* Deliberately quiet: a spinner that flashes for 80ms is worse
   than a brief hold on the previous paint. */
function EssayFallback() {
  return <div style={{ minHeight: '60vh' }} aria-busy="true" />
}

export default function App() {
  return (
    <>
      <SkipLink />
      <RouteMeta />
      <Header />
      <ScrollToTop />
      <main id="main">
        <Suspense fallback={<EssayFallback />}>
          <Routes>
            <Route path="/"                      element={<Home />} />
            <Route path="/about"                 element={<About />} />
            <Route path="/writing"               element={<Writing />} />
            <Route path="/writing/voronoi"       element={<VoronoiPost />} />
            <Route path="/writing/voronoi-ii"    element={<VoronoiPost2 />} />
            <Route path="/writing/voronoi-iii"   element={<VoronoiPost3 />} />
            <Route path="/writing/architects"    element={<ArchitectsPost />} />
            <Route path="/writing/fabric"        element={<FabricPost />} />
            <Route path="/writing/lineage"       element={<LineagePost />} />
            <Route path="/projects"              element={<Projects />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
