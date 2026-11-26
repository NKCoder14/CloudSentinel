import React, { useEffect } from 'react'
import { X } from 'lucide-react'

/**
 * Modal — centered dialog
 * Drawer — right-slide panel
 *
 * Props shared:
 *   open      boolean
 *   onClose   () => void
 *   title     string
 *   children  node
 *   width     string (tailwind w-* class, default 'max-w-lg')
 */

export default function Modal({ open, onClose, title, children, width = 'max-w-lg' }) {
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-lav-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel */}
      <div className={`relative w-full ${width} bg-cs-surface rounded-2xl shadow-elevated border border-cs-border animate-slide-up`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-cs-border">
          <h2 className="font-semibold text-sm text-cs-primary">{title}</h2>
          <button onClick={onClose} className="cs-btn-ghost cs-btn-icon" aria-label="Close">
            <X size={15} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

export function Drawer({ open, onClose, title, children, width = 'max-w-xl' }) {
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-lav-900/30 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-full ${width} bg-cs-surface border-l border-cs-border shadow-elevated
          transform transition-transform duration-250 ease-out overflow-y-auto
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-cs-border sticky top-0 bg-cs-surface z-10">
          <h2 className="font-semibold text-sm text-cs-primary">{title}</h2>
          <button onClick={onClose} className="cs-btn-ghost cs-btn-icon" aria-label="Close">
            <X size={15} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </aside>
    </>
  )
}
