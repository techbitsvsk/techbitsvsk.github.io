import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Writing from './pages/Writing'
import VoronoiPost from './pages/VoronoiPost'
import ArchitectsPost from './pages/ArchitectsPost'
import FabricPost from './pages/FabricPost'
import LineagePost from './pages/LineagePost'
import Projects from './pages/Projects'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <Header />
      <ScrollToTop />
      <main>
        <Routes>
          <Route path="/"                      element={<Home />} />
          <Route path="/writing"               element={<Writing />} />
          <Route path="/writing/voronoi"       element={<VoronoiPost />} />
          <Route path="/writing/architects"    element={<ArchitectsPost />} />
          <Route path="/writing/fabric"        element={<FabricPost />} />
          <Route path="/writing/lineage"       element={<LineagePost />} />
          <Route path="/projects"              element={<Projects />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
