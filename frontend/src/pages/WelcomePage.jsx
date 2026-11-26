import React from 'react'
import WelcomeDashboard from '../components/dashboard/WelcomeDashboard.jsx'
import { useScans } from '../hooks/useScans.js'

export default function WelcomePage() {
  const { scans, loading, error } = useScans()
  const hasScans = scans.length > 0
  const backendConnected = !loading && !error
  const snapshotUploaded = hasScans

  return (
    <WelcomeDashboard
      backendConnected={backendConnected}
      hasScans={hasScans}
      snapshotUploaded={snapshotUploaded}
      loading={loading}
    />
  )
}
