/* Skip-to-content link.

   It moves focus itself rather than relying on the browser's
   fragment navigation: under HashRouter the hash *is* the route,
   so an href of "#main" would be read as a navigation to /main.
   Works unchanged once the app moves to BrowserRouter. */

export default function SkipLink({ targetId = 'main' }) {
  const jump = event => {
    event.preventDefault()
    const target = document.getElementById(targetId)
    if (!target) return
    /* Programmatic focus needs a tabindex the target does not
       normally carry; remove it again so it never becomes a
       tab stop of its own. */
    target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })
    target.scrollIntoView({ block: 'start' })
    target.addEventListener('blur', () => target.removeAttribute('tabindex'), {
      once: true,
    })
  }

  return (
    <a href={`#${targetId}`} onClick={jump} className="skip-link">
      Skip to content
    </a>
  )
}
