import React from 'react'
import { WifiOff, AlertTriangle, RefreshCw } from 'lucide-react'
import Button from './Button.jsx'

/**
 * ErrorState — centred error display.
 *
 * Props:
 *   title    string
 *   message  string
 *   network  boolean  — show WifiOff icon instead of AlertTriangle
 *   onRetry  function — if provided, shows Retry button
 */
export default function ErrorState({ title = 'Something went wrong', message, network = false, onRetry }) {
  const Icon = network ? WifiOff : AlertTriangle
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
      <div className="w-14 h-14 rounded-2xl bg-cs-critical-bg border border-cs-critical-border flex items-center justify-center mb-4">
        <Icon size={22} className="text-cs-critical" strokeWidth={1.5} />
      </div>
      <h3 className="text-sm font-semibold text-cs-primary mb-1">{title}</h3>
      {message && (
        <p className="text-sm text-cs-secondary font-light max-w-xs leading-relaxed">{message}</p>
      )}
      {onRetry && (
        <div className="mt-5">
          <Button variant="secondary" size="sm" onClick={onRetry}>
            <RefreshCw size={13} />
            Retry
          </Button>
        </div>
      )}
    </div>
  )
}
