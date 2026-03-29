// src/components/simulator/ParallelRealityEngine.jsx

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { runParallelReality } from '../../lib/parallelReality'
import { getScenariosForStyle } from '../../data/scenarios'
import { AxonQuote } from '../DesignSystem'

const AXON_IMG = `${import.meta.env.BASE_URL}axon-final.webp`

const AXIS_COLORS = { who: '#B88AFF', why: '#00C8FF', what: '#00E896', how: '#FFB340' }

function resolveStyle(profile) {
  if (profile?.dominantStyle) return profile.dominantStyle
  if (profile?.style) return profile.style
  try {
    const stored = JSON.parse(localStorage.getItem('neuroleader_profile') || '{}')
    return stored.dominantStyle || 'diplomatic'
  } catch {
    return 'diplomatic'
  }
}

function ScoreBar({ score, color }) {
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Predicted effectiveness
        </span>
        <span className="font-display font-black text-lg tabular-nums" style={{ color }}>
          {score}
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: color }}
        />
      </div>
    </div>
  )
}

function CausalStep({ index, label, value, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.07 }}
      className="flex gap-3 items-start mb-3"
    >
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-display font-black text-[9px]"
        style={{ background: `${color}18`, border: `1px solid ${color}35`, color }}
      >
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[9px] font-bold uppercase tracking-[0.12em] mb-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
          {label}
        </div>
        <div className="text-sm leading-snug" style={{ color: 'rgba(255,255,255,0.8)' }}>
          {value}
        </div>
      </div>
    </motion.div>
  )
}

function OutcomeCard({ label, outcome, color, message, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 140, damping: 18 }}
      className="flex-1 min-w-0 rounded-2xl overflow-hidden"
      style={{
        background: '#0D1426',
        border: `1px solid ${color}25`,
        borderTop: `3px solid ${color}`,
      }}
    >
      <div className="p-6">
        {/* Label */}
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] mb-4" style={{ color }}>
          {label}
        </div>

        {/* Message blockquote */}
        <div
          className="rounded-xl p-4 mb-5 relative overflow-hidden"
          style={{ background: `${color}08`, border: `1px solid ${color}18` }}
        >
          <div
            className="absolute right-2 top-1 font-display font-black text-5xl leading-none pointer-events-none select-none"
            style={{ color: `${color}10` }}
          >
            "
          </div>
          <p className="text-sm leading-relaxed italic relative" style={{ color: 'rgba(255,255,255,0.85)' }}>
            {message}
          </p>
        </div>

        {/* Causal chain */}
        {[
          { label: 'They read it as', value: outcome.interpretation },
          { label: 'They feel',       value: outcome.emotionalResponse },
          { label: 'They do',         value: outcome.behavioralResponse },
          { label: 'What follows',    value: outcome.downstreamImpact },
        ].map((step, i) => (
          <CausalStep key={step.label} index={i} label={step.label} value={step.value} color={color} />
        ))}

        <ScoreBar score={outcome.score} color={color} />
      </div>
    </motion.div>
  )
}

