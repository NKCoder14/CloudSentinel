
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
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }

  let response

  try {
    response = await fetch(url, config)
  } catch {
    throw new APIError(
      'Cannot reach the CloudSentinel backend. Make sure Django is running on port 8000.',
      0,
      null
    )
  }

  if (!response.ok) {
    let data = null

    try {
      data = await response.json()
    } catch { }

    const message =
      data?.detail ||
      data?.error ||
      data?.message ||
      `Request failed with status ${response.status}`

    throw new APIError(message, response.status, data)
  }

  if (response.status === 204) return null

  return response.json()
}

function validateScanId(scanId) {
  if (
    scanId === undefined ||
    scanId === null ||
    String(scanId).trim() === '' ||
    String(scanId) === 'undefined' ||
    String(scanId) === 'null'
  ) {
    throw new APIError(
      'Invalid scan ID. Please return to Audit Reports and select a valid report.',
      400,
      null
    )
  }

  return encodeURIComponent(String(scanId))
}

export const scansAPI = {
  run: (configJson) =>
    request('/scans/', {
      method: 'POST',
      body: JSON.stringify(configJson),
    }),

  list: () => request('/scans/'),

  get: (scanId) =>
    request(`/scans/${validateScanId(scanId)}/`),

  analyzeWithAI: (scanId, payload) =>
    request(`/scans/${validateScanId(scanId)}/ai-analysis/`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
}

export { APIError } 