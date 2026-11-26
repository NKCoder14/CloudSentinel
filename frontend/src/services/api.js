const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

class APIError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'APIError'
    this.status = status
    this.data = data
  }
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`
  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  }

  let response
  try {
    response = await fetch(url, config)
  } catch (networkErr) {
    throw new APIError(
      'Cannot reach the CloudSentinel backend. Make sure Django is running on port 8000.',
      0,
      null
    )
  }

  if (!response.ok) {
    let data = null
    try { data = await response.json() } catch { }
    const message =
      data?.detail || data?.error || data?.message ||
      `Request failed with status ${response.status}`
    throw new APIError(message, response.status, data)
  }

  // 204 No Content
  if (response.status === 204) return null

  return response.json()
}

// ─── Scans ─────────────────────────────────────────────────────────────────
export const scansAPI = {
  /**
   * Run a new security scan.
   * @param {object} configJson — parsed AWS configuration snapshot
   */
  run: (configJson) =>
    request('/scans/', {
      method: 'POST',
      body: JSON.stringify(configJson),
    }),

  /**
   * List all previous scans.
   */
  list: () => request('/scans/'),

  /**
   * Get a single scan with its findings.
   * @param {string|number} scanId
   */
  get: (scanId) => request(`/scans/${scanId}/`),

  /**
   * Request optional Nemotron assistance for a completed scan.
   * The backend must keep the deterministic findings as the source of truth.
   */
  analyzeWithAI: (scanId, payload) =>
    request(`/scans/${scanId}/ai-analysis/`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
}

export { APIError }