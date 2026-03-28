import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { STYLES } from '../data/styles'
import QuadrantPlot from '../components/QuadrantPlot'

const TABS = ['Profile', 'Leadership Style', 'Apply It', 'Go Deeper']

function HeroStats({ profile, style }) {
  const stats = [
    { label: 'Leadership Style', value: style.name, color: style.color },
    { label: 'Orientation', value: style.orientation, color: '#00C8FF' },
    { label: 'Environment Fit', value: style.env.split(',')[0], color: '#00E896' },
  ]
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {stats.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-bg-surface border border-white/8 rounded-xl p-5"
        >
          <div className="text-xs text-text-muted uppercase tracking-wider mb-1">{s.label}</div>
          <div className="font-display text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
        </motion.div>
      ))}
    </div>
  )
}

function SignalMap({ axisScores, attrScores, style }) {
  const axisItems = [
    { label: 'WHO — People Focus', key: 'who', color: '#B88AFF', ideal: style.axes.who === 'high' ? 80 : 30 },
    { label: 'WHY — Purpose Focus', key: 'why', color: '#00C8FF', ideal: style.axes.why === 'high' ? 80 : 30 },
    { label: 'WHAT — Systems Focus', key: 'what', color: '#00E896', ideal: style.axes.what === 'high' ? 80 : 30 },
    { label: 'HOW — Execution Focus', key: 'how', color: '#FFB340', ideal: style.axes.how === 'high' ? 80 : 30 },
  ]

  const attrItems = [
    { label: 'Empathy', key: 'empathy', color: '#B88AFF' },
    { label: 'Vision', key: 'vision', color: '#00C8FF' },
    { label: 'Structure', key: 'structure', color: '#00E896' },
    { label: 'Decisiveness', key: 'decisiveness', color: '#FFB340' },
    { label: 'Communication', key: 'communication', color: '#B88AFF' },
    { label: 'Risk Tolerance', key: 'risk', color: '#FFB340' },
    { label: 'Collaboration', key: 'collaboration', color: '#B88AFF' },
  ]

  return (
    <div className="space-y-4">
      {axisItems.map((item, i) => (
        <motion.div
          key={item.key}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          className="bg-bg-surface border border-white/8 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-text-primary">{item.label}</span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${item.color}20`, color: item.color }}>
                {axisScores[item.key] || 0}
              </span>
            </div>
            <span className="text-xs text-text-muted">
              {item.key.toUpperCase()} axis
            </span>
          </div>
          <div className="relative h-3 bg-bg-surface2 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ background: item.color }}
              initial={{ width: 0 }}
              animate={{ width: `${axisScores[item.key] || 0}%` }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            />
            {/* Ideal marker */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white/40"
              style={{ left: `${item.ideal}%` }}
              title={`Ideal for ${style.name}: ${item.ideal}`}
            />
          </div>
          <div className="text-xs text-text-muted mt-1">
            Ideal range for {style.name}: {item.ideal > 50 ? 'High' : 'Low'}
          </div>
        </motion.div>
      ))}

      <div className="mt-6 pt-4 border-t border-white/5">
        <h4 className="text-sm font-display font-semibold text-text-primary mb-4">Attributes</h4>
        {attrItems.map((item, i) => (
          <div key={item.key} className="flex items-center gap-3 mb-3">
            <span className="text-xs text-text-muted w-28 shrink-0">{item.label}</span>
            <div className="flex-1 h-2 bg-bg-surface2 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: item.color }}
                initial={{ width: 0 }}
                animate={{ width: `${attrScores[item.key] || 50}%` }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.05 }}
              />
            </div>
            <span className="text-xs font-semibold w-8" style={{ color: item.color }}>
              {attrScores[item.key] || 50}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function NeuroCallout({ text }) {
  return (
    <div className="bg-purple/5 border border-purple/20 rounded-xl p-5 my-6">
      <div className="flex items-start gap-3">
        <div className="text-purple text-lg">🧠</div>
        <div>
          <div className="text-xs font-display font-bold text-purple uppercase tracking-wider mb-1">Neuroscience Insight</div>
          <p className="text-sm text-text-primary leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  )
}

function StyleDetail({ style }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${style.color}20` }}>
          <span className="font-display text-xl font-bold" style={{ color: style.color }}>{style.name[0]}</span>
        </div>
        <div>
          <h3 className="font-display text-2xl font-bold" style={{ color: style.color }}>{style.name}</h3>
          <p className="text-sm text-text-muted">{style.short}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(style.axes).map(([axis, level]) => (
          <span
            key={axis}
            className={`text-xs px-3 py-1 rounded-full border ${
              level === 'high' ? 'border-cyan/30 bg-cyan/10 text-cyan' : 'border-white/10 bg-white/5 text-text-muted'
            }`}
          >
            {axis.toUpperCase()}: {level}
          </span>
        ))}
      </div>

      <p className="text-sm text-text-primary leading-relaxed mb-6">{style.desc}</p>

      <NeuroCallout text={style.neuro} />

      <div className="mt-6">
        <h4 className="font-display font-semibold text-text-primary mb-2">Environment Fit</h4>
        <p className="text-sm text-text-muted leading-relaxed">{style.envDesc}</p>
      </div>
    </div>
  )
}

