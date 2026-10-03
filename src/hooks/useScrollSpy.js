import { useEffect, useState } from 'react'

/**
 * Tracks which of the given element ids is the one currently being
 * read, and returns its id. The element nearest the top of the
 * viewport while still below the sticky header wins, so the rail
 * never highlights a section that has already scrolled past.
 *
 * @param {string[]} ids    element ids, in document order
 * @param {number}   offset pixels from the top to treat as the reading line
 */
export function useScrollSpy(ids, offset = 140) {
  const [activeId, setActiveId] = useState(ids[0] ?? null)

  useEffect(() => {
    if (!ids.length) return

    const pick = () => {
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top - offset <= 0) current = id
        else break
      }
      setActiveId(current)
    }

    pick()
    window.addEventListener('scroll', pick, { passive: true })
    window.addEventListener('resize', pick)
    return () => {
      window.removeEventListener('scroll', pick)
      window.removeEventListener('resize', pick)
    }
  }, [ids, offset])

  return activeId
}
