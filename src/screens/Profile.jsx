import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { STYLES } from '../data/styles'
import QuadrantPlot from '../components/QuadrantPlot'

const TABS = ['Profile', 'Style', 'Apply It', 'Go Deeper', 'Growth Path']

const GROWTH_MODULES = [
  { phase: 'Foundation', title: 'New Leader Foundations', desc: 'Trust, motivation, 1:1s, delegation — the trailhead of leadership.', milestones: 7, program: 'MGMT 101', color: '#00E896' },
  { phase: 'Core', title: 'Leadership Development Experience', desc: 'Strategy, culture, coaching, conflict — the desert crossing.', milestones: 49, program: 'LDE', color: '#FFB340' },
  { phase: 'Advanced', title: 'Advanced Leadership Development', desc: 'Org design, executive presence, board dynamics — the ascent.', milestones: 40, program: 'ALDE', color: '#00C8FF' },
  { phase: 'Practice', title: 'Lab Notes', desc: 'Reflective practice using Gibbs\' cycle. Where observation becomes insight.', milestones: null, program: 'Lab Notes', color: '#B88AFF' },
]

function Nav({ activeTab, setActiveTab }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/60 backdrop-blur-2xl border-b border-white/[0.04]">
      <div className="max-w-5xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan via-purple to-coral flex items-center justify-center">
              <span className="text-white font-display font-bold text-xs">N</span>
            </div>
            <span className="font-display font-bold text-white text-sm">NeuroLeader</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/simulator" className="text-xs px-4 py-2 rounded-full bg-white/[0.04] text-text-muted hover:text-white border border-white/[0.06] transition-all">
              Simulator
            </Link>
            <Link to="/assessment" className="text-xs px-4 py-2 rounded-full bg-white/[0.04] text-text-muted hover:text-white border border-white/[0.06] transition-all">
              Retake
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
  )
}

function HeroStats({ style, axisScores }) {
  const stats = [
    { label: 'Leadership Style', value: style.name, sub: style.short, color: style.color },
    { label: 'Orientation', value: style.orientation, sub: style.orientDesc.split('.')[0], color: '#00C8FF' },
    { label: 'Best Environment', value: style.env.split(',')[0], sub: style.envDesc.split('.')[0], color: '#00E896' },
  ]
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
      {stats.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-bg-surface/60 border border-white/[0.06] rounded-2xl p-6 hover:border-white/10 transition-all"
        >
          <div className="text-[10px] text-text-muted uppercase tracking-widest mb-2">{s.label}</div>
          <div className="font-display text-xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
          <p className="text-xs text-text-muted leading-relaxed">{s.sub}</p>
        </motion.div>
      ))}
    </div>
  )
}

