import { useEffect, useRef } from 'react'

const COLORS = [
  { r: 0,   g: 200, b: 255 }, // cyan
  { r: 184, g: 138, b: 255 }, // purple
  { r: 255, g: 107, b: 107 }, // coral
]

const NODE_COUNT = 52
const MAX_EDGE_DIST = 180
const PULSE_SPEED = 0.008
const DRIFT_SPEED = 0.18

function rand(min, max) {
  return Math.random() * (max - min) + min
}

function makeNode(w, h) {
  const color = COLORS[Math.floor(Math.random() * COLORS.length)]
  return {
    x: rand(0, w),
    y: rand(0, h),
    vx: rand(-DRIFT_SPEED, DRIFT_SPEED),
    vy: rand(-DRIFT_SPEED, DRIFT_SPEED),
    r: rand(1.5, 3.5),
    opacity: rand(0.25, 0.7),
    color,
    // slow opacity breathe
    breathePhase: rand(0, Math.PI * 2),
    breatheSpeed: rand(0.003, 0.008),
  }
}

function makePulse(fromNode, toNode) {
  return {
    from: fromNode,
    to: toNode,
    t: 0, // 0 → 1 travel progress
    speed: rand(PULSE_SPEED * 0.6, PULSE_SPEED * 1.4),
    color: Math.random() > 0.5 ? fromNode.color : toNode.color,
  }
}

export default function NeuralBackground() {
  const canvasRef = useRef(null)
  const stateRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let animId
    let nodes = []
    let pulses = []
    let lastPulseSpawn = 0

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      // Re-seed nodes on first load or major resize
      if (!nodes.length) {
        nodes = Array.from({ length: NODE_COUNT }, () =>
          makeNode(canvas.width, canvas.height)
        )
      }
    }

    function spawnPulse(now) {
      if (now - lastPulseSpawn < 320) return
      if (pulses.length > 20) return
      // pick a random node and find a nearby neighbour
      const a = nodes[Math.floor(Math.random() * nodes.length)]
      let best = null
      let bestD = Infinity
      for (const b of nodes) {
        if (b === a) continue
        const d = Math.hypot(b.x - a.x, b.y - a.y)
        if (d < MAX_EDGE_DIST && d < bestD) { best = b; bestD = d }
      }
      if (best) {
        pulses.push(makePulse(a, best))
        lastPulseSpawn = now
      }
    }

    function draw(now) {
      if (document.hidden) {
        animId = requestAnimationFrame(draw)
        return
      }

      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)

      // --- Update nodes ---
      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        // Bounce off edges with small margin
        if (n.x < -20) n.vx = Math.abs(n.vx)
        if (n.x > W + 20) n.vx = -Math.abs(n.vx)
        if (n.y < -20) n.vy = Math.abs(n.vy)
        if (n.y > H + 20) n.vy = -Math.abs(n.vy)
        n.breathePhase += n.breatheSpeed
      }

      // --- Draw edges ---
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const d = Math.hypot(b.x - a.x, b.y - a.y)
          if (d > MAX_EDGE_DIST) continue
          const edgeAlpha = (1 - d / MAX_EDGE_DIST) * 0.08
          const { r, g, b: bl } = a.color
          ctx.strokeStyle = `rgba(${r},${g},${bl},${edgeAlpha})`
          ctx.lineWidth = 0.6
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }

      // --- Draw nodes ---
      for (const n of nodes) {
        const breathe = 0.5 + 0.5 * Math.sin(n.breathePhase)
        const alpha = n.opacity * (0.4 + 0.6 * breathe)
        const { r, g, b: bl } = n.color

        // Outer glow
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5)
        glow.addColorStop(0, `rgba(${r},${g},${bl},${alpha * 0.4})`)
        glow.addColorStop(1, `rgba(${r},${g},${bl},0)`)
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2)
        ctx.fill()

        // Core dot
        ctx.fillStyle = `rgba(${r},${g},${bl},${alpha})`
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fill()
      }

      // --- Spawn and draw pulses ---
      spawnPulse(now)
      const alive = []
      for (const p of pulses) {
        p.t += p.speed
        if (p.t >= 1) continue
        alive.push(p)

        const x = p.from.x + (p.to.x - p.from.x) * p.t
        const y = p.from.y + (p.to.y - p.from.y) * p.t
        const { r, g, b: bl } = p.color

        // Trail
        const trailT = Math.max(0, p.t - 0.12)
        const tx = p.from.x + (p.to.x - p.from.x) * trailT
        const ty = p.from.y + (p.to.y - p.from.y) * trailT
        const grad = ctx.createLinearGradient(tx, ty, x, y)
        grad.addColorStop(0, `rgba(${r},${g},${bl},0)`)
        grad.addColorStop(1, `rgba(${r},${g},${bl},0.55)`)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(tx, ty)
        ctx.lineTo(x, y)
        ctx.stroke()

        // Pulse dot
        const pGlow = ctx.createRadialGradient(x, y, 0, x, y, 5)
        pGlow.addColorStop(0, `rgba(${r},${g},${bl},0.9)`)
        pGlow.addColorStop(1, `rgba(${r},${g},${bl},0)`)
        ctx.fillStyle = pGlow
        ctx.beginPath()
        ctx.arc(x, y, 5, 0, Math.PI * 2)
        ctx.fill()
      }
      pulses = alive

      animId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.9,
      }}
    />
  )
}
