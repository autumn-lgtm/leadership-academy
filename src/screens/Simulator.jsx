import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { STYLES } from '../data/styles'
import { computeStyle } from '../data/scoring'
import { translateMessage, analyzeConversationStyle } from '../api/anthropic'
import QuadrantPlot from '../components/QuadrantPlot'
import LeadershipRadar from '../components/simulator/LeadershipRadar'
import AxonMascot from '../components/simulator/AxonMascot'
import TeamSignalMap from '../components/simulator/TeamSignalMap'
import { ParallelRealityEngine } from '../components/simulator/ParallelRealityEngine'
import TrustPulse from '../components/simulator/TrustPulse'
import CultureDiagnostic from '../components/simulator/CultureDiagnostic'
import { RainbowDivider, PageFooter, AxonQuote, NeuralSection } from '../components/DesignSystem'

const TABS = ['Your Style', 'Read the Room', 'Say It Their Way', 'Team Signal Map', 'Parallel Reality', 'Trust Pulse', 'Culture']

const SIGNAL_WORDS = {
  who: [
    'team', 'people', 'trust', 'relationship', 'empathy', 'listen',
    'together', 'support', 'care', 'connect', 'collaborate', 'harmony',
    'morale', 'feelings', 'inclusive', 'bond', 'respect', 'safe',
    'belonging', 'compassion', 'loyalty', 'warmth', 'mentor', 'nurture'
  ],
  why: [
    'purpose', 'vision', 'mission', 'meaning', 'strategy', 'future',
    'impact', 'why', 'values', 'culture', 'inspire', 'alignment',
    'north star', 'legacy', 'principle', 'belief', 'direction', 'aspire',
    'transform', 'paradigm', 'framework', 'systemic', 'pattern', 'insight'
  ],
  what: [
    'process', 'system', 'structure', 'plan', 'organize', 'document',
    'checklist', 'workflow', 'procedure', 'standard', 'optimize', 'efficient',
    'reliable', 'consistent', 'template', 'framework', 'architecture', 'scale',
    'infrastructure', 'audit', 'compliance', 'protocol', 'sequence', 'method'
  ],
  how: [
    'execute', 'ship', 'deliver', 'action', 'results', 'deadline',
    'fast', 'now', 'sprint', 'metrics', 'KPI', 'accountable',
    'own', 'drive', 'hustle', 'pivot', 'tactical', 'urgent',
    'priority', 'target', 'milestone', 'velocity', 'outcome', 'ROI'
  ],
}

const SLIDER_META = {
  who: { short: 'WHO', desc: 'People, relationships, team trust', color: '#B88AFF' },
  why: { short: 'WHY', desc: 'Purpose, vision, long-horizon thinking', color: '#00C8FF' },
  what: { short: 'WHAT', desc: 'Systems, process, structure', color: '#00E896' },
  how: { short: 'HOW', desc: 'Execution, speed, results', color: '#FFB340' },
}

const AXIS_COLORS = { who: '#B88AFF', why: '#00C8FF', what: '#00E896', how: '#FFB340' }
const AXIS_LABELS = { who: 'WHO', why: 'WHY', what: 'WHAT', how: 'HOW' }
const AXIS_DESCS  = { who: 'People & Relationships', why: 'Vision & Purpose', what: 'Systems & Process', how: 'Execution & Results' }

