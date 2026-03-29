// src/components/simulator/SpiderMap.jsx
// Animated radar/spider chart — two morphing polygons on canvas

import { useEffect, useRef } from 'react'

const AXES = ['Connection', 'Purpose', 'Clarity', 'Execution', 'Structure', 'Vision']
const N = AXES.length

export const STAGE_DATA = {
  forming: {
    name: 'Forming', color: '#00C8FF',
    need: [4, 5, 9, 8, 9, 6],
    fit: 'moderate', score: 58, gaps: 3,
  },
  storming: {
    name: 'Storming', color: '#FF6B6B',
    need: [5, 7, 8, 6, 5, 7],
    fit: 'gap', score: 39, gaps: 4,
  },
  norming: {
    name: 'Norming', color: '#00E896',
    need: [8, 7, 5, 4, 5, 6],
    fit: 'strong', score: 74, gaps: 2,
  },
  performing: {
    name: 'Performing', color: '#00C8FF',
    need: [6, 9, 3, 4, 3, 9],
    fit: 'strong', score: 81, gaps: 1,
  },
  adjourning: {
    name: 'Adjourning', color: '#FFB340',
    need: [9, 7, 6, 3, 4, 6],
    fit: 'strongest', score: 88, gaps: 1,
  },
}

// Convert profile axis scores to 6-axis radar values (0–10)
function profileToRadar(profile) {
  if (!profile?.axisScores) return [8, 9, 3, 5, 4, 7] // default diplomatic
  const { who = 55, why = 100, what = 33, how = 84 } = profile.axisScores
  return [
    Math.round(who / 10),                     // Connection = WHO
    Math.round(why / 10),                     // Purpose    = WHY
    Math.round(what / 10),                    // Clarity    = WHAT
    Math.round(how / 10),                     // Execution  = HOW
    Math.round(((what + how) / 2) / 10),      // Structure
    Math.round(((why + what) / 2) / 10),      // Vision
  ]
}

const ease = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
const lerp = (a, b, t) => a + (b - a) * t
const ang = i => (Math.PI * 2 * i / N) - Math.PI / 2

export function SpiderMap({ stage, profile }) {
  const canvasRef = useRef(null)
  const animRef = useRef({
    curNeed: [...STAGE_DATA.norming.need],
    curLead: profileToRadar(profile),
    tgtNeed: [...STAGE_DATA[stage || 'norming'].need],
    tgtLead: profileToRadar(profile),
    animT: 1,
    pulseT: 0,
  })

  // Kick off morph animation when stage or profile changes
  useEffect(() => {
    const s = STAGE_DATA[stage || 'norming']
    const anim = animRef.current
    const et = ease(Math.min(1, anim.animT))
    anim.curNeed = anim.curNeed.map((v, i) => lerp(v, anim.tgtNeed[i], et))
    anim.curLead = anim.curLead.map((v, i) => lerp(v, anim.tgtLead[i], et))
    anim.tgtNeed = [...s.need]
    anim.tgtLead = profileToRadar(profile)
    anim.animT = 0
  }, [stage, profile])

  // Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const DPR = window.devicePixelRatio || 1
    const SIZE = canvas.offsetWidth
    canvas.width = SIZE * DPR
    canvas.height = SIZE * 0.72 * DPR
    const ctx = canvas.getContext('2d')
    ctx.scale(DPR, DPR)
    const W = SIZE, H = SIZE * 0.72
    const cx = W / 2, cy = H / 2 + 8
    const R = Math.min(W, H) * 0.36

    const pt = (i, r) => ({
      x: cx + r * Math.cos(ang(i)),
      y: cy + r * Math.sin(ang(i)),
    })

    let rafId
    const draw = () => {
      const anim = animRef.current
      ctx.clearRect(0, 0, W, H)
      anim.pulseT += 0.018
      if (anim.animT < 1) anim.animT = Math.min(1, anim.animT + 0.035)
      const et = ease(anim.animT)

      const need = anim.curNeed.map((v, i) => lerp(v, anim.tgtNeed[i], et))
      const lead = anim.curLead.map((v, i) => lerp(v, anim.tgtLead[i], et))

      // Grid rings
      for (let ring = 1; ring <= 5; ring++) {
        const r = R * ring / 5
        ctx.beginPath()
        for (let i = 0; i < N; i++) {
          const p = pt(i, r)
          i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
        }
        ctx.closePath()
        ctx.strokeStyle = ring === 5 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)'
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      // Axis lines
      for (let i = 0; i < N; i++) {
        const p = pt(i, R + 4)
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(p.x, p.y)
        ctx.strokeStyle = 'rgba(255,255,255,0.07)'
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      // Stage needs polygon — dashed purple
      ctx.save()
      ctx.beginPath()
      for (let i = 0; i < N; i++) {
        const p = pt(i, R * need[i] / 10)
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
      }
      ctx.closePath()
      ctx.fillStyle = 'rgba(184,138,255,0.10)'
      ctx.fill()
      ctx.setLineDash([5, 4])
      ctx.strokeStyle = '#B88AFF'
      ctx.lineWidth = 1.8
      ctx.stroke()
      ctx.setLineDash([])
      ctx.restore()

      // Leader Map polygon — solid cyan
      ctx.beginPath()
      for (let i = 0; i < N; i++) {
        const p = pt(i, R * lead[i] / 10)
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
      }
      ctx.closePath()
      ctx.fillStyle = 'rgba(0,200,255,0.08)'
      ctx.fill()
      ctx.strokeStyle = '#00C8FF'
      ctx.lineWidth = 2
      ctx.stroke()

      // Dots + gap indicator lines
      for (let i = 0; i < N; i++) {
        const diff = Math.abs(need[i] - lead[i])
        const dotColor = diff < 2 ? '#00E896' : diff < 4 ? '#FFB340' : '#FF6B6B'
        const isGap = diff >= 4
        const pulse = 0.6 + 0.4 * Math.sin(anim.pulseT + i * 1.1)

        const pN = pt(i, R * need[i] / 10)
        const pL = pt(i, R * lead[i] / 10)

        if (diff > 1.5) {
          ctx.beginPath()
          ctx.moveTo(pN.x, pN.y)
          ctx.lineTo(pL.x, pL.y)
          ctx.strokeStyle = isGap ? 'rgba(255,107,107,0.3)' : 'rgba(255,179,64,0.2)'
          ctx.lineWidth = 1
          ctx.setLineDash([2, 3])
          ctx.stroke()
          ctx.setLineDash([])
        }

        // Need dot — pulses on gap axes
        ctx.beginPath()
        ctx.arc(pN.x, pN.y, isGap ? 3.5 + pulse : 3, 0, Math.PI * 2)
        ctx.fillStyle = dotColor
        ctx.fill()

        // Leader dot
        ctx.beginPath()
        ctx.arc(pL.x, pL.y, 3, 0, Math.PI * 2)
        ctx.fillStyle = '#00C8FF'
        ctx.fill()
      }

      // Axis labels
      ctx.font = '500 10px DM Sans, system-ui'
      for (let i = 0; i < N; i++) {
        const p = pt(i, R + 20)
        const a = ang(i)
        ctx.textAlign = Math.cos(a) < -0.25 ? 'right' : Math.cos(a) > 0.25 ? 'left' : 'center'
        ctx.fillStyle = 'rgba(255,255,255,0.5)'
        ctx.fillText(AXES[i], p.x, p.y + 4)
      }

      rafId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(rafId)
  }, []) // only mount/unmount — stage changes trigger morph via the first useEffect

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100%', maxWidth: 440, margin: '0 auto' }}
    />
  )
}
