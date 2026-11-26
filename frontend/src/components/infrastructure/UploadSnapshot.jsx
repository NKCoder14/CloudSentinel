
import React, { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Upload,
  FileJson,
  X,
  CheckCircle2,
  AlertCircle,
  Shield,
} from 'lucide-react'

import { runScan } from '../../services/scanService.js'
import { formatFileSize } from '../../utils/formatters.js'
import Button from '../common/Button.jsx'
import { Spinner } from '../common/LoadingState.jsx'

/* ── Scan stage tracker ───────────────────────────────────────── */

const STAGES = [
  'Parsing configuration',
  'Validating resources',
  'Running security rules',
  'Calculating risk score',
  'Finalising report',
]

function ScanProgress({ stage }) {
  return (
    <div className="cs-inset p-5 mt-4">
      <div className="flex items-center gap-2 mb-4">
        <Spinner size={15} />
        <span className="text-sm font-medium text-cs-primary">
          Running security audit…
        </span>
      </div>

      <ol className="space-y-2.5">
        {STAGES.map((s, i) => {
          const done = i < stage
          const current = i === stage

          return (
            <li key={s} className="flex items-center gap-2.5">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs
                  ${done
                    ? 'bg-lav-700 text-white'
                    : current
                      ? 'border-2 border-lav-600 bg-transparent'
                      : 'bg-cs-surface-2 border border-cs-border'
                  }`}
              >
                {done && <CheckCircle2 size={10} />}

                {current && (
                  <div className="w-2 h-2 rounded-full bg-lav-600 animate-pulse-soft" />
                )}
              </div>

              <span
                className={`text-xs ${done
                    ? 'text-cs-secondary line-through'
                    : current
                      ? 'text-cs-primary font-medium'
                      : 'text-cs-muted font-light'
                  }`}
              >
                {s}
              </span>
            </li>
          )
        })}
      </ol>

      <div className="mt-4 h-1.5 rounded-pill bg-cs-surface-2 overflow-hidden">
        <div
          className="h-full bg-gradient-accent rounded-pill transition-all duration-700 ease-out"
          style={{
            width: `${Math.round(((stage + 1) / STAGES.length) * 100)}%`,
          }}
        />
      </div>
    </div>
  )
}

/* ── Upload tab ───────────────────────────────────────────────── */

function UploadTab() {
  const navigate = useNavigate()
  const fileRef = useRef(null)

  const [file, setFile] = useState(null)
  const [parsed, setParsed] = useState(null)
  const [jsonError, setJsonError] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [stage, setStage] = useState(0)
  const [scanError, setScanError] = useState(null)

  const processFile = useCallback((f) => {
    if (!f) return

    setFile(f)
    setJsonError(null)
    setParsed(null)
    setScanError(null)

    if (!f.name.toLowerCase().endsWith('.json')) {
      setJsonError('Only JSON files are allowed.')
      return
    }

    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)

        if (
          !data ||
          typeof data !== 'object' ||
          Array.isArray(data)
        ) {
          throw new Error('JSON root must be an object.')
        }

        setParsed(data)
      } catch (error) {
        setJsonError(
          error.message === 'JSON root must be an object.'
            ? error.message
            : 'Invalid JSON — please upload a valid configuration snapshot.'
        )
      }
    }

    reader.onerror = () => {
      setJsonError('Unable to read the selected file.')
    }

    reader.readAsText(f)
  }, [])

  const onDrop = useCallback(
    (e) => {
      e.preventDefault()
      setDragging(false)

      const dropped = e.dataTransfer.files[0]

      if (dropped) {
        processFile(dropped)
      }
    },
    [processFile]
  )

  const clearFile = () => {
    setFile(null)
    setParsed(null)
    setJsonError(null)
    setScanError(null)

    if (fileRef.current) {
      fileRef.current.value = ''
    }
  }

  const handleScan = async () => {
    if (!parsed || scanning) return

    setScanning(true)
    setScanError(null)
    setStage(0)

    // Visual progress indicator; the backend performs the actual scan.
    const timer = setInterval(() => {
      setStage((current) =>
        Math.min(current + 1, STAGES.length - 2)
      )
    }, 1200)

    try {
      const result = await runScan(parsed)

      clearInterval(timer)

      // Django returns scan_id, not id.
      const scanId = result?.scan_id

      if (!scanId) {
        setScanning(false)
        setScanError(
          'Scan completed, but the backend did not return a scan ID. Check the API response.'
        )
        return
      }

      setStage(STAGES.length - 1)

      // Navigate to the report using the actual Django scan UUID.
      setTimeout(() => {
        navigate(`/reports/${encodeURIComponent(scanId)}`)
      }, 600)

    } catch (err) {
      clearInterval(timer)
      setScanning(false)

      setScanError(
        err.message ?? 'Audit failed — check that the backend is running.'
      )
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Drop zone */}

      {!file && (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
          className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed
            px-8 py-14 cursor-pointer transition-colors duration-150
            ${dragging
              ? 'border-lav-600 bg-cs-accent-light'
              : 'border-cs-border hover:border-lav-400 hover:bg-cs-surface-2'
            }`}
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-card border border-cs-border flex items-center justify-center mb-4">
            <Upload size={20} className="text-lav-700" />
          </div>

          <p className="font-semibold text-sm text-cs-primary mb-1">
            Drop your JSON snapshot here
          </p>

          <p className="text-xs text-cs-secondary font-light">
            or click to browse — .json files only
          </p>

          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            className="sr-only"
            onChange={(e) => processFile(e.target.files[0])}
          />
        </div>
      )}

      {/* File selected */}

      {file && !scanning && (
        <div className="cs-card p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-card border border-cs-border flex items-center justify-center shrink-0">
              <FileJson size={18} className="text-lav-700" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-cs-primary truncate">
                {file.name}
              </p>

              <p className="text-xs text-cs-muted mt-0.5">
                {formatFileSize(file.size)}
              </p>

              {parsed && !jsonError && (
                <span className="inline-flex items-center gap-1 mt-2 badge-success">
                  <CheckCircle2 size={10} />
                  Valid JSON
                </span>
              )}

              {jsonError && (
                <span className="inline-flex items-center gap-1 mt-2 badge-critical">
                  <AlertCircle size={10} />
                  {jsonError}
                </span>
              )}
            </div>

            <button
              onClick={clearFile}
              className="cs-btn-ghost cs-btn-icon text-cs-muted"
              aria-label="Remove file"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Progress */}

      {scanning && <ScanProgress stage={stage} />}

      {/* Error */}

      {scanError && !scanning && (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-cs-critical-bg border border-cs-critical-border px-4 py-3">
          <AlertCircle
            size={15}
            className="text-cs-critical shrink-0 mt-0.5"
          />

          <p className="text-xs text-cs-critical-text">
            {scanError}
          </p>
        </div>
      )}

      {/* CTA */}

      {parsed && !jsonError && !scanning && (
        <div className="mt-5 flex gap-3">
          <Button
            onClick={handleScan}
            className="flex-1 justify-center"
          >
            <Shield size={15} />
            Run Security Audit
          </Button>

          <Button variant="ghost" onClick={clearFile}>
            <X size={14} />
          </Button>
        </div>
      )}
    </div>
  )
}

/* ── Main exported component ─────────────────────────────────── */

export default function UploadSnapshot() {
  return (
    <div className="animate-fade-in">
      <UploadTab />
    </div>
  )
}
