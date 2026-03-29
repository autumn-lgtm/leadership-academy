import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import BrainOrbit from '../components/BrainOrbit'
import { SectionHeader, RainbowDivider, NeuralSection, GlowCard, AxonQuote } from '../components/DesignSystem'

const features = [
  {
    title: 'Leadership Map',
    desc: 'Answer real scenarios, map your signals, and discover which of four leadership styles fits you best.',
    color: '#00C8FF',
    link: '/assessment',
    cta: 'Take the Map',
    icon: '01',
  },
  {
    title: 'Profile Lab',
    desc: 'See your results come alive with interactive plots, personalized insights, and team complement analysis.',
    color: '#B88AFF',
    link: '/profile',
    cta: 'View Profile',
    icon: '02',
  },
  {
    title: 'Communication Simulator',
    desc: 'Decode how others lead, translate your message into their style, and bridge the gap — with AI help.',
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
    <div className="min-h-screen overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/60 backdrop-blur-2xl border-b border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan via-purple to-coral flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">N</span>
            </div>
            <span className="font-display font-bold text-white text-lg tracking-tight">NeuroLeader</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/assessment" className="text-sm text-text-muted hover:text-white transition-colors hidden md:block">Map</Link>
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
              Take the Map
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
      <NeuralSection className="py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-surface/50 to-transparent pointer-events-none" />
        <RainbowDivider className="absolute top-0" />
        <div className="max-w-6xl mx-auto px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeader tag="The Four Neural Axes" title="How your brain" highlight="leads" />

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
      </NeuralSection>

      {/* Features — editorial stacked layout */}
      <section className="py-28">
        <div className="max-w-6xl mx-auto px-8">
          <SectionHeader tag="The Platform" title="Three tools." highlight="One system." />
          <div className="mt-16"></div>

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

      {/* Meet Axon */}
      <NeuralSection className="py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-surface/40 to-transparent pointer-events-none" />
        <RainbowDivider className="absolute top-0" />
        <div className="max-w-6xl mx-auto px-8 relative">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center md:text-left"
            >
              <h2 className="font-display text-xs font-bold text-text-muted uppercase tracking-[6px] mb-4">Your Guide</h2>
              <p className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                Meet <span className="bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">Axon.</span>
              </p>
              <p className="text-base text-text-muted max-w-lg leading-relaxed mb-6">
                Axon breaks down the science of leadership into stuff you can actually use.
                No jargon. No lectures. Just smart, honest insights about how your brain
                shapes the way you lead.
              </p>
              <AxonQuote text="The best leaders aren't born. They're wired through practice." />
              <Link
                to="/simulator"
                className="group inline-flex items-center gap-2.5 mt-6 text-sm font-semibold text-cyan hover:text-white transition-colors"
              >
                Explore Brain → Behavior
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </motion.div>
          </div>
        </div>
        <RainbowDivider className="absolute bottom-0" />
      </NeuralSection>

      {/* Four Styles — 2x2 grid */}
      <NeuralSection className="py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-surface/30 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-8 relative">
          <SectionHeader tag="Leadership Styles" title="Which one are" highlight="you?" />
          <div className="mt-16"></div>

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
      </NeuralSection>

      {/* Footer */}
      <footer className="relative">
        <RainbowDivider />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-surface/40 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-8 py-16 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div>
              <Link to="/" className="flex items-center gap-2.5 mb-4 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan via-purple to-coral flex items-center justify-center">
                  <span className="text-white font-display font-bold text-sm">N</span>
                </div>
                <span className="font-display font-bold text-white text-lg">NeuroLeader</span>
              </Link>
              <p className="text-sm text-text-muted leading-relaxed max-w-xs">
                Neuroscience-informed leadership development. Map your brain. Understand your style. Bridge the gap.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-display text-xs font-bold text-text-muted uppercase tracking-[4px] mb-5">Explore</h4>
              <div className="flex flex-col gap-3">
                <Link to="/assessment" className="text-sm text-text-muted hover:text-white transition-colors">Leadership Map</Link>
                <Link to="/profile" className="text-sm text-text-muted hover:text-white transition-colors">Profile Lab</Link>
                <Link to="/simulator" className="text-sm text-text-muted hover:text-white transition-colors">Communication Simulator</Link>
              </div>
            </div>

            {/* Neural Axes quick ref */}
            <div>
              <h4 className="font-display text-xs font-bold text-text-muted uppercase tracking-[4px] mb-5">The Four Axes</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'WHO', color: '#B88AFF' },
                  { label: 'WHY', color: '#00C8FF' },
                  { label: 'WHAT', color: '#00E896' },
                  { label: 'HOW', color: '#FFB340' },
                ].map(a => (
                  <div key={a.label} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: a.color }} />
                    <span className="text-sm text-text-muted">{a.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              {['#FF6B6B', '#FFB340', '#00E896', '#00C8FF', '#B88AFF'].map((c, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full opacity-40" style={{ background: c }} />
              ))}
            </div>
            <p className="text-xs text-text-muted/40">Built on neuroscience. Designed for leaders.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
