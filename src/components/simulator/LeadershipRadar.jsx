import { useRef, useEffect, useCallback } from 'react'

const AXES = ['who', 'why', 'what', 'how']

// Cardinal point angles — WHO top, WHY right, WHAT bottom, HOW left
const ANGLES = {
  who:  -Math.PI / 2,
  why:   0,
  what:  Math.PI / 2,
  how:   Math.PI,
}

const COLORS = {
  who:  '#B88AFF',
  why:  '#00C8FF',
  what: '#00E896',
  how:  '#FFB340',
}

const LABELS = {
  who:  'WHO',
  why:  'WHY',
  what: 'WHAT',
  how:  'HOW',
}

const DESCS = {
  who:  'People & Relationships',
  why:  'Vision & Purpose',
  what: 'Systems & Process',
  how:  'Execution & Results',
}

// Polygon area (shoelace) → leadership space coverage %
function polygonArea(pts) {
  let a = 0
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length
    a += pts[i].x * pts[j].y - pts[j].x * pts[i].y
  }
  return Math.abs(a / 2)
}

function lerp(a, b, t) { return a + (b - a) * t }

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

export default function LeadershipRadar({ axes, size = 380 }) {
  const canvasRef  = useRef()
  const currentRef = useRef({ who: axes.who * 0.1, why: axes.why * 0.1, what: axes.what * 0.1, how: axes.how * 0.1 })
  const targetRef  = useRef({ ...axes })
  const rafRef     = useRef()
  const timeRef    = useRef(0)

  // Keep target in sync with prop changes
  useEffect(() => { targetRef.current = { ...axes } }, [axes])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width  = size * dpr
    canvas.height = size * dpr
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)

    const cx   = size / 2
    const cy   = size / 2
    const maxR = size * 0.33

    // Max possible polygon area (all axes at 100)
    const maxPts = AXES.map(ax => ({
      x: cx + maxR * Math.cos(ANGLES[ax]),
      y: cy + maxR * Math.sin(ANGLES[ax]),
    }))
    const maxArea = polygonArea(maxPts)

    function draw(timestamp) {
      timeRef.current = timestamp * 0.001
      ctx.clearRect(0, 0, size, size)

      const t    = timeRef.current
      const cur  = currentRef.current
      const tar  = targetRef.current

      // Exponential ease toward target (feels like spring)
      AXES.forEach(ax => { cur[ax] = lerp(cur[ax], tar[ax], 0.10) })

      const pts = AXES.map(ax => {
        const r = (cur[ax] / 100) * maxR
        return {
          x: cx + r * Math.cos(ANGLES[ax]),
          y: cy + r * Math.sin(ANGLES[ax]),
          ax,
          val: cur[ax],
        }
      })

      // Dominant axis by current animated value
      const dominant = AXES.reduce((best, ax) => cur[ax] > cur[best] ? ax : best, 'who')
      const domColor = COLORS[dominant]
      const domRgb   = hexToRgb(domColor)

      // Coverage score
      const area     = polygonArea(pts)
      const coverage = Math.round((area / maxArea) * 100)

      // ── 1. Breathing background rings ──────────────────────────
      const breathe = Math.sin(t * 0.8) * 0.5 + 0.5 // 0→1 slow pulse
      ;[100, 75, 50, 25].forEach((g, i) => {
        const r   = (g / 100) * maxR
        const isPrimary = g === 50
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.strokeStyle = isPrimary
          ? `rgba(${domRgb.r},${domRgb.g},${domRgb.b},${0.06 + breathe * 0.04})`
          : 'rgba(255,255,255,0.035)'
        ctx.lineWidth = isPrimary ? 1 : 0.75
        if (g === 100) {
          ctx.setLineDash([2, 5])
        } else {
          ctx.setLineDash([])
        }
        ctx.stroke()
        ctx.setLineDash([])

        // Ring value labels (data analyst: annotate every scale marker)
        ctx.font = '600 7px ui-monospace, monospace'
        ctx.fillStyle = 'rgba(255,255,255,0.14)'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(g, cx + 3, cy - r + 9)
      })

      // ── 2. Axis spokes ─────────────────────────────────────────
      AXES.forEach(ax => {
        const isDom  = ax === dominant
        const endX   = cx + maxR * Math.cos(ANGLES[ax])
        const endY   = cy + maxR * Math.sin(ANGLES[ax])
        const rgb    = hexToRgb(COLORS[ax])

        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(endX, endY)
        ctx.strokeStyle = isDom
          ? `rgba(${rgb.r},${rgb.g},${rgb.b},0.22)`
          : 'rgba(255,255,255,0.05)'
        ctx.lineWidth = isDom ? 1.5 : 0.75
        ctx.stroke()
      })

      // ── 3. Polygon fill with radial gradient ───────────────────
      ctx.beginPath()
      pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y))
      ctx.closePath()

      const fillGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.9)
      fillGrad.addColorStop(0, `rgba(${domRgb.r},${domRgb.g},${domRgb.b},0.22)`)
      fillGrad.addColorStop(0.6, `rgba(${domRgb.r},${domRgb.g},${domRgb.b},0.10)`)
      fillGrad.addColorStop(1, `rgba(${domRgb.r},${domRgb.g},${domRgb.b},0.02)`)
      ctx.fillStyle = fillGrad
      ctx.fill()

      // Polygon stroke with glow
      ctx.strokeStyle = domColor
      ctx.lineWidth   = 2
      ctx.lineJoin    = 'round'
      ctx.shadowColor = domColor
      ctx.shadowBlur  = 10
      ctx.stroke()
      ctx.shadowBlur  = 0

      // ── 4. Axis labels (data-encoded: opacity = value strength) ──
      AXES.forEach(ax => {
        const isDom  = ax === dominant
        const angle  = ANGLES[ax]
        const labelR = maxR + 26
        const lx = cx + labelR * Math.cos(angle)
        const ly = cy + labelR * Math.sin(angle)
        const opacity = 0.3 + (cur[ax] / 100) * 0.7 // brightness encodes value

        ctx.textAlign    = Math.abs(Math.cos(angle)) < 0.1 ? 'center' : Math.cos(angle) > 0 ? 'left' : 'right'
        ctx.textBaseline = Math.abs(Math.sin(angle)) < 0.1 ? 'middle' : Math.sin(angle) > 0 ? 'top' : 'bottom'

        // Axis name
        ctx.font      = `800 ${isDom ? 12 : 10}px 'DM Sans', ui-sans-serif, sans-serif`
        ctx.fillStyle = isDom ? domColor : `rgba(255,255,255,${opacity})`
        if (isDom) {
          ctx.shadowColor = domColor
          ctx.shadowBlur  = 6
        }
        ctx.fillText(LABELS[ax], lx, ly)
        ctx.shadowBlur = 0

        // Sub-description for dominant
        if (isDom) {
          const subLx = lx
          const subLy = ly + (Math.sin(angle) >= 0 ? 14 : -14)
          ctx.font      = `500 8px 'DM Sans', sans-serif`
          ctx.fillStyle = `rgba(${domRgb.r},${domRgb.g},${domRgb.b},0.5)`
          ctx.fillText(DESCS[ax], subLx, subLy)
        }
      })

      // ── 5. Node dots with per-axis glow ───────────────────────
      pts.forEach(p => {
        const isDom  = p.ax === dominant
        const color  = COLORS[p.ax]
        const rgb    = hexToRgb(color)
        const pulse  = isDom ? (Math.sin(t * 2.4) * 0.5 + 0.5) : 0
        const dotR   = isDom ? 5.5 + pulse * 1.5 : 3.5

        // Outer glow halo
        const glowR  = dotR + (isDom ? 10 + pulse * 4 : 7)
        const glow   = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR)
        glow.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},${isDom ? 0.3 + pulse * 0.1 : 0.18})`)
        glow.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.beginPath()
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()

        // Core dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, dotR, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.shadowColor = color
        ctx.shadowBlur  = isDom ? 12 : 6
        ctx.fill()
        ctx.shadowBlur  = 0

        // Value number offset along axis direction
        const ang = ANGLES[p.ax]
        const vx  = p.x + Math.cos(ang) * 14
        const vy  = p.y + Math.sin(ang) * 14
        ctx.font         = '800 9px ui-monospace, monospace'
        ctx.fillStyle    = color
        ctx.textAlign    = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(Math.round(p.val), vx, vy)
      })

      // ── 6. Center origin dot ───────────────────────────────────
      ctx.beginPath()
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,255,0.25)'
      ctx.fill()

      // ── 7. Coverage badge (bottom-right corner) ─────────────────
      // Draw inside canvas so it follows the chart
      const badgeX = size - 10
      const badgeY = size - 10
      ctx.font         = '700 7px ui-monospace, monospace'
      ctx.textAlign    = 'right'
      ctx.textBaseline = 'bottom'
      ctx.fillStyle    = 'rgba(255,255,255,0.18)'
      ctx.fillText('COVERAGE', badgeX, badgeY - 12)
      ctx.font         = `800 14px ui-monospace, monospace`
      ctx.fillStyle    = domColor
      ctx.fillText(`${coverage}%`, badgeX, badgeY)

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [size])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size, background: 'transparent' }}
    />
  )
}
