/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ── Sidebar (deep charcoal) ───────────────────────────────────
        sidebar: {
          bg:           '#1C1B22',   // near-black charcoal with slight violet undertone
          hover:        '#282730',
          border:       '#32303C',
          text:         '#A094C8',   // muted lavender — readable on dark
          'text-active':'#F0ECF8',   // lightest lavender-white
          active:       '#6B5FA0',
          'active-bg':  'rgba(155,142,196,0.14)',
        },
        // ── App surfaces (warm ivory) ─────────────────────────────────
        cs: {
          bg:          '#F5F1EC',   // warm ivory page background
          surface:     '#FDFAF6',   // warm white card surface
          'surface-2': '#F0EBE2',   // slightly deeper ivory for nested surfaces
          border:      '#DDD5C8',   // warm taupe border
          'border-sm': '#EDE8DF',
          hover:       '#EDE7DE',   // ivory row hover

          // Typography
          primary:   '#1C1B22',   // deep charcoal (almost black, cool)
          secondary: '#4A4557',   // mid charcoal with violet undertone
          muted:     '#9B8EC4',   // muted lavender
          placeholder:'#B8AED4',

          // Accent — muted lavender
          accent:        '#7260AA',   // mid muted lavender
          'accent-hover':'#5F4E94',   // deeper lavender
          'accent-light':'#EDE8F5',   // very light lavender tint
          'accent-mid':  '#9B8EC4',   // lighter lavender
          'accent-text': '#3D3060',   // deep lavender for text on light bg

          // Severity (semantic)
          critical:         '#DC2626',
          'critical-bg':    '#FEF2F2',
          'critical-border':'#FCA5A5',
          'critical-text':  '#7F1D1D',
          high:             '#EA580C',
          'high-bg':        '#FFF7ED',
          'high-border':    '#FED7AA',
          'high-text':      '#7C2D12',
          medium:           '#D97706',
          'medium-bg':      '#FFFBEB',
          'medium-border':  '#FDE68A',
          'medium-text':    '#78350F',
          low:              '#16A34A',
          'low-bg':         '#F0FDF4',
          'low-border':     '#86EFAC',
          'low-text':       '#14532D',
          success:          '#16A34A',
          'success-bg':     '#F0FDF4',
        },
        // ── Palette direct tokens ─────────────────────────────────────
        lav: {
          900: '#1C1B22',   // deepest charcoal
          800: '#282730',
          700: '#3D3060',   // deep lavender-charcoal
          600: '#5F4E94',   // medium lavender
          500: '#7260AA',   // accent lavender
          400: '#9B8EC4',   // muted lavender
          200: '#C5BBE0',   // light lavender
          100: '#EDE8F5',   // lavender tint
          50:  '#F5F2FC',   // palest lavender
        },
        ivory: {
          DEFAULT: '#FAF7F0',
          warm:    '#F5F1EC',
          deep:    '#EDE7DE',
          border:  '#DDD5C8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
      borderRadius: {
        xl:   '0.75rem',
        '2xl':'1rem',
        '3xl':'1.5rem',
        pill: '9999px',
      },
      boxShadow: {
        card:         '0 1px 3px rgba(28,27,34,0.07), 0 1px 2px rgba(28,27,34,0.05)',
        'card-hover': '0 8px 24px rgba(28,27,34,0.10), 0 2px 6px rgba(28,27,34,0.06)',
        btn:          '0 2px 10px rgba(114,96,170,0.35)',
        elevated:     '0 20px 40px rgba(28,27,34,0.12)',
        'inner-sm':   'inset 0 1px 2px rgba(28,27,34,0.06)',
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, #5F4E94 0%, #7260AA 100%)',
        'gradient-logo':   'linear-gradient(135deg, #3D3060 0%, #7260AA 100%)',
        'gradient-card':   'linear-gradient(135deg, #EDE8F5 0%, #F5F2FC 100%)',
        'gradient-dark':   'linear-gradient(135deg, #1C1B22 0%, #28273C 100%)',
        'gradient-hero':   'linear-gradient(160deg, #1C1B22 0%, #3D3060 50%, #5F4E94 100%)',
      },
      animation: {
        'fade-in':   'fadeIn 0.2s ease-out',
        'slide-up':  'slideUp 0.2s ease-out',
        'slide-in':  'slideIn 0.25s ease-out',
        'spin':      'spin 1s linear infinite',
        'pulse-soft':'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: 0 },                               to: { opacity: 1 } },
        slideUp:   { from: { opacity: 0, transform: 'translateY(10px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideIn:   { from: { opacity: 0, transform: 'translateX(20px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        pulseSoft: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.6 } },
      },
    },
  },
  plugins: [],
}
