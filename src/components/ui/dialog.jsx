/* shadcn/ui-style Dialog, built on Radix. Radix handles the focus
   trap, scroll lock, Escape, and aria wiring; the styling is ours. */

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogPortal = DialogPrimitive.Portal
export const DialogClose = DialogPrimitive.Close

export function DialogOverlay({ className, ...props }) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        'dlg-overlay fixed inset-0 z-[150] bg-obsidian/85 backdrop-blur-sm',
        className
      )}
      {...props}
    />
  )
}

export function DialogContent({ className, children, showClose = true, ...props }) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          'dlg-content fixed top-1/2 left-1/2 z-[151] w-[calc(100vw-2rem)] max-w-5xl',
          '-translate-x-1/2 -translate-y-1/2',
          'max-h-[90vh] overflow-auto rounded-panel border border-rule',
          'bg-surface p-4 shadow-far sm:p-6',
          className
        )}
        {...props}
      >
        {children}
        {showClose && (
          <DialogPrimitive.Close
            aria-label="Close"
            className="absolute top-3 right-3 rounded-full border border-rule bg-obsidian/70 p-2 text-parchment-dim transition-colors hover:text-copper"
          >
            <X size={16} strokeWidth={1.5} aria-hidden="true" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

export function DialogTitle({ className, ...props }) {
  return (
    <DialogPrimitive.Title
      className={cn('font-display text-lg text-parchment', className)}
      {...props}
    />
  )
}

export function DialogDescription({ className, ...props }) {
  return (
    <DialogPrimitive.Description
      className={cn('font-prose text-sm text-parchment-muted', className)}
      {...props}
    />
  )
}
