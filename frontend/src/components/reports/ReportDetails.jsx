import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, FileJson, Brain } from 'lucide-react'
import { useScan } from '../../hooks/useScans.js'
import { formatDateTime } from '../../utils/formatters.js'
import { exportScanJson, summarizeScanWithAI } from '../../services/scanService.js'
import Button from '../common/Button.jsx'
import Header from '../layout/Header.jsx'
import LoadingState from '../common/LoadingState.jsx'
import ErrorState from '../common/ErrorState.jsx'
import SeveritySummary from './SeveritySummary.jsx'
import SecurityFindings from './SecurityFindings.jsx'
import FindingDetails from './FindingDetails.jsx'
import { SeverityDonut, ServiceBarChart } from './RiskChart.jsx'

export default function ReportDetails() {
  const { scanId } = useParams()
  const { scan, loading, error, refetch: reload } = useScan(scanId)
  const [activeFinding, setActiveFinding] = useState(null)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [aiSummary, setAiSummary] = useState('')
  const [summaryError, setSummaryError] = useState('')

  if (loading) return <LoadingState rows={6} label="Loading report…" />
  if (error) return <ErrorState title="Failed to load report" message={error} onRetry={reload} />
  if (!scan) return <ErrorState title="Report not found" message={`Scan ${scanId} could not be found.`} />

  const findings = scan.findings ?? []
  const counts = { critical: 0, high: 0, medium: 0, low: 0 }
  findings.forEach(f => { if (f.severity?.toLowerCase() in counts) counts[f.severity.toLowerCase()]++ })

  const handleExport = async () => {
    try { await exportScanJson(scanId) } catch { }
  }

  const handleAISummary = async () => {
    setSummaryLoading(true)
    setSummaryError('')
    setAiSummary('')
    try {
      const response = await summarizeScanWithAI(scanId)
      if (response?.status === 'failed') {
        throw new Error(response.error || 'Nemotron could not summarize this audit.')
      }
      const content = response?.ai_analysis ?? response?.overall_summary?.ai_analysis ?? response?.summary
      if (!content) throw new Error('The AI endpoint returned no summary.')
      setAiSummary(typeof content === 'string' ? content : JSON.stringify(content, null, 2))
    } catch (err) {
      if (err?.status === 404) {
        setSummaryError('AI analysis is not connected on the backend yet. Add POST /api/scans/<scan_id>/ai-analysis/ to enable this action.')
      } else {
        setSummaryError(err.message || 'Unable to generate an AI summary. Please try again.')
      }
    } finally {
      setSummaryLoading(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <Header
        title={`Audit Report`}
        subtitle={formatDateTime(scan.created_at)}
        breadcrumb={
          <>
            <Link to="/reports" className="inline-flex items-center gap-1 text-cs-muted hover:text-cs-secondary transition-colors">
              <ChevronLeft size={12} /> All Reports
            </Link>
          </>
        }
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={handleExport}>
              <FileJson size={13} /> Export JSON
            </Button>
          </>
        }
      />

      {/* Summary card */}
      <SeveritySummary scan={scan} />

      {/* Optional scan-level AI summary */}
      {findings.length > 0 && (
        <section className="cs-card p-5 mb-5" aria-labelledby="ai-summary-title">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Brain size={16} className="text-lav-600" />
                <h2 id="ai-summary-title" className="text-sm font-semibold text-cs-primary">AI Security Briefing</h2>
              </div>
              <p className="text-xs text-cs-muted mt-1">Generate a plain-language summary of findings already detected by the security engine.</p>
            </div>
            <button onClick={handleAISummary} disabled={summaryLoading} className="cs-btn-secondary cs-btn-sm shrink-0">
              <Brain size={13} /> {summaryLoading ? 'Generating…' : aiSummary ? 'Regenerate summary' : 'Generate AI summary'}
            </button>
          </div>
          {summaryError && <p role="alert" className="mt-3 text-xs text-cs-high">{summaryError}</p>}
          {aiSummary && <div className="mt-4 pt-4 border-t border-cs-border text-xs text-cs-secondary leading-relaxed whitespace-pre-wrap break-words">{aiSummary}</div>}
        </section>
      )}

      {/* Analytics — only when findings exist */}
      {findings.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <SeverityDonut {...counts} />
          <ServiceBarChart findings={findings} />
        </div>
      )}

      {/* Findings table */}
      <div className="mb-2">
        <span className="cs-section-label block mb-3">Security Findings</span>
        <SecurityFindings findings={findings} onSelectFinding={setActiveFinding} />
      </div>

      {/* Finding detail drawer */}
      <FindingDetails
        finding={activeFinding}
        scanId={scanId}
        open={!!activeFinding}
        onClose={() => setActiveFinding(null)}
      />
    </div>
  )
}
