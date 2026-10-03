import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge class names, with later Tailwind utilities winning conflicts. */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * True when the visitor has asked the OS to reduce motion.
 * Read once per call — callers that need to react to changes
 * should use the usePrefersReducedMotion hook instead.
 */
export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
