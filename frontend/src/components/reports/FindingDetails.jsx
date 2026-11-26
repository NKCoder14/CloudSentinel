import React, { useEffect, useState } from 'react'
import { Copy, CheckCheck, Brain, AlertCircle, Info, Server, FileText } from 'lucide-react'
import { Drawer } from '../common/Modal.jsx'
import Badge from '../common/Badge.jsx'
import { analyzeFindingWithAI } from '../../services/scanService.js'

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      onClick={copy}
      className="absolute top-3 right-3 cs-btn-ghost cs-btn-icon text-lav-400 hover:text-lav-100"
      aria-label="Copy to clipboard"
    >
      {copied ? <CheckCheck size={13} className="text-lav-400" /> : <Copy size={13} />}
    </button>
  )
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={13} className="text-cs-muted shrink-0" />
        <span className="text-2xs font-semibold uppercase tracking-widest text-cs-muted">{title}</span>
      </div>
      {children}
    </div>
  )
}

export default function FindingDetails({ finding, open, onClose, scanId }) {
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResult, setAiResult] = useState(null)
  const [aiError, setAiError] = useState('')

  useEffect(() => {
    setAiResult(null)
    setAiError('')
    setAiLoading(false)
  }, [finding?.rule_id, finding?.resource_id, finding?.resource])

  if (!finding) return null

  const handleAIAnalysis = async () => {
    setAiLoading(true)
    setAiError('')
    setAiResult(null)
    try {
      const response = await analyzeFindingWithAI(scanId, finding)
      if (response?.status === 'failed') {
        throw new Error(response.error || 'Nemotron could not generate an explanation.')
      }
      const content = response?.ai_analysis ?? response?.analysis ?? response?.explanation
      if (!content) throw new Error('The AI endpoint returned no explanation.')
      setAiResult(typeof content === 'string' ? content : JSON.stringify(content, null, 2))
    } catch (error) {
      if (error?.status === 404) {
        setAiError('AI analysis is not connected on the backend yet. Add POST /api/scans/<scan_id>/ai-analysis/ to enable this action.')
      } else {
        setAiError(error.message || 'Unable to generate an AI explanation. Please try again.')
      }
    } finally {
      setAiLoading(false)
    }
  }

  const evidenceText = finding.evidence
    ? (typeof finding.evidence === 'string'
      ? finding.evidence
      : JSON.stringify(finding.evidence, null, 2))
    : null

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Finding Details"
      width="max-w-xl"
    >
      {/* Header badges */}
      <div className="flex items-center gap-2 flex-wrap mb-5">
        <Badge severity={finding.severity?.toLowerCase()}>{finding.severity}</Badge>
        {finding.service && <span className="badge-neutral">{finding.service}</span>}
        {finding.rule_id && (
          <span className="font-mono text-2xs text-cs-muted bg-cs-surface-2 border border-cs-border rounded-pill px-2 py-0.5">
            {finding.rule_id}
          </span>
        )}
      </div>

      {/* Title */}
      <h2 className="font-semibold text-sm text-cs-primary leading-snug mb-5">{finding.title}</h2>

      {/* Affected resource */}
      {(finding.resource ?? finding.resource_id) && (
        <Section icon={Server} title="Affected Resource">
          <p className="font-mono text-xs text-cs-secondary bg-cs-surface-2 border border-cs-border rounded-xl px-3 py-2.5 break-all">
            {finding.resource ?? finding.resource_id}
          </p>
        </Section>
      )}

      {/* Description */}
      {finding.description && (
        <Section icon={FileText} title="Description">
          <p className="text-xs text-cs-secondary font-light leading-relaxed">{finding.description}</p>
        </Section>
      )}

      {/* Evidence */}
      {evidenceText && (
        <Section icon={AlertCircle} title="Evidence">
          <div className="relative">
            <pre className="cs-code max-h-48 overflow-y-auto">{evidenceText}</pre>
            <CopyButton text={evidenceText} />
          </div>
        </Section>
      )}

      {/* Impact */}
      {finding.impact && (
        <Section icon={AlertCircle} title="Impact">
          <p className="text-xs text-cs-secondary font-light leading-relaxed">{finding.impact}</p>
        </Section>
      )}

      {/* Remediation */}
      {(finding.remediation ?? finding.recommendation) && (
        <Section icon={Info} title="Remediation">
          <p className="text-xs text-cs-secondary font-light leading-relaxed">{finding.remediation ?? finding.recommendation}</p>
        </Section>
      )}

      {/* Optional AI assistance. Detection and severity remain rule-engine owned. */}
      <div className="cs-inset p-4 mt-4">
        <div className="flex items-center gap-2 mb-2">
          <Brain size={14} className="text-lav-600 shrink-0" />
          <span className="text-xs font-semibold text-cs-primary">AI-Assisted Explanation</span>
          <span className="badge-neutral text-2xs ml-auto">Optional</span>
        </div>
        <p className="text-xs text-cs-muted font-light leading-relaxed mb-3">
          Ask Nemotron to explain the detected issue, its potential impact and practical remediation.
          CloudSentinel's rule engine remains responsible for detection and severity.
        </p>
        <button
          onClick={handleAIAnalysis}
          disabled={aiLoading || !scanId}
          className="cs-btn-secondary cs-btn-sm w-full justify-center"
        >
          <Brain size={12} /> {aiLoading ? 'Generating explanation…' : aiResult ? 'Regenerate explanation' : 'Generate AI Explanation'}
        </button>
        {aiError && <p role="alert" className="mt-3 text-xs text-cs-high leading-relaxed">{aiError}</p>}
        {aiResult && (
          <div className="mt-3 rounded-xl border border-lav-400/20 bg-cs-surface p-3">
            <p className="text-2xs font-semibold uppercase tracking-widest text-lav-600 mb-2">Nemotron analysis</p>
            <div className="text-xs text-cs-secondary leading-relaxed whitespace-pre-wrap break-words">{aiResult}</div>
          </div>
        )}
      </div>
    </Drawer>
  )
}