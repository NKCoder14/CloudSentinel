import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileBarChart2, Download, Eye, Search, ChevronUp, ChevronDown, SlidersHorizontal } from 'lucide-react'
import { useScans } from '../../hooks/useScans.js'
import { formatDateTime, formatRelative } from '../../utils/formatters.js'
import { getRiskLevel } from '../../utils/severity.js'
import { exportScanJson } from '../../services/scanService.js'
import { RiskScoreDisplay, StatusBadge } from '../common/Badge.jsx'
import Button from '../common/Button.jsx'
import EmptyState from '../common/EmptyState.jsx'
import ErrorState from '../common/ErrorState.jsx'
import LoadingState from '../common/LoadingState.jsx'
import Header from '../layout/Header.jsx'

const RISK_FILTERS = ['All', 'Critical', 'High', 'Medium', 'Low']

export default function AuditReports() {
  const navigate = useNavigate()
  const { scans, loading, error, refetch: reload } = useScans()
  const [search, setSearch] = useState('')
  const [riskFilter, setRisk] = useState('All')
  const [sortAsc, setSortAsc] = useState(false)

  if (loading) return <LoadingState rows={5} label="Loading audit history…" />
  if (error) return <ErrorState title="Failed to load reports" message={error} onRetry={reload} />

  const filtered = scans
    .filter(s => {
      const matchSearch = !search || s.scan_id?.toString().toLowerCase().includes(search.toLowerCase())
      const matchRisk = riskFilter === 'All' ||
        getRiskLevel(s.risk_score ?? 0).label.toLowerCase().startsWith(riskFilter.toLowerCase())
      return matchSearch && matchRisk
    })
    .sort((a, b) => {
      const ta = new Date(a.scanned_at).getTime()
      const tb = new Date(b.scanned_at).getTime()
      return sortAsc ? ta - tb : tb - ta
    })

  const handleExport = async (e, scanId) => {
    e.stopPropagation()
    try { await exportScanJson(scanId) } catch (err) {
      alert(`Export failed: ${err.message}`)
    }
  }

  return (
    <div className="animate-fade-in">
      <Header
        title="Audit Reports"
        subtitle="Security audit history with detailed findings and risk assessments."
        actions={
          <Button onClick={() => navigate('/connect')}>
            <FileBarChart2 size={14} /> New Audit
          </Button>
        }
      />

      {/* Filters */}
      <div className="cs-card p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cs-muted" />
            <input
              className="cs-input pl-9"
              placeholder="Search by scan ID…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={13} className="text-cs-muted shrink-0" />
            <div className="flex gap-1 flex-wrap">
              {RISK_FILTERS.map(r => (
                <button
                  key={r}
                  onClick={() => setRisk(r)}
                  className={`text-xs rounded-pill px-3 py-1.5 font-medium border transition-colors duration-150 ${riskFilter === r
                      ? 'bg-gradient-accent text-white border-transparent'
                      : 'bg-cs-surface text-cs-secondary border-cs-border hover:bg-cs-surface-2'
                    }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <button
              onClick={() => setSortAsc(v => !v)}
              className="cs-btn-ghost cs-btn-icon"
              aria-label="Toggle sort order"
            >
              {sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={FileBarChart2}
          title={search || riskFilter !== 'All' ? 'No matching reports' : 'No audits yet'}
          body={search || riskFilter !== 'All'
            ? 'Try adjusting your search or filters.'
            : 'Run your first security audit by uploading a JSON configuration snapshot.'}
          action={
            !(search || riskFilter !== 'All') && (
              <Button size="sm" onClick={() => navigate('/connect')}>
                Start First Audit
              </Button>
            )
          }
        />
      ) : (
        <div className="cs-card overflow-hidden">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-cs-surface-2 border-b border-cs-border">
                {['Date', 'Risk Score', 'Findings', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-2xs font-semibold uppercase tracking-widest text-cs-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cs-border">
              {filtered.map(scan => {
                // Use backend-provided counts directly instead of recalculating
                const counts = {
                  critical: scan.critical_count ?? 0,
                  high: scan.high_count ?? 0,
                  medium: scan.medium_count ?? 0,
                  low: scan.low_count ?? 0,
                }
                return (
                  <tr
                    key={scan.scan_id}
                    onClick={() => navigate(`/reports/${scan.scan_id}`)}
                    className="cursor-pointer hover:bg-cs-hover transition-colors duration-100 group"
                  >
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="text-xs text-cs-primary">{formatDateTime(scan.scanned_at)}</p>
                        <p className="text-2xs text-cs-muted mt-0.5">{formatRelative(scan.scanned_at)}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <RiskScoreDisplay score={scan.risk_score} size="sm" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {counts.critical > 0 && <span className="badge-critical">{counts.critical}C</span>}
                        {counts.high > 0 && <span className="badge-high">{counts.high}H</span>}
                        {counts.medium > 0 && <span className="badge-medium">{counts.medium}M</span>}
                        {counts.low > 0 && <span className="badge-low">{counts.low}L</span>}
                        {(counts.critical + counts.high + counts.medium + counts.low) === 0 && <span className="text-xs text-cs-muted">None</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={scan.status ?? 'completed'} />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <button
                          onClick={(e) => handleExport(e, scan.scan_id)}
                          className="cs-btn-ghost cs-btn-icon"
                          aria-label="Export JSON"
                          title="Export JSON"
                        >
                          <Download size={13} />
                        </button>
                        <Button size="sm" variant="secondary" onClick={e => { e.stopPropagation(); navigate(`/reports/${scan.scan_id}`) }}>
                          <Eye size={12} /> View
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
