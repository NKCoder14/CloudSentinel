import React from 'react'
import { Inbox } from 'lucide-react'

/**
 * EmptyState — centred empty / zero-data placeholder.
 *
 * Props:
 *   icon      Lucide icon component (default Inbox)
 *   title     string
 *   body      string
 *   action    node  — optional CTA below
 */
export default function EmptyState({ icon: Icon = Inbox, title, body, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
      <div className="w-14 h-14 rounded-2xl bg-cs-surface-2 border border-cs-border flex items-center justify-center mb-4">
        <Icon size={22} className="text-cs-muted" strokeWidth={1.5} />
      </div>
      {title && <h3 className="text-sm font-semibold text-cs-primary mb-1">{title}</h3>}
      {body  && <p  className="text-sm text-cs-secondary font-light max-w-xs leading-relaxed">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
