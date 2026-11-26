// Severity helpers — updated for light theme
export const SEVERITY = {
  critical: {
    label:       'Critical',
    badgeClass:  'badge-critical',
    textClass:   'text-cs-critical',
    bgClass:     'bg-cs-critical-bg',
    barClass:    'bg-cs-critical',
    chartColor:  '#DC2626',
    order: 0,
  },
  high: {
    label:       'High',
    badgeClass:  'badge-high',
    textClass:   'text-cs-high',
    bgClass:     'bg-cs-high-bg',
    barClass:    'bg-cs-high',
    chartColor:  '#EA580C',
    order: 1,
  },
  medium: {
    label:       'Medium',
    badgeClass:  'badge-medium',
    textClass:   'text-cs-medium',
    bgClass:     'bg-cs-medium-bg',
    barClass:    'bg-cs-medium',
    chartColor:  '#D97706',
    order: 2,
  },
  low: {
    label:       'Low',
    badgeClass:  'badge-low',
    textClass:   'text-cs-low',
    bgClass:     'bg-cs-low-bg',
    barClass:    'bg-cs-low',
    chartColor:  '#16A34A',
    order: 3,
  },
}

export function getSeverity(level) {
  return SEVERITY[level?.toLowerCase()] ?? SEVERITY.low
}

export function sortBySeverity(findings) {
  return [...findings].sort(
    (a, b) =>
      (SEVERITY[a.severity?.toLowerCase()]?.order ?? 99) -
      (SEVERITY[b.severity?.toLowerCase()]?.order ?? 99)
  )
}

export const RISK_META = {
  critical: { label: 'Critical Risk', textClass: 'text-cs-critical', min: 80 },
  high:     { label: 'High Risk',     textClass: 'text-cs-high',     min: 60 },
  medium:   { label: 'Medium Risk',   textClass: 'text-cs-medium',   min: 40 },
  low:      { label: 'Low Risk',      textClass: 'text-cs-low',      min: 0  },
}

export function getRiskLevel(score) {
  if (score >= 80) return RISK_META.critical
  if (score >= 60) return RISK_META.high
  if (score >= 40) return RISK_META.medium
  return RISK_META.low
}
