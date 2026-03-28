import { useEffect, useRef } from 'react'

// Detailed brain silhouette — anatomically-inspired side view
const BRAIN_OUTER = new Path2D(`
  M 50 12
  C 42 12, 34 14, 28 20
  C 22 26, 18 34, 16 42
  C 14 48, 13 56, 16 62
  C 12 66, 11 72, 14 78
  C 17 84, 24 88, 32 90
  C 38 92, 44 92, 50 90
  C 56 92, 62 92, 68 90
  C 76 88, 83 84, 86 78
  C 89 72, 88 66, 84 62
  C 87 56, 86 48, 84 42
  C 82 34, 78 26, 72 20
  C 66 14, 58 12, 50 12
  Z
`)

// Brain hemisphere divider
const BRAIN_CENTER = 'M 50 16 C 49 30, 48 50, 49 70 C 49 78, 50 85, 50 90'

// Left hemisphere folds (sulci) — flowing curves
const LEFT_FOLDS = [
  'M 28 28 Q 34 24, 42 26 Q 46 27, 48 22',
  'M 20 38 Q 28 33, 36 36 Q 42 38, 47 34',
  'M 18 50 Q 26 45, 34 48 Q 40 50, 46 46',
  'M 17 62 Q 24 57, 32 60 Q 38 62, 46 58',
  'M 20 74 Q 28 69, 36 72 Q 42 74, 48 70',
  'M 26 84 Q 34 80, 42 82 Q 46 83, 49 80',
]

// Right hemisphere folds — mirror curves
const RIGHT_FOLDS = [
  'M 72 28 Q 66 24, 58 26 Q 54 27, 52 22',
  'M 80 38 Q 72 33, 64 36 Q 58 38, 53 34',
  'M 82 50 Q 74 45, 66 48 Q 60 50, 54 46',
  'M 83 62 Q 76 57, 68 60 Q 62 62, 54 58',
  'M 80 74 Q 72 69, 64 72 Q 58 74, 52 70',
  'M 74 84 Q 66 80, 58 82 Q 54 83, 51 80',
]

const ALL_FOLDS = [...LEFT_FOLDS, ...RIGHT_FOLDS]

// Neural hotspot positions (normalized 0-100)
const HOTSPOTS = [
  { x: 35, y: 28 }, { x: 65, y: 28 },
  { x: 25, y: 45 }, { x: 75, y: 45 },
  { x: 50, y: 40 },
  { x: 30, y: 62 }, { x: 70, y: 62 },
  { x: 40, y: 78 }, { x: 60, y: 78 },
  { x: 50, y: 55 },
]

const RAINBOW = ['#FF6B6B', '#FFB340', '#00E896', '#00C8FF', '#B88AFF', '#FF6B6B']

function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  }
}

function lerpColor(t) {
  const seg = t * (RAINBOW.length - 1)
  const i = Math.floor(seg)
  const f = seg - i
  const a = hexToRgb(RAINBOW[i])
  const b = hexToRgb(RAINBOW[Math.min(i + 1, RAINBOW.length - 1)])
  return `rgb(${a.r + (b.r - a.r) * f | 0}, ${a.g + (b.g - a.g) * f | 0}, ${a.b + (b.b - a.b) * f | 0})`
}

function lerpColorAlpha(t, alpha) {
  const seg = t * (RAINBOW.length - 1)
  const i = Math.floor(seg)
  const f = seg - i
  const a = hexToRgb(RAINBOW[i])
  const b = hexToRgb(RAINBOW[Math.min(i + 1, RAINBOW.length - 1)])
  return `rgba(${a.r + (b.r - a.r) * f | 0}, ${a.g + (b.g - a.g) * f | 0}, ${a.b + (b.b - a.b) * f | 0}, ${alpha})`
}

// DNA helix configuration
const HELIX_NODES = 30
const HELIX_RADIUS = 90
const HELIX_Y_MIN = -20
const HELIX_Y_MAX = 120
const HELIX_TURNS = 3

