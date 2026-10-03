import { useState, useEffect, lazy, Suspense } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, useScroll } from 'motion/react'
import { Menu, Search, X } from 'lucide-react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { profile } from '@/content/profile'

/* cmdk and its index of the whole site only load once someone
   actually reaches for search. */
const CommandPalette = lazy(() => import('./CommandPalette'))

const NAV = [
  { to: '/about', label: 'About' },
  { to: '/writing', label: 'Writing' },
  { to: '/projects', label: 'Projects' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const { scrollYProgress } = useScroll()

  /* ⌘K on macOS, Ctrl+K elsewhere. Owned here so the shortcut
     works before the palette chunk has been fetched. */
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setPaletteOpen(open => !open)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className="site-header">
      <div className="topbar">
        <Link to="/" className="brand">
          TechBits<span>VSK</span>
        </Link>

        {/* ── Desktop ────────────────────────────────────────── */}
        <nav className="site-nav max-md:hidden" aria-label="Main">
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {item.label}
            </NavLink>
          ))}
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn ↗
          </a>
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            aria-label="Search the site"
            className="flex items-center gap-2 rounded-full border border-rule px-3 py-1.5 font-mono text-[0.68rem] text-parchment-dim transition-colors hover:border-copper hover:text-copper"
          >
            <Search size={12} strokeWidth={1.5} aria-hidden="true" />
            <kbd className="font-mono">⌘K</kbd>
          </button>
        </nav>

        {/* ── Mobile ─────────────────────────────────────────── */}
        <div className="flex items-center gap-1.5 md:hidden">
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            aria-label="Search the site"
            className="rounded-full border border-rule p-2 text-parchment-dim"
          >
            <Search size={15} strokeWidth={1.5} aria-hidden="true" />
          </button>

          <DialogPrimitive.Root open={menuOpen} onOpenChange={setMenuOpen}>
            <DialogPrimitive.Trigger
              aria-label="Open menu"
              className="rounded-full border border-rule p-2 text-parchment-dim"
            >
              <Menu size={15} strokeWidth={1.5} aria-hidden="true" />
            </DialogPrimitive.Trigger>
            <DialogPrimitive.Portal>
              <DialogPrimitive.Overlay className="dlg-overlay fixed inset-0 z-[150] bg-obsidian/85 backdrop-blur-sm" />
              <DialogPrimitive.Content className="sheet fixed top-0 right-0 z-[151] flex h-full w-[min(20rem,85vw)] flex-col border-l border-rule bg-ink p-6">
                <DialogPrimitive.Title className="sr-only">Menu</DialogPrimitive.Title>
                <DialogPrimitive.Close
                  aria-label="Close menu"
                  className="self-end rounded-full border border-rule p-2 text-parchment-dim"
                >
                  <X size={15} strokeWidth={1.5} aria-hidden="true" />
                </DialogPrimitive.Close>
                <nav className="mt-8 flex flex-col gap-1" aria-label="Main">
                  {NAV.map(item => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `border-b border-rule-soft py-3.5 font-display text-xl no-underline ${
                          isActive ? 'text-copper' : 'text-parchment'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-b border-rule-soft py-3.5 font-display text-xl text-parchment no-underline"
                  >
                    LinkedIn ↗
                  </a>
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3.5 font-display text-xl text-parchment no-underline"
                  >
                    GitHub ↗
                  </a>
                </nav>
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          </DialogPrimitive.Root>
        </div>
      </div>

      {/* Reading progress. Purely decorative. */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: scrollYProgress }}
        className="h-px origin-left bg-copper"
      />

      {paletteOpen && (
        <Suspense fallback={null}>
          <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
        </Suspense>
      )}
    </header>
  )
}
