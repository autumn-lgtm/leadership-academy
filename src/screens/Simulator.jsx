import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { STYLES } from '../data/styles'
import { computeStyle } from '../data/scoring'
import { translateMessage } from '../api/anthropic'
import QuadrantPlot from '../components/QuadrantPlot'
import AxonMascot from '../components/simulator/AxonMascot'
import TeamSignalMap from '../components/simulator/TeamSignalMap'
import { ParallelRealityEngine } from '../components/simulator/ParallelRealityEngine'
import { RainbowDivider, PageFooter, AxonQuote, NeuralSection } from '../components/DesignSystem'

const TABS = ['Your Style', 'Read the Room', 'Say It Their Way', 'Team Signal Map', 'Parallel Reality']

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

function MapYourStyle() {
  const [axes, setAxes] = useState({ who: 50, why: 50, what: 50, how: 50 })

  useEffect(() => {
    const stored = localStorage.getItem('neuroleader_profile')
    if (stored) {
      const profile = JSON.parse(stored)
      if (profile.axisScores) {
        setAxes(profile.axisScores)
      }
    }
  }, [])

  const style = computeStyle(axes.who, axes.why, axes.what, axes.how)
  const styleData = STYLES[style]

  const sliders = [
    { key: 'who', ...SLIDER_META.who },
    { key: 'why', ...SLIDER_META.why },
    { key: 'what', ...SLIDER_META.what },
    { key: 'how', ...SLIDER_META.how },
  ]

  return (
    <div>
      {/* Editorial header */}
      <div className="mb-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted/60 mb-3">Your Style Lab</p>
        <h1 className="font-display text-4xl md:text-5xl font-black text-white leading-none mb-3">
          Your Leadership<br />
          <span className="bg-gradient-to-r from-cyan via-purple to-coral bg-clip-text text-transparent">
            Frequency
          </span>
        </h1>
        <p className="text-text-muted text-sm max-w-md leading-relaxed">
          Drag each axis to match how you actually lead. Watch your style emerge in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sliders */}
        <div className="space-y-3">
          {sliders.map(s => (
            <div
              key={s.key}
              className="relative bg-bg-surface border border-white/[0.06] rounded-2xl p-5 overflow-hidden transition-all hover:border-white/10"
              style={{ borderColor: axes[s.key] > 65 ? `${s.color}30` : undefined }}
            >
              {/* Watermark axis letter */}
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 font-display font-black text-6xl pointer-events-none select-none leading-none"
                style={{ color: `${s.color}08` }}
              >
                {s.short}
              </div>
              <div className="relative">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-display font-black text-base text-white">{s.short}</div>
                    <div className="text-[11px] text-text-muted mt-0.5">{s.desc}</div>
                  </div>
                  <motion.span
                    key={axes[s.key]}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="font-display font-black text-2xl tabular-nums leading-none"
                    style={{ color: s.color }}
                  >
                    {axes[s.key]}
                  </motion.span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={axes[s.key]}
                  onChange={e => setAxes({ ...axes, [s.key]: Number(e.target.value) })}
                  className="w-full"
                  style={{ background: `linear-gradient(to right, ${s.color} ${axes[s.key]}%, rgba(255,255,255,0.06) ${axes[s.key]}%)` }}
                />
                {/* Level indicator */}
                <div className="flex justify-between mt-1.5">
                  <span className="text-[9px] text-text-muted/40">Low</span>
                  <span className="text-[9px] text-text-muted/40">High</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quadrant + result */}
        <div className="flex flex-col items-center">
          <div className="w-full bg-bg-surface border border-white/[0.06] rounded-2xl p-5 mb-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted/50 mb-3">Quadrant Map</div>
            <QuadrantPlot {...axes} size={280} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={style}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="w-full relative overflow-hidden rounded-2xl border p-6"
              style={{
                borderColor: `${styleData.color}30`,
                background: `linear-gradient(135deg, ${styleData.color}08 0%, transparent 60%)`,
              }}
            >
              {/* Watermark style initial */}
              <div
                className="absolute right-4 top-1/2 -translate-y-1/2 font-display font-black text-[88px] leading-none pointer-events-none select-none"
                style={{ color: `${styleData.color}06` }}
              >
                {styleData.name.charAt(0)}
              </div>
              <div className="relative">
                <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted/50 mb-2">Computed Style</div>
                <div className="font-display text-2xl font-black mb-1" style={{ color: styleData.color }}>
                  {styleData.name}
                </div>
                <div className="text-xs text-text-muted/70 italic mb-3">{styleData.short}</div>
                <p className="text-sm text-text-muted leading-relaxed">{styleData.orientDesc}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function StyleDecoder() {
  const [selected, setSelected] = useState({
    who: new Set(), why: new Set(), what: new Set(), how: new Set()
  })
  const [decoded, setDecoded] = useState(null)

  const axisColors = { who: '#B88AFF', why: '#00C8FF', what: '#00E896', how: '#FFB340' }
  const axisLabels = { who: 'WHO', why: 'WHY', what: 'WHAT', how: 'HOW' }

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

  return (
    <div>
      {/* Editorial header */}
      <div className="mb-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted/60 mb-3">Read the Room</p>
        <h1 className="font-display text-4xl md:text-5xl font-black text-white leading-none mb-3">
          Decode Who<br />
          <span className="bg-gradient-to-r from-purple to-cyan bg-clip-text text-transparent">
            You're Talking To
          </span>
        </h1>
        <p className="text-text-muted text-sm max-w-md leading-relaxed">
          Tap words you hear them say. We'll reveal their leadership wiring — before they tell you.
        </p>
      </div>

      {/* Signal detection summary strip */}
      {totalSelected > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6 p-3 bg-bg-surface/60 border border-white/[0.06] rounded-xl overflow-hidden"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted/50 shrink-0">Signals detected</span>
          <div className="flex gap-1.5 flex-1">
            {['who', 'why', 'what', 'how'].map(axis => (
              <div key={axis} className="flex-1 relative h-6 rounded overflow-hidden">
                <motion.div
                  className="absolute inset-0 rounded"
                  initial={false}
                  animate={{ opacity: counts[axis] > 0 ? 1 : 0.2 }}
                  style={{ background: axisColors[axis], opacity: 0.15 }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[9px] font-bold" style={{ color: axisColors[axis] }}>
                    {axisLabels[axis]} {counts[axis] > 0 ? `×${counts[axis]}` : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <span className="text-xs font-bold text-white/60 shrink-0">{totalSelected}</span>
        </motion.div>
      )}

      <div className="space-y-4">
        {Object.entries(SIGNAL_WORDS).map(([axis, words]) => (
          <div
            key={axis}
            className="bg-bg-surface border border-white/[0.06] rounded-2xl overflow-hidden transition-all"
            style={{ borderColor: counts[axis] > 0 ? `${axisColors[axis]}25` : undefined }}
          >
            {/* Axis header */}
            <div
              className="flex items-center gap-3 px-5 py-3"
              style={{ background: counts[axis] > 0 ? `${axisColors[axis]}08` : undefined }}
            >
              <span className="font-display font-black text-sm" style={{ color: axisColors[axis] }}>
                {axisLabels[axis]}
              </span>
              <span className="text-[11px] text-text-muted/60 flex-1">
                {SLIDER_META[axis].desc}
              </span>
              {/* Fill bar */}
              <div className="w-16 h-1 bg-white/[0.04] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  animate={{ width: `${Math.min((counts[axis] / 6) * 100, 100)}%` }}
                  style={{ background: axisColors[axis] }}
                />
              </div>
              <span className="text-xs font-bold w-4 text-right" style={{ color: counts[axis] > 0 ? axisColors[axis] : 'rgba(255,255,255,0.2)' }}>
                {counts[axis] || ''}
              </span>
            </div>
            {/* Words */}
            <div className="flex flex-wrap gap-2 px-5 py-4">
              {words.map(word => (
                <button
                  key={word}
                  onClick={() => toggleWord(axis, word)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    selected[axis].has(word)
                      ? 'text-white'
                      : 'border-white/8 text-text-muted hover:border-white/20'
                  }`}
                  style={selected[axis].has(word) ? {
                    background: `${axisColors[axis]}20`,
                    borderColor: `${axisColors[axis]}80`,
                    color: axisColors[axis],
                  } : {}}
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={decode}
          disabled={totalSelected === 0}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            totalSelected === 0
              ? 'bg-bg-surface text-text-muted/40 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple to-cyan text-white shadow-[0_0_20px_rgba(184,138,255,0.3)]'
          }`}
        >
          Decode their style →
        </button>
        {decoded && (
          <button
            onClick={() => {
              localStorage.setItem('neuroleader_decoded_target', decoded.styleKey)
            }}
            className="px-6 py-3 rounded-xl border border-cyan/20 text-cyan text-sm hover:bg-cyan/10 transition-all"
          >
            Build a translated message →
          </button>
        )}
      </div>

      <AnimatePresence>
        {decoded && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 160, damping: 20 }}
            className="mt-8 space-y-4"
          >
            {/* Big reveal card */}
            <div
              className="relative overflow-hidden rounded-2xl border p-7"
              style={{
                borderColor: `${decoded.style.color}35`,
                background: `linear-gradient(135deg, ${decoded.style.color}10 0%, transparent 60%)`,
              }}
            >
              {/* Watermark */}
              <div
                className="absolute right-4 top-1/2 -translate-y-1/2 font-display font-black text-[100px] leading-none pointer-events-none select-none"
                style={{ color: `${decoded.style.color}06` }}
              >
                {decoded.style.name.charAt(0)}
              </div>
              <div className="relative">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: decoded.style.color }}>
                  Detected Style
                </div>
                <div className="font-display text-3xl font-black text-white mb-1">
                  {decoded.style.name}
                </div>
                <div className="text-sm italic mb-4" style={{ color: decoded.style.color }}>{decoded.style.short}</div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {Object.entries(decoded.style.axes).map(([axis, level]) => (
                    <span
                      key={axis}
                      className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase"
                      style={{
                        background: level === 'high' ? `${axisColors[axis]}20` : 'rgba(255,255,255,0.04)',
                        color: level === 'high' ? axisColors[axis] : 'rgba(255,255,255,0.3)',
                        border: `1px solid ${level === 'high' ? `${axisColors[axis]}40` : 'rgba(255,255,255,0.06)'}`,
                      }}
                    >
                      {axis.toUpperCase()} ↑
                    </span>
                  ))}
                </div>
                <p className="text-sm text-text-muted leading-relaxed">{decoded.style.orientDesc}</p>
              </div>
            </div>

            {/* Quadrant comparison + gap */}
            <div className="bg-bg-surface border border-white/[0.06] rounded-2xl p-6">
              <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted/50 mb-4">Quadrant Overlap</div>
              <div className="flex items-start gap-6">
                <div className="shrink-0">
                  {userProfile?.axisScores ? (
                    <QuadrantPlot
                      {...userProfile.axisScores}
                      compareAxes={decodeCompareAxes}
                      compareLabel={decoded.style.name}
                      size={180}
                    />
                  ) : (
                    <QuadrantPlot
                      who={decodeCompareAxes.who} why={decodeCompareAxes.why}
                      what={decodeCompareAxes.what} how={decodeCompareAxes.how}
                      size={180}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full bg-cyan shrink-0" />
                    <span className="text-text-muted">You — {userProfile?.dominantStyle || 'Your style'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full bg-white/40 shrink-0" />
                    <span className="text-text-muted">{decoded.style.name}</span>
                  </div>
                  {userProfile?.axisScores && (
                    <div className="pt-2 space-y-2">
                      {['who', 'why', 'what', 'how'].map(axis => {
                        const userVal = userProfile.axisScores[axis] || 50
                        const theirVal = decodeCompareAxes[axis]
                        const diff = Math.abs(userVal - theirVal)
                        const color = diff < 20 ? '#00E896' : diff < 40 ? '#FFB340' : '#FF6B6B'
                        return (
                          <div key={axis} className="flex items-center gap-2">
                            <span className="text-[10px] font-bold w-8 shrink-0" style={{ color: axisColors[axis] }}>{axis.toUpperCase()}</span>
                            <div className="flex-1 h-1 bg-white/[0.04] rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${diff}%` }}
                                transition={{ delay: 0.1, duration: 0.5 }}
                                style={{ background: color }}
                              />
                            </div>
                            <span className="text-[10px] font-bold w-5 shrink-0 tabular-nums" style={{ color }}>{diff}</span>
                          </div>
                        )
                      })}
                      <p className="text-[9px] text-text-muted/40 pt-1">Gap per axis — lower = easier to connect</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* How to adjust */}
            {userProfile && (
              <div
                className="rounded-2xl border p-5"
                style={{ borderColor: 'rgba(255,179,64,0.2)', background: 'rgba(255,179,64,0.04)' }}
              >
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber mb-3">Your Bridge Strategy</div>
                <p className="text-sm text-text-primary leading-relaxed">
                  {STYLES[userProfile.dominantStyle]?.adjustTo?.[decoded.styleKey] ||
                    'Adapt your communication by emphasizing their primary axes.'}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MessageTranslator() {
  const [message, setMessage] = useState('')
  const [targetStyle, setTargetStyle] = useState('diplomatic')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
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

  return (
    <div>
      {/* Editorial header */}
      <div className="mb-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted/60 mb-3">Message Translator</p>
        <h1 className="font-display text-4xl md:text-5xl font-black text-white leading-none mb-3">
          Speak<br />
          <span className="bg-gradient-to-r from-cyan to-emerald bg-clip-text text-transparent">
            Their Language
          </span>
        </h1>
        <p className="text-text-muted text-sm max-w-md leading-relaxed">
          Type your message. Pick a style. Get a version that actually lands for them.
        </p>
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

      {/* Target style selector */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold uppercase tracking-[0.15em] text-text-muted/60">Translate for</label>
          {targetStyleData && (
            <span className="text-xs font-bold" style={{ color: targetStyleData.color }}>
              {targetStyleData.name}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {styleOptions.map(s => (
            <button
              key={s.key}
              onClick={() => setTargetStyle(s.key)}
              className="relative overflow-hidden p-4 rounded-2xl border text-left transition-all hover:scale-[1.02]"
              style={targetStyle === s.key ? {
                borderColor: `${s.color}50`,
                background: `${s.color}10`,
                boxShadow: `0 0 24px ${s.color}15`,
              } : {
                borderColor: 'rgba(255,255,255,0.06)',
              }}
            >
              {/* Selected indicator */}
              {targetStyle === s.key && (
                <div
                  className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
                  style={{ background: s.color }}
                />
              )}
              {/* Axis mini bars */}
              <div className="flex gap-0.5 mb-2">
                {['who', 'why', 'what', 'how'].map(axis => (
                  <div
                    key={axis}
                    className="flex-1 h-0.5 rounded-full"
                    style={{
                      background: s.axes[axis] === 'high'
                        ? { who: '#B88AFF', why: '#00C8FF', what: '#00E896', how: '#FFB340' }[axis]
                        : 'rgba(255,255,255,0.08)',
                    }}
                  />
                ))}
              </div>
              <div className="text-xs font-display font-black leading-tight" style={{ color: targetStyle === s.key ? s.color : 'rgba(255,255,255,0.7)' }}>
                {s.name}
              </div>
              <div className="text-[10px] text-text-muted/50 mt-0.5 leading-tight">{s.short}</div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleTranslate}
        disabled={loading || !message.trim()}
        className={`px-8 py-3.5 rounded-xl font-bold text-sm transition-all ${
          loading || !message.trim()
            ? 'bg-bg-surface text-text-muted/40 cursor-not-allowed'
            : 'bg-gradient-to-r from-cyan to-purple text-white shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:shadow-[0_0_28px_rgba(0,200,255,0.4)]'
        }`}
      >
        {loading ? 'Translating...' : `Translate for ${targetStyleData?.name || ''} →`}
      </button>

      {/* Loading animation */}
      {loading && (
        <div className="mt-6 flex items-center gap-3">
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-cyan"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
          <span className="text-sm text-text-muted">Analyzing communication patterns...</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-6 p-4 bg-coral/10 border border-coral/20 rounded-xl">
          <p className="text-sm text-coral">{error}</p>
        </div>
      )}

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 160, damping: 20 }}
            className="mt-8 space-y-4"
          >
            {/* Main translated message — big card */}
            <div
              className="relative overflow-hidden rounded-2xl border p-7"
              style={{
                borderColor: `${STYLES[targetStyle].color}35`,
                background: `linear-gradient(135deg, ${STYLES[targetStyle].color}08 0%, transparent 60%)`,
              }}
            >
              <div
                className="absolute right-4 bottom-4 font-display font-black text-[80px] leading-none pointer-events-none select-none"
                style={{ color: `${STYLES[targetStyle].color}06` }}
              >
                {STYLES[targetStyle].name.charAt(0)}
              </div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-1 h-6 rounded-full"
                    style={{ background: STYLES[targetStyle].color }}
                  />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: STYLES[targetStyle].color }}>
                      {STYLES[targetStyle].name} Translation
                    </div>
                    <div className="text-[10px] text-text-muted/40">{STYLES[targetStyle].short}</div>
                  </div>
                </div>
                <p className="text-base text-text-primary leading-relaxed">{result.translated}</p>
              </div>
            </div>

            {/* Principle */}
            <div className="rounded-2xl border border-purple/20 bg-purple/[0.04] p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple mb-2">Why This Works</div>
              <p className="text-sm text-text-muted leading-relaxed italic">"{result.principle}"</p>
            </div>

            {/* Communication gap */}
            {userProfile?.axisScores && (
              <div className="bg-bg-surface border border-white/[0.06] rounded-2xl p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted/50 mb-4">Translation Gap</div>
                <div className="space-y-3">
                  {[
                    { key: 'who', label: 'WHO', color: '#B88AFF' },
                    { key: 'why', label: 'WHY', color: '#00C8FF' },
                    { key: 'what', label: 'WHAT', color: '#00E896' },
                    { key: 'how', label: 'HOW', color: '#FFB340' },
                  ].map(axis => {
                    const userVal = userProfile.axisScores[axis.key] || 50
                    const targetVal = STYLES[targetStyle].axes[axis.key] === 'high' ? 80 : 25
                    const gap = Math.abs(userVal - targetVal)
                    const gapColor = gap < 20 ? '#00E896' : gap < 45 ? '#FFB340' : '#FF6B6B'
                    return (
                      <div key={axis.key} className="flex items-center gap-3">
                        <span className="text-[10px] font-black w-8 shrink-0" style={{ color: axis.color }}>{axis.label}</span>
                        <div className="flex-1 h-1.5 bg-white/[0.04] rounded-full overflow-hidden relative">
                          <motion.div
                            className="absolute left-0 top-0 h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${gap}%` }}
                            transition={{ delay: 0.15, duration: 0.5 }}
                            style={{ background: gapColor }}
                          />
                        </div>
                        <span className="text-[10px] font-bold w-5 shrink-0 tabular-nums" style={{ color: gapColor }}>{gap}</span>
                      </div>
                    )
                  })}
                </div>
                <p className="text-[9px] text-text-muted/40 mt-3">How far your natural emphasis is from theirs. Lower = message lands more naturally.</p>
              </div>
            )}

            {/* All versions */}
            {result.versions && (
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted/50 mb-3">All Style Versions</div>
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
                        {/* Axis mini bars */}
                        <div className="flex gap-0.5 shrink-0">
                          {['who', 'why', 'what', 'how'].map(axis => (
                            <div
                              key={axis}
                              className="w-0.5 h-4 rounded-full"
                              style={{
                                background: STYLES[key]?.axes?.[axis] === 'high'
                                  ? { who: '#B88AFF', why: '#00C8FF', what: '#00E896', how: '#FFB340' }[axis]
                                  : 'rgba(255,255,255,0.08)',
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
    <div className="min-h-screen bg-bg-primary">
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
          </motion.div>
        </AnimatePresence>
      </main>
      <PageFooter />
    </div>
  )
}
