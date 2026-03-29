import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { STYLES } from '../data/styles'
import { PROGRAMS, AXIS_COLORS } from '../data/growth'
import { getProfileQuotes, getRandomQuote } from '../data/quotes'
import QuadrantPlot from '../components/QuadrantPlot'
import AxonMascot from '../components/simulator/AxonMascot'
import { RainbowDivider, PageFooter, AxonQuote, NeuralSection } from '../components/DesignSystem'
import ActivationCard from '../components/profile/ActivationCard'
import NuggetCard from '../components/nuggets/NuggetCard'
import { getNuggetForPlacement } from '../data/nuggets'

const RAINBOW_STYLE = {
  background: 'linear-gradient(90deg, #B88AFF 0%, #00C8FF 35%, #00E896 65%, #FFB340 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  display: 'inline',
  fontWeight: 700,
}

function StyleName({ name }) {
  return (
    <span style={RAINBOW_STYLE}>
      {name.charAt(0).toUpperCase() + name.slice(1)}
    </span>
  )
}

function ProfileHero({ style }) {
  const highAxes = Object.entries(style.axes)
    .filter(([, v]) => v === 'high')
    .map(([k]) => k.toUpperCase())
  return (
    <div className="mb-10 pb-10 border-b border-white/[0.04]">
      <p className="text-[10px] text-text-muted uppercase tracking-[6px] mb-4">Your Leadership Identity</p>
      <h1 className="font-display text-6xl md:text-7xl font-black leading-none mb-3">
        <StyleName name={style.name} />
      </h1>
      <p className="text-lg text-text-muted font-medium mb-4">{style.short}</p>
      <div className="flex flex-wrap items-center gap-3">
        {highAxes.map(axis => (
          <span key={axis} className="text-xs px-3 py-1 rounded-full border border-white/10 text-white/60 font-mono tracking-widest">
            {axis}
          </span>
        ))}
        <span className="text-sm text-text-muted">{style.orientation}</span>
      </div>
    </div>
  )
}

function scoreLabel(score) {
  if (score >= 80) return { text: 'Dominant', color: '#00E896' }
  if (score >= 56) return { text: 'High',     color: '#00C8FF' }
  if (score >= 31) return { text: 'Moderate', color: '#FFB340' }
  return              { text: 'Low',      color: '#B88AFF' }
}

