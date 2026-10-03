import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
// theme.css owns the cascade order and imports the legacy
// stylesheet into its own layer, so utilities win over it.
import './styles/theme.css'
import './styles/motion.css'

/* ── Back-compatibility for the old hash URLs ──────────────────
   The site used HashRouter, so every link shared before this
   change looks like /#/writing/voronoi. Those are rewritten to
   the real path before React Router ever reads the location, so
   existing LinkedIn posts keep working.

   An in-page anchor such as /about#credit-risk is untouched:
   only a hash that opens a route ("#/") is a legacy URL. */
const { hash } = window.location
if (hash.startsWith('#/')) {
  window.history.replaceState(null, '', hash.slice(1))
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
