import { useEffect } from 'react'

export function useTocHighlight() {
  useEffect(() => {
    const headings = document.querySelectorAll('article h2[id], article h3[id]')
    const tocLinks = document.querySelectorAll('.toc-list a')

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            tocLinks.forEach(l => l.classList.remove('active'))
            const active = document.querySelector(
              `.toc-list a[href="#${entry.target.id}"]`
            )
            if (active) active.classList.add('active')
          }
        })
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )

    headings.forEach(h => observer.observe(h))
    return () => observer.disconnect()
  }, [])
}
