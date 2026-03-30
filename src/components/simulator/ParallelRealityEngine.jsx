// src/components/simulator/ParallelRealityEngine.jsx

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { runParallelReality } from '../../lib/parallelReality'
import { getScenariosForStyle } from '../../data/scenarios'

const AXON_IMG = `${import.meta.env.BASE_URL}axon-final.webp`

function ScoreBar({ score, color }) {
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
          Predicted effectiveness
        </span>
        <span className="text-xs font-bold font-mono" style={{ color }}>
          {score}/100
        </span>
      </div>
      <div className="h-1 bg-white/[0.08] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
    </div>
  )
}

function OutcomeCard({ label, outcome, color, message }) {
  return (
    <div
      className="flex-1 min-w-0 rounded-2xl p-5"
      style={{
        background: 'rgba(13,20,38,0.8)',
        border: `1px solid ${color}30`,
        borderTop: `2px solid ${color}`,
      }}
    >
      <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color }}>
        {label}
      </div>

      <div
        className="rounded-xl px-4 py-3 mb-4 text-sm italic leading-relaxed"
        style={{
          background: `${color}08`,
          border: `1px solid ${color}20`,
          color: 'rgba(255,255,255,0.85)',
        }}
      >
        &ldquo;{message}&rdquo;
      </div>

      {[
        { label: 'They read it as', value: outcome.interpretation },
        { label: 'They feel',       value: outcome.emotionalResponse },
        { label: 'They do',         value: outcome.behavioralResponse },
        { label: 'What follows',    value: outcome.downstreamImpact },
      ].map(({ label, value }) => (
        <div key={label} className="mb-2.5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-0.5">
            {label}
          </div>
          <div className="text-sm text-white/75 leading-snug">{value}</div>
        </div>
      ))}

      <ScoreBar score={outcome.score} color={color} />
    </div>
  )
}

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

  return (
    <div className="py-8">

      {/* Header */}
      <div className="mb-8">
        <div className="text-[10px] font-bold uppercase tracking-widest text-cyan mb-2">
          Parallel Reality Engine
        </div>
        <h2 className="font-display text-2xl font-bold text-white mb-2 tracking-tight">
          See how your message lands.
        </h2>
        <p className="text-sm text-text-muted leading-relaxed max-w-lg">
          Pick a real leadership scenario. See your natural response versus the optimized version —
          then the full causal chain: interpretation, emotion, behavior, downstream impact.
        </p>
      </div>

      {/* Scenario grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
        {scenarios.map((scenario, idx) => (
          <button
            key={scenario.id}
            onClick={() => handleSelect(scenario.id)}
            className={`text-left rounded-2xl p-4 border transition-all duration-200 ${
              selectedId === scenario.id
                ? 'border-cyan/40 bg-cyan/[0.08]'
                : 'border-white/[0.06] bg-bg-surface/60 hover:border-white/10 hover:bg-bg-surface'
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-amber mb-2">
              {String(idx + 1).padStart(2, '0')}
            </div>
            <div className="text-sm font-bold text-white mb-1.5 leading-snug">
              {scenario.title}
            </div>
            <div className="text-xs text-text-muted leading-relaxed italic">
              {scenario.tension}
            </div>
          </button>
        ))}
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={result.scenario.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Context strip */}
            <div className="bg-bg-surface/60 border border-white/[0.06] rounded-2xl px-6 py-4 mb-5">
              <p className="text-sm text-text-muted mb-2">{result.scenario.description}</p>
              <p className="text-sm font-semibold text-amber">
                The tension: {result.scenario.tension}
              </p>
            </div>

            {/* Side-by-side outcome cards */}
            <div className="flex gap-4 mb-5 flex-wrap">
              <OutcomeCard
                label="Your natural response"
                outcome={result.naturalOutcome}
                color="#FF6B6B"
                message={result.naturalMessage}
              />
              <OutcomeCard
                label="Optimized for impact"
                outcome={result.optimizedOutcome}
                color="#00E896"
                message={result.optimizedMessage}
              />
            </div>

            {/* Gap score */}
            <div className="bg-bg-surface/60 border border-cyan/[0.15] rounded-2xl px-6 py-4 mb-5 flex items-center gap-5">
              <motion.div
                className="font-mono text-4xl font-black text-cyan shrink-0"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 240, damping: 18 }}
              >
                +{result.gapScore}
              </motion.div>
              <div>
                <div className="text-sm font-bold text-white mb-1">Effectiveness gap</div>
                <div className="text-sm text-text-muted leading-snug">
                  The distance between your natural delivery and what this moment requires.
                </div>
              </div>
            </div>

            {/* Axon line */}
            <div className="bg-amber/[0.06] border border-amber/20 rounded-2xl px-5 py-4 flex items-start gap-3 mb-6">
              <img
                src={AXON_IMG}
                alt="Axon"
                style={{
                  width: 44, height: 'auto', flexShrink: 0,
                  mixBlendMode: 'screen',
                  filter: 'drop-shadow(0 0 20px rgba(0,200,255,0.25))',
                }}
              />
              <p className="text-sm text-amber italic leading-relaxed">
                &ldquo;{result.axonLine}&rdquo;
              </p>
            </div>

            {/* CTA */}
            <div className="text-center">
              <p className="text-sm text-text-muted mb-3">How would you actually say it?</p>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('neuroleader:navigate', { detail: 'say-it-their-way' }))}
                className="px-7 py-3 rounded-2xl font-display font-bold text-sm transition-all hover:opacity-90"
                style={{ background: '#00C8FF', color: '#060A0E' }}
              >
                Try with your own words →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
