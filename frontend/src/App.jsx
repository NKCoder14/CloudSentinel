import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/layout/Navbar.jsx'
import WelcomePage        from './pages/WelcomePage.jsx'
import InfrastructurePage from './pages/InfrastructurePage.jsx'
import ReportsPage        from './pages/ReportsPage.jsx'
import NetworkCanvas      from './components/common/NetworkCanvas.jsx'
import { useScans }       from './hooks/useScans.js'

function Layout() {
  const { scans } = useScans()

  return (
    <div className="relative min-h-screen flex flex-col bg-cs-bg overflow-hidden">
      {/* Faint page-level network — behind everything, dashboard hero has its own denser one */}
      <NetworkCanvas nodeCount={22} maxDist={110} speed={0.18} opacity={0.12} />

      {/* Floating Pill Top Navigation */}
      <Navbar scanCount={scans.length} />

      {/* Main content */}
      <main className="relative z-10 flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
          <Routes>
            <Route path="/"               element={<WelcomePage />} />
            <Route path="/connect"        element={<InfrastructurePage />} />
            <Route path="/reports"        element={<ReportsPage />} />
            <Route path="/reports/:scanId" element={<ReportsPage />} />
            <Route path="*"               element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
