import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const features = [
  {
    title: 'Leadership Assessment',
    desc: 'Discover your leadership style through scenarios, signal mapping, and attribute profiling across 4 axes.',
    color: '#00C8FF',
    link: '/assessment',
    cta: 'Take Assessment',
  },
  {
    title: 'Profile Lab',
    desc: 'Explore your results with interactive quadrant plots, neuroscience insights, and team complement analysis.',
    color: '#B88AFF',
    link: '/profile',
    cta: 'View Profile',
  },
  {
    title: 'Communication Simulator',
    desc: 'Decode others\' styles, map your signals, and translate messages across all four leadership styles.',
    color: '#00E896',
    link: '/simulator',
    cta: 'Open Simulator',
  },
]

const axes = [
  { label: 'WHO', desc: 'People & Relationships', color: '#B88AFF' },
  { label: 'WHY', desc: 'Purpose & Vision', color: '#00C8FF' },
  { label: 'WHAT', desc: 'Systems & Structure', color: '#00E896' },
  { label: 'HOW', desc: 'Speed & Execution', color: '#FFB340' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan/5 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto px-6 pt-20 pb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan to-purple flex items-center justify-center">
                <span className="text-white font-display font-bold text-2xl">N</span>
              </div>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-text-primary mb-4 tracking-tight">
              Neuro<span className="text-cyan">Leader</span>
            </h1>
            <p className="text-lg text-text-muted max-w-2xl mx-auto mb-2">
              Neuroscience-informed leadership development
            </p>
            <p className="text-sm text-text-muted/60 max-w-xl mx-auto mb-10">
              Map your leadership style across four neural axes. Understand how you lead,
              how others lead, and how to bridge the gap.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link
                to="/assessment"
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan to-purple text-white font-semibold shadow-[0_0_30px_rgba(0,200,255,0.3)] hover:shadow-[0_0_40px_rgba(0,200,255,0.5)] transition-all"
              >
                Start Assessment
              </Link>
              <Link
                to="/profile"
                className="px-8 py-3.5 rounded-xl border border-white/10 text-text-primary hover:bg-white/5 transition-all"
              >
                View Profile
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 4 Axes */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-center font-display text-sm font-bold text-text-muted uppercase tracking-[4px] mb-8">
            Four Neural Axes
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {axes.map((axis, i) => (
              <motion.div
                key={axis.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="bg-bg-surface border border-white/8 rounded-xl p-5 text-center"
              >
                <div className="font-display text-2xl font-bold mb-1" style={{ color: axis.color }}>
                  {axis.label}
                </div>
                <div className="text-xs text-text-muted">{axis.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              <Link
                to={f.link}
                className="block bg-bg-surface border border-white/8 rounded-xl p-6 hover:border-white/15 transition-all group h-full"
              >
                <div className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center" style={{ background: `${f.color}15` }}>
                  <div className="w-3 h-3 rounded-full" style={{ background: f.color }} />
                </div>
                <h3 className="font-display text-lg font-bold text-text-primary mb-2 group-hover:text-cyan transition-colors">
                  {f.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed mb-4">{f.desc}</p>
                <span className="text-xs font-semibold" style={{ color: f.color }}>
                  {f.cta} →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Four Styles Grid */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-center font-display text-sm font-bold text-text-muted uppercase tracking-[4px] mb-8">
          Four Leadership Styles
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: 'Diplomatic', sub: 'The Bridge-Builder', color: '#B88AFF', axes: 'WHO + WHY' },
            { name: 'Strategic', sub: 'The Visionary', color: '#00C8FF', axes: 'WHY + WHAT' },
            { name: 'Tactical', sub: 'The Operator', color: '#FFB340', axes: 'WHO + HOW' },
            { name: 'Logistical', sub: 'The Architect', color: '#00E896', axes: 'WHAT + HOW' },
          ].map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="bg-bg-surface border border-white/8 rounded-xl p-6 text-center"
            >
              <div className="font-display text-xl font-bold mb-1" style={{ color: s.color }}>{s.name}</div>
              <div className="text-sm text-text-muted mb-2">{s.sub}</div>
              <div className="text-xs px-3 py-1 rounded-full inline-block" style={{ background: `${s.color}15`, color: s.color }}>
                {s.axes}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-6 py-8 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-cyan to-purple flex items-center justify-center">
              <span className="text-white font-display font-bold text-xs">N</span>
            </div>
            <span className="text-sm font-display font-semibold text-text-muted">NeuroLeader</span>
          </div>
          <p className="text-xs text-text-muted">Neuroscience-informed leadership development</p>
        </div>
      </footer>
    </div>
  )
}
