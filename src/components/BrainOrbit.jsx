import { useEffect, useRef } from 'react'

// Brain shape as a set of bezier curves (side-view brain silhouette)
const BRAIN_PATH = `
  M 50 8
  C 35 8, 20 15, 15 28
  C 10 40, 12 52, 18 58
  C 14 62, 10 68, 12 76
  C 14 84, 22 90, 32 92
  C 38 93, 44 92, 50 90
  C 56 92, 62 93, 68 92
  C 78 90, 86 84, 88 76
  C 90 68, 86 62, 82 58
  C 88 52, 90 40, 85 28
  C 80 15, 65 8, 50 8
  Z
`

// Internal brain folds / sulci
const BRAIN_FOLDS = [
  'M 50 18 C 45 28, 35 32, 28 30',
  'M 50 18 C 55 28, 65 32, 72 30',
  'M 25 42 C 32 38, 42 40, 50 45',
  'M 75 42 C 68 38, 58 40, 50 45',
  'M 50 45 C 48 55, 40 60, 30 62',
  'M 50 45 C 52 55, 60 60, 70 62',
  'M 32 70 C 38 65, 46 68, 50 75',
  'M 68 70 C 62 65, 54 68, 50 75',
  'M 20 50 C 25 48, 30 50, 35 55',
  'M 80 50 C 75 48, 70 50, 65 55',
  'M 38 80 C 42 76, 48 78, 50 82',
  'M 62 80 C 58 76, 52 78, 50 82',
]

// Orbital ring particles
const ORBIT_COUNT = 3
const PARTICLES_PER_ORBIT = 24