function MapYourStyle() {
  const [axes, setAxes] = useState({ who: 50, why: 50, what: 50, how: 50 })

  useEffect(() => {
    const stored = localStorage.getItem('neuroleader_profile')
    if (stored) {
      try {
        const p = JSON.parse(stored)
        if (p.axisScores) setAxes(p.axisScores)
      } catch { /* ignore */ }
    }
  }, [])

  const style     = computeStyle(axes.who, axes.why, axes.what, axes.how)
  const styleData = STYLES[style]

  // Data analyst: sort axes by value for ranked breakdown
  const axesSorted = ['who', 'why', 'what', 'how'].sort((a, b) => axes[b] - axes[a])
  const dominant   = axesSorted[0]
  const weakest    = axesSorted[3]

  const sliders = [
    { key: 'who',  color: AXIS_COLORS.who,  label: AXIS_LABELS.who,  desc: AXIS_DESCS.who  },
    { key: 'why',  color: AXIS_COLORS.why,  label: AXIS_LABELS.why,  desc: AXIS_DESCS.why  },
    { key: 'what', color: AXIS_COLORS.what, label: AXIS_LABELS.what, desc: AXIS_DESCS.what },
    { key: 'how',  color: AXIS_COLORS.how,  label: AXIS_LABELS.how,  desc: AXIS_DESCS.how  },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted/60 mb-2">Neural Signature Lab</p>
        <h1 className="font-display text-4xl md:text-5xl font-black text-white leading-none mb-2">
          Your Leadership<br />
          <span className="bg-gradient-to-r from-cyan via-purple to-coral bg-clip-text text-transparent">
            Neural Signature
          </span>
        </h1>
        <p className="text-text-muted text-sm max-w-md leading-relaxed">
          Drag each axis. The radar maps your behavioral fingerprint in real time — dominant axes glow, coverage scores your range.
        </p>
      </div>

      {/* Main layout: radar hero + style intel */}
      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6 mb-6 items-start">

        {/* ── Radar chart hero ── */}
        <div className="flex flex-col items-center">
          <div
            className="relative rounded-3xl border p-3"
            style={{
              background: `radial-gradient(ellipse at center, ${styleData.color}08 0%, rgba(6,10,14,0) 70%)`,
              borderColor: `${styleData.color}18`,
            }}
          >
            <LeadershipRadar axes={axes} size={340} />
          </div>
          {/* Axis dominance rank strip — data analyst: ranked order below chart */}
          <div className="flex gap-1.5 mt-3 w-full max-w-[340px]">
            {axesSorted.map((ax, rank) => (
              <div
                key={ax}
                className="flex-1 rounded-lg px-2 py-1.5 text-center transition-all"
                style={{
                  background: rank === 0 ? `${AXIS_COLORS[ax]}15` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${rank === 0 ? `${AXIS_COLORS[ax]}35` : 'rgba(255,255,255,0.05)'}`,
                }}
              >
                <div className="text-[8px] font-bold uppercase tracking-wider mb-0.5"
                  style={{ color: rank === 0 ? AXIS_COLORS[ax] : 'rgba(255,255,255,0.25)' }}>
                  #{rank + 1}
                </div>
                <div className="text-[10px] font-black"
                  style={{ color: rank === 0 ? AXIS_COLORS[ax] : 'rgba(255,255,255,0.4)' }}>
                  {AXIS_LABELS[ax]}
                </div>
                <div className="text-[9px] font-bold tabular-nums mt-0.5"
                  style={{ color: rank === 0 ? AXIS_COLORS[ax] : 'rgba(255,255,255,0.3)' }}>
                  {axes[ax]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Style intel panel ── */}
        <div className="flex flex-col gap-4 min-w-0">

          {/* Style archetype card — animates on style change */}
          <AnimatePresence mode="wait">
            <motion.div
              key={style}
              initial={{ opacity: 0, x: 20, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
              className="relative overflow-hidden rounded-2xl border p-6"
              style={{
                borderColor: `${styleData.color}30`,
                background: `linear-gradient(135deg, ${styleData.color}10 0%, rgba(6,10,14,0.8) 55%)`,
              }}
            >
              {/* Giant watermark letter */}
              <div
                className="absolute right-2 top-1/2 -translate-y-1/2 font-display font-black leading-none pointer-events-none select-none"
                style={{ fontSize: 120, color: `${styleData.color}07` }}
              >
                {styleData.name.charAt(0)}
              </div>
              <div className="relative">
                <div className="text-[9px] font-bold uppercase tracking-[0.2em] mb-2"
                  style={{ color: `${styleData.color}80` }}>
                  Computed Archetype
                </div>
                <div className="font-display text-3xl font-black mb-0.5" style={{ color: styleData.color }}>
                  {styleData.name}
                </div>
                <div className="text-xs italic mb-4" style={{ color: `${styleData.color}90` }}>
                  {styleData.short}
                </div>
                <p className="text-sm text-text-muted leading-relaxed mb-4">
                  {styleData.orientDesc}
                </p>
                {/* High axes tags */}
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(styleData.axes).filter(([, v]) => v === 'high').map(([ax]) => (
                    <span key={ax}
                      className="text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider"
                      style={{
                        background: `${AXIS_COLORS[ax]}18`,
                        color: AXIS_COLORS[ax],
                        border: `1px solid ${AXIS_COLORS[ax]}40`,
                      }}>
                      {AXIS_LABELS[ax]} dominant
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Axis signal breakdown — data analyst: bar chart per axis with delta encoding */}
          <div className="rounded-2xl border border-white/[0.06] p-5"
            style={{ background: 'rgba(6,10,14,0.6)' }}>
            <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-text-muted/40 mb-4">
              Axis Signal Breakdown
            </div>
            <div className="space-y-3">
              {axesSorted.map((ax, rank) => {
                const val = axes[ax]
                const isStyleHigh = styleData.axes[ax] === 'high'
                const isDom = rank === 0
                return (
                  <div key={ax}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: AXIS_COLORS[ax] }} />
                        <span className="text-[10px] font-bold uppercase tracking-wider"
                          style={{ color: isDom ? AXIS_COLORS[ax] : 'rgba(255,255,255,0.5)' }}>
                          {AXIS_LABELS[ax]}
                        </span>
                        {isDom && (
                          <span className="text-[8px] px-1.5 py-0.5 rounded font-bold uppercase"
                            style={{ background: `${AXIS_COLORS[ax]}18`, color: AXIS_COLORS[ax] }}>
                            Lead
                          </span>
                        )}
                        {ax === weakest && (
                          <span className="text-[8px] px-1.5 py-0.5 rounded font-bold uppercase"
                            style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.25)' }}>
                            Develop
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px]"
                          style={{ color: isStyleHigh ? AXIS_COLORS[ax] : 'rgba(255,255,255,0.2)' }}>
                          {isStyleHigh ? '↑ in style' : '↓ in style'}
                        </span>
                        <span className="text-xs font-black tabular-nums"
                          style={{ color: isDom ? AXIS_COLORS[ax] : 'rgba(255,255,255,0.5)' }}>
                          {val}
                        </span>
                      </div>
                    </div>
                    {/* Bar track */}
                    <div className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        animate={{ width: `${val}%` }}
                        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                        style={{
                          background: isDom
                            ? `linear-gradient(to right, ${AXIS_COLORS[ax]}, ${AXIS_COLORS[ax]}80)`
                            : `${AXIS_COLORS[ax]}50`,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Neuroscience insight card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`neuro-${style}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="rounded-2xl border p-5"
              style={{ borderColor: 'rgba(0,200,255,0.12)', background: 'rgba(0,200,255,0.04)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-4 rounded-full" style={{ background: '#00C8FF' }} />
                <span className="text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: '#00C8FF' }}>
                  Neuroscience
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {styleData.neuro}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Signal dial sliders ── */}
      <div className="rounded-2xl border border-white/[0.06] p-6"
        style={{ background: 'rgba(6,10,14,0.5)' }}>
        <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-text-muted/40 mb-5">
          Adjust Your Axes — Radar Updates Live
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {sliders.map(s => (
            <div
              key={s.key}
              className="relative rounded-xl p-4 transition-all"
              style={{
                background: axes[s.key] > 65 ? `${s.color}08` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${axes[s.key] > 65 ? `${s.color}25` : 'rgba(255,255,255,0.05)'}`,
              }}
            >
              <div className="flex justify-between items-center mb-3">
                <div>
                  <span className="font-display font-black text-sm" style={{ color: s.color }}>{s.label}</span>
                  <span className="text-[10px] text-text-muted/50 ml-2">{s.desc}</span>
                </div>
                <motion.span
                  key={axes[s.key]}
                  initial={{ scale: 1.3, opacity: 0.7 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="font-display font-black text-xl tabular-nums"
                  style={{ color: s.color }}
                >
                  {axes[s.key]}
                </motion.span>
              </div>
              <input
                type="range" min="0" max="100" value={axes[s.key]}
                onChange={e => setAxes({ ...axes, [s.key]: Number(e.target.value) })}
                className="w-full"
                style={{
                  background: `linear-gradient(to right, ${s.color} ${axes[s.key]}%, rgba(255,255,255,0.06) ${axes[s.key]}%)`,
                  accentColor: s.color,
                }}
              />
              <div className="flex justify-between mt-1">
                <span className="text-[8px] text-text-muted/30">Developing</span>
                <span className="text-[8px] text-text-muted/30">Dominant</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StyleDecoder() {
  const [mode, setMode] = useState('words') // 'words' | 'convo'
  const [selected, setSelected] = useState({
    who: new Set(), why: new Set(), what: new Set(), how: new Set()
  })
  const [decoded, setDecoded] = useState(null)
  const [convText, setConvText] = useState('')
  const [convLoading, setConvLoading] = useState(false)
  const [convError, setConvError] = useState(null)
  const [detectedSignals, setDetectedSignals] = useState(null)

  const axisColors = AXIS_COLORS
  const axisLabels = AXIS_LABELS

  function toggleWord(axis, word) {
    const next = { ...selected }
    const s = new Set(next[axis])
    if (s.has(word)) s.delete(word)
    else s.add(word)
    next[axis] = s
    setSelected(next)
  }

  function getCounts() {
    return {
      who: selected.who.size,
      why: selected.why.size,
      what: selected.what.size,
      how: selected.how.size,
    }
  }

  function decode() {
    const counts = getCounts()
    const max = Math.max(...Object.values(counts), 1)
    const normalized = {
      who: Math.round((counts.who / max) * 100),
      why: Math.round((counts.why / max) * 100),
      what: Math.round((counts.what / max) * 100),
      how: Math.round((counts.how / max) * 100),
    }
    const styleKey = computeStyle(normalized.who, normalized.why, normalized.what, normalized.how)
    setDecoded({ style: STYLES[styleKey], scores: normalized, styleKey })
  }

  async function analyzeConvo() {
    if (convText.trim().length < 20) return
    setConvLoading(true)
    setConvError(null)
    setDecoded(null)
    setDetectedSignals(null)
    try {
      const result = await analyzeConversationStyle(convText)
      // Build signal sets from detected words
      const nextSelected = {
        who: new Set(result.detected_signals?.who || []),
        why: new Set(result.detected_signals?.why || []),
        what: new Set(result.detected_signals?.what || []),
        how: new Set(result.detected_signals?.how || []),
      }
      setSelected(nextSelected)
      setDetectedSignals({ ...result })
      // Compute style from counts
      const rawCounts = {
        who: result.who_count || 0,
        why: result.why_count || 0,
        what: result.what_count || 0,
        how: result.how_count || 0,
      }
      const max = Math.max(...Object.values(rawCounts), 1)
      const normalized = {
        who: Math.round((rawCounts.who / max) * 100),
        why: Math.round((rawCounts.why / max) * 100),
        what: Math.round((rawCounts.what / max) * 100),
        how: Math.round((rawCounts.how / max) * 100),
      }
      const styleKey = computeStyle(normalized.who, normalized.why, normalized.what, normalized.how)
      setDecoded({ style: STYLES[styleKey], scores: normalized, styleKey })
    } catch (err) {
      setConvError(err.message)
    } finally {
      setConvLoading(false)
    }
  }

  function handleConvFile(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setConvText(ev.target.result)
    reader.readAsText(file)
  }

  const counts = getCounts()

  // Load user's profile for comparison
  const [userProfile, setUserProfile] = useState(null)
  useEffect(() => {
    const stored = localStorage.getItem('neuroleader_profile')
    if (stored) setUserProfile(JSON.parse(stored))
  }, [])

  const decodeCompareAxes = decoded ? {
    who: decoded.style.axes.who === 'high' ? 75 : 30,
    why: decoded.style.axes.why === 'high' ? 75 : 30,
    what: decoded.style.axes.what === 'high' ? 75 : 30,
    how: decoded.style.axes.how === 'high' ? 75 : 30,
  } : null

  const totalSelected = counts.who + counts.why + counts.what + counts.how
  const dominantAxis = totalSelected > 0
    ? Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
    : null

  // Data analyst: signal density = selected / available per axis
  const signalDensity = {
    who:  Math.round((counts.who  / SIGNAL_WORDS.who.length)  * 100),
    why:  Math.round((counts.why  / SIGNAL_WORDS.why.length)  * 100),
    what: Math.round((counts.what / SIGNAL_WORDS.what.length) * 100),
    how:  Math.round((counts.how  / SIGNAL_WORDS.how.length)  * 100),
  }
  // Signal clarity: how much the dominant axis leads (0=ambiguous, 100=clear)
  const maxCount     = Math.max(...Object.values(counts), 1)
  const signalClarity = totalSelected > 0
    ? Math.round((maxCount / totalSelected) * 100)
    : 0
  // Live radar axes — normalized to max selected axis = 100
  const liveRadarAxes = totalSelected > 0 ? {
    who:  Math.round((counts.who  / maxCount) * 100),
    why:  Math.round((counts.why  / maxCount) * 100),
    what: Math.round((counts.what / maxCount) * 100),
    how:  Math.round((counts.how  / maxCount) * 100),
  } : { who: 12, why: 12, what: 12, how: 12 }
  // Top evidence words from dominant axis (for fingerprint reveal)
  const dominantAxisKey = totalSelected > 0
    ? Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
    : null
  const topEvidenceWords = dominantAxisKey
    ? Array.from(selected[dominantAxisKey]).slice(0, 4)
    : []

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted/60 mb-2">Neural Signal Lab</p>
        <h1 className="font-display text-4xl md:text-5xl font-black text-white leading-none mb-2">
          Decode Who<br />
          <span className="bg-gradient-to-r from-purple to-cyan bg-clip-text text-transparent">
            You're Talking To
          </span>
        </h1>
        <p className="text-text-muted text-sm max-w-md leading-relaxed">
          Tap the words you hear them use. Their leadership wiring reveals itself — signal by signal.
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-1 p-1 rounded-xl border mb-7"
        style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
        {[
          { key: 'words', label: '◈ Tap Words' },
          { key: 'convo', label: '⬡ Drop a Conversation' },
        ].map(m => (
          <button
            key={m.key}
            onClick={() => { setMode(m.key); setDecoded(null); setDetectedSignals(null) }}
            className="flex-1 py-2 px-3 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all"
            style={mode === m.key ? {
              background: '#18263a', color: 'rgba(255,255,255,0.9)',
              border: '1px solid rgba(100,180,255,0.14)',
            } : {
              background: 'transparent', color: 'rgba(255,255,255,0.35)',
              border: '1px solid transparent',
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Conversation analysis mode */}
      {mode === 'convo' && (
        <div className="mb-6">
          {/* File drop */}
          <label
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-6 text-center cursor-pointer transition-all mb-3"
            style={{ borderColor: 'rgba(100,180,255,0.15)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(184,138,255,0.35)'; e.currentTarget.style.background = 'rgba(184,138,255,0.02)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(100,180,255,0.15)'; e.currentTarget.style.background = 'transparent' }}
          >
            <input type="file" accept=".txt,.md" className="hidden" onChange={handleConvFile} />
            <div className="font-display text-sm font-bold text-white mb-1">Drop a conversation</div>
            <div className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Slack thread · Email · Meeting notes · 1:1 transcript<br />Nothing is stored.
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border"
              style={{ background: '#111b28', borderColor: 'rgba(184,138,255,0.2)', color: '#B88AFF' }}>
              Choose file
            </span>
          </label>

          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
            <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.2)' }}>or paste it</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
          </div>

          <textarea
            value={convText}
            onChange={e => setConvText(e.target.value)}
            rows={5}
            placeholder={"Paste what they said, wrote, or how they communicate.\n\nExample: 'We need to hit Q3 targets. I want a plan by Friday with clear owners and milestones. If someone's behind, I want to know immediately.'"}
            className="w-full rounded-2xl border p-4 text-sm leading-relaxed resize-y outline-none transition-colors"
            style={{
              background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.07)',
              color: 'rgba(255,255,255,0.85)', minHeight: 120,
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(184,138,255,0.25)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.07)'}
          />

          {convError && (
            <div className="mt-2 px-3 py-2 rounded-xl text-xs border"
              style={{ background: 'rgba(255,107,107,0.06)', borderColor: 'rgba(255,107,107,0.2)', color: '#FF6B6B' }}>
              {convError}
            </div>
          )}

          <button
            onClick={analyzeConvo}
            disabled={convLoading || convText.trim().length < 20}
            className="mt-3 px-6 py-3 rounded-xl font-bold text-sm transition-all"
            style={convLoading || convText.trim().length < 20 ? {
              background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.25)', cursor: 'not-allowed',
              border: '1px solid rgba(255,255,255,0.06)',
            } : {
              background: 'linear-gradient(to right, #B88AFF, #00C8FF)',
              color: '#fff', cursor: 'pointer', border: 'none',
              boxShadow: '0 0 20px rgba(184,138,255,0.25)',
            }}
          >
            {convLoading ? (
              <span className="flex items-center gap-2">
                <motion.span
                  className="inline-block w-3 h-3 rounded-full border border-white/30 border-t-white"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
                Reading their language…
              </span>
            ) : 'Decode from conversation →'}
          </button>
        </div>
      )}

      {/* Detected signals from conversation analysis */}
      {mode === 'convo' && detectedSignals && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 p-4 rounded-2xl border"
          style={{ background: 'rgba(184,138,255,0.04)', borderColor: 'rgba(184,138,255,0.15)' }}
        >
          <div className="text-[10px] font-bold uppercase tracking-[0.15em] mb-3" style={{ color: '#B88AFF' }}>
            Signals detected in conversation
          </div>
          <div className="flex gap-3 mb-3">
            {['who', 'why', 'what', 'how'].map(axis => {
              const count = detectedSignals[`${axis}_count`] || 0
              return (
                <div key={axis} className="flex-1 text-center">
                  <div className="font-display font-black text-lg" style={{ color: axisColors[axis] }}>{count}</div>
                  <div className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>{axisLabels[axis]}</div>
                </div>
              )
            })}
          </div>
          {detectedSignals.explanation && (
            <p className="text-xs leading-relaxed italic" style={{ color: 'rgba(255,255,255,0.5)' }}>
              "{detectedSignals.explanation}"
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {['who', 'why', 'what', 'how'].flatMap(axis =>
              Array.from(selected[axis]).map(word => (
                <span key={`${axis}-${word}`} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{ background: `${axisColors[axis]}18`, color: axisColors[axis], border: `1px solid ${axisColors[axis]}35` }}>
                  {word}
                </span>
              ))
            )}
          </div>
        </motion.div>
      )}

      {/* ── Live Signal Radar (words mode) ── */}
      {mode === 'words' && (
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 mb-6 p-4 rounded-2xl border"
          style={{ background: 'rgba(6,10,14,0.6)', borderColor: 'rgba(255,255,255,0.05)' }}>
          {/* Mini radar builds in real time */}
          <div className="flex flex-col items-center">
            <div className="text-[8px] font-bold uppercase tracking-[0.18em] text-text-muted/40 mb-2">
              Signal Profile
            </div>
            <LeadershipRadar axes={liveRadarAxes} size={200} />
          </div>
          {/* Signal metrics panel */}
          <div className="flex flex-col justify-center gap-3 min-w-0">
            <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-text-muted/40 mb-1">
              Axis Density — Signals / Available
            </div>
            {['who', 'why', 'what', 'how'].map(ax => (
              <div key={ax}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: counts[ax] > 0 ? axisColors[ax] : 'rgba(255,255,255,0.25)' }}>
                    {axisLabels[ax]}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] tabular-nums" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      {counts[ax]}/{SIGNAL_WORDS[ax].length}
                    </span>
                    <span className="text-[10px] font-black tabular-nums w-8 text-right"
                      style={{ color: counts[ax] > 0 ? axisColors[ax] : 'rgba(255,255,255,0.2)' }}>
                      {signalDensity[ax]}%
                    </span>
                  </div>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    animate={{ width: `${signalDensity[ax]}%` }}
                    transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                    style={{ background: `${axisColors[ax]}${counts[ax] > 0 ? 'cc' : '30'}` }}
                  />
                </div>
              </div>
            ))}
            {/* Signal clarity meter */}
            <div className="mt-2 pt-3 border-t border-white/[0.05] flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted/40">
                Signal Clarity
              </span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    animate={{ width: `${signalClarity}%` }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    style={{
                      background: signalClarity > 66 ? '#00E896' : signalClarity > 33 ? '#FFB340' : '#FF6B6B',
                    }}
                  />
                </div>
                <span className="text-[10px] font-black tabular-nums"
                  style={{ color: signalClarity > 66 ? '#00E896' : signalClarity > 33 ? '#FFB340' : 'rgba(255,255,255,0.3)' }}>
                  {totalSelected > 0 ? `${signalClarity}%` : '—'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Word tap grid ── */}
      {mode === 'words' && (
        <div className="space-y-3 mb-6">
          {Object.entries(SIGNAL_WORDS).map(([axis, words]) => (
            <div key={axis}
              className="rounded-2xl overflow-hidden transition-all"
              style={{
                background: counts[axis] > 0 ? `${axisColors[axis]}06` : 'rgba(6,10,14,0.5)',
                border: `1px solid ${counts[axis] > 0 ? `${axisColors[axis]}22` : 'rgba(255,255,255,0.05)'}`,
              }}>
              {/* Axis header */}
              <div className="flex items-center gap-3 px-5 py-3 border-b"
                style={{ borderColor: counts[axis] > 0 ? `${axisColors[axis]}15` : 'rgba(255,255,255,0.04)' }}>
                <span className="font-display font-black text-sm" style={{ color: axisColors[axis] }}>
                  {axisLabels[axis]}
                </span>
                <span className="text-[11px] text-text-muted/50 flex-1">{SLIDER_META[axis].desc}</span>
                {/* Density bar */}
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <motion.div className="h-full rounded-full"
                      animate={{ width: `${signalDensity[axis]}%` }}
                      transition={{ type: 'spring', stiffness: 140, damping: 18 }}
                      style={{ background: axisColors[axis] }}
                    />
                  </div>
                  <span className="text-[9px] font-black tabular-nums w-6"
                    style={{ color: counts[axis] > 0 ? axisColors[axis] : 'rgba(255,255,255,0.2)' }}>
                    {counts[axis] || '0'}
                  </span>
                </div>
              </div>
              {/* Word chips */}
              <div className="flex flex-wrap gap-2 px-5 py-4">
                {words.map(word => {
                  const isOn = selected[axis].has(word)
                  return (
                    <motion.button
                      key={word}
                      onClick={() => toggleWord(axis, word)}
                      whileTap={{ scale: 0.88 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                      className="text-xs px-3 py-1.5 rounded-full border transition-colors"
                      style={isOn ? {
                        background: `${axisColors[axis]}22`,
                        borderColor: `${axisColors[axis]}70`,
                        color: axisColors[axis],
                        boxShadow: `0 0 10px ${axisColors[axis]}25`,
                      } : {
                        background: 'rgba(255,255,255,0.02)',
                        borderColor: 'rgba(255,255,255,0.07)',
                        color: 'rgba(255,255,255,0.45)',
                      }}
                    >
                      {isOn && <span className="mr-1 text-[9px]">✦</span>}
                      {word}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Decode button ── */}
      {mode === 'words' && (
        <div className="flex gap-3 mb-2">
          <motion.button
            onClick={decode}
            disabled={totalSelected === 0}
            whileHover={totalSelected > 0 ? { scale: 1.02 } : {}}
            whileTap={totalSelected > 0 ? { scale: 0.97 } : {}}
            className="px-7 py-3.5 rounded-xl font-bold text-sm transition-all"
            style={totalSelected === 0 ? {
              background: 'rgba(255,255,255,0.04)',
              color: 'rgba(255,255,255,0.2)',
              cursor: 'not-allowed',
              border: '1px solid rgba(255,255,255,0.05)',
            } : {
              background: 'linear-gradient(135deg, #B88AFF, #00C8FF)',
              color: '#fff',
              border: 'none',
              boxShadow: '0 0 24px rgba(184,138,255,0.35)',
            }}
          >
            {totalSelected === 0 ? 'Tap words to begin →' : `Identify their neural wiring — ${totalSelected} signal${totalSelected !== 1 ? 's' : ''} →`}
          </motion.button>
          {decoded && (
            <button
              onClick={() => localStorage.setItem('neuroleader_decoded_target', decoded.styleKey)}
              className="px-5 py-3 rounded-xl border text-sm transition-all hover:bg-cyan/10"
              style={{ borderColor: 'rgba(0,200,255,0.2)', color: '#00C8FF' }}
            >
              Translate a message →
            </button>
          )}
        </div>
      )}

      {mode === 'convo' && decoded && (
        <div className="flex gap-3 mt-4 mb-2">
          <button
            onClick={() => localStorage.setItem('neuroleader_decoded_target', decoded.styleKey)}
            className="px-5 py-3 rounded-xl border text-sm transition-all hover:bg-cyan/10"
            style={{ borderColor: 'rgba(0,200,255,0.2)', color: '#00C8FF' }}
          >
            Translate a message for them →
          </button>
        </div>
      )}

      {/* ── Fingerprint reveal ── */}
      <AnimatePresence>
        {decoded && (
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 160, damping: 22 }}
            className="mt-6 space-y-4"
          >
            {/* ── Hero reveal card ── */}
            <div className="relative overflow-hidden rounded-2xl border"
              style={{
                borderColor: `${decoded.style.color}35`,
                background: `linear-gradient(135deg, ${decoded.style.color}12 0%, rgba(6,10,14,0.95) 55%)`,
              }}>
              {/* Scan line animation */}
              <motion.div
                className="absolute inset-x-0 h-px pointer-events-none"
                style={{ background: `linear-gradient(to right, transparent, ${decoded.style.color}60, transparent)` }}
                initial={{ top: 0, opacity: 1 }}
                animate={{ top: '100%', opacity: 0 }}
                transition={{ duration: 1.2, ease: 'linear' }}
              />
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: decoded.style.color }} />
                  <span className="text-[9px] font-bold uppercase tracking-[0.22em]"
                    style={{ color: `${decoded.style.color}90` }}>
                    Neural fingerprint identified
                  </span>
                </div>
                {/* Style name — big */}
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 22 }}
                >
                  <div className="font-display text-4xl font-black mb-0.5" style={{ color: decoded.style.color }}>
                    {decoded.style.name}
                  </div>
                  <div className="text-sm italic mb-4" style={{ color: `${decoded.style.color}80` }}>
                    {decoded.style.short}
                  </div>
                </motion.div>
                {/* Axis signature tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {Object.entries(decoded.style.axes).map(([axis, level]) => (
                    <motion.span key={axis}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + Object.keys(decoded.style.axes).indexOf(axis) * 0.06 }}
                      className="text-[9px] px-2.5 py-1 rounded-full font-bold uppercase"
                      style={{
                        background: level === 'high' ? `${axisColors[axis]}22` : 'rgba(255,255,255,0.03)',
                        color: level === 'high' ? axisColors[axis] : 'rgba(255,255,255,0.25)',
                        border: `1px solid ${level === 'high' ? `${axisColors[axis]}45` : 'rgba(255,255,255,0.06)'}`,
                      }}>
                      {axisLabels[axis]} {level === 'high' ? '↑ dominant' : '↓ low'}
                    </motion.span>
                  ))}
                </div>
                <p className="text-sm text-text-muted leading-relaxed mb-5">
                  {decoded.style.orientDesc}
                </p>
                {/* Top evidence signals */}
                {topEvidenceWords.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-xl p-3 border"
                    style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}
                  >
                    <div className="text-[8px] font-bold uppercase tracking-[0.16em] text-text-muted/40 mb-2">
                      Key signals detected
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {topEvidenceWords.map((w, i) => (
                        <motion.span key={w}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.45 + i * 0.07 }}
                          className="text-[10px] px-2.5 py-1 rounded-full font-medium"
                          style={{
                            background: `${axisColors[dominantAxisKey]}18`,
                            color: axisColors[dominantAxisKey],
                            border: `1px solid ${axisColors[dominantAxisKey]}35`,
                          }}>
                          ✦ {w}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* ── Gap analysis ── */}
            {userProfile?.axisScores && (
              <div className="rounded-2xl border border-white/[0.06] p-5"
                style={{ background: 'rgba(6,10,14,0.6)' }}>
                <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-text-muted/40 mb-4">
                  Your Gap to Their Wiring — Axis by Axis
                </div>
                <div className="space-y-2.5">
                  {['who', 'why', 'what', 'how'].map(axis => {
                    const userVal  = userProfile.axisScores[axis] || 50
                    const theirVal = decodeCompareAxes[axis]
                    const diff     = Math.abs(userVal - theirVal)
                    const gapColor = diff < 20 ? '#00E896' : diff < 40 ? '#FFB340' : '#FF6B6B'
                    const label    = diff < 20 ? 'Aligned' : diff < 40 ? 'Moderate gap' : 'High gap'
                    return (
                      <div key={axis} className="flex items-center gap-3">
                        <span className="text-[10px] font-black w-10 uppercase"
                          style={{ color: axisColors[axis] }}>{axisLabels[axis]}</span>
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden"
                          style={{ background: 'rgba(255,255,255,0.04)' }}>
                          <motion.div className="h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${diff}%` }}
                            transition={{ delay: 0.1, type: 'spring', stiffness: 100, damping: 20 }}
                            style={{ background: gapColor }}
                          />
                        </div>
                        <span className="text-[9px] font-bold w-16 text-right tabular-nums"
                          style={{ color: gapColor }}>{diff}pt — {label}</span>
                      </div>
                    )
                  })}
                </div>
                <p className="text-[9px] text-text-muted/30 mt-3">
                  Lower gap = less translation effort needed. High gap = speak their axis first.
                </p>
              </div>
            )}

            {/* ── Bridge strategy ── */}
            {userProfile && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl border p-5"
                style={{ borderColor: 'rgba(255,179,64,0.18)', background: 'rgba(255,179,64,0.04)' }}
              >
                <div className="text-[9px] font-bold uppercase tracking-[0.2em] mb-3"
                  style={{ color: '#FFB340' }}>Your Bridge Strategy</div>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {STYLES[userProfile.dominantStyle]?.adjustTo?.[decoded.styleKey] ||
                    'Lead with their dominant axis. Match their language before introducing your own frame.'}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Translation DNA helpers ─────────────────────────────────────────────────
const AXIS_KEYWORDS = {
  who:  ['team', 'people', 'relationship', 'you', 'we', 'together', 'feel', 'understand', 'support', 'trust', 'everyone', 'person', 'connect', 'colleague'],
  why:  ['vision', 'purpose', 'mission', 'meaning', 'why', 'because', 'value', 'impact', 'believe', 'matter', 'important', 'direction', 'principle'],
  what: ['system', 'process', 'structure', 'deliverable', 'framework', 'plan', 'timeline', 'milestone', 'workflow', 'organize', 'checklist', 'step', 'phase'],
  how:  ['action', 'result', 'execute', 'now', 'quickly', 'drive', 'achieve', 'deadline', 'ship', 'deliver', 'complete', 'finish', 'implement', 'move'],
}

function computeTranslateDNA(text) {
  const lower = text.toLowerCase()
  const scores = { who: 0, why: 0, what: 0, how: 0 }
  Object.entries(AXIS_KEYWORDS).forEach(([axis, words]) => {
    words.forEach(w => {
      const m = lower.match(new RegExp(`\\b${w}\\b`, 'gi'))
      if (m) scores[axis] += m.length
    })
  })
  const total = Math.max(Object.values(scores).reduce((a, b) => a + b, 0), 1)
  return { who: Math.round((scores.who / total) * 100), why: Math.round((scores.why / total) * 100), what: Math.round((scores.what / total) * 100), how: Math.round((scores.how / total) * 100) }
}

function tagSentences(text) {
  const raw = text.match(/[^.!?]+[.!?]+/g) || [text]
  return raw.map(s => {
    const lower = s.toLowerCase()
    const best = Object.entries(AXIS_KEYWORDS).reduce((b, [ax, words]) => {
      const count = words.filter(w => lower.includes(w)).length
      return count > b[1] ? [ax, count] : b
    }, ['neutral', 0])
    return { text: s.trim(), axis: best[1] > 0 ? best[0] : null }
  })
}

const LOADING_PHASES = [
  'Mapping neural wiring...',
  'Reframing language patterns...',
  'Optimizing for their axis...',
  'Translating intent...',
]

function MessageTranslator() {
  const [message, setMessage] = useState('')
  const [targetStyle, setTargetStyle] = useState('diplomatic')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingPhase, setLoadingPhase] = useState(0)
  const [error, setError] = useState(null)
  const [expandedVersion, setExpandedVersion] = useState(null)
  const [userProfile, setUserProfile] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('neuroleader_profile')
    if (stored) setUserProfile(JSON.parse(stored))
  }, [])

  useEffect(() => {
    const decoded = localStorage.getItem('neuroleader_decoded_target')
    if (decoded) {
      setTargetStyle(decoded)
      localStorage.removeItem('neuroleader_decoded_target')
    }
  }, [])

  useEffect(() => {
    if (!loading) return
    setLoadingPhase(0)
    const iv = setInterval(() => setLoadingPhase(p => (p + 1) % LOADING_PHASES.length), 900)
    return () => clearInterval(iv)
  }, [loading])

  async function handleTranslate() {
    if (!message.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await translateMessage(message, targetStyle)
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const styleOptions = Object.entries(STYLES).map(([key, s]) => ({ key, ...s }))
  const targetStyleData = STYLES[targetStyle]

  const dna = result?.translated ? computeTranslateDNA(result.translated) : null
  const sentences = result?.translated ? tagSentences(result.translated) : []

  const bridgeDistance = userProfile?.axisScores
    ? Math.round(['who', 'why', 'what', 'how'].reduce((sum, ax) => {
        const userVal = userProfile.axisScores[ax] || 50
        const targetVal = STYLES[targetStyle].axes[ax] === 'high' ? 80 : 25
        return sum + Math.abs(userVal - targetVal)
      }, 0) / 4)
    : null

  return (
    <div>
      {/* Editorial header */}
      <div className="mb-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted/60 mb-3">Neural Translator</p>
        <h1 className="font-display text-4xl md:text-5xl font-black text-white leading-none mb-3">
          Say It<br />
          <span className="bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
            Their Way
          </span>
        </h1>
        <p className="text-text-muted text-sm max-w-md leading-relaxed">
          Type your message. Select their wiring. Watch your words transform into language that actually hits.
        </p>
      </div>

      {/* Target style selector — axis fingerprint grid */}
      <div className="mb-6">
        <label className="text-xs font-bold uppercase tracking-[0.15em] text-text-muted/60 block mb-3">Their Neural Wiring</label>
        <div className="grid grid-cols-2 gap-2">
          {styleOptions.map(s => {
            const isSelected = targetStyle === s.key
            return (
              <motion.button
                key={s.key}
                onClick={() => setTargetStyle(s.key)}
                whileTap={{ scale: 0.97 }}
                className="relative overflow-hidden p-4 rounded-2xl border text-left transition-all"
                style={isSelected ? {
                  borderColor: `${s.color}50`,
                  background: `linear-gradient(135deg, ${s.color}12 0%, ${s.color}05 100%)`,
                  boxShadow: `0 0 24px ${s.color}20`,
                } : {
                  borderColor: 'rgba(255,255,255,0.06)',
                }}
              >
                {isSelected && (
                  <motion.div
                    layoutId="style-selector-edge"
                    className="absolute left-0 top-0 w-0.5 h-full rounded-full"
                    style={{ background: `linear-gradient(to bottom, transparent, ${s.color}, transparent)` }}
                  />
                )}
                {/* Axis fingerprint — vertical bars */}
                <div className="flex items-end gap-1 mb-3">
                  {['who', 'why', 'what', 'how'].map(ax => (
                    <div key={ax} className="flex flex-col items-center gap-0.5">
                      <div
                        className="w-1.5 rounded-full transition-all duration-500"
                        style={{
                          height: s.axes[ax] === 'high' ? 20 : 8,
                          background: s.axes[ax] === 'high' ? AXIS_COLORS[ax] : 'rgba(255,255,255,0.08)',
                          boxShadow: isSelected && s.axes[ax] === 'high' ? `0 0 6px ${AXIS_COLORS[ax]}` : 'none',
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="font-display font-black text-sm leading-tight mb-0.5" style={{ color: isSelected ? s.color : 'rgba(255,255,255,0.75)' }}>
                  {s.name}
                </div>
                <div className="text-[10px] text-text-muted/50">{s.short}</div>
              </motion.button>
            )
          })}
        </div>

        {/* Selected style context strip */}
        <AnimatePresence mode="wait">
          <motion.div
            key={targetStyle}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="mt-3 p-4 rounded-2xl border"
            style={{ borderColor: `${targetStyleData.color}20`, background: `${targetStyleData.color}06` }}
          >
            <div className="flex items-start gap-3">
              <div className="w-0.5 min-h-[32px] rounded-full shrink-0 mt-0.5" style={{ background: targetStyleData.color }} />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.15em] mb-1" style={{ color: targetStyleData.color }}>
                  What lands for them
                </div>
                <p className="text-[11px] text-text-muted/70 leading-relaxed">
                  {STYLES[targetStyle].translatePrinciple?.[targetStyle] || STYLES[targetStyle].short}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Message input */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-[0.15em] text-text-muted/60">Your Message</label>
          <span className="text-[10px] text-text-muted/40 tabular-nums">{message.length} chars</span>
        </div>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type what you want to communicate — raw, unfiltered, as you'd normally say it..."
          className="w-full h-32 bg-bg-surface border border-white/[0.06] rounded-2xl p-5 text-sm text-text-primary placeholder-text-muted/40 resize-none focus:outline-none focus:border-cyan/20 transition-colors leading-relaxed"
        />
      </div>

      {/* Translate button — style-colored */}
      <motion.button
        onClick={handleTranslate}
        disabled={loading || !message.trim()}
        whileTap={{ scale: 0.97 }}
        className="relative overflow-hidden px-8 py-4 rounded-xl font-bold text-sm transition-all"
        style={!loading && message.trim() ? {
          background: `linear-gradient(135deg, ${targetStyleData.color}CC 0%, ${targetStyleData.color}88 100%)`,
          color: '#fff',
          boxShadow: `0 0 24px ${targetStyleData.color}30`,
        } : {
          background: 'rgba(255,255,255,0.04)',
          color: 'rgba(255,255,255,0.3)',
          cursor: loading || !message.trim() ? 'not-allowed' : 'pointer',
        }}
      >
        {!loading && message.trim() && (
          <motion.div
            className="absolute inset-0 rounded-xl"
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ background: `radial-gradient(ellipse at 30% 50%, ${targetStyleData.color}50, transparent 70%)` }}
          />
        )}
        <span className="relative">
          {loading ? LOADING_PHASES[loadingPhase] : `Translate for ${targetStyleData?.name || ''} →`}
        </span>
      </motion.button>

      {/* Loading — bar pulse */}
      {loading && (
        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-end gap-0.5">
            {[0, 1, 2, 3].map(i => (
              <motion.div
                key={i}
                className="w-1 rounded-full"
                animate={{ height: ['6px', '16px', '6px'] }}
                transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.12 }}
                style={{ background: targetStyleData.color }}
              />
            ))}
          </div>
          <span className="text-[11px] text-text-muted/60">Neural pattern matching active</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-6 p-4 bg-coral/10 border border-coral/20 rounded-xl">
          <p className="text-sm text-coral">{error}</p>
        </div>
      )}

      {/* ── RESULT ──────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 160, damping: 20 }}
            className="mt-8 space-y-5"
          >
            {/* 1. Translation DNA bar */}
            {dna && (
              <div className="bg-bg-surface border border-white/[0.06] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted/50">Translation DNA</div>
                  <div className="text-[10px] text-text-muted/30">Axis composition of translated message</div>
                </div>
                {/* Segmented bar */}
                <div className="flex h-4 rounded-full overflow-hidden gap-px mb-3">
                  {['who', 'why', 'what', 'how'].map(ax => (
                    <motion.div
                      key={ax}
                      initial={{ flex: 0 }}
                      animate={{ flex: dna[ax] || 0.5 }}
                      transition={{ duration: 0.9, delay: 0.1, type: 'spring', stiffness: 70 }}
                      style={{ background: AXIS_COLORS[ax], minWidth: 2 }}
                    />
                  ))}
                </div>
                {/* Legend */}
                <div className="flex gap-4 flex-wrap">
                  {['who', 'why', 'what', 'how'].map(ax => (
                    <div key={ax} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: AXIS_COLORS[ax] }} />
                      <span className="text-[10px] font-black" style={{ color: AXIS_COLORS[ax] }}>{AXIS_LABELS[ax]}</span>
                      <span className="text-[10px] text-text-muted/40">{dna[ax]}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Side-by-side diff — original vs translated */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Original */}
              <div className="bg-bg-surface border border-white/[0.06] rounded-2xl p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted/40 mb-4">Your Original</div>
                <p className="text-sm text-text-muted/55 leading-relaxed">{message}</p>
              </div>

              {/* Translated — sentence-level axis dots */}
              <div
                className="relative overflow-hidden rounded-2xl border p-5"
                style={{ borderColor: `${targetStyleData.color}30`, background: `${targetStyleData.color}06` }}
              >
                <div
                  className="absolute right-3 bottom-3 font-display font-black text-[60px] leading-none pointer-events-none select-none"
                  style={{ color: `${targetStyleData.color}07` }}
                >
                  {targetStyleData.name.charAt(0)}
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-0.5 h-4 rounded-full" style={{ background: targetStyleData.color }} />
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: targetStyleData.color }}>
                    {targetStyleData.name} Translation
                  </div>
                </div>
                <div className="relative space-y-2">
                  {sentences.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.13, duration: 0.35 }}
                      className="flex items-start gap-2"
                    >
                      <div
                        className="shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full"
                        style={{ background: s.axis ? AXIS_COLORS[s.axis] : 'rgba(255,255,255,0.12)' }}
                      />
                      <p className="text-sm leading-relaxed text-white/85">{s.text}</p>
                    </motion.div>
                  ))}
                </div>
                {/* Axis legend for sentence dots */}
                <div className="flex gap-3 mt-4 pt-3 border-t border-white/[0.05] flex-wrap">
                  {['who', 'why', 'what', 'how'].filter(ax => sentences.some(s => s.axis === ax)).map(ax => (
                    <div key={ax} className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: AXIS_COLORS[ax] }} />
                      <span className="text-[9px] font-black" style={{ color: AXIS_COLORS[ax] }}>{AXIS_LABELS[ax]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Neural Bridge Analysis */}
            <div className="bg-bg-surface border border-white/[0.06] rounded-2xl p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted/50 mb-5">Neural Bridge Analysis</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Why it works */}
                <div className="md:col-span-2">
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: targetStyleData.color }}>Why This Lands</div>
                  <p className="text-sm text-text-muted leading-relaxed italic">"{result.principle}"</p>
                </div>
                {/* Bridge distance gauge */}
                {bridgeDistance !== null && (
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-text-muted/50 mb-2">Bridge Distance</div>
                    <div className="flex items-end gap-1.5 mb-2">
                      <motion.span
                        className="font-display font-black text-3xl tabular-nums"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        style={{ color: bridgeDistance < 20 ? '#00E896' : bridgeDistance < 40 ? '#FFB340' : '#FF6B6B' }}
                      >
                        {bridgeDistance}
                      </motion.span>
                      <span className="text-[10px] text-text-muted/40 mb-1.5">pts</span>
                    </div>
                    <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(bridgeDistance, 100)}%` }}
                        transition={{ delay: 0.4, duration: 0.7 }}
                        className="h-full rounded-full"
                        style={{ background: bridgeDistance < 20 ? '#00E896' : bridgeDistance < 40 ? '#FFB340' : '#FF6B6B' }}
                      />
                    </div>
                    <p className="text-[9px] text-text-muted/40 mt-2 leading-relaxed">
                      {bridgeDistance < 20 ? 'Natural alignment — easy reach' : bridgeDistance < 40 ? 'Moderate stretch — conscious effort' : 'High stretch — significant adaptation needed'}
                    </p>
                  </div>
                )}
              </div>

              {/* Per-axis shift arrows */}
              {userProfile?.axisScores && (
                <div className="mt-5 pt-4 border-t border-white/[0.05]">
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-text-muted/40 mb-3">Per-Axis Shift</div>
                  <div className="grid grid-cols-4 gap-2">
                    {['who', 'why', 'what', 'how'].map((ax, i) => {
                      const userVal = userProfile.axisScores[ax] || 50
                      const targetVal = STYLES[targetStyle].axes[ax] === 'high' ? 80 : 25
                      const delta = targetVal - userVal
                      const isUp = delta > 0
                      const absD = Math.abs(Math.round(delta))
                      const arrowColor = absD < 10 ? '#00E896' : absD < 30 ? '#FFB340' : '#FF6B6B'
                      return (
                        <div key={ax} className="text-center">
                          <div className="text-[10px] font-black mb-1" style={{ color: AXIS_COLORS[ax] }}>{AXIS_LABELS[ax]}</div>
                          <motion.div
                            className="font-black text-lg leading-none"
                            initial={{ opacity: 0, y: isUp ? 8 : -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.07 }}
                            style={{ color: arrowColor }}
                          >
                            {isUp ? '↑' : '↓'} {absD}
                          </motion.div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 4. All style versions */}
            {result.versions && (
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted/50 mb-3">All Style Translations</div>
                <div className="space-y-2">
                  {Object.entries(result.versions).map(([key, text]) => (
                    <div
                      key={key}
                      className="bg-bg-surface border border-white/[0.06] rounded-2xl overflow-hidden transition-all"
                      style={expandedVersion === key ? { borderColor: `${STYLES[key]?.color}25` } : {}}
                    >
                      <button
                        onClick={() => setExpandedVersion(expandedVersion === key ? null : key)}
                        className="w-full text-left px-5 py-4 flex items-center gap-3"
                      >
                        {/* Axis fingerprint */}
                        <div className="flex items-end gap-0.5 shrink-0">
                          {['who', 'why', 'what', 'how'].map(ax => (
                            <div
                              key={ax}
                              className="w-1.5 rounded-full"
                              style={{
                                height: STYLES[key]?.axes?.[ax] === 'high' ? 16 : 7,
                                background: STYLES[key]?.axes?.[ax] === 'high' ? AXIS_COLORS[ax] : 'rgba(255,255,255,0.08)',
                              }}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-display font-black flex-1" style={{ color: STYLES[key]?.color }}>
                          {STYLES[key]?.name}
                        </span>
                        <span className="text-[10px] text-text-muted/40 italic mr-2 hidden md:block">{STYLES[key]?.short}</span>
                        <motion.span
                          animate={{ rotate: expandedVersion === key ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-text-muted/40 text-xs"
                        >
                          ▾
                        </motion.span>
                      </button>
                      <AnimatePresence>
                        {expandedVersion === key && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div
                              className="px-5 pb-5 pt-4 border-t"
                              style={{ borderColor: `${STYLES[key]?.color}15`, background: `${STYLES[key]?.color}04` }}
                            >
                              <p className="text-sm text-text-primary leading-relaxed">{text}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const BRAIN_INSIGHTS = [
  {
    title: 'Why You Panic in Meetings',
    subtitle: 'Your inner alarm system',
    axis: 'WHY',
    color: '#00C8FF',
    icon: '🧠',
    body: 'Your brain has a built-in panic button called the amygdala. When stakes feel high, it hijacks your thinking brain and throws you into fight-or-flight. That brilliant point you had? Gone. Replaced by "uhh, what she said." Great leaders learn to notice the hijack happening — and hit pause before it takes over.',
    move: 'Next time you feel your chest tighten in a meeting, pause for one breath before you speak. That single second lets your thinking brain get back in the driver\'s seat. Sounds too simple? Try it once.',
  },
  {
    title: 'Why Your Team Mirrors Your Mood',
    subtitle: 'Emotions are contagious — literally',
    axis: 'WHO',
    color: '#B88AFF',
    icon: '🪞',
    body: 'Your brain has special cells that fire when you watch someone else do something — as if you were doing it yourself. This is why yawns spread and why a stressed leader creates a stressed team. Your people are unconsciously copying your emotional state all day long. No pressure, right?',
    move: 'Before your next team meeting, do a quick mood check. If you\'re frazzled, your team will feel it before you say a word. Take 30 seconds to reset. Walk in calm, and watch the room shift.',
  },
  {
    title: 'How Habits Actually Work',
    subtitle: 'Your brain\'s autopilot mode',
    axis: 'WHAT',
    color: '#00E896',
    icon: '⚙️',
    body: 'About 40% of what you do each day isn\'t a conscious decision — it\'s habit. Your brain automates repeated behaviors to save energy for harder stuff. This is why great systems leaders build clear processes: they\'re literally freeing up their team\'s brainpower for creative work instead of wasting it on "wait, how do we do this again?"',
    move: 'Pick one thing your team asks about repeatedly. Turn it into a dead-simple template or checklist. You just gave everyone back mental energy they didn\'t know they were spending.',
  },
  {
    title: 'The Science of Getting Stuff Done',
    subtitle: 'Dopamine isn\'t what you think',
    axis: 'HOW',
    color: '#FFB340',
    icon: '🚀',
    body: 'Dopamine isn\'t a "pleasure chemical" — it\'s an anticipation chemical. Your brain releases it when you expect a reward, not when you get one. That\'s why checking off a to-do feels so good, and why massive projects with no milestones feel like a slog. Smart leaders break big goals into small wins — not because they\'re soft, but because that\'s how brains actually work.',
    move: 'Take your biggest current project and chop it into 3 pieces you could finish this week. Celebrate each one — even a quick message to the team. You\'re not being cheesy. You\'re hacking dopamine.',
  },
  {
    title: 'You Can Actually Rewire This',
    subtitle: 'Your leadership style isn\'t permanent',
    axis: 'ALL',
    color: '#FF6B6B',
    icon: '🌱',
    body: 'Here\'s the good news: your brain physically changes based on what you practice. Every time you try a new approach — listening more, delegating differently, speaking up — you\'re building new neural pathways. Do it enough and it stops feeling forced. That\'s not positive thinking. That\'s biology.',
    move: 'Pick one leadership behavior that doesn\'t come naturally. Practice it for 5 minutes a day this week. Awkward at first? Good. That\'s your brain building new wiring. By Friday, it\'ll feel 10% more natural. By next month, it\'ll be yours.',
  },
]

function BrainBehavior() {
  const [expanded, setExpanded] = useState(null)
  const [axonMood, setAxonMood] = useState('idle')

  function handleExpand(i) {
    if (expanded === i) {
      setExpanded(null)
      setAxonMood('idle')
    } else {
      setExpanded(i)
      setAxonMood('excited')
      setTimeout(() => setAxonMood('thinking'), 800)
    }
  }

  return (
    <div>
      {/* Axon hero */}
      <div className="flex flex-col items-center text-center mb-12">
        <AxonMascot size={200} mood={axonMood} showQuip={expanded === null} entrance="portal" />
        <h2 className="font-display text-3xl font-bold text-white mt-4">
          Meet <span className="bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">Axon</span>
        </h2>
        <p className="text-text-muted text-sm max-w-sm mt-2 leading-relaxed">
          Your guide to how your brain actually runs the show.
          Tap a card — Axon's got thoughts.
        </p>
      </div>

      {/* Insight cards */}
      <div className="space-y-3">
        {BRAIN_INSIGHTS.map((insight, i) => (
          <motion.div
            key={i}
            className="bg-bg-surface border border-white/8 rounded-xl overflow-hidden"
            initial={false}
            whileHover={{ borderColor: `${insight.color}25` }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={() => handleExpand(i)}
              className="w-full text-left p-5 flex items-center gap-4"
            >
              <motion.div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-lg"
                style={{ background: `${insight.color}15` }}
                animate={expanded === i ? { scale: [1, 1.15, 1], rotate: [0, 5, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                {insight.icon}
              </motion.div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-semibold text-white text-sm">
                  {insight.title}
                </div>
                <div className="text-xs text-text-muted mt-0.5">
                  {insight.subtitle}
                </div>
              </div>
              <motion.span
                className="text-text-muted text-xs"
                animate={{ rotate: expanded === i ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                ▾
              </motion.span>
            </button>
            <AnimatePresence>
              {expanded === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 border-t border-white/5">
                    <p className="text-sm text-text-primary mt-4 leading-relaxed">
                      {insight.body}
                    </p>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mt-4 p-4 rounded-lg"
                      style={{ background: `${insight.color}08`, borderLeft: `3px solid ${insight.color}` }}
                    >
                      <span className="font-semibold text-xs uppercase tracking-wider" style={{ color: insight.color }}>
                        Your move
                      </span>
                      <p className="text-text-primary mt-1.5 text-sm leading-relaxed">{insight.move}</p>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <RainbowDivider className="mt-12 mb-8" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-8 rounded-2xl bg-bg-surface/60 border border-white/[0.06] text-center"
      >
        <AxonQuote text="Knowing how your brain works is step one. Mapping your style is step two. You're already ahead of most leaders." />
        <Link
          to="/assessment"
          className="group inline-flex items-center gap-2 mt-6 px-8 py-3.5 rounded-2xl bg-white text-bg-primary font-bold text-sm hover:bg-white/90 transition-all"
        >
          Take the Map
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </motion.div>
    </div>
  )
}

export default function Simulator() {
  const [activeTab, setActiveTab] = useState(0)
  const [profile, setProfile] = useState(null)
  const location = useLocation()

  useEffect(() => {
    const stored = localStorage.getItem('neuroleader_profile')
    if (stored) {
      try { setProfile(JSON.parse(stored)) } catch { /* ignore */ }
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const tab = params.get('tab')
    if (tab !== null) setActiveTab(Number(tab))
  }, [location.search])

  // Navigation event from ParallelRealityEngine CTA → switch to Say It Their Way
  useEffect(() => {
    const handler = (e) => {
      if (e.detail === 'say-it-their-way') setActiveTab(2)
    }
    window.addEventListener('neuroleader:navigate', handler)
    return () => window.removeEventListener('neuroleader:navigate', handler)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/60 backdrop-blur-2xl border-b border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan via-purple to-coral flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">N</span>
              </div>
              <span className="font-display font-bold text-white text-lg tracking-tight">NeuroLeader</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link to="/assessment" className="text-sm text-text-muted hover:text-white transition-colors hidden md:block">Map</Link>
              <button
                onClick={() => setActiveTab(3)}
                className="text-sm text-text-muted hover:text-white transition-colors hidden md:block"
              >
                Signal Map
              </button>
              <Link
                to="/profile"
                className="px-5 py-2 rounded-full bg-white text-bg-primary text-sm font-semibold hover:bg-white/90 transition-all"
              >
                Profile
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <span className="text-[9px] font-bold text-text-muted/40 uppercase tracking-[0.18em] hidden md:block whitespace-nowrap">Practice Lab</span>
            <div className="flex-1 h-px bg-white/[0.04] hidden md:block" />
          </div>

          <div className="flex gap-1 overflow-x-auto">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-2 text-xs rounded-full whitespace-nowrap transition-all ${
                  activeTab === i
                    ? 'bg-white text-bg-primary font-bold'
                    : 'text-text-muted hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 pt-40 pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 0 && <MapYourStyle />}
            {activeTab === 1 && <StyleDecoder />}
            {activeTab === 2 && <MessageTranslator />}
            {activeTab === 3 && <TeamSignalMap profile={profile} />}
            {activeTab === 4 && <ParallelRealityEngine />}
            {activeTab === 5 && <TrustPulse />}
            {activeTab === 6 && <CultureDiagnostic />}
          </motion.div>
        </AnimatePresence>
      </main>
      <PageFooter />
    </div>
  )
}
