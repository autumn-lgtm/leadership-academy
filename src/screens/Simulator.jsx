import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { STYLES } from '../data/styles'
import { computeStyle } from '../data/scoring'
import { translateMessage } from '../api/anthropic'
import QuadrantPlot from '../components/QuadrantPlot'
import AxonMascot from '../components/simulator/AxonMascot'
import { RainbowDivider, PageFooter, AxonQuote, NeuralSection } from '../components/DesignSystem'

const TABS = ['Your Style', 'Read the Room', 'Say It Their Way']

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
    { key: 'who', label: 'WHO — People Focus', color: '#B88AFF' },
    { key: 'why', label: 'WHY — Purpose Focus', color: '#00C8FF' },
    { key: 'what', label: 'WHAT — Systems Focus', color: '#00E896' },
    { key: 'how', label: 'HOW — Execution Focus', color: '#FFB340' },
  ]

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          {sliders.map(s => (
            <div key={s.key} className="bg-bg-surface border border-white/8 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-text-primary">{s.label}</label>
                <span className="text-sm font-bold" style={{ color: s.color }}>{axes[s.key]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={axes[s.key]}
                onChange={e => setAxes({ ...axes, [s.key]: Number(e.target.value) })}
                className="w-full"
                style={{ background: `linear-gradient(to right, ${s.color} ${axes[s.key]}%, #1a2a3a ${axes[s.key]}%)` }}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center">
          <QuadrantPlot {...axes} size={300} />
          <motion.div
            key={style}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-5 bg-bg-surface border border-white/8 rounded-xl w-full"
          >
            <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Computed Style</div>
            <div className="font-display text-xl font-bold" style={{ color: styleData.color }}>
              {styleData.name} — {styleData.short}
            </div>
            <p className="text-sm text-text-muted mt-2">{styleData.orientDesc}</p>
          </motion.div>
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

  return (
    <div>
      <p className="text-sm text-text-muted mb-6">
        Select signal words you hear from someone to decode their leadership style.
      </p>

      {Object.entries(SIGNAL_WORDS).map(([axis, words]) => (
        <div key={axis} className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-display font-bold tracking-wider" style={{ color: axisColors[axis] }}>
              {axisLabels[axis]} Signals
            </span>
            <div className="flex-1 h-1.5 bg-bg-surface2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  background: axisColors[axis],
                  width: `${(counts[axis] / 6) * 100}%`
                }}
              />
            </div>
            <span className="text-xs font-semibold" style={{ color: axisColors[axis] }}>{counts[axis]}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {words.map(word => (
              <button
                key={word}
                onClick={() => toggleWord(axis, word)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  selected[axis].has(word)
                    ? 'text-white'
                    : 'border-white/10 text-text-muted hover:border-white/20'
                }`}
                style={selected[axis].has(word) ? {
                  background: `${axisColors[axis]}30`,
                  borderColor: axisColors[axis],
                  color: axisColors[axis],
                } : {}}
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="flex gap-3 mt-6">
        <button
          onClick={decode}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan to-purple text-white font-semibold text-sm"
        >
          Decode their style
        </button>
        {decoded && (
          <button
            onClick={() => {
              // Store decoded style and switch to translator tab
              localStorage.setItem('neuroleader_decoded_target', decoded.styleKey)
            }}
            className="px-6 py-2.5 rounded-xl border border-cyan/20 text-cyan text-sm hover:bg-cyan/10 transition-all"
          >
            Build a translated message →
          </button>
        )}
      </div>

      <AnimatePresence>
        {decoded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-6 bg-bg-surface border border-white/8 rounded-xl"
          >
            <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Detected Style</div>
            <div className="font-display text-2xl font-bold mb-2" style={{ color: decoded.style.color }}>
              {decoded.style.name}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.entries(decoded.style.axes).map(([axis, level]) => (
                <span key={axis} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-text-muted">
                  {axis.toUpperCase()}: {level}
                </span>
              ))}
            </div>
            <p className="text-sm text-text-primary mb-4">{decoded.style.orientDesc}</p>

            {/* Adjustment guide */}
            {userProfile && (
              <div className="border-t border-white/5 pt-4 mt-4">
                <div className="text-xs text-amber uppercase tracking-wider font-semibold mb-2">
                  How to adjust (You → Them)
                </div>
                <p className="text-sm text-text-primary">
                  {STYLES[userProfile.dominantStyle]?.adjustTo?.[decoded.styleKey] ||
                    'Adapt your communication by emphasizing their primary axes.'}
                </p>
              </div>
            )}

            {/* Compare grid */}
            {userProfile && (
              <div className="border-t border-white/5 pt-4 mt-4">
                <div className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-3">
                  You vs. Them
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {['who', 'why', 'what', 'how'].map(axis => (
                    <div key={axis} className="bg-bg-primary rounded-lg p-3">
                      <div className="text-xs font-semibold mb-1" style={{ color: axisColors[axis] }}>
                        {axis.toUpperCase()}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-text-muted">You: {userProfile.axisScores[axis]}</span>
                        <span className="text-text-muted">|</span>
                        <span className="text-text-muted">Them: {decoded.scores[axis]}</span>
                      </div>
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

function MessageTranslator() {
  const [message, setMessage] = useState('')
  const [targetStyle, setTargetStyle] = useState('diplomatic')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [expandedVersion, setExpandedVersion] = useState(null)

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

  return (
    <div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-primary mb-2">Your Message</label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type the message you want to translate into a different leadership style..."
          className="w-full h-32 bg-bg-surface border border-white/10 rounded-xl p-4 text-sm text-text-primary placeholder-text-muted resize-none focus:outline-none focus:border-cyan/30 transition-colors"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-text-primary mb-2">Target Style</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {styleOptions.map(s => (
            <button
              key={s.key}
              onClick={() => setTargetStyle(s.key)}
              className={`p-3 rounded-xl border text-left transition-all ${
                targetStyle === s.key
                  ? 'shadow-lg'
                  : 'border-white/8 hover:border-white/15'
              }`}
              style={targetStyle === s.key ? {
                borderColor: s.color,
                background: `${s.color}10`,
                boxShadow: `0 0 20px ${s.color}20`,
              } : {}}
            >
              <div className="text-xs font-display font-bold" style={{ color: targetStyle === s.key ? s.color : undefined }}>
                {s.name}
              </div>
              <div className="text-[10px] text-text-muted">{s.short}</div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleTranslate}
        disabled={loading || !message.trim()}
        className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all ${
          loading || !message.trim()
            ? 'bg-bg-surface2 text-text-muted cursor-not-allowed'
            : 'bg-gradient-to-r from-cyan to-purple text-white shadow-[0_0_20px_rgba(0,200,255,0.3)]'
        }`}
      >
        {loading ? 'Translating...' : 'Translate'}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            {/* Translated message */}
            <div className="p-6 bg-bg-surface border rounded-xl" style={{ borderColor: `${STYLES[targetStyle].color}30` }}>
              <div className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: STYLES[targetStyle].color }}>
                {STYLES[targetStyle].name} Translation
              </div>
              <p className="text-text-primary leading-relaxed">{result.translated}</p>
            </div>

            {/* Principle */}
            <div className="p-4 bg-purple/5 border border-purple/20 rounded-xl">
              <div className="text-xs text-purple uppercase tracking-wider font-semibold mb-1">Translation Principle</div>
              <p className="text-sm text-text-primary">{result.principle}</p>
            </div>

            {/* All versions */}
            {result.versions && (
              <div className="space-y-2">
                <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">All Style Versions</div>
                {Object.entries(result.versions).map(([key, text]) => (
                  <div key={key} className="bg-bg-surface border border-white/8 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedVersion(expandedVersion === key ? null : key)}
                      className="w-full text-left p-4 flex items-center justify-between"
                    >
                      <span className="text-sm font-display font-semibold" style={{ color: STYLES[key]?.color }}>
                        {STYLES[key]?.name}
                      </span>
                      <span className={`text-text-muted text-xs transition-transform ${expandedVersion === key ? 'rotate-180' : ''}`}>▾</span>
                    </button>
                    <AnimatePresence>
                      {expandedVersion === key && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-0 border-t border-white/5">
                            <p className="text-sm text-text-primary mt-3 leading-relaxed">{text}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
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
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const tab = params.get('tab')
    if (tab !== null) setActiveTab(Number(tab))
  }, [location.search])

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
              <Link to="/profile" className="text-sm text-text-muted hover:text-white transition-colors hidden md:block">Profile</Link>
              <Link
                to="/profile"
                className="px-5 py-2 rounded-full bg-white text-bg-primary text-sm font-semibold hover:bg-white/90 transition-all"
              >
                View Profile
              </Link>
            </div>
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

      <main className="max-w-6xl mx-auto px-8 pt-32 pb-16">
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
          </motion.div>
        </AnimatePresence>
      </main>
      <PageFooter />
    </div>
  )
}
