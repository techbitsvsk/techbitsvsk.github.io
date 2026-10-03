/* ============================================================
   Media — one component for every animated figure on the site.

   Handles, in one place:
     · format        mp4/webm → <video>, gif/png/webp → <img>,
                     no file → the built-in animated SVG
     · layout shift  a reserved aspect-ratio box, always
     · CPU/battery   plays only while actually on screen
     · preference    honours prefers-reduced-motion, and offers
                     an explicit play control so the visitor can
                     opt in either way (WCAG 2.2.2)
     · caption       renders as <figure> / <figcaption>
     · lightbox      click to open full size, focus-trapped

   Content comes from content/motion.js. Swapping a built-in
   placeholder for a real recording is a one-line edit there.
   ============================================================ */

import { useEffect, useRef, useState } from 'react'
import { Play, Pause, Expand } from 'lucide-react'
import { getMotionAsset } from '@/content/motion'
import { motionComponents } from '@/components/motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

const VIDEO_PATTERN = /\.(mp4|webm|mov)$/i
/* A GIF cannot be paused or seeked from script — the browser owns
   playback. That is why MP4 is the documented default. */
const GIF_PATTERN = /\.gif$/i

export default function Media({
  assetKey,
  className,
  frameClassName,
  lightbox = true,
  showCaption = true,
}) {
  const asset = getMotionAsset(assetKey)

  const reducedMotion = usePrefersReducedMotion()
  const containerRef = useRef(null)
  const videoRef = useRef(null)

  const [inView, setInView] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [open, setOpen] = useState(false)

  /* null means "no explicit choice yet, follow the OS preference".
     Deriving this rather than syncing it in an effect means a
     preference changed mid-visit is picked up for free, while a
     visitor who pressed play keeps what they asked for. */
  const [override, setOverride] = useState(null)
  const playing = override ?? !reducedMotion
  const setPlaying = next =>
    setOverride(current => (typeof next === 'function' ? next(current ?? !reducedMotion) : next))

  const src = asset?.src ?? null
  const isVideo = Boolean(src) && VIDEO_PATTERN.test(src)
  const isGif = Boolean(src) && GIF_PATTERN.test(src)
  const isImage = Boolean(src) && !isVideo
  const BuiltIn = src ? null : motionComponents[assetKey]

  /* Animation runs only when it is on screen and the visitor wants it. */
  const animating = playing && inView
  /* A still image and a GIF have nothing to control. */
  const controllable = isVideo || Boolean(BuiltIn)

  /* Pause whatever scrolls out of view. */
  useEffect(() => {
    const node = containerRef.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setInView(true) // no observer: never leave the media frozen
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '120px 0px', threshold: 0.01 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  /* Drive the video element from that state. */
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (animating) {
      // Autoplay can still be refused (low-power mode, for one).
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [animating, isVideo])

  /* Guard after the hooks, so hook order stays stable. */
  if (!asset) return null

  const frame = (
    <div
      ref={containerRef}
      className={cn(
        'group relative w-full overflow-hidden rounded-card border border-rule bg-ink',
        !animating && 'motion-paused',
        frameClassName
      )}
      style={{ aspectRatio: asset.aspectRatio ?? '16 / 10' }}
    >
      {/* Reserved-space shimmer, only for media that has to load. */}
      {src && !loaded && (
        <div className="media-skeleton absolute inset-0" aria-hidden="true" />
      )}

      {isVideo && (
        <video
          ref={videoRef}
          src={src}
          poster={asset.poster ?? undefined}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={asset.alt}
          onLoadedData={() => setLoaded(true)}
          className="h-full w-full object-cover"
        />
      )}

      {isImage && (
        <img
          src={src}
          alt={asset.alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className="h-full w-full object-cover"
        />
      )}

      {BuiltIn && <BuiltIn animating={animating} title={asset.alt} />}

      {/* Controls. Always reachable by keyboard, not only on hover. */}
      <div className="absolute right-2 bottom-2 flex gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 max-md:opacity-100">
        {controllable && (
          <button
            type="button"
            onClick={() => setPlaying(p => !p)}
            aria-label={playing ? 'Pause animation' : 'Play animation'}
            className="rounded-full border border-rule bg-obsidian/80 p-2 text-parchment-dim backdrop-blur-sm transition-colors hover:text-copper"
          >
            {playing ? (
              <Pause size={13} strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <Play size={13} strokeWidth={1.75} aria-hidden="true" />
            )}
          </button>
        )}
        {lightbox && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="View this diagram full size"
            className="rounded-full border border-rule bg-obsidian/80 p-2 text-parchment-dim backdrop-blur-sm transition-colors hover:text-copper"
          >
            <Expand size={13} strokeWidth={1.75} aria-hidden="true" />
          </button>
        )}
      </div>

      {isGif && (
        /* Surfaced deliberately: a GIF genuinely cannot be paused. */
        <span className="sr-only">
          This animation loops continuously and cannot be paused.
        </span>
      )}
    </div>
  )

  const body = showCaption && asset.caption ? (
    <figure className={cn('m-0', className)}>
      {frame}
      <figcaption className="mt-2.5 font-mono text-[0.68rem] leading-relaxed text-parchment-dim">
        {asset.caption}
      </figcaption>
    </figure>
  ) : (
    <div className={className}>{frame}</div>
  )

  if (!lightbox) return body

  return (
    <>
      {body}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle className="sr-only">{asset.alt}</DialogTitle>
          {/* Rendered without its own lightbox, so it cannot nest. */}
          <Media assetKey={assetKey} lightbox={false} />
        </DialogContent>
      </Dialog>
    </>
  )
}
