import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, CloudUpload, FileBarChart2, Menu, X } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/connect', icon: CloudUpload, label: 'Connect Infrastructure' },
  { to: '/reports', icon: FileBarChart2, label: 'Audit Reports' },
]

export default function Navbar({ scanCount = 0 }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <div className="w-full pt-4 pb-2 px-4 sm:px-6 sticky top-0 z-40 pointer-events-none">
      {/* Floating Pill Container */}
      <nav
        aria-label="Main Navigation"
        className="max-w-4xl mx-auto pointer-events-auto rounded-full bg-[#18171f]/85 backdrop-blur-md border border-[#363345]/60 shadow-[0_8px_32px_rgba(0,0,0,0.22)] px-3 py-2 flex items-center justify-between gap-3 transition-all duration-200"
      >
        {/* Left: Brand Logo in circular icon container */}
        <NavLink
          to="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-lav-400/50"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lav-600/90 via-lav-700 to-lav-900 border border-lav-400/30 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(139,92,246,0.25)] group-hover:scale-105 transition-transform duration-150">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="text-lav-100"
            >
              <path
                d="M12 2.5L4.5 5.8V11.4C4.5 16.3 7.7 20.8 12 22C16.3 20.8 19.5 16.3 19.5 11.4V5.8L12 2.5Z"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinejoin="round"
                fill="rgba(167,139,250,0.14)"
              />
              <path
                d="M12 8.2L9.2 13.3H14.8L12 8.2Z"
                stroke="#C4B5FD"
                strokeWidth="1.35"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="8.2" r="1.3" fill="#EDE9FE" />
              <circle cx="9.2" cy="13.3" r="1.3" fill="#EDE9FE" />
              <circle cx="14.8" cy="13.3" r="1.3" fill="#EDE9FE" />
            </svg>
          </div>
          <span className="font-semibold text-[13px] tracking-tight text-white/95 group-hover:text-lav-100 transition-colors leading-none">
            Cloud<span className="text-lav-300">Sentinel</span>
          </span>
        </NavLink>

        {/* Center: Desktop horizontal pill navigation */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
            const active = isActive(to)
            return (
              <NavLink
                key={to}
                to={to}
                className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ease-out hover:scale-[1.03] active:scale-[0.98] ${active
                  ? 'bg-[#2d2a3b]/90 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] border border-lav-500/20'
                  : 'text-white/65 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Icon
                  size={13}
                  className={`shrink-0 transition-colors ${active ? 'text-lav-300' : 'text-white/50 group-hover:text-white/80'
                    }`}
                />
                <span>{label}</span>
              </NavLink>
            )
          })}
        </div>

        {/* Right: Mobile toggle */}
        <div className="flex items-center gap-1.5 pr-1">
          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden w-7 h-7 rounded-full flex items-center justify-center text-white/75 hover:text-white hover:bg-white/10 transition-all duration-150 ease-out hover:scale-[1.03] active:scale-[0.98] focus:outline-none"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={15} /> : <Menu size={15} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Dropdown */}
      {mobileOpen && (
        <div className="md:hidden max-w-4xl mx-auto mt-2 pointer-events-auto rounded-2xl bg-[#18171f]/95 backdrop-blur-md border border-[#363345]/80 shadow-2xl p-3 flex flex-col gap-1 transition-all duration-150 animate-fade-in">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
            const active = isActive(to)
            return (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ease-out hover:scale-[1.03] active:scale-[0.98] ${active
                  ? 'bg-[#2d2a3b] text-white border border-lav-500/25'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Icon size={14} className={active ? 'text-lav-300' : 'text-white/50'} />
                <span>{label}</span>
              </NavLink>
            )
          })}
        </div>
      )}
    </div>
  )
}