function SignalBars({ axisScores, attrScores, style }) {
  const axes = [
    { label: 'WHO', sub: 'People', key: 'who', color: '#B88AFF', high: style.axes.who === 'high' },
    { label: 'WHY', sub: 'Purpose', key: 'why', color: '#00C8FF', high: style.axes.why === 'high' },
    { label: 'WHAT', sub: 'Systems', key: 'what', color: '#00E896', high: style.axes.what === 'high' },
    { label: 'HOW', sub: 'Execution', key: 'how', color: '#FFB340', high: style.axes.how === 'high' },
  ]

  const attrs = [
    { label: 'Empathy', key: 'empathy', color: '#B88AFF' },
    { label: 'Vision', key: 'vision', color: '#00C8FF' },
    { label: 'Structure', key: 'structure', color: '#00E896' },
    { label: 'Decisiveness', key: 'decisiveness', color: '#FFB340' },
    { label: 'Communication', key: 'communication', color: '#B88AFF' },
    { label: 'Risk Tolerance', key: 'risk', color: '#FFB340' },
    { label: 'Collaboration', key: 'collaboration', color: '#00C8FF' },
  ]

  return (
    <div className="space-y-3">
      {axes.map((a, i) => (
        <motion.div
          key={a.key}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          className="bg-bg-surface/60 border border-white/[0.06] rounded-2xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-display text-xs font-bold tracking-wider" style={{ color: a.color }}>{a.label}</span>
              <span className="text-[10px] text-text-muted">{a.sub}</span>
            </div>
            <span className="text-xs font-bold" style={{ color: a.color }}>{axisScores[a.key] || 0}</span>
          </div>
          <div className="relative h-2 bg-white/[0.04] rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ background: a.color }}
              initial={{ width: 0 }}
              animate={{ width: `${axisScores[a.key] || 0}%` }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            />
            <div className="absolute top-0 bottom-0 w-0.5 bg-white/20" style={{ left: `${a.high ? 75 : 30}%` }} />
          </div>
        </motion.div>
      ))}

      <div className="mt-8 pt-6 border-t border-white/[0.04]">
        <h4 className="text-[10px] text-text-muted uppercase tracking-widest mb-4">Attributes</h4>
        {attrs.map((a, i) => (
          <div key={a.key} className="flex items-center gap-3 mb-2.5">
            <span className="text-xs text-text-muted w-24 shrink-0">{a.label}</span>
            <div className="flex-1 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: a.color }}
                initial={{ width: 0 }}
                animate={{ width: `${attrScores[a.key] || 50}%` }}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.04 }}
              />
            </div>
            <span className="text-xs font-bold w-6" style={{ color: a.color }}>{attrScores[a.key] || 50}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function NeuroCallout({ text }) {
  return (
    <div className="rounded-2xl p-5 my-6 border border-purple/15" style={{ background: 'linear-gradient(135deg, rgba(184,138,255,0.06), rgba(0,200,255,0.03))' }}>
      <div className="flex items-start gap-3">
        <span className="text-lg">🧠</span>
        <div>
          <div className="text-[10px] font-display font-bold text-purple uppercase tracking-widest mb-1">Neuroscience</div>
          <p className="text-sm text-text-primary leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  )
}

function StyleTab({ style, axisScores }) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${style.color}15` }}>
              <span className="font-display text-2xl font-bold" style={{ color: style.color }}>{style.name[0]}</span>
            </div>
            <div>
              <h3 className="font-display text-3xl font-bold" style={{ color: style.color }}>{style.name}</h3>
              <p className="text-sm text-text-muted">{style.short}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(style.axes).map(([axis, level]) => (
              <span key={axis} className={`text-xs px-3 py-1 rounded-full border ${level === 'high' ? 'border-cyan/20 bg-cyan/8 text-cyan' : 'border-white/[0.06] bg-white/[0.02] text-text-muted'}`}>
                {axis.toUpperCase()}: {level}
              </span>
            ))}
          </div>

          <p className="text-sm text-text-primary leading-relaxed mb-6">{style.desc}</p>
          <NeuroCallout text={style.neuro} />
        </div>

        <div>
          <div className="flex justify-center mb-6">
            <QuadrantPlot {...axisScores} size={260} />
          </div>

          <div className="bg-bg-surface/60 border border-white/[0.06] rounded-2xl p-5 mb-6">
            <div className="text-[10px] text-text-muted uppercase tracking-widest mb-2">Quadrant Position</div>
            <p className="text-sm text-text-primary leading-relaxed">{style.quadDetail}</p>
          </div>

          <h4 className="text-[10px] text-text-muted uppercase tracking-widest mb-3">Complementary Styles</h4>
          <div className="space-y-3">
            {style.complement.map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-bg-surface/60 border border-white/[0.06] rounded-2xl p-4">
                <div className="font-display text-sm font-bold text-cyan mb-0.5">{c.style}</div>
                <div className="text-xs text-amber mb-1">{c.why}</div>
                <div className="text-xs text-text-muted">{c.how}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ApplyItTab({ style }) {
  const [expanded, setExpanded] = useState(null)
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-white mb-2">Scenarios for {style.name} Leaders</h2>
      <p className="text-sm text-text-muted mb-8">Practice applying your style to real situations.</p>
      <div className="space-y-3">
        {style.scenarios.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-bg-surface/60 border border-white/[0.06] rounded-2xl overflow-hidden">
            <button onClick={() => setExpanded(expanded === i ? null : i)} className="w-full text-left p-5 flex items-start justify-between gap-4">
              <div>
                <div className="font-display text-base font-bold text-white">{s.title}</div>
                <div className="text-sm text-text-muted mt-1">{s.body}</div>
              </div>
              <span className={`text-text-muted text-sm shrink-0 transition-transform ${expanded === i ? 'rotate-180' : ''}`}>▾</span>
            </button>
            <AnimatePresence>
              {expanded === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="px-5 pb-5 border-t border-white/[0.04]">
                    <div className="text-[10px] text-cyan uppercase tracking-widest font-bold mt-4 mb-2">Your Action</div>
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
      <h2 className="font-display text-2xl font-bold text-white mb-2">Reflection Prompts</h2>
      <p className="text-sm text-text-muted mb-8">The questions that sharpen self-awareness.</p>
      <div className="space-y-3 mb-8">
        {style.reflects.map((r, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-bg-surface/60 border border-white/[0.06] rounded-2xl p-5 cursor-pointer hover:border-white/10 transition-all"
            onClick={() => setExpanded(expanded === i ? null : i)}>
            <div className="text-sm text-white leading-relaxed">{r}</div>
            <AnimatePresence>
              {expanded === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-xs text-text-muted mt-3 pt-3 border-t border-white/[0.04]">
                    Journal your response. There's no right answer — only honest exploration of your leadership patterns.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
      <NeuroCallout text="Reflection activates the Default Mode Network — the same neural circuitry responsible for self-awareness, empathy, and creative insight. Regular reflection strengthens connections between your prefrontal cortex and limbic system, improving emotional regulation and decision-making under pressure." />
      <div className="mt-8 text-center">
        <Link to="/simulator" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white text-bg-primary font-bold text-sm hover:bg-white/90 transition-all">
          Communication Simulator →
        </Link>
      </div>
    </div>
  )
}

function GrowthPathTab({ style }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-white mb-2">Growth Path</h2>
      <p className="text-sm text-text-muted mb-3">
        Your <span style={{ color: style.color }}>{style.name}</span> style shapes how you move through these programs.
      </p>
      <p className="text-xs text-text-muted mb-8 leading-relaxed max-w-lg">
        The Leadership Academy curriculum builds on your natural strengths while developing complementary skills. Each phase maps to real leadership challenges.
      </p>

      <div className="space-y-4">
        {GROWTH_MODULES.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-bg-surface/60 border border-white/[0.06] rounded-2xl p-6 hover:border-white/10 transition-all group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest"
                    style={{ background: `${m.color}12`, color: m.color }}>
                    {m.phase}
                  </span>
                  <span className="text-[10px] text-text-muted">{m.program}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-1">{m.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{m.desc}</p>
              </div>
              {m.milestones && (
                <div className="shrink-0 text-right">
                  <div className="font-display text-2xl font-bold" style={{ color: m.color }}>{m.milestones}</div>
                  <div className="text-[10px] text-text-muted">milestones</div>
                </div>
              )}
            </div>

            {/* Style-specific insight */}
            <div className="mt-4 pt-3 border-t border-white/[0.04]">
              <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: style.color }}>
                For {style.name} leaders
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                {i === 0 && `Focus on ${style.axes.who === 'high' ? 'leveraging your natural people skills in 1:1s' : 'building stronger interpersonal foundations'}.`}
                {i === 1 && `Your ${style.orientation.toLowerCase()} orientation means you'll ${style.axes.why === 'high' ? 'excel at strategic milestones but should push on execution skills' : 'move fast through tactical milestones but should slow down for vision work'}.`}
                {i === 2 && `At the advanced level, lean into ${style.complement[0]?.style} partnerships to round out your leadership architecture.`}
                {i === 3 && `Reflection is especially valuable for ${style.name} leaders — it strengthens your ${style.axes.who === 'high' ? 'systems thinking' : 'empathic accuracy'}.`}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 p-6 rounded-2xl border border-purple/15" style={{ background: 'linear-gradient(135deg, rgba(184,138,255,0.04), rgba(0,200,255,0.02))' }}>
        <div className="text-[10px] font-display font-bold text-purple uppercase tracking-widest mb-2">How it connects</div>
        <p className="text-sm text-text-primary leading-relaxed">
          Your NeuroLeader assessment maps <em>who you are</em> as a leader. The Growth Path develops <em>what you can become</em>. Your {style.name} style isn't a box — it's a starting point. The curriculum builds the neural pathways you need to lead across all four axes.
        </p>
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
    if (stored) setProfile(JSON.parse(stored))
  }, [])

  if (!profile) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center px-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan via-purple to-coral flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-display font-bold text-2xl">N</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-3">No Profile Yet</h2>
          <p className="text-text-muted mb-8 max-w-sm mx-auto">Complete the assessment to discover your leadership style and unlock your profile.</p>
          <button onClick={() => navigate('/assessment')} className="px-8 py-3.5 rounded-2xl bg-white text-bg-primary font-bold text-sm">
            Take Assessment →
          </button>
        </div>
      </div>
    )
  }

  const style = STYLES[profile.dominantStyle]
  const { axisScores, attrScores } = profile

  return (
    <div className="min-h-screen bg-bg-primary">
      <Nav activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-5xl mx-auto px-6 pt-32 pb-16">
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
                <HeroStats style={style} axisScores={axisScores} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <SignalBars axisScores={axisScores} attrScores={attrScores} style={style} />
                  <div className="flex flex-col items-center">
                    <QuadrantPlot who={axisScores.who} why={axisScores.why} what={axisScores.what} how={axisScores.how} size={300} />
                    <div className="mt-4 p-5 bg-bg-surface/60 border border-white/[0.06] rounded-2xl w-full">
                      <div className="text-[10px] text-text-muted uppercase tracking-widest mb-2">Quadrant Detail</div>
                      <p className="text-sm text-text-primary leading-relaxed">{style.quadDetail}</p>
                    </div>
                    <NeuroCallout text={style.neuro} />
                  </div>
                </div>
              </div>
            )}
            {activeTab === 1 && <StyleTab style={style} axisScores={axisScores} />}
            {activeTab === 2 && <ApplyItTab style={style} />}
            {activeTab === 3 && <GoDeeperTab style={style} />}
            {activeTab === 4 && <GrowthPathTab style={style} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
