import { scansAPI, APIError } from './api.js'

/**
 * Submit a JSON snapshot and start a scan.
 * Returns the scan result or throws APIError.
 */
export async function runScan(configJson) {
  return scansAPI.run(configJson)
}

/**
 * Fetch all historical scans.
 * Returns an array (possibly empty).
 */
export async function listScans() {
  const data = await scansAPI.list()
  // Backend may return array or {results: [...]}
  if (Array.isArray(data)) return data
  if (data?.results) return data.results
  return []
}

/**
 * Fetch one scan by ID.
 */
export async function getScan(scanId) {
  return scansAPI.get(scanId)
}

/** Request an AI explanation for one existing deterministic finding. */
export async function analyzeFindingWithAI(scanId, finding) {
  return scansAPI.analyzeWithAI(scanId, {
    scope: 'finding',
    rule_id: finding.rule_id ?? null,
    resource_id: finding.resource_id ?? finding.resource ?? null,
  })
}

/** Request an AI-generated summary of the scan's existing findings. */
export async function summarizeScanWithAI(scanId) {
  return scansAPI.analyzeWithAI(scanId, { scope: 'summary' })
}

/**
 * Export a scan result as a JSON file download.
 */
export function exportScanJson(scan) {
  const blob = new Blob([JSON.stringify(scan, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `cloudsentinel-scan-${scan.scan_id ?? Date.now()}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}