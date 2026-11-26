import { useEffect, useRef } from 'react'

/**
 * NetworkCanvas – lightweight Canvas network-node animation.
 *
 * Props:
 *   nodeCount   number of nodes          (default 40)
 *   maxDist     connection draw distance  (default 130)
 *   speed       max node velocity        (default 0.25)
 *   opacity     overall canvas opacity   (default 1; tune via parent)
 *   className   extra classes
 */
export default function NetworkCanvas({
  nodeCount = 40,
  maxDist   = 130,
  speed     = 0.25,
  opacity   = 1,
  className = '',
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    // ── sizing ─────────────────────────────────────────────────
    let W = 0, H = 0

    function resize() {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      canvas.width  = W
      canvas.height = H
    }
    resize()

    // ── nodes ──────────────────────────────────────────────────
    const nodes = Array.from({ length: nodeCount }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      r:  Math.random() * 1.2 + 0.6,   // radius 0.6–1.8 px
    }))

    // ── pulses ─────────────────────────────────────────────────
    // Each pulse: { from, to, progress 0→1 }
    const pulses = []
    let pulseTimer = 0
    const PULSE_INTERVAL = 80  // frames between spawns (~1.3 s at 60 fps)
    const PULSE_STEP = 0.007   // progress per frame  (~2.4 s crossing time)

    function spawnPulse() {
      for (let attempt = 0; attempt < 15; attempt++) {
        const i = Math.floor(Math.random() * nodes.length)
        const j = Math.floor(Math.random() * nodes.length)
        if (i === j) continue
        const dx = nodes[i].x - nodes[j].x
        const dy = nodes[i].y - nodes[j].y
        if (dx * dx + dy * dy < maxDist * maxDist) {
          pulses.push({ from: i, to: j, progress: 0 })
          return
        }
      }
    }

    // ── palette ────────────────────────────────────────────────
    // lav-400 ~ #a78bfa  lav-500 ~ #8b5cf6  lav-300 ~ #c4b5fd
    const NODE_COLOR   = 'rgba(167,139,250,'   // lav-400 base
    const LINE_COLOR   = 'rgba(139, 92,246,'   // lav-500 base
    const PULSE_COLOR  = 'rgba(196,181,253,'   // lav-300 base

    // ── draw loop ──────────────────────────────────────────────
    let rafId

    function draw() {
      ctx.clearRect(0, 0, W, H)

      // move nodes
      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        if (n.x <= 0 || n.x >= W) { n.vx *= -1; n.x = Math.max(0, Math.min(W, n.x)) }
        if (n.y <= 0 || n.y >= H) { n.vy *= -1; n.y = Math.max(0, Math.min(H, n.y)) }
      }

      // draw edges
      ctx.lineWidth = 0.5
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d2 = dx * dx + dy * dy
          if (d2 < maxDist * maxDist) {
            const alpha = (1 - Math.sqrt(d2) / maxDist) * 0.14
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = LINE_COLOR + alpha + ')'
            ctx.stroke()
          }
        }
      }

      // spawn & draw pulses
      pulseTimer++
      if (pulseTimer >= PULSE_INTERVAL) { pulseTimer = 0; spawnPulse() }

      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p]
        pulse.progress += PULSE_STEP
        if (pulse.progress >= 1) { pulses.splice(p, 1); continue }

        const a = nodes[pulse.from]
        const b = nodes[pulse.to]
        const px = a.x + (b.x - a.x) * pulse.progress
        const py = a.y + (b.y - a.y) * pulse.progress

        // sin envelope: fade in and out over the journey
        const env = Math.sin(pulse.progress * Math.PI)

        // glow halo
        const grd = ctx.createRadialGradient(px, py, 0, px, py, 7)
        grd.addColorStop(0, PULSE_COLOR + (env * 0.45) + ')')
        grd.addColorStop(1, PULSE_COLOR + '0)')
        ctx.beginPath()
        ctx.arc(px, py, 7, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()

        // bright core dot
        ctx.beginPath()
        ctx.arc(px, py, 1.8, 0, Math.PI * 2)
        ctx.fillStyle = PULSE_COLOR + (env * 0.85) + ')'
        ctx.fill()
      }

      // draw nodes
      for (const n of nodes) {
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = NODE_COLOR + '0.38)'
        ctx.fill()
      }

      rafId = requestAnimationFrame(draw)
    }

    // kick off
    rafId = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [nodeCount, maxDist, speed])  // stable deps — no recreate on parent re-render

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ opacity }}
    />
  )
}
