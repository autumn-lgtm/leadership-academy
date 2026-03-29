import { useEffect } from 'react'
import { markNuggetShown } from '../../data/nuggets'
import { useDwellTime } from '../../hooks/useDwellTime'

const CATEGORY_STYLES = {
  science: { label: 'SCIENCE', color: '#00C8FF' },
  theory:  { label: 'THEORY',  color: '#B88AFF' },
  practice: { label: 'PRACTICE', color: '#00E896' },
}

export default function NuggetCard({ nugget }) {
  const ref = useDwellTime('nugget', nugget.id)

  useEffect(() => {
    markNuggetShown(nugget.id)
  }, [nugget.id])

  const cat = CATEGORY_STYLES[nugget.category] || CATEGORY_STYLES.science

  return (
    <div
      ref={ref}
      className="rounded-2xl bg-bg-surface/60 border border-white/[0.06] overflow-hidden"
      style={{ borderTop: `2px solid #FFB340` }}
    >
      <div className="p-6">
        {/* Category badge + attribution */}
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest"
            style={{ background: `${cat.color}15`, color: cat.color }}
          >
            {cat.label}
          </span>
          {nugget.attribution === 'leader' && (
            <span style={{
              fontSize: 10, fontWeight: 600, color: '#FFB340',
              background: 'rgba(255,179,64,0.1)', border: '1px solid rgba(255,179,64,0.25)',
              borderRadius: 4, padding: '2px 7px', letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>From a leader</span>
          )}
        </div>

        {/* Nugget text */}
        <p className="text-base text-white leading-relaxed mb-5">
          {nugget.text}
        </p>

        {/* Axon line */}
        <p className="text-sm text-text-muted italic border-t border-white/[0.06] pt-4">
          &ldquo;{nugget.axonLine}&rdquo;
        </p>
      </div>
    </div>
  )
}
