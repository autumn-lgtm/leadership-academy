import { getDeltaTier, getDeltaCopy, getAxisDeltaCopy } from '../../data/profileIntelligence'

const mascotImg = `${import.meta.env.BASE_URL}axon-final.webp`

export function StressDeltaCard({ profile }) {
  // stressDelta from scoring engine: { deltas: { who, why, what, how }, stressProfile, baseline, pressure }
  const stressDeltaData = profile?.stressDelta
  const axisScores = profile?.axisScores || profile?.quadrant || {}

  if (!stressDeltaData?.deltas || !axisScores.who) return null

  const deltas = stressDeltaData.deltas

  const AXES = ['who', 'why', 'what', 'how']
  const AXIS_LABELS = { who: 'WHO', why: 'WHY', what: 'WHAT', how: 'HOW' }
  const AXIS_COLORS = { who: '#B88AFF', why: '#00C8FF', what: '#FFB340', how: '#00E896' }

  const totalDelta = AXES.reduce((sum, axis) =>
    sum + Math.abs(deltas[axis] || 0), 0) / AXES.length

  const biggestDrop = AXES.reduce((max, axis) => {
    const drop = deltas[axis] || 0
    return drop < (deltas[max] || 0) ? axis : max
  }, 'who')

  const dominantAxis = Object.entries(axisScores)
    .filter(([k]) => AXES.includes(k))
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'who'

  const tier = getDeltaTier(totalDelta)
  const deltaCopy = getDeltaCopy(tier)
  const axisCopy = tier === 'large' ? getAxisDeltaCopy(biggestDrop) : null

  const tierColors = {
    small:  { color: '#00E896', bg: 'rgba(0,232,150,0.08)',   border: 'rgba(0,232,150,0.2)',   label: 'Stable' },
    medium: { color: '#FFB340', bg: 'rgba(255,179,64,0.08)',  border: 'rgba(255,179,64,0.2)',  label: 'Moderate shift' },
    large:  { color: '#FF6B6B', bg: 'rgba(255,107,107,0.08)', border: 'rgba(255,107,107,0.2)', label: 'Significant shift' },
  }
  const tc = tierColors[tier]

  return (
    <div style={{
      background: '#0D1426',
      border: `1px solid ${tc.border}`,
      borderTop: `3px solid ${tc.color}`,
      borderRadius: 12,
      padding: '24px 28px',
      marginBottom: 16,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', marginBottom: 20,
        flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <div style={{
            fontSize: 10, fontWeight: 700, color: tc.color,
            letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6,
          }}>
            Your stress delta
          </div>
          <div style={{
            fontSize: 24, fontWeight: 700,
            fontFamily: 'JetBrains Mono, monospace', color: tc.color,
          }}>
            -{Math.round(Math.abs(totalDelta))} pts under pressure
          </div>
        </div>
        <div style={{
          padding: '6px 14px', borderRadius: 6,
          background: tc.bg, border: `1px solid ${tc.border}`,
          fontSize: 11, fontWeight: 700, color: tc.color,
          letterSpacing: '0.06em', alignSelf: 'flex-start',
        }}>
          {tc.label}
        </div>
      </div>

      {/* Axis comparison bars */}
      <div style={{ marginBottom: 24 }}>
        {AXES.map(axis => {
          const calm = axisScores[axis] || 0
          const delta = deltas[axis] || 0
          const pressure = Math.max(0, Math.min(100, calm + delta))
          const color = AXIS_COLORS[axis]
          const isDrop = delta < -5

          return (
            <div key={axis} style={{ marginBottom: 16 }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                marginBottom: 6, alignItems: 'center',
              }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, color,
                  letterSpacing: '0.1em',
                }}>
                  {AXIS_LABELS[axis]}
                </span>
                <span style={{
                  fontSize: 12,
                  color: isDrop ? '#FF6B6B' : 'rgba(255,255,255,0.35)',
                  fontFamily: 'JetBrains Mono, monospace',
                }}>
                  {Math.round(calm)} → {Math.round(pressure)}
                  {isDrop && ` (${Math.round(delta)})`}
                </span>
              </div>
              {/* Calm bar */}
              <div style={{
                height: 5, background: 'rgba(255,255,255,0.06)',
                borderRadius: 3, marginBottom: 3, overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', width: `${calm}%`,
                  background: color, borderRadius: 3, opacity: 0.35,
                }} />
              </div>
              {/* Pressure bar */}
              <div style={{
                height: 5, background: 'rgba(255,255,255,0.06)',
                borderRadius: 3, overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', width: `${pressure}%`,
                  background: isDrop ? '#FF6B6B' : color,
                  borderRadius: 3,
                }} />
              </div>
            </div>
          )
        })}
        <div style={{ display: 'flex', gap: 20, marginTop: 4 }}>
          {[['rgba(255,255,255,0.2)', 'Calm'], ['rgba(255,255,255,0.6)', 'Under pressure']].map(([bg, label]) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 11, color: 'rgba(255,255,255,0.35)',
            }}>
              <div style={{ width: 16, height: 4, borderRadius: 2, background: bg }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Narrative */}
      {deltaCopy.paragraphs.map((para, i) => (
        <p key={i} style={{
          fontSize: 14, color: 'rgba(255,255,255,0.75)',
          lineHeight: 1.65, margin: '0 0 14px',
        }}>
          {para.replace('[DOMINANT_AXIS]', AXIS_LABELS[dominantAxis])}
        </p>
      ))}

      {/* Axis-specific copy for large delta */}
      {axisCopy && (
        <div style={{
          marginTop: 16, paddingTop: 16,
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{
            fontSize: 10, fontWeight: 700,
            color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em',
            textTransform: 'uppercase', marginBottom: 10,
          }}>
            Your biggest drop: {AXIS_LABELS[biggestDrop]}
          </div>
          <p style={{
            fontSize: 14, color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.65, margin: 0,
          }}>
            {axisCopy}
          </p>
        </div>
      )}

      {/* Axon line */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        background: 'rgba(255,179,64,0.06)',
        border: '1px solid rgba(255,179,64,0.15)',
        borderRadius: 8, padding: '12px 16px', marginTop: 20,
      }}>
        <img
          src={mascotImg}
          alt="Axon"
          style={{ width: 36, flexShrink: 0, mixBlendMode: 'screen' }}
        />
        <p style={{
          fontSize: 13, color: '#FFB340', fontStyle: 'italic',
          lineHeight: 1.6, margin: 0,
        }}>
          &ldquo;{deltaCopy.axonLine}&rdquo;
        </p>
      </div>
    </div>
  )
}
