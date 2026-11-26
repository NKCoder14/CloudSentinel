import React from 'react'

/**
 * LoadingState — simple animate-pulse skeleton rows.
 *
 * Props:
 *   rows    number   — skeleton row count (default 4)
 *   label   string   — optional text below
 */
export default function LoadingState({ rows = 4, label }) {
  return (
    <div className="animate-fade-in space-y-3 py-6">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-14 bg-cs-surface-2 rounded-xl animate-pulse border border-cs-border"
          style={{ opacity: 1 - i * 0.15 }}
        />
      ))}
      {label && (
        <p className="text-xs text-cs-muted text-center pt-2 font-light">{label}</p>
      )}
    </div>
  )
}

/** Inline spinner — small indigo spinner */
export function Spinner({ size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`animate-spin text-lav-600 ${className}`}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
