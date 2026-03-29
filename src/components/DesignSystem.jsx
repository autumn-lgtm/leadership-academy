import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

/**
 * Shared design components for consistent visual language.
 * Import these instead of recreating patterns per-screen.
 */

// ── Section Header ────────────────────────────────────────
// The standard section intro used on every page.

export function SectionHeader({ tag, title, highlight, subtitle, center = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={center ? 'text-center' : ''}
    >
      {tag && (
        <h2 className="font-display text-xs font-bold text-text-muted uppercase tracking-[6px] mb-4">
          {tag}
        </h2>
      )}
      <p className="font-display text-4xl md:text-5xl font-bold text-white">
        {title}{' '}
        {highlight && (
          <span className="bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
            {highlight}
          </span>
        )}
      </p>
      {subtitle && (
        <p className="text-base text-text-muted max-w-lg mx-auto mt-4 leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}

// ── Rainbow Divider ───────────────────────────────────────
// Thin gradient line for visual separation.

export function RainbowDivider({ className = '' }) {
  return <div className={`rainbow-line w-full ${className}`} />
}

// ── Neural Grid Section ───────────────────────────────────
// Wraps content in the subtle dot-grid background.

export function NeuralSection({ children, className = '' }) {
  return (
    <section className={`relative neural-grid ${className}`}>
      {children}
    </section>
  )
}

// ── Glow Card ─────────────────────────────────────────────
// Standard card with hover glow effect.

export function GlowCard({ children, color = '#00C8FF', className = '', onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ borderColor: `${color}30` }}
      onClick={onClick}
      className={`group relative bg-bg-surface/60 border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-500 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: `inset 0 0 40px ${color}06, 0 0 30px ${color}04` }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  )
}

// ── Page Footer ───────────────────────────────────────────
// Consistent footer for inner pages (not Home).

export function PageFooter() {
  return (
    <footer className="relative mt-16">
      <RainbowDivider />
      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan via-purple to-coral flex items-center justify-center">
              <span className="text-white font-display font-bold text-xs">N</span>
            </div>
            <span className="font-display font-bold text-white text-sm">NeuroLeader</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/assessment" className="text-xs text-text-muted hover:text-white transition-colors">Assessment</Link>
            <Link to="/profile" className="text-xs text-text-muted hover:text-white transition-colors">Profile</Link>
            <Link to="/simulator" className="text-xs text-text-muted hover:text-white transition-colors">Simulator</Link>
          </div>
          <div className="flex items-center gap-4">
            {['#FF6B6B', '#FFB340', '#00E896', '#00C8FF', '#B88AFF'].map((c, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full opacity-40" style={{ background: c }} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ── Stat Block ────────────────────────────────────────────
// Compact stat display used across pages.

export function StatBlock({ value, label, color = '#00C8FF' }) {
  return (
    <div className="p-5 rounded-2xl bg-bg-surface/60 border border-white/[0.06] text-center">
      <div className="font-display text-2xl font-bold" style={{ color }}>{value}</div>
      <div className="text-[10px] text-text-muted mt-1 uppercase tracking-widest">{label}</div>
    </div>
  )
}

// ── Gradient Badge ────────────────────────────────────────
// Small pill badge with gradient or colored background.

export function Badge({ children, color = '#00C8FF' }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest"
      style={{ background: `${color}15`, color }}
    >
      {children}
    </span>
  )
}

// ── Axon Quote Block ──────────────────────────────────────
// Inline Axon insight — smaller than the full mascot.

export function AxonQuote({ text, color = '#B88AFF' }) {
  return (
    <div
      className="rounded-2xl p-5 border"
      style={{
        borderColor: `${color}20`,
        background: `linear-gradient(135deg, ${color}08, rgba(0,200,255,0.03))`,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-display font-bold"
          style={{ background: `${color}20`, color }}
        >
          A
        </div>
        <div>
          <div className="text-[10px] font-display font-bold uppercase tracking-widest mb-1" style={{ color }}>
            Axon-ism
          </div>
          <p className="text-sm text-text-primary leading-relaxed italic">"{text}"</p>
        </div>
      </div>
    </div>
  )
}