function ProfileWelcome({ style, onDismiss }) {
  const quote = getRandomQuote(getProfileQuotes(style.name.toLowerCase()))
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mb-8 p-6 rounded-2xl border relative"
      style={{ borderColor: `${style.color}30`, background: `${style.color}08` }}
    >
      <button
        onClick={onDismiss}
        className="absolute top-4 right-4 text-text-muted hover:text-white text-xs transition-colors"
      >
        Dismiss
      </button>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${style.color}20` }}>
          <span className="text-lg">&#x2728;</span>
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-white mb-1">
            Welcome, <StyleName name={style.name} /> leader.
          </h3>
          <p className="text-sm text-text-muted leading-relaxed mb-3">
            Your profile is ready. Explore your style, see how you compare, and find your growth path.
          </p>
          {quote && (
            <p className="text-xs italic text-text-muted">
              &ldquo;{quote.text}&rdquo; &mdash; {quote.attribution}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

const TABS = ['Profile', 'Style', 'Apply It', 'Go Deeper', 'Growth Path']

function Nav({ activeTab, setActiveTab }) {
  return (
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
            <Link to="/simulator" className="text-sm text-text-muted hover:text-white transition-colors hidden md:block">Simulator</Link>
            <Link
              to="/assessment"
              className="px-5 py-2 rounded-full bg-white text-bg-primary text-sm font-semibold hover:bg-white/90 transition-all"
            >
              Remap
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

function HeroStats({ style }) {
  const stats = [
    { label: 'Orientation', value: style.orientation, sub: style.orientDesc.split('.')[0], color: '#00C8FF' },
    { label: 'Best Environment', value: style.env.split(',')[0], sub: style.envDesc.split('.')[0], color: '#00E896' },
  ]
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
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
            <div className="flex items-center gap-2">
              {(() => { const sl = scoreLabel(axisScores[a.key] || 0); return (
                <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
                  style={{ color: sl.color, background: `${sl.color}18` }}>{sl.text}</span>
              )})()}
              <span className="text-xs font-bold" style={{ color: a.color }}>{axisScores[a.key] || 0}</span>
            </div>
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

function AxonCallout({ text }) {
  return <AxonQuote text={text} />
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
              <h3 className="font-display text-3xl font-bold"><StyleName name={style.name} /></h3>
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
          <AxonCallout text={style.neuro} />
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
      <h2 className="font-display text-2xl font-bold text-white mb-2">Scenarios for <StyleName name={style.name} /> Leaders</h2>
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
      <AxonCallout text="Writing things down forces your brain to process differently than just thinking about them. That's why journaling works — it activates the same networks responsible for self-awareness and creative insight. You're not just reflecting. You're literally rewiring." />
      <div className="mt-8 text-center">
        <Link to="/simulator" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white text-bg-primary font-bold text-sm hover:bg-white/90 transition-all">
          Communication Simulator →
        </Link>
      </div>
    </div>
  )
}

function NeuroLinkCard({ link, index, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="p-4 rounded-xl bg-bg-primary/60 border border-white/[0.04] hover:border-white/[0.08] transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold mt-0.5"
          style={{ background: `${color}15`, color }}>
          {index + 1}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-bold text-white mb-0.5">{link.title}</h4>
          <p className="text-xs text-text-muted leading-relaxed mb-2">{link.sub}</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/[0.04] text-text-muted border border-white/[0.06]">
              {link.framework}
            </span>
            {link.axes?.map(a => (
              <span key={a} className="w-1.5 h-1.5 rounded-full" style={{ background: AXIS_COLORS[a] }} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ProgramCard({ program, styleKey, isExpanded, onToggle }) {
  const styleInsight = program.styleInsight?.[styleKey]

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-surface/60 border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/10 transition-all"
    >
      <button
        onClick={onToggle}
        className="w-full text-left p-6 transition-all"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest"
                style={{ background: `${program.color}15`, color: program.color }}>
                {program.phase}
              </span>
              <span className="text-[10px] text-text-muted">{program.program}</span>
              {program.hours && (
                <span className="text-[10px] text-text-muted">{program.hours} hrs</span>
              )}
            </div>
            <h3 className="font-display text-lg font-bold text-white mb-1">{program.title}</h3>
            <p className="text-sm text-text-muted leading-relaxed">{program.desc}</p>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-2">
            {program.neurolinks && (
              <div className="text-right">
                <div className="font-display text-2xl font-bold" style={{ color: program.color }}>{program.neurolinks}</div>
                <div className="text-[10px] text-text-muted">neurolinks</div>
              </div>
            )}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              className="w-6 h-6 rounded-full bg-white/[0.04] flex items-center justify-center text-text-muted"
            >
              <span className="text-xs">▼</span>
            </motion.div>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-4">
              {/* Science foundation */}
              <div className="p-4 rounded-xl border border-white/[0.04]" style={{ background: `${program.color}06` }}>
                <div className="text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{ color: program.color }}>
                  Science Foundation
                </div>
                <p className="text-xs text-text-muted leading-relaxed">{program.science}</p>
              </div>

              {/* Style-specific insight */}
              {styleInsight && (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="text-[9px] font-bold uppercase tracking-widest mb-1.5 text-purple">
                    For Your Style
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">{styleInsight}</p>
                </div>
              )}

              {/* Phases (LDE/ALDE) */}
              {program.phases && (
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-text-muted mb-2 px-1">
                    Phases
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {program.phases.map((p, pi) => (
                      <div key={pi} className="p-3 rounded-lg bg-bg-primary/40 border border-white/[0.04]">
                        <div className="text-[10px] font-bold text-white mb-0.5">{p.name}</div>
                        <div className="text-[9px] text-text-muted">{p.range} — {p.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Neurolinks list */}
              {program.neurolinksData && (
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-text-muted mb-2 px-1">
                    {program.neurolinks} Neurolinks
                  </div>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                    {program.neurolinksData.map((link, li) => (
                      <NeuroLinkCard key={li} link={link} index={li} color={program.color} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function GrowthPathTab({ style }) {
  const [expanded, setExpanded] = useState(null)
  const styleKey = style.name.toLowerCase()

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-white mb-2">Growth Path</h2>
      <p className="text-sm text-text-muted mb-2">
        Your <StyleName name={style.name} /> style shapes how you move through these programs.
      </p>
      <p className="text-xs text-text-muted mb-8 leading-relaxed max-w-lg">
        Neurolinks are your units of progress. Each one builds a specific leadership skill through practice, not theory. Your style shapes how you'll move through the work.
      </p>

      <div className="space-y-4">
        {PROGRAMS.map((program, i) => (
          <ProgramCard
            key={program.id}
            program={program}
            styleKey={styleKey}
            isExpanded={expanded === i}
            onToggle={() => setExpanded(expanded === i ? null : i)}
          />
        ))}
      </div>

      {/* How it connects */}
      <div className="mt-8">
        <AxonQuote text={`The Map shows who you are as a leader. The Growth Path develops what you can become. Your ${style.name} style isn't a box — it's a starting point.`} />
      </div>

      {/* Total stats */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { label: 'Total Neurolinks', value: '59', color: '#00C8FF' },
          { label: 'Total Hours', value: '~144', color: '#00E896' },
          { label: 'Programs', value: '3 + Lab Notes', color: '#B88AFF' },
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-xl bg-bg-surface/60 border border-white/[0.06] text-center">
            <div className="font-display text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[10px] text-text-muted mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ActivationTeaser({ style, onOpen }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      onClick={onOpen}
      className="mt-8 w-full text-left p-5 rounded-2xl border border-white/[0.06] bg-bg-surface/40 hover:border-white/10 hover:bg-bg-surface/60 transition-all group"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[4px] text-text-muted mb-1.5">Communication Gap</div>
          <p className="text-sm text-white font-semibold mb-1">
            How a <StyleName name={style.name} /> message lands on a different style.
          </p>
          <p className="text-xs text-text-muted">See where communication breaks down — and how to close it.</p>
        </div>
        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-all shrink-0 ml-4 text-text-muted group-hover:text-white text-sm">
          →
        </div>
      </div>
    </motion.button>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const [profile, setProfile] = useState(null)
  const [showWelcome, setShowWelcome] = useState(() =>
    !localStorage.getItem('neuroleader_welcome_dismissed')
  )
  const [showActivation, setShowActivation] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('neuroleader_profile')
    if (stored) setProfile(JSON.parse(stored))
  }, [])

  function dismissWelcome() {
    setShowWelcome(false)
    localStorage.setItem('neuroleader_welcome_dismissed', '1')
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center px-8">
          <AxonMascot size={160} mood="wave" showQuip={false} entrance="portal" />
          <h2 className="font-display text-3xl font-bold text-white mb-3 mt-4">
            No Profile <span className="bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">Yet</span>
          </h2>
          <p className="text-text-muted mb-8 max-w-sm mx-auto">
            Take the Map and Axon will break down your leadership style — who you are, how you lead, and where you can grow.
          </p>
          <button onClick={() => navigate('/assessment')} className="group px-8 py-3.5 rounded-2xl bg-white text-bg-primary font-bold text-sm hover:bg-white/90 transition-all inline-flex items-center gap-2">
            Take the Map
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>
      </div>
    )
  }

  // Support both legacy (dominantStyle) and new (quadrant.style) profile formats
  const styleName = profile.dominantStyle || profile.quadrant?.style
  const style = STYLES[styleName]
  const axisScores = profile.axisScores || profile.quadrant || {}
  const attrScores = profile.attrScores || profile.attributes || {}

  const nugget = getNuggetForPlacement('profile', { style: styleName })

  return (
    <div className="min-h-screen bg-bg-primary">
      <Nav activeTab={activeTab} setActiveTab={setActiveTab} />

      <ActivationCard styleName={styleName} open={showActivation} onClose={() => setShowActivation(false)} />
      <main className="max-w-6xl mx-auto px-8 pt-32 pb-16">
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
                <ProfileHero style={style} />
                <AnimatePresence>
                  {showWelcome && style && (
                    <ProfileWelcome style={style} onDismiss={dismissWelcome} />
                  )}
                </AnimatePresence>
                <HeroStats style={style} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <SignalBars axisScores={axisScores} attrScores={attrScores} style={style} />
                  <div className="flex flex-col items-center">
                    <QuadrantPlot who={axisScores.who} why={axisScores.why} what={axisScores.what} how={axisScores.how} size={300} />
                    <div className="mt-4 p-5 bg-bg-surface/60 border border-white/[0.06] rounded-2xl w-full">
                      <div className="text-[10px] text-text-muted uppercase tracking-widest mb-2">Quadrant Detail</div>
                      <p className="text-sm text-text-primary leading-relaxed">{style.quadDetail}</p>
                    </div>
                    <AxonCallout text={style.neuro} />
                  </div>
                </div>
                <ActivationTeaser style={style} onOpen={() => setShowActivation(true)} />
                {nugget && (
                  <div className="mt-8">
                    <NuggetCard nugget={nugget} />
                  </div>
                )}
              </div>
            )}
            {activeTab === 1 && <StyleTab style={style} axisScores={axisScores} />}
            {activeTab === 2 && <ApplyItTab style={style} />}
            {activeTab === 3 && <GoDeeperTab style={style} />}
            {activeTab === 4 && <GrowthPathTab style={style} />}
          </motion.div>
        </AnimatePresence>
      </main>
      <PageFooter />
    </div>
  )
}
