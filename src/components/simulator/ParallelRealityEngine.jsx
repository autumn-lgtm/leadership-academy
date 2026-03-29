// src/components/simulator/ParallelRealityEngine.jsx
// The core simulation UI — shows natural vs optimized side by side
// with full causal chain output

import { useState } from 'react'
import { runParallelReality } from '../../lib/parallelReality'
import { getScenariosForStyle } from '../../data/scenarios'

const AXON_IMG = `${import.meta.env.BASE_URL}axon-final.webp`

const COLORS = {
  bg: '#050810', panel: '#0A0F1E', card: '#0D1426',
  cyan: '#00C8FF', purple: '#B88AFF', amber: '#FFB340',
  green: '#00E896', coral: '#FF6B6B',
  muted: 'rgba(255,255,255,0.5)', dim: 'rgba(255,255,255,0.25)',
}

function ScoreBar({ score, color }) {
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Predicted effectiveness
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, color, fontFamily: 'monospace' }}>
          {score}/100
        </span>
      </div>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${score}%`,
          background: color,
          borderRadius: 2,
          transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)',
        }} />
      </div>
    </div>
  )
}

function OutcomeCard({ label, outcome, color, message }) {
  return (
    <div style={{
      flex: 1, background: COLORS.card,
      border: `1px solid ${color}30`,
      borderTop: `2px solid ${color}`,
      borderRadius: 12, padding: 20,
      minWidth: 0,
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, color, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
        {label}
      </div>

      {/* The message */}
      <div style={{
        background: `${color}08`, border: `1px solid ${color}20`,
        borderRadius: 8, padding: '12px 14px', marginBottom: 16,
        fontSize: 13, color: 'rgba(255,255,255,0.85)',
        lineHeight: 1.6, fontStyle: 'italic',
      }}>
        &ldquo;{message}&rdquo;
      </div>

      {/* Causal chain */}
      {[
        { label: 'They read it as', value: outcome.interpretation },
        { label: 'They feel', value: outcome.emotionalResponse },
        { label: 'They do', value: outcome.behavioralResponse },
        { label: 'What follows', value: outcome.downstreamImpact },
      ].map(({ label, value }) => (
        <div key={label} style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: COLORS.dim, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>
            {label}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
            {value}
          </div>
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
    <div style={{ padding: '32px 0' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.cyan, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>
          Parallel Reality Engine
        </div>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 28, color: '#fff', marginBottom: 8, letterSpacing: '-0.02em' }}>
          See how your message lands.
        </h2>
        <p style={{ fontSize: 15, color: COLORS.muted, lineHeight: 1.6, maxWidth: 560 }}>
          Pick a real leadership scenario. See your natural response versus the optimized version.
          Then see the full causal chain — interpretation, emotion, behavior, downstream impact.
        </p>
      </div>

      {/* Scenario selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12, marginBottom: 40 }}>
        {scenarios.map(scenario => (
          <button
            key={scenario.id}
            onClick={() => handleSelect(scenario.id)}
            style={{
              background: selectedId === scenario.id ? `${COLORS.cyan}12` : COLORS.panel,
              border: `1px solid ${selectedId === scenario.id ? COLORS.cyan : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 10, padding: '14px 16px', textAlign: 'left',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            <div style={{ fontSize: 11, color: COLORS.amber, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
              {scenario.id}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 6, lineHeight: 1.3 }}>
              {scenario.title}
            </div>
            <div style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.5, fontStyle: 'italic' }}>
              {scenario.tension}
            </div>
          </button>
        ))}
      </div>

      {/* Results */}
      {result && (
        <div>
          {/* Scenario context */}
          <div style={{
            background: COLORS.panel, border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12, padding: '20px 24px', marginBottom: 24,
          }}>
            <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 8 }}>
              {result.scenario.description}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.amber }}>
              The tension: {result.scenario.tension}
            </div>
          </div>

          {/* Side by side comparison */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
            <OutcomeCard
              label="Your natural response"
              outcome={result.naturalOutcome}
              color={COLORS.coral}
              message={result.naturalMessage}
            />
            <OutcomeCard
              label="Optimized for impact"
              outcome={result.optimizedOutcome}
              color={COLORS.green}
              message={result.optimizedMessage}
            />
          </div>

          {/* Gap score */}
          <div style={{
            background: COLORS.panel, border: '1px solid rgba(0,200,255,0.15)',
            borderRadius: 12, padding: '16px 20px', marginBottom: 20,
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <div style={{
              fontFamily: 'monospace', fontSize: 32, fontWeight: 700,
              color: COLORS.cyan, minWidth: 80,
            }}>
              +{result.gapScore}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
                Effectiveness gap
              </div>
              <div style={{ fontSize: 13, color: COLORS.muted }}>
                The distance between your natural delivery and what this moment requires.
              </div>
            </div>
          </div>

          {/* Axon line */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 14,
            background: 'rgba(255,179,64,0.06)',
            border: '1px solid rgba(255,179,64,0.15)',
            borderRadius: 12, padding: '14px 18px',
          }}>
            <img
              src={AXON_IMG}
              alt="Axon"
              style={{ width: 44, height: 'auto', flexShrink: 0, mixBlendMode: 'screen', filter: 'drop-shadow(0 0 20px rgba(0,200,255,0.25))' }}
            />
            <p style={{ fontSize: 14, color: COLORS.amber, fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>
              &ldquo;{result.axonLine}&rdquo;
            </p>
          </div>

          {/* Try it yourself CTA */}
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: COLORS.muted, marginBottom: 12 }}>
              How would you actually say it?
            </p>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('neuroleader:navigate', { detail: 'say-it-their-way' }))}
              style={{
                background: COLORS.cyan, color: '#050810',
                border: 'none', borderRadius: 10, padding: '12px 28px',
                fontFamily: 'Syne, sans-serif', fontWeight: 700,
                fontSize: 14, cursor: 'pointer',
              }}
            >
              Try with your own words →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