function TeamComplement({ style }) {
  return (
    <div className="space-y-4">
      <h4 className="font-display font-semibold text-text-primary">Complementary Styles</h4>
      {style.complement.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-bg-surface border border-white/8 rounded-xl p-5"
        >
          <div className="font-display font-semibold text-cyan mb-1">{c.style}</div>
          <div className="text-sm text-amber mb-2">{c.why}</div>
          <div className="text-xs text-text-muted">{c.how}</div>
        </motion.div>
      ))}
    </div>
  )
}

function ApplyItTab({ style }) {
  const [expanded, setExpanded] = useState(null)
  return (
    <div>
      <h3 className="font-display text-xl font-bold text-text-primary mb-4">Scenarios for {style.name} Leaders</h3>
      <div className="space-y-3">
        {style.scenarios.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-bg-surface border border-white/8 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="w-full text-left p-5 flex items-center justify-between"
            >
              <div>
                <div className="font-display font-semibold text-text-primary">{s.title}</div>
                <div className="text-sm text-text-muted mt-1">{s.body}</div>
              </div>
              <span className={`text-text-muted transition-transform ${expanded === i ? 'rotate-180' : ''}`}>
                ▾
              </span>
            </button>
            <AnimatePresence>
              {expanded === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pt-0 border-t border-white/5">
                    <div className="text-xs text-cyan uppercase tracking-wider font-semibold mb-2 mt-3">Your Action</div>
                    <p className="text-sm text-text-primary leading-relaxed">{s.action}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function GoDeeperTab({ style }) {
  const [expanded, setExpanded] = useState(null)
  return (
    <div>
      <h3 className="font-display text-xl font-bold text-text-primary mb-4">Reflection Prompts</h3>
      <div className="space-y-3 mb-8">
        {style.reflects.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-bg-surface border border-white/8 rounded-xl overflow-hidden cursor-pointer"
            onClick={() => setExpanded(expanded === i ? null : i)}
          >
            <div className="p-5">
              <div className="text-sm text-text-primary">{r}</div>
              <AnimatePresence>
                {expanded === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <p className="text-xs text-text-muted mt-3 pt-3 border-t border-white/5">
                      Take a moment to journal your response. There's no right answer — only honest exploration of your leadership patterns.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      <NeuroCallout text="Reflection activates the Default Mode Network (DMN) — the same neural circuitry responsible for self-awareness, empathy, and creative insight. Regular reflection physically strengthens the connections between your prefrontal cortex and limbic system, improving emotional regulation and decision-making under pressure." />

      <div className="mt-8 text-center">
        <Link
          to="/simulator"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan to-purple text-white font-semibold shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:shadow-[0_0_30px_rgba(0,200,255,0.5)] transition-all"
        >
          Communication Simulator →
        </Link>
      </div>
    </div>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('neuroleader_profile')
    if (stored) {
      setProfile(JSON.parse(stored))
    }
  }, [])

  if (!profile) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-text-primary mb-4">No Profile Yet</h2>
          <p className="text-text-muted mb-6">Complete the assessment to see your leadership profile.</p>
          <button
            onClick={() => navigate('/assessment')}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan to-purple text-white font-semibold"
          >
            Take Assessment
          </button>
        </div>
      </div>
    )
  }

  const style = STYLES[profile.dominantStyle]
  const { axisScores, attrScores } = profile

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan to-purple flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">N</span>
              </div>
              <span className="font-display font-bold text-text-primary">NeuroLeader</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/simulator"
                className="text-xs px-4 py-2 rounded-lg bg-cyan/10 text-cyan border border-cyan/20 hover:bg-cyan/20 transition-all"
              >
                Communication Simulator
              </Link>
              <Link
                to="/assessment"
                className="text-xs px-4 py-2 rounded-lg bg-white/5 text-text-muted hover:text-text-primary border border-white/10 transition-all"
              >
                Retake
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-2 text-sm rounded-lg transition-all ${
                  activeTab === i
                    ? 'bg-cyan/10 text-cyan font-semibold'
                    : 'text-text-muted hover:text-text-primary hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 0 && (
              <div>
                <HeroStats profile={profile} style={style} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-display font-semibold text-text-primary mb-4">Signal Map</h3>
                    <SignalMap axisScores={axisScores} attrScores={attrScores} style={style} />
                  </div>
                  <div className="flex flex-col items-center">
                    <h3 className="font-display font-semibold text-text-primary mb-4">Quadrant Position</h3>
                    <QuadrantPlot
                      who={axisScores.who}
                      why={axisScores.why}
                      what={axisScores.what}
                      how={axisScores.how}
                      size={320}
                    />
                    <div className="mt-4 p-4 bg-bg-surface border border-white/8 rounded-xl">
                      <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Quadrant Detail</div>
                      <p className="text-sm text-text-primary leading-relaxed">{style.quadDetail}</p>
                    </div>
                  </div>
                </div>
                <NeuroCallout text={style.neuro} />
              </div>
            )}

            {activeTab === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <StyleDetail style={style} />
                <div>
                  <div className="flex justify-center mb-6">
                    <QuadrantPlot
                      who={axisScores.who}
                      why={axisScores.why}
                      what={axisScores.what}
                      how={axisScores.how}
                      size={280}
                    />
                  </div>
                  <TeamComplement style={style} />
                </div>
              </div>
            )}

            {activeTab === 2 && <ApplyItTab style={style} />}
            {activeTab === 3 && <GoDeeperTab style={style} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
