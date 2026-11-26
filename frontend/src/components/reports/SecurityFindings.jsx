import React, { useState, useMemo } from 'react'
import { Search, ChevronUp, ChevronDown, Filter } from 'lucide-react'
import Badge from '../common/Badge.jsx'
import EmptyState from '../common/EmptyState.jsx'
import { sortBySeverity } from '../../utils/severity.js'

const SERVICES = ['All', 'S3', 'IAM', 'EC2']
const SEVERITIES = ['All', 'Critical', 'High', 'Medium', 'Low']

export default function SecurityFindings({ findings = [], onSelectFinding }) {
  const [search, setSearch]     = useState('')
  const [sevFilter, setSev]     = useState('All')
  const [svcFilter, setSvc]     = useState('All')
  const [sortField, setSortField] = useState('severity')
  const [sortAsc, setSortAsc]   = useState(true)

  const toggleSort = (field) => {
    if (sortField === field) setSortAsc(v => !v)
    else { setSortField(field); setSortAsc(true) }
  }

  const filtered = useMemo(() => {
    let list = findings.filter(f => {
      const matchSev = sevFilter === 'All' || f.severity?.toLowerCase() === sevFilter.toLowerCase()
      const matchSvc = svcFilter === 'All' || f.service?.toLowerCase() === svcFilter.toLowerCase() ||
                       f.resource_type?.toLowerCase().includes(svcFilter.toLowerCase())
      const matchSearch = !search ||
        f.title?.toLowerCase().includes(search.toLowerCase()) ||
        f.resource?.toLowerCase().includes(search.toLowerCase()) ||
        f.rule_id?.toLowerCase().includes(search.toLowerCase())
      return matchSev && matchSvc && matchSearch
    })

    list = sortBySeverity(list)

    if (sortField !== 'severity') {
      list = [...list].sort((a, b) => {
        const av = (a[sortField] ?? '').toString()
        const bv = (b[sortField] ?? '').toString()
        return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av)
      })
    } else if (!sortAsc) {
      list = [...list].reverse()
    }

    return list
  }, [findings, search, sevFilter, svcFilter, sortField, sortAsc])

  const SortIcon = ({ field }) =>
    sortField === field
      ? (sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />)
      : <ChevronDown size={12} className="opacity-30" />

  return (
    <div className="cs-card overflow-hidden">
      {/* Filter bar */}
      <div className="px-5 py-4 border-b border-cs-border bg-cs-surface-2 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-cs-muted" />
          <input
            className="cs-input pl-9 py-2 text-xs"
            placeholder="Search findings…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={12} className="text-cs-muted shrink-0" />
          {SEVERITIES.map(s => (
            <button
              key={s}
              onClick={() => setSev(s)}
              className={`text-xs rounded-pill px-2.5 py-1 font-medium border transition-colors duration-150 ${
                sevFilter === s
                  ? 'bg-gradient-accent text-white border-transparent'
                  : 'bg-cs-surface text-cs-secondary border-cs-border hover:bg-cs-hover'
              }`}
            >
              {s}
            </button>
          ))}
          <span className="text-cs-border">|</span>
          {SERVICES.map(s => (
            <button
              key={s}
              onClick={() => setSvc(s)}
              className={`text-xs rounded-pill px-2.5 py-1 font-medium border transition-colors duration-150 ${
                svcFilter === s
                  ? 'bg-cs-accent-light text-cs-accent-text border-lav-400/30'
                  : 'bg-cs-surface text-cs-secondary border-cs-border hover:bg-cs-hover'
              }`}
            >
              {s}
            </button>
          ))}
          <span className="text-2xs text-cs-muted ml-2 shrink-0">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No findings match your filters"
          body="Try adjusting the severity or service filter."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-cs-border bg-cs-surface-2">
                {[
                  { key: 'severity', label: 'Severity' },
                  { key: 'title',    label: 'Finding' },
                  { key: 'service',  label: 'Service' },
                  { key: 'resource', label: 'Resource' },
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    onClick={() => toggleSort(key)}
                    className="px-4 py-3 text-left text-2xs font-semibold uppercase tracking-widest text-cs-muted cursor-pointer hover:text-cs-secondary select-none"
                  >
                    <span className="inline-flex items-center gap-1">
                      {label} <SortIcon field={key} />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cs-border">
              {filtered.map((f, i) => (
                <tr
                  key={f.id ?? `${f.rule_id}-${i}`}
                  onClick={() => onSelectFinding?.(f)}
                  className="cursor-pointer hover:bg-cs-hover transition-colors duration-100"
                >
                  <td className="px-4 py-3.5">
                    <Badge severity={f.severity?.toLowerCase()}>{f.severity}</Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-xs font-medium text-cs-primary">{f.title}</p>
                    {f.rule_id && (
                      <p className="text-2xs text-cs-muted font-mono mt-0.5">{f.rule_id}</p>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-cs-secondary">{f.service ?? f.resource_type ?? '—'}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-xs text-cs-secondary truncate max-w-[200px] block">
                      {f.resource ?? '—'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