export function ParallelRealityEngine({ profile }) {
  const [selectedId, setSelectedId] = useState(null)
  const [result, setResult] = useState(null)

  const style = resolveStyle(profile)
  const scenarios = getScenariosForStyle(style)

  function handleSelect(id) {
    setSelectedId(id)
    const resolvedProfile = profile || (() => {
      try { return JSON.parse(localStorage.getItem('neuroleader_profile') || '{}') } catch { return {} }
    })()
    const res = runParallelReality(id, resolvedProfile)
    setResult(res)
  }

  const styleScores = result ? (() => {
    const scores = {
      diplomatic: Math.round(result.naturalOutcome.score * (style === 'diplomatic' ? 1 : 0.7) + result.optimizedOutcome.score * (style === 'diplomatic' ? 0 : 0.15)),
      strategic:  Math.round(result.naturalOutcome.score * (style === 'strategic'  ? 1 : 0.7) + result.optimizedOutcome.score * (style === 'strategic'  ? 0 : 0.15)),
      logistical: Math.round(result.naturalOutcome.score * (style === 'logistical' ? 1 : 0.7) + result.optimizedOutcome.score * (style === 'logistical' ? 0 : 0.15)),
      tactical:   Math.round(result.naturalOutcome.score * (style === 'tactical'   ? 1 : 0.7) + result.optimizedOutcome.score * (style === 'tactical'   ? 0 : 0.15)),
    }
    scores[style] = result.naturalOutcome.score
    return scores
  })() : null

  return (
    <div>
      {/* Editorial header */}
      <div className="mb-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted/60 mb-3">Parallel Reality Engine</p>
        <h1 className="font-display text-4xl md:text-5xl font-black text-white leading-none mb-3">
          Two Versions<br />
          <span className="bg-gradient-to-r from-coral to-purple bg-clip-text text-transparent">
            of the Same Moment
          </span>
        </h1>
        <p className="text-text-muted text-sm max-w-md leading-relaxed">
          Pick a scenario. See your natural response versus the optimized version — then follow the full causal chain out.
        </p>
      </div>

      {/* Scenario selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
        {scenarios.map((scenario, idx) => {
          const active = selectedId === scenario.id
          return (
            <button
              key={scenario.id}
              onClick={() => handleSelect(scenario.id)}
              className="relative overflow-hidden text-left rounded-2xl border p-5 transition-all hover:scale-[1.01]"
              style={active ? {
                borderColor: 'rgba(0,200,255,0.3)',
                background: 'rgba(0,200,255,0.06)',
              } : {
                borderColor: 'rgba(255,255,255,0.06)',
                background: '#0D1422',
              }}
            >
              {/* Watermark number */}
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 font-display font-black text-[72px] leading-none pointer-events-none select-none"
                style={{ color: active ? 'rgba(0,200,255,0.07)' : 'rgba(255,255,255,0.03)' }}
              >
                {String(idx + 1).padStart(2, '0')}
              </div>

              <div className="relative">
                {/* Number pill */}
                <div
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider mb-2"
                  style={active ? {
                    background: 'rgba(0,200,255,0.15)', color: '#00C8FF', border: '1px solid rgba(0,200,255,0.3)',
                  } : {
                    background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </div>

                <div className="font-display font-bold text-sm text-white mb-1.5 leading-snug">
                  {scenario.title}
                </div>
                <div className="text-[11px] italic leading-snug" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {scenario.tension}
                </div>

                {/* Stakes + charge pills */}
                <div className="flex gap-1.5 mt-3">
                  {scenario.stakes && (
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(255,107,107,0.08)', color: '#FF6B6B', border: '1px solid rgba(255,107,107,0.15)' }}
                    >
                      {scenario.stakes} stakes
                    </span>
                  )}
                  {scenario.emotionalCharge && (
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(255,179,64,0.08)', color: '#FFB340', border: '1px solid rgba(255,179,64,0.15)' }}
                    >
                      {scenario.emotionalCharge} charge
                    </span>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={result.scenario.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Scenario context strip */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border p-5 mb-6"
              style={{ background: '#0D1422', borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                The situation
              </div>
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {result.scenario.description}
              </p>
              <div className="flex items-start gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider shrink-0 mt-0.5" style={{ color: '#FFB340' }}>
                  The tension:
                </span>
                <span className="text-sm font-medium" style={{ color: '#FFB340' }}>
                  {result.scenario.tension}
                </span>
              </div>
            </motion.div>

            {/* Before / After cards */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <OutcomeCard
                label="Your natural response"
                outcome={result.naturalOutcome}
                color="#FF6B6B"
                message={result.naturalMessage}
                delay={0.05}
              />
              <OutcomeCard
                label="Optimized for impact"
                outcome={result.optimizedOutcome}
                color="#00E896"
                message={result.optimizedMessage}
                delay={0.15}
              />
            </div>

            {/* Gap score */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="rounded-2xl border p-5 mb-4 flex items-center gap-5"
              style={{ background: '#0D1422', borderColor: 'rgba(0,200,255,0.15)' }}
            >
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.14em] mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  Effectiveness gap
                </div>
                <motion.div
                  className="font-display font-black leading-none tabular-nums"
                  style={{ fontSize: 48, color: '#00C8FF' }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                >
                  +{result.gapScore}
                </motion.div>
              </div>
              <div className="flex-1">
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  The distance between your natural delivery and what this moment requires.
                  {result.gapScore >= 30 && ' A large gap means the adjustment is learnable — and worth it.'}
                  {result.gapScore < 15 && ' A small gap means your style is already close. Small refinements move the needle.'}
                </p>
              </div>
            </motion.div>

            {/* Style effectiveness comparison */}
            {styleScores && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="rounded-2xl border p-5 mb-6"
                style={{ background: '#0D1422', borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <div className="text-[10px] font-bold uppercase tracking-[0.14em] mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  Natural effectiveness by style
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'diplomatic', label: 'Diplomatic', color: '#B88AFF' },
                    { key: 'strategic',  label: 'Strategic',  color: '#00C8FF' },
                    { key: 'tactical',   label: 'Tactical',   color: '#FFB340' },
                    { key: 'logistical', label: 'Logistical', color: '#00E896' },
                  ].map((s, i) => {
                    const score = styleScores[s.key]
                    const isUser = s.key === style
                    return (
                      <motion.div
                        key={s.key}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.05 }}
                        className="rounded-xl p-3"
                        style={{
                          background: isUser ? `${s.color}10` : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${isUser ? s.color + '30' : 'rgba(255,255,255,0.05)'}`,
                        }}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[11px] font-bold" style={{ color: isUser ? s.color : 'rgba(255,255,255,0.4)' }}>
                            {s.label}{isUser ? ' ← you' : ''}
                          </span>
                          <span className="font-display font-black text-base tabular-nums" style={{ color: isUser ? s.color : 'rgba(255,255,255,0.3)' }}>
                            {score}
                          </span>
                        </div>
                        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                          <motion.div
                            className="h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${score}%` }}
                            transition={{ delay: 0.45 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            style={{ background: isUser ? s.color : 'rgba(255,255,255,0.15)' }}
                          />
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
                <p className="text-[10px] mt-3" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  Natural delivery scores — what each style produces in this moment without coaching.
                </p>
              </motion.div>
            )}

            {/* Axon callout */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <AxonQuote text={result.axonLine} />
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="mt-6 text-center"
            >
              <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>How would you actually say it?</p>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('neuroleader:navigate', { detail: 'say-it-their-way' }))}
                className="group inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm transition-all"
                style={{
                  background: 'linear-gradient(to right, #FF6B6B, #B88AFF)',
                  color: '#fff',
                  boxShadow: '0 0 24px rgba(255,107,107,0.2)',
                }}
              >
                Try with your own words
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!result && (
        <div className="text-center py-12" style={{ color: 'rgba(255,255,255,0.2)' }}>
          <div className="font-display font-black text-4xl mb-3" style={{ color: 'rgba(255,255,255,0.06)' }}>→</div>
          <p className="text-sm">Pick a scenario above to see both realities.</p>
        </div>
      )}
    </div>
  )
}
