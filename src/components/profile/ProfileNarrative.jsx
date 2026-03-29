import { useState } from 'react'
import { getFormationNarrative, getPatternCopy } from '../../data/profileIntelligence'

const mascotImg = `${import.meta.env.BASE_URL}axon-final.webp`

export function ProfileNarrative({ profile }) {
  const [expanded, setExpanded] = useState(false)

  const styleName = profile?.dominantStyle || profile?.quadrant?.style || 'diplomatic'
  const narrative = getFormationNarrative(styleName)
  const patterns = profile?.responsePatterns || []
  const patternCopy = patterns[0] ? getPatternCopy(patterns[0]) : null

  return (
    <div style={{
      background: '#0D1426',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 12,
      padding: '24px 28px',
      marginBottom: 16,
    }}>
      <div style={{
        fontSize: 10, fontWeight: 700, color: '#00C8FF',
        letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14,
      }}>
        Why your Map took this shape
      </div>

      {narrative.paragraphs.map((para, i) => (
        <p key={i} style={{
          fontSize: 15, color: 'rgba(255,255,255,0.8)',
          lineHeight: 1.7, margin: '0 0 16px',
        }}>
          {para}
        </p>
      ))}

      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        background: 'rgba(255,179,64,0.06)',
        border: '1px solid rgba(255,179,64,0.15)',
        borderRadius: 8, padding: '12px 16px', marginTop: 8,
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
          &ldquo;{narrative.axonLine}&rdquo;
        </p>
      </div>

      {patternCopy && (
        <div style={{ marginTop: 20 }}>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 600, color: '#00C8FF',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', gap: 6, padding: 0,
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            {expanded ? 'Hide' : 'See'} what your responses revealed
            <span style={{ fontSize: 10 }}>{expanded ? '▲' : '▼'}</span>
          </button>

          {expanded && (
            <div style={{
              marginTop: 16, paddingTop: 16,
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{
                fontSize: 10, fontWeight: 700, color: '#B88AFF',
                letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10,
              }}>
                Response pattern: {patternCopy.label}
              </div>
              {patternCopy.paragraphs.map((para, i) => (
                <p key={i} style={{
                  fontSize: 14, color: 'rgba(255,255,255,0.7)',
                  lineHeight: 1.65, margin: '0 0 14px',
                }}>
                  {para}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