export default function BrainOrbit({ size = 420 }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2
    const brainScale = size / 100 * 0.42

    // Pre-create orbital particles
    const orbits = [0, 1, 2].map(o => {
      const count = 18 + o * 6
      return Array.from({ length: count }, (_, p) => ({
        angle: (p / count) * Math.PI * 2 + o * 0.5,
        speed: 0.25 + o * 0.08,
        rx: 170 + o * 28,
        ry: 55 + o * 18,
        tilt: (-25 + o * 25) * Math.PI / 180,
        size: 1.2 + Math.random() * 1.8,
        colorT: p / count,
      }))
    })

    // Ambient sparks
    const sparks = Array.from({ length: 50 }, () => ({
      x: Math.random() * size,
      y: Math.random() * size,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: 0.5 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
      colorT: Math.random(),
    }))

    // Neural connection pairs for synaptic firing
    const connections = []
    for (let i = 0; i < HOTSPOTS.length; i++) {
      for (let j = i + 1; j < HOTSPOTS.length; j++) {
        const dx = HOTSPOTS[i].x - HOTSPOTS[j].x
        const dy = HOTSPOTS[i].y - HOTSPOTS[j].y
        if (Math.sqrt(dx * dx + dy * dy) < 30) {
          connections.push([i, j])
        }
      }
    }

    function draw(time) {
      ctx.clearRect(0, 0, size, size)
      const t = time * 0.001

      // === BACKGROUND GLOW ===
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.48)
      bg.addColorStop(0, 'rgba(0,200,255,0.06)')
      bg.addColorStop(0.4, 'rgba(184,138,255,0.03)')
      bg.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, size, size)

      // === ORBITAL RINGS (behind brain) ===
      drawOrbitals(ctx, orbits, cx, cy, t, false)

      // === DNA HELIX (behind brain — back half) ===
      drawDNAHelix(ctx, cx, cy, brainScale, t, false)

      // === BRAIN ===
      ctx.save()
      ctx.translate(cx - 50 * brainScale, cy - 50 * brainScale)
      ctx.scale(brainScale, brainScale)

      // Outer glow
      ctx.shadowColor = lerpColorAlpha((t * 0.08) % 1, 0.6)
      ctx.shadowBlur = 40

      // Animated fill gradient
      const fillGrad = ctx.createLinearGradient(0, 0, 100, 100)
      const offset = (t * 0.12) % 1
      for (let i = 0; i < 5; i++) {
        fillGrad.addColorStop(((i / 4) + offset) % 1, lerpColorAlpha((i / 4 + offset) % 1, 0.12))
      }
      ctx.fillStyle = fillGrad
      ctx.fill(BRAIN_OUTER)

      // Brain outline — thick rainbow stroke
      const strokeGrad = ctx.createConicGradient(t * 0.5, 50, 50)
      for (let i = 0; i <= 6; i++) {
        strokeGrad.addColorStop(i / 6, RAINBOW[i % RAINBOW.length])
      }
      ctx.strokeStyle = strokeGrad
      ctx.lineWidth = 2
      ctx.globalAlpha = 0.9
      ctx.stroke(BRAIN_OUTER)
      ctx.shadowBlur = 0

      // Hemisphere divider
      ctx.globalAlpha = 0.25
      ctx.strokeStyle = lerpColor((t * 0.1) % 1)
      ctx.lineWidth = 1
      ctx.beginPath()
      const centerPath = new Path2D(BRAIN_CENTER)
      ctx.stroke(centerPath)

      // Sulci folds — each with shifting color
      ctx.lineWidth = 1
      ctx.lineCap = 'round'
      ALL_FOLDS.forEach((fold, i) => {
        const colorT = ((i / ALL_FOLDS.length) + t * 0.15) % 1
        ctx.globalAlpha = 0.35 + Math.sin(t * 1.5 + i * 0.5) * 0.15
        ctx.strokeStyle = lerpColor(colorT)
        ctx.beginPath()
        ctx.stroke(new Path2D(fold))
      })

      // Neural connections — synaptic lines
      ctx.globalAlpha = 1
      connections.forEach(([a, b], ci) => {
        const firing = Math.sin(t * 3 + ci * 1.2) * 0.5 + 0.5
        if (firing > 0.3) {
          const ha = HOTSPOTS[a], hb = HOTSPOTS[b]
          ctx.beginPath()
          ctx.moveTo(ha.x, ha.y)
          ctx.lineTo(hb.x, hb.y)
          ctx.strokeStyle = lerpColorAlpha((ci / connections.length + t * 0.1) % 1, firing * 0.25)
          ctx.lineWidth = firing * 1.5
          ctx.stroke()
        }
      })

      // Hotspot nodes — pulsing
      HOTSPOTS.forEach((h, i) => {
        const pulse = Math.sin(t * 2.5 + i * 0.9) * 0.5 + 0.5
        const colorT = ((i / HOTSPOTS.length) + t * 0.08) % 1
        const color = lerpColor(colorT)
        const r = 2 + pulse * 2.5

        // Glow
        const glow = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, r * 4)
        glow.addColorStop(0, lerpColorAlpha(colorT, 0.4 * pulse))
        glow.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.globalAlpha = 1
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(h.x, h.y, r * 4, 0, Math.PI * 2)
        ctx.fill()

        // Core dot
        ctx.fillStyle = color
        ctx.globalAlpha = 0.6 + pulse * 0.4
        ctx.beginPath()
        ctx.arc(h.x, h.y, r, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.restore()

      // === DNA HELIX (in front of brain — front half) ===
      drawDNAHelix(ctx, cx, cy, brainScale, t, true)

      // === ORBITAL RINGS (in front of brain) ===
      ctx.globalAlpha = 1
      drawOrbitals(ctx, orbits, cx, cy, t, true)

      // === AMBIENT SPARKS ===
      sparks.forEach(s => {
        s.x += s.vx
        s.y += s.vy
        s.phase += 0.02
        if (s.x < 0 || s.x > size) s.vx *= -1
        if (s.y < 0 || s.y > size) s.vy *= -1
        const alpha = (Math.sin(s.phase) * 0.5 + 0.5) * 0.25
        ctx.fillStyle = lerpColorAlpha((s.colorT + t * 0.03) % 1, alpha)
        ctx.globalAlpha = 1
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fill()
      })

      animRef.current = requestAnimationFrame(draw)
    }

    function drawDNAHelix(ctx, cx, cy, brainScale, t, front) {
      const rotation = t * 0.3

      // Brain center in screen coords
      const brainCenterX = cx
      const brainCenterY = cy

      // Compute node positions for both strands
      const strands = [0, 1].map(strandIndex => {
        const phaseOffset = strandIndex * Math.PI
        const nodes = []
        for (let i = 0; i < HELIX_NODES; i++) {
          const frac = i / (HELIX_NODES - 1)
          // Vertical position: map from HELIX_Y_MIN..HELIX_Y_MAX in brain coords to screen
          const yNorm = HELIX_Y_MIN + frac * (HELIX_Y_MAX - HELIX_Y_MIN)
          const screenY = brainCenterY + (yNorm - 50) * brainScale

          // Helix angle for this node
          const helixAngle = frac * HELIX_TURNS * Math.PI * 2 + rotation + phaseOffset

          // 3D position on helix
          const x3d = Math.cos(helixAngle) * HELIX_RADIUS * brainScale / (size / 100 * 0.42)
          const z3d = Math.sin(helixAngle) * HELIX_RADIUS * brainScale / (size / 100 * 0.42)

          // Project to 2D — x3d is the screen offset, z3d determines depth
          const screenX = brainCenterX + x3d * brainScale
          const depth = z3d // positive = toward viewer

          nodes.push({
            sx: screenX,
            sy: screenY,
            depth,
            colorT: (frac + t * 0.05) % 1,
            frac,
            index: i,
          })
        }
        return nodes
      })

      // Determine which nodes are in front vs behind
      // Draw rungs first (behind layer), then strand dots
      ctx.save()

      // --- Draw connecting rungs every 3rd node ---
      for (let i = 0; i < HELIX_NODES; i += 3) {
        const nodeA = strands[0][i]
        const nodeB = strands[1][i]

        // A rung is visible if at least part of it is on the correct side
        const avgDepth = (nodeA.depth + nodeB.depth) / 2
        const isFront = avgDepth > 0

        if (isFront !== front) continue

        const rungAlpha = 0.15 + Math.abs(avgDepth) / (HELIX_RADIUS * brainScale / (size / 100 * 0.42)) * 0.2
        const rungColorT = (nodeA.colorT + nodeB.colorT) / 2

        ctx.beginPath()
        ctx.moveTo(nodeA.sx, nodeA.sy)
        ctx.lineTo(nodeB.sx, nodeB.sy)
        ctx.strokeStyle = lerpColorAlpha(rungColorT, rungAlpha)
        ctx.lineWidth = 0.8
        ctx.globalAlpha = 1
        ctx.stroke()
      }

      // --- Draw strand curves and neuron dots ---
      strands.forEach((nodes, strandIndex) => {
        // Draw strand path segments
        for (let i = 0; i < nodes.length - 1; i++) {
          const n0 = nodes[i]
          const n1 = nodes[i + 1]
          const segDepth = (n0.depth + n1.depth) / 2
          const isFront = segDepth > 0

          if (isFront !== front) continue

          const depthNorm = (segDepth + HELIX_RADIUS * brainScale / (size / 100 * 0.42)) /
            (2 * HELIX_RADIUS * brainScale / (size / 100 * 0.42))
          const segAlpha = 0.1 + depthNorm * 0.35

          ctx.beginPath()
          ctx.moveTo(n0.sx, n0.sy)
          ctx.lineTo(n1.sx, n1.sy)
          ctx.strokeStyle = lerpColorAlpha((n0.colorT + strandIndex * 0.2) % 1, segAlpha)
          ctx.lineWidth = 1.2
          ctx.globalAlpha = 1
          ctx.stroke()
        }

        // Draw neuron dots on each node
        nodes.forEach(n => {
          const isFront = n.depth > 0
          if (isFront !== front) return

          const maxDepth = HELIX_RADIUS * brainScale / (size / 100 * 0.42)
          const depthNorm = (n.depth + maxDepth) / (2 * maxDepth)
          const dotSize = 2 + depthNorm * 2 // 2-4px
          const dotAlpha = 0.3 + depthNorm * 0.7

          const colorT = (n.colorT + strandIndex * 0.3) % 1
          const color = lerpColor(colorT)

          // Glow around neuron dot
          const glowR = dotSize * 2.5
          const glow = ctx.createRadialGradient(n.sx, n.sy, 0, n.sx, n.sy, glowR)
          glow.addColorStop(0, lerpColorAlpha(colorT, 0.25 * dotAlpha))
          glow.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.fillStyle = glow
          ctx.globalAlpha = 1
          ctx.beginPath()
          ctx.arc(n.sx, n.sy, glowR, 0, Math.PI * 2)
          ctx.fill()

          // Core neuron dot
          ctx.fillStyle = color
          ctx.globalAlpha = dotAlpha
          ctx.beginPath()
          ctx.arc(n.sx, n.sy, dotSize, 0, Math.PI * 2)
          ctx.fill()
        })
      })

      ctx.restore()
    }

    function drawOrbitals(ctx, orbits, cx, cy, t, front) {
      orbits.forEach((particles, oi) => {
        const rx = 170 + oi * 28
        const ry = 55 + oi * 18
        const tilt = (-25 + oi * 25) * Math.PI / 180

        // Faint orbit ring
        if (!front) {
          ctx.save()
          ctx.translate(cx, cy)
          ctx.rotate(tilt)
          ctx.beginPath()
          ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(184,138,255,${0.04 + oi * 0.01})`
          ctx.lineWidth = 0.5
          ctx.globalAlpha = 1
          ctx.stroke()
          ctx.restore()
        }

        particles.forEach(p => {
          const angle = p.angle + t * p.speed
          const x3d = Math.cos(angle) * p.rx
          const y3d = Math.sin(angle) * p.ry
          const z = y3d * Math.sin(p.tilt)

          if (front && z <= 0) return
          if (!front && z > 0) return

          const x = cx + x3d * Math.cos(p.tilt)
          const y = cy + y3d * Math.cos(p.tilt) * Math.cos(p.tilt) + x3d * Math.sin(p.tilt) * 0

          // Simpler: project to 2D
          const screenX = cx + Math.cos(angle) * p.rx
          const screenY = cy + Math.sin(angle) * p.ry * Math.cos(p.tilt)

          const depth = (z + p.ry) / (p.ry * 2)
          const sz = p.size * (0.4 + depth * 0.8)
          const alpha = 0.15 + depth * 0.6

          const color = lerpColor((p.colorT + t * 0.04) % 1)

          // Trail
          const trailAngle = angle - 0.2
          const tx = cx + Math.cos(trailAngle) * p.rx
          const ty = cy + Math.sin(trailAngle) * p.ry * Math.cos(p.tilt)
          ctx.beginPath()
          ctx.moveTo(tx, ty)
          ctx.lineTo(screenX, screenY)
          ctx.strokeStyle = lerpColorAlpha((p.colorT + t * 0.04) % 1, alpha * 0.3)
          ctx.lineWidth = sz * 0.6
          ctx.globalAlpha = 1
          ctx.stroke()

          // Particle dot
          ctx.beginPath()
          ctx.arc(screenX, screenY, sz, 0, Math.PI * 2)
          ctx.fillStyle = color
          ctx.globalAlpha = alpha
          ctx.fill()

          // Glow on bigger particles
          if (sz > 2) {
            const g = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, sz * 3)
            g.addColorStop(0, lerpColorAlpha((p.colorT + t * 0.04) % 1, 0.2))
            g.addColorStop(1, 'rgba(0,0,0,0)')
            ctx.fillStyle = g
            ctx.globalAlpha = 1
            ctx.beginPath()
            ctx.arc(screenX, screenY, sz * 3, 0, Math.PI * 2)
            ctx.fill()
          }
        })
      })
    }

    animRef.current = requestAnimationFrame(draw)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [size])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className="pointer-events-none"
    />
  )
}
