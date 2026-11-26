import React from 'react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts'

const SEV_COLORS = {
  Critical: '#DC2626',
  High:     '#EA580C',
  Medium:   '#D97706',
  Low:      '#16A34A',
}

/* ── Custom tooltip ───────────────────────────────────────────── */
function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0].payload
  return (
    <div className="bg-white border border-cs-border rounded-xl shadow-card px-3 py-2">
      <p className="text-xs font-semibold text-cs-primary">{name}</p>
      <p className="text-xs text-cs-secondary">{value} finding{value !== 1 ? 's' : ''}</p>
    </div>
  )
}

/* ── Severity donut ───────────────────────────────────────────── */
export function SeverityDonut({ critical = 0, high = 0, medium = 0, low = 0 }) {
  const data = [
    { name: 'Critical', value: critical },
    { name: 'High',     value: high },
    { name: 'Medium',   value: medium },
    { name: 'Low',      value: low },
  ].filter(d => d.value > 0)

  if (data.length === 0) return null

  return (
    <div className="cs-card p-5">
      <p className="text-xs font-semibold text-cs-primary mb-4">Severity Distribution</p>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={56}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map(entry => (
              <Cell key={entry.name} fill={SEV_COLORS[entry.name]} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {data.map(d => (
          <span key={d.name} className="inline-flex items-center gap-1.5 text-xs text-cs-secondary">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: SEV_COLORS[d.name] }} />
            {d.name} · {d.value}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── Service bar chart ────────────────────────────────────────── */
export function ServiceBarChart({ findings = [] }) {
  const serviceMap = {}
  findings.forEach(f => {
    const svc = f.service ?? f.resource_type ?? 'Other'
    serviceMap[svc] = (serviceMap[svc] ?? 0) + 1
  })
  const data = Object.entries(serviceMap).map(([service, count]) => ({ service, count }))

  if (data.length === 0) return null

  return (
    <div className="cs-card p-5">
      <p className="text-xs font-semibold text-cs-primary mb-4">Findings by Service</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#DDD5C8" vertical={false} />
          <XAxis
            dataKey="service"
            tick={{ fontSize: 10, fill: '#A094C8' }}
            axisLine={{ stroke: '#DDD5C8' }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 10, fill: '#A094C8' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: '#EDE8F5', opacity: 0.5 }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              return (
                <div className="bg-white border border-cs-border rounded-xl shadow-card px-3 py-2">
                  <p className="text-xs font-semibold text-cs-primary">{payload[0].payload.service}</p>
                  <p className="text-xs text-cs-secondary">{payload[0].value} finding{payload[0].value !== 1 ? 's' : ''}</p>
                </div>
              )
            }}
          />
          <Bar dataKey="count" fill="#7260AA" radius={[6, 6, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