export default function BrainOrbit({ size = 420 }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    // Rainbow color stops matching our palette
    const rainbowColors = [
      '#FF6B6B', // coral
      '#FFB340', // amber
      '#00E896', // green
      '#00C8FF', // cyan
      '#B88AFF', // purple
      '#FF6B6B', // back to coral for loop
    ]

    function getRainbowColor(t) {
      // t from 0 to 1, interpolate through rainbow
      const segment = t * (rainbowColors.length - 1)
      const i = Math.floor(segment)
      const f = segment - i
      const c1 = hexToRgb(rainbowColors[i])
      const c2 = hexToRgb(rainbowColors[Math.min(i + 1, rainbowColors.length - 1)])
      return `rgb(${c1.r + (c2.r - c1.r) * f}, ${c1.g + (c2.g - c1.g) * f}, ${c1.b + (c2.b - c1.b) * f})`
    }

    function hexToRgb(hex) {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return { r, g, b }
    }

    // Create orbital particles
    const orbits = []
    for (let o = 0; o < ORBIT_COUNT; o++) {
      const particles = []
      for (let p = 0; p < PARTICLES_PER_ORBIT; p++) {
        particles.push({
          angle: (p / PARTICLES_PER_ORBIT) * Math.PI * 2,
          speed: 0.3 + Math.random() * 0.2,
          radiusX: 160 + o * 35 + (Math.random() - 0.5) * 20,
          radiusY: 60 + o * 20 + (Math.random() - 0.5) * 10,
          tilt: (o * 60 - 30) * (Math.PI / 180),
          size: 1.5 + Math.random() * 2,
          colorOffset: p / PARTICLES_PER_ORBIT,
        })
      }
      orbits.push(particles)
    }

    // Floating neural spark particles
    const sparks = Array.from({ length: 40 }, () => ({
      x: Math.random() * size,
      y: Math.random() * size,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2,
      life: Math.random(),
      colorT: Math.random(),
    }))

    function draw(time) {
      timeRef.current = time
      ctx.clearRect(0, 0, size, size)

      const cx = size / 2
      const cy = size / 2
      const brainScale = size / 100 * 0.38
      const t = time * 0.001

      // Draw background glow
      const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.45)
      bgGrad.addColorStop(0, 'rgba(0, 200, 255, 0.04)')
      bgGrad.addColorStop(0.5, 'rgba(184, 138, 255, 0.02)')
      bgGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, size, size)

      // Draw orbital particles BEHIND brain (those with negative z)
      drawOrbitalParticles(ctx, orbits, cx, cy, t, false, getRainbowColor)

      // Draw brain
      ctx.save()
      ctx.translate(cx - 50 * brainScale, cy - 50 * brainScale)
      ctx.scale(brainScale, brainScale)

      // Brain glow
      ctx.shadowColor = getRainbowColor((t * 0.1) % 1)
      ctx.shadowBlur = 30

      // Brain fill with animated rainbow gradient
      const grad = ctx.createLinearGradient(0, 0, 100, 100)
      const offset = (t * 0.15) % 1
      for (let i = 0; i < rainbowColors.length; i++) {
        const stop = ((i / (rainbowColors.length - 1)) + offset) % 1
        grad.addColorStop(stop, rainbowColors[i])
      }

      // Draw brain shape
      ctx.beginPath()
      const path = new Path2D(BRAIN_PATH)
      ctx.fillStyle = grad
      ctx.globalAlpha = 0.15
      ctx.fill(path)

      // Brain outline with rainbow stroke
      ctx.globalAlpha = 0.8
      ctx.strokeStyle = grad
      ctx.lineWidth = 1.5
      ctx.stroke(path)

      // Brain folds
      ctx.globalAlpha = 0.4
      ctx.lineWidth = 1
      BRAIN_FOLDS.forEach((fold, i) => {
        const foldGrad = ctx.createLinearGradient(20, 20, 80, 80)
        const foldOffset = ((t * 0.2) + i * 0.08) % 1
        foldGrad.addColorStop(0, getRainbowColor(foldOffset))
        foldGrad.addColorStop(1, getRainbowColor((foldOffset + 0.3) % 1))
        ctx.strokeStyle = foldGrad
        ctx.beginPath()
        const foldPath = new Path2D(fold)
        ctx.stroke(foldPath)
      })

      ctx.shadowBlur = 0
      ctx.restore()

      // Draw neural pulse nodes on brain surface
      ctx.globalAlpha = 1
      const pulseNodes = [
        { bx: 35, by: 30 }, { bx: 65, by: 30 },
        { bx: 25, by: 50 }, { bx: 75, by: 50 },
        { bx: 50, by: 45 }, { bx: 35, by: 70 },
        { bx: 65, by: 70 }, { bx: 50, by: 82 },
      ]
      pulseNodes.forEach((node, i) => {
        const px = cx + (node.bx - 50) * brainScale
        const py = cy + (node.by - 50) * brainScale
        const pulse = Math.sin(t * 2 + i * 0.8) * 0.5 + 0.5
        const nodeColor = getRainbowColor((i / pulseNodes.length + t * 0.1) % 1)

        ctx.beginPath()
        ctx.arc(px, py, 2 + pulse * 2, 0, Math.PI * 2)
        ctx.fillStyle = nodeColor
        ctx.globalAlpha = 0.3 + pulse * 0.5
        ctx.fill()

        // Glow
        ctx.beginPath()
        ctx.arc(px, py, 4 + pulse * 4, 0, Math.PI * 2)
        const glowGrad = ctx.createRadialGradient(px, py, 0, px, py, 4 + pulse * 4)
        glowGrad.addColorStop(0, nodeColor)
        glowGrad.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = glowGrad
        ctx.globalAlpha = 0.2 + pulse * 0.3
        ctx.fill()
      })

      // Draw orbital particles IN FRONT of brain (those with positive z)
      ctx.globalAlpha = 1
      drawOrbitalParticles(ctx, orbits, cx, cy, t, true, getRainbowColor)

      // Draw floating sparks
      sparks.forEach(spark => {
        spark.x += spark.vx
        spark.y += spark.vy
        spark.life += 0.005
        if (spark.x < 0 || spark.x > size) spark.vx *= -1
        if (spark.y < 0 || spark.y > size) spark.vy *= -1

        const sparkAlpha = Math.sin(spark.life * Math.PI) * 0.3
        if (sparkAlpha > 0) {
          ctx.beginPath()
          ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2)
          ctx.fillStyle = getRainbowColor((spark.colorT + t * 0.05) % 1)
          ctx.globalAlpha = sparkAlpha
          ctx.fill()
        }

        if (spark.life > 1) {
          spark.life = 0
          spark.x = Math.random() * size
          spark.y = Math.random() * size
          spark.colorT = Math.random()
        }
      })

      ctx.globalAlpha = 1
      animRef.current = requestAnimationFrame(draw)
    }

    function drawOrbitalParticles(ctx, orbits, cx, cy, t, frontOnly, getColor) {
      orbits.forEach((particles, orbitIdx) => {
        // Draw orbit ring (faint)
        if (!frontOnly) {
          ctx.beginPath()
          ctx.ellipse(
            cx, cy,
            160 + orbitIdx * 35,
            60 + orbitIdx * 20,
            (orbitIdx * 60 - 30) * (Math.PI / 180),
            0, Math.PI * 2
          )
          ctx.strokeStyle = `rgba(184, 138, 255, ${0.04 + orbitIdx * 0.01})`
          ctx.lineWidth = 0.5
          ctx.globalAlpha = 1
          ctx.stroke()
        }

        particles.forEach(p => {
          const angle = p.angle + t * p.speed
          const cosA = Math.cos(angle)
          const sinA = Math.sin(angle)
          const cosTilt = Math.cos(p.tilt)
          const sinTilt = Math.sin(p.tilt)

          // 3D position
          const x3d = cosA * p.radiusX
          const y3d = sinA * p.radiusY
          const z = y3d * sinTilt

          // Only draw front or back particles based on z
          if (frontOnly && z <= 0) return
          if (!frontOnly && z > 0) return

          const x = cx + x3d
          const y = cy + y3d * cosTilt

          // Distance-based opacity and size
          const depthFactor = (z + p.radiusY) / (p.radiusY * 2)
          const particleSize = p.size * (0.5 + depthFactor * 0.8)
          const particleAlpha = 0.2 + depthFactor * 0.6

          const color = getColor((p.colorOffset + t * 0.05) % 1)

          // Trail
          const trailAngle = angle - 0.15
          const trailX = cx + Math.cos(trailAngle) * p.radiusX
          const trailY = cy + Math.sin(trailAngle) * p.radiusY * cosTilt

          ctx.beginPath()
          ctx.moveTo(trailX, trailY)
          ctx.lineTo(x, y)
          ctx.strokeStyle = color
          ctx.globalAlpha = particleAlpha * 0.3
          ctx.lineWidth = particleSize * 0.5
          ctx.stroke()

          // Particle
          ctx.beginPath()
          ctx.arc(x, y, particleSize, 0, Math.PI * 2)
          ctx.fillStyle = color
          ctx.globalAlpha = particleAlpha
          ctx.fill()

          // Glow on larger particles
          if (particleSize > 2) {
            ctx.beginPath()
            ctx.arc(x, y, particleSize * 3, 0, Math.PI * 2)
            const glowGrad = ctx.createRadialGradient(x, y, 0, x, y, particleSize * 3)
            glowGrad.addColorStop(0, color)
            glowGrad.addColorStop(1, 'rgba(0,0,0,0)')
            ctx.fillStyle = glowGrad
            ctx.globalAlpha = particleAlpha * 0.15
            ctx.fill()
          }
        })
      })
    }

    animRef.current = requestAnimationFrame(draw)
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [size])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className="pointer-events-none"
    />
  )
}
