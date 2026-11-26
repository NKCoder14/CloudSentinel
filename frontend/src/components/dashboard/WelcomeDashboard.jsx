import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Shield, CloudUpload, FileBarChart2, ArrowRight,
  Lock, Database, Server, CheckCircle2,
  ScanSearch, Gauge, Wrench, Cpu, FileJson,
} from 'lucide-react'
import Button from '../common/Button.jsx'
import LoadingState from '../common/LoadingState.jsx'
import NetworkCanvas from '../common/NetworkCanvas.jsx'

/* ── Service coverage cards (SheCares feature-card pattern) ──── */
const SERVICES = [
  {
    id: 's3',
    icon: Database,
    name: 'Amazon S3',
    checks: ['Public bucket exposure', 'Missing server-side encryption', 'ACL misconfiguration'],
  },
  {
    id: 'iam',
    icon: Lock,
    name: 'AWS IAM',
    checks: ['Wildcard (*) permissions', 'Excessive policy scope', 'Overly permissive roles'],
  },
  {
    id: 'ec2',
    icon: Server,
    name: 'Amazon EC2',
    checks: ['Unrestricted inbound (0.0.0.0/0)', 'Exposed sensitive ports', 'Open security groups'],
  },
]

/* ── How CloudSentinel Works (4 stages) ──────────────────────── */
const HOW_IT_WORKS = [
  {
    step: '01',
    icon: CloudUpload,
    title: 'Ingest',
    description: 'Upload an AWS JSON configuration snapshot for validation and normalization.',
  },
  {
    step: '02',
    icon: ScanSearch,
    title: 'Detect',
    description: 'Evaluate S3, IAM, and EC2 resources against deterministic security rules.',
  },
  {
    step: '03',
    icon: Gauge,
    title: 'Assess Risk',
    description: 'Calculate a 0–100 risk score and classify severity across all findings.',
  },
  {
    step: '04',
    icon: Wrench,
    title: 'Remediate',
    description: 'Inspect evidence-backed findings and follow actionable remediation steps.',
  },
]

/* ── Security Capabilities (actual implemented features) ─────── */
const CAPABILITIES = [
  {
    icon: Cpu,
    title: 'Deterministic Rule Engine',
    description: 'Repeatable Python security checks with zero guesswork across S3, IAM, and EC2.',
  },
  {
    icon: Gauge,
    title: 'Quantitative Risk Scoring',
    description: 'Automated 0–100 risk scoring and Critical / High / Medium / Low classification.',
  },
  {
    icon: Shield,
    title: 'Evidence & Remediation',
    description: 'Every finding includes exact resource evidence and concrete fix recommendations.',
  },
  {
    icon: FileJson,
    title: 'Audit History & JSON Export',
    description: 'Scans persist in MySQL and can be reviewed anytime or exported as JSON reports.',
  },
]

/* ── Main component ──────────────────────────────────────────── */
export default function WelcomeDashboard({ loading }) {
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <LoadingState rows={3} label="Loading dashboard…" />
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-fade-in">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-hero px-8 py-10 text-white">
        {/* Animated network canvas — behind all content */}
        <NetworkCanvas nodeCount={38} maxDist={130} speed={0.22} opacity={0.55} />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-pill bg-white/10 border border-white/15 px-3 py-1 text-xs text-white/80 mb-4">
            <Shield size={12} />
            Automated Cloud Security Audit
          </div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight mb-2">
            Audit Your Cloud Infrastructure
          </h1>
          <p className="text-sm text-white/70 font-light max-w-lg leading-relaxed mb-6">
            Upload a JSON configuration snapshot to run a comprehensive security audit.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate('/connect')}
              className="bg-white text-lav-800 hover:bg-lav-100 border-transparent"
            >
              <CloudUpload size={15} />
              Run New Audit
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/reports')}
              className="text-white hover:bg-white/10"
            >
              <FileBarChart2 size={15} />
              All Reports
            </Button>
          </div>
        </div>
      </section>

      {/* ── Security Coverage ─────────────────────────────────── */}
      <section>
        <span className="cs-section-label block mb-4">Security Coverage</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SERVICES.map(({ id, icon: Icon, name, checks }) => (
            <div key={id} className="cs-card p-5 flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-card border border-cs-border flex items-center justify-center">
                <Icon size={18} className="text-lav-700" />
              </div>
              <div>
                <p className="font-semibold text-sm text-cs-primary mb-1">{name}</p>
                <ul className="space-y-1">
                  {checks.map(c => (
                    <li key={c} className="flex items-start gap-1.5 text-xs text-cs-secondary font-light">
                      <CheckCircle2 size={11} className="text-lav-600 shrink-0 mt-0.5" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => navigate('/connect')}
                className="text-xs text-cs-accent font-medium flex items-center gap-1 hover:text-cs-accent-hover transition-colors mt-auto"
              >
                Audit this service <ArrowRight size={11} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── How CloudSentinel Works ───────────────────────────── */}
      <section className="cs-card p-6">
        <span className="cs-section-label block mb-5">How CloudSentinel Works</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HOW_IT_WORKS.map(({ step, icon: Icon, title, description }, idx) => (
            <div key={title} className="relative cs-inset p-4 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-gradient-accent flex items-center justify-center text-white shadow-sm">
                  <Icon size={15} />
                </div>
                <span className="text-2xs font-mono font-semibold text-cs-muted">{step}</span>
              </div>
              <p className="font-semibold text-sm text-cs-primary">{title}</p>
              <p className="text-xs text-cs-secondary font-light leading-relaxed">{description}</p>
              {idx < HOW_IT_WORKS.length - 1 && (
                <ArrowRight
                  size={14}
                  className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-cs-muted z-10"
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Security Capabilities ─────────────────────────────── */}
      <section>
        <span className="cs-section-label block mb-4">Security Capabilities</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CAPABILITIES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="cs-card p-5 flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-card border border-cs-border flex items-center justify-center shrink-0">
                <Icon size={16} className="text-lav-700" />
              </div>
              <div>
                <p className="font-semibold text-sm text-cs-primary mb-1">{title}</p>
                <p className="text-xs text-cs-secondary font-light leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
