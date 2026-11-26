import React from 'react'
import { ChevronRight } from 'lucide-react'

export default function Header({ title, subtitle, breadcrumb, actions }) {
  return (
    <header className="mb-8">
      {breadcrumb && (
        <div className="flex items-center gap-1.5 text-xs text-cs-muted mb-3">
          {breadcrumb}
        </div>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="cs-page-title">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-cs-secondary font-light leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 shrink-0 mt-0.5">
            {actions}
          </div>
        )}
      </div>
    </header>
  )
}

/** Tiny utility exported for breadcrumb separators */
export function BreadcrumbSep() {
  return <ChevronRight size={12} className="text-cs-muted" />
}
