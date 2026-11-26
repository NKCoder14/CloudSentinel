import React from 'react'

/**
 * Badge — severity / status pill.
 *
 * Props:
 *   severity  'critical'|'high'|'medium'|'low'  — severity badge
 *   variant   string — explicit badge variant class key (overrides severity)
 *
 * StatusBadge — for scan status text
 * RiskScoreDisplay — coloured risk score number
 */

const SEVERITY_CLASS = {
  critical: 'badge-critical',
  high:     'badge-high',
  medium:   'badge-medium',
  low:      'badge-low',
}
const VARIANT_CLASS = {
  info:    'badge-info',
  success: 'badge-success',
  neutral: 'badge-neutral',
}

export default function Badge({ severity, variant, children, className = '' }) {
  const cls = severity
    ? (SEVERITY_CLASS[severity?.toLowerCase()] ?? 'badge-neutral')
    : (VARIANT_CLASS[variant] ?? 'badge-neutral')
  return <span className={`${cls} ${className}`}>{children}</span>
}

export function StatusBadge({ status }) {
  const map = {
    completed: { cls: 'badge-success', label: 'Completed' },
    running:   { cls: 'badge-info',    label: 'Running' },
    failed:    { cls: 'badge-critical', label: 'Failed' },
    pending:   { cls: 'badge-neutral', label: 'Pending' },
  }
  const { cls, label } = map[status?.toLowerCase()] ?? map.pending
  return <span className={cls}>{label}</span>
}

export function RiskScoreDisplay({ score, size = 'md' }) {
  const level = score >= 80 ? 'critical' : score >= 60 ? 'high' : score >= 40 ? 'medium' : 'low'
  const colorMap = {
    critical: 'text-cs-critical',
    high:     'text-cs-high',
    medium:   'text-cs-medium',
    low:      'text-cs-low',
  }
  const textSize = { md: 'text-2xl font-bold', sm: 'text-lg font-semibold', lg: 'text-4xl font-bold' }[size]
  return (
    <span className={`${textSize} ${colorMap[level]} font-mono`}>
      {score ?? '—'}
    </span>
  )
}
