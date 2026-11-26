import { useState, useEffect, useCallback } from 'react'
import { listScans, getScan } from '../services/scanService.js'

/**
 * Hook — manage the list of historical scans.
 */
export function useScans() {
  const [scans,   setScans]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listScans()
      setScans(data)
    } catch (err) {
      setError(err.message ?? 'Failed to load scan history.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { scans, loading, error, refetch: fetch }
}

/**
 * Hook — load a single scan by ID.
 */
export function useScan(scanId) {
  const [scan,    setScan]    = useState(null)
  const [loading, setLoading] = useState(!!scanId)
  const [error,   setError]   = useState(null)

  const fetch = useCallback(async () => {
    if (!scanId) return
    setLoading(true)
    setError(null)
    try {
      const data = await getScan(scanId)
      setScan(data)
    } catch (err) {
      setError(err.message ?? 'Failed to load scan details.')
    } finally {
      setLoading(false)
    }
  }, [scanId])

  useEffect(() => { fetch() }, [fetch])

  return { scan, loading, error, refetch: fetch }
}
