import React from 'react'
import { Shield, AlertTriangle, AlertCircle, Info, CheckCircle2 } from 'lucide-react'
import { getRiskLevel } from '../../utils/severity.js'
import { RiskScoreDisplay } from '../common/Badge.jsx'

const SEV_CONFIG = {
  critical: { icon: AlertCircle,   cls: 'text-cs-critical', bar: 'bg-cs-critical', label: 'Critical' },
  high:     { icon: AlertTriangle, cls: 'text-cs-high',     bar: 'bg-cs-high',     label: 'High' },
  medium:   { icon: Info,          cls: 'text-cs-medium',   bar: 'bg-cs-medium',   label: 'Medium' },
  low:      { icon: CheckCircle2,  cls: 'text-cs-low',      bar: 'bg-cs-low',      label: 'Low' },
}

function ScoreRing({ score }) {
  const r = 32
  const circ = 2 * Math.PI * r
  const fill = ((score ?? 0) / 100) * circ
  const level = score >= 80 ? 'critical' : score >= 60 ? 'high' : score >= 40 ? 'medium' : 'low'
  const strokeColor = { critical: '#B91C1C', high: '#C2410C', medium: '#B45309', low: '#15803D' }[level]

  return (
    <div className="relative w-20 h-20 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#DDD5C8" strokeWidth="8" />
        <circle
          cx="40" cy="40" r={r} fill="none"
          stroke={strokeColor} strokeWidth="8"
          strokeDasharray={`${fill} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <RiskScoreDisplay score={score} size="sm" />
      </div>
    </div>
  )
}

export default function SeveritySummary({ scan }) {
  const findings = scan?.findings ?? []
  // Use backend-provided counts directly instead of recalculating
  const counts = {
    critical: scan.critical_count ?? 0,
    high: scan.high_count ?? 0,
    medium: scan.medium_count ?? 0,
    low: scan.low_count ?? 0,
  }
  const riskMeta = getRiskLevel(scan?.risk_score ?? 0)
  const total = findings.length

  return (
    <div className="cs-card p-6 mb-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {/* Score ring */}
        <div className="flex flex-col items-center gap-1.5">
          <ScoreRing score={scan?.risk_score ?? 0} />
          <p className="text-2xs text-cs-muted text-center font-light leading-tight">
            {riskMeta.label}
          </p>
        </div>

        {/* Bars */}
        <div className="flex-1 space-y-2.5">
          {Object.entries(SEV_CONFIG).map(([key, { cls, bar, label }]) => {
            const count = counts[key]
            const pct   = total > 0 ? Math.round((count / total) * 100) : 0
            return (
              <div key={key} className="flex items-center gap-3">
                <span className={`text-2xs font-semibold w-14 shrink-0 ${cls}`}>{label}</span>
                <div className="flex-1 h-1.5 rounded-pill bg-cs-surface-2 overflow-hidden">
                  <div className={`h-full rounded-pill ${bar} transition-all duration-500`} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs font-mono text-cs-muted w-4 text-right shrink-0">{count}</span>
              </div>
            )
          })}
        </div>

        {/* Meta */}
        <div className="sm:border-l sm:border-cs-border sm:pl-6 grid grid-cols-2 gap-x-6 gap-y-2">
          {[
            { label: 'Status',     value: scan?.status ?? 'COMPLETED' },
            { label: 'Provider',   value: scan?.provider ?? 'AWS' },
            { label: 'Resources',  value: scan?.resource_count ?? '—' },
            { label: 'Findings',   value: total },
          ].map(({ label, value, mono }) => (
            <div key={label}>
              <p className="text-2xs text-cs-muted">{label}</p>
              <p className={`text-xs font-medium text-cs-primary mt-0.5 ${mono ? 'font-mono' : ''}`}>
                {value ?? '—'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
