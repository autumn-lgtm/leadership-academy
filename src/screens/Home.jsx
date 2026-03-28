import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import BrainOrbit from '../components/BrainOrbit'

const features = [
  {
    title: 'Leadership Assessment',
    desc: 'Discover your leadership style through scenarios, signal mapping, and attribute profiling across 4 neural axes.',
    color: '#00C8FF',
    link: '/assessment',
    cta: 'Take Assessment',
    icon: '01',
  },
  {
    title: 'Profile Lab',
    desc: 'Explore your results with interactive quadrant plots, neuroscience insights, and team complement analysis.',
    color: '#B88AFF',
    link: '/profile',
    cta: 'View Profile',
    icon: '02',
  },
  {
    title: 'Communication Simulator',
    desc: 'Decode others\' styles, map your signals, and translate messages across all four leadership styles with AI.',
    color: '#00E896',
    link: '/simulator',
    cta: 'Open Simulator',
    icon: '03',
  },
]

const styles = [
  { name: 'Diplomatic', sub: 'The Bridge-Builder', color: '#B88AFF', axes: 'WHO + WHY', desc: 'Leads with empathy, shared values, and coalition-building' },
  { name: 'Strategic', sub: 'The Visionary', color: '#00C8FF', axes: 'WHY + WHAT', desc: 'Leads with vision, frameworks, and systems thinking' },
  { name: 'Tactical', sub: 'The Operator', color: '#FFB340', axes: 'WHO + HOW', desc: 'Leads with speed, directness, and measurable results' },
  { name: 'Logistical', sub: 'The Architect', color: '#00E896', axes: 'WHAT + HOW', desc: 'Leads with process, structure, and reliable execution' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-primary overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/60 backdrop-blur-2xl border-b border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan via-purple to-coral flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">N</span>
            </div>
            <span className="font-display font-bold text-white text-lg tracking-tight">NeuroLeader</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/assessment" className="text-sm text-text-muted hover:text-white transition-colors hidden md:block">Assessment</Link>
            <Link to="/profile" className="text-sm text-text-muted hover:text-white transition-colors hidden md:block">Profile</Link>
            <Link to="/simulator" className="text-sm text-text-muted hover:text-white transition-colors hidden md:block">Simulator</Link>
            <Link
              to="/assessment"
              className="px-5 py-2 rounded-full bg-white text-bg-primary text-sm font-semibold hover:bg-white/90 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero — Centered brain above, text below */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16">
        {/* Background radial glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[120px]"
            style={{ background: 'radial-gradient(circle, rgba(0,200,255,0.08) 0%, rgba(184,138,255,0.04) 50%, transparent 100%)' }} />
          <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] rounded-full blur-[100px] bg-purple/[0.04]" />
          <div className="absolute top-[40%] right-[15%] w-[250px] h-[250px] rounded-full blur-[100px] bg-coral/[0.03]" />
        </div>

        {/* Brain — centered hero element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mb-8"
        >
          <BrainOrbit size={380} />
        </motion.div>

        {/* Text — centered below brain */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 text-center max-w-2xl mx-auto px-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] mb-6"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
            <span className="text-xs text-text-muted font-medium tracking-wide">Neuroscience-informed leadership</span>
          </motion.div>

          <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1] tracking-tight mb-5">
            <span className="text-white">Map your </span>
            <span className="bg-gradient-to-r from-coral via-amber via-green via-cyan to-purple bg-clip-text text-transparent">
              leadership
            </span>
            <span className="text-white"> brain.</span>
          </h1>

          <p className="text-base md:text-lg text-text-muted max-w-lg mx-auto mb-8 leading-relaxed">
            Discover how you lead across four neural axes.
            Understand your style. Decode others. Bridge the gap.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/assessment"
              className="group px-8 py-3.5 rounded-2xl bg-white text-bg-primary font-bold text-sm hover:bg-white/90 transition-all flex items-center gap-2.5"
            >
              Start Assessment
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/profile"
              className="px-8 py-3.5 rounded-2xl border border-white/10 text-white font-semibold text-sm hover:bg-white/5 transition-all"
            >
              View Profile
            </Link>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-1.5 rounded-full bg-white/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* Four Axes — horizontal scroll-like strip */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-surface/50 to-transparent" />
        <div className="max-w-6xl mx-auto px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <h2 className="font-display text-xs font-bold text-text-muted uppercase tracking-[6px] mb-4">The Four Neural Axes</h2>
              <p className="font-display text-4xl md:text-5xl font-bold text-white">
                How your brain <span className="bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">leads</span>
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'WHO', desc: 'People & Relationships', long: 'Empathy, trust, team dynamics, interpersonal connection', color: '#B88AFF', icon: '◐' },
                { label: 'WHY', desc: 'Purpose & Vision', long: 'Meaning, strategy, long-term thinking, values alignment', color: '#00C8FF', icon: '◎' },
                { label: 'WHAT', desc: 'Systems & Structure', long: 'Process, organization, architecture, reliable execution', color: '#00E896', icon: '◈' },
                { label: 'HOW', desc: 'Speed & Execution', long: 'Action, results, decisiveness, real-time adaptation', color: '#FFB340', icon: '◆' },
              ].map((axis, i) => (
                <motion.div
                  key={axis.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative bg-bg-surface/80 backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6 hover:border-white/10 transition-all duration-500 hover:-translate-y-1"
                  style={{ '--glow': axis.color }}
                >
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ boxShadow: `inset 0 0 40px ${axis.color}08, 0 0 30px ${axis.color}06` }} />
                  <div className="relative">
                    <div className="text-2xl mb-3 opacity-40">{axis.icon}</div>
                    <div className="font-display text-3xl font-extrabold mb-1 tracking-tight" style={{ color: axis.color }}>{axis.label}</div>
                    <div className="text-sm font-semibold text-white mb-2">{axis.desc}</div>
                    <div className="text-xs text-text-muted leading-relaxed">{axis.long}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features — editorial stacked layout */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-xs font-bold text-text-muted uppercase tracking-[6px] mb-4">The Platform</h2>
            <p className="font-display text-4xl md:text-5xl font-bold text-white">
              Three tools. <span className="bg-gradient-to-r from-amber to-coral bg-clip-text text-transparent">One system.</span>
            </p>
          </motion.div>

          <div className="space-y-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={f.link}
                  className="group flex flex-col md:flex-row items-start md:items-center gap-6 bg-bg-surface/60 border border-white/[0.06] rounded-2xl p-8 hover:border-white/10 transition-all duration-500 hover:bg-bg-surface"
                >
                  <div className="shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center font-display text-2xl font-extrabold"
                    style={{ background: `${f.color}10`, color: f.color }}>
                    {f.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-xl font-bold text-white mb-1 group-hover:text-white transition-colors">
                      {f.title}
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed">{f.desc}</p>
                  </div>
                  <div className="shrink-0 text-sm font-semibold transition-all group-hover:translate-x-1" style={{ color: f.color }}>
                    {f.cta} →
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Four Styles — 2x2 grid */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-surface/30 to-transparent" />
        <div className="max-w-6xl mx-auto px-8 relative">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-xs font-bold text-text-muted uppercase tracking-[6px] mb-4">Leadership Styles</h2>
            <p className="font-display text-4xl md:text-5xl font-bold text-white">
              Which one are <span className="bg-gradient-to-r from-green to-cyan bg-clip-text text-transparent">you?</span>
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {styles.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group bg-bg-surface/60 border border-white/[0.06] rounded-2xl p-8 hover:border-white/10 transition-all duration-500"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="font-display text-2xl font-extrabold mb-0.5" style={{ color: s.color }}>{s.name}</div>
                    <div className="text-sm text-text-muted">{s.sub}</div>
                  </div>
                  <div className="text-xs px-3 py-1 rounded-full font-semibold"
                    style={{ background: `${s.color}12`, color: s.color }}>
                    {s.axes}
                  </div>
                </div>
                <p className="text-sm text-text-muted leading-relaxed">{s.desc}</p>
                <div className="mt-4 w-full h-px" style={{ background: `linear-gradient(to right, ${s.color}30, transparent)` }} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/assessment"
              className="group inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-white text-bg-primary font-bold text-base hover:bg-white/90 transition-all"
            >
              Discover your style
              <span className="text-lg transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-12">
        <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan via-purple to-coral flex items-center justify-center">
              <span className="text-white font-display font-bold text-xs">N</span>
            </div>
            <span className="font-display font-bold text-text-muted">NeuroLeader</span>
          </div>
          <div className="flex items-center gap-8">
            <Link to="/assessment" className="text-xs text-text-muted hover:text-white transition-colors">Assessment</Link>
            <Link to="/profile" className="text-xs text-text-muted hover:text-white transition-colors">Profile</Link>
            <Link to="/simulator" className="text-xs text-text-muted hover:text-white transition-colors">Simulator</Link>
          </div>
          <p className="text-xs text-text-muted/50">Neuroscience-informed leadership development</p>
        </div>
      </footer>
    </div>
  )
}
