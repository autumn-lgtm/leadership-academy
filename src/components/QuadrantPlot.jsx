import { motion } from 'framer-motion'

const QUADRANT_LABELS = [
  { label: 'DIPLOMATIC', sub: 'People + Purpose', x: '25%', y: '25%', color: '#B88AFF' },
  { label: 'STRATEGIC', sub: 'Purpose + Systems', x: '75%', y: '25%', color: '#00C8FF' },
  { label: 'TACTICAL', sub: 'People + Execution', x: '25%', y: '75%', color: '#FFB340' },
  { label: 'LOGISTICAL', sub: 'Systems + Execution', x: '75%', y: '75%', color: '#00E896' },
]

export default function QuadrantPlot({ who = 50, why = 50, what = 50, how = 50, size = 320, compareAxes = null, compareLabel = null }) {
  // Map axes to x,y position
  // X axis: WHO (left) vs WHAT (right) — people vs systems
  // Y axis: WHY (top) vs HOW (bottom) — purpose vs execution
  const x = ((100 - who + what) / 200) * 100
  const y = ((100 - why + how) / 200) * 100

  const cx = compareAxes ? ((100 - compareAxes.who + compareAxes.what) / 200) * 100 : null
  const cy = compareAxes ? ((100 - compareAxes.why + compareAxes.how) / 200) * 100 : null

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100" className="absolute inset-0">
        {/* Background quadrants */}
        <rect x="0" y="0" width="50" height="50" fill="rgba(184,138,255,0.06)" />
        <rect x="50" y="0" width="50" height="50" fill="rgba(0,200,255,0.06)" />
        <rect x="0" y="50" width="50" height="50" fill="rgba(255,179,64,0.06)" />
        <rect x="50" y="50" width="50" height="50" fill="rgba(0,232,150,0.06)" />

        {/* Grid lines */}
        <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />

        {/* Axis labels */}
        <text x="2" y="52" fill="#B88AFF" fontSize="3.5" fontWeight="600" fontFamily="Syne, sans-serif">WHO</text>
        <text x="88" y="52" fill="#00E896" fontSize="3.5" fontWeight="600" fontFamily="Syne, sans-serif">WHAT</text>
        <text x="48" y="5" fill="#00C8FF" fontSize="3.5" fontWeight="600" fontFamily="Syne, sans-serif" textAnchor="middle">WHY</text>
        <text x="48" y="98" fill="#FFB340" fontSize="3.5" fontWeight="600" fontFamily="Syne, sans-serif" textAnchor="middle">HOW</text>

        {/* Dashed connecting line between primary and compare dots */}
        {compareAxes && (
          <line
            x1={x} y1={y} x2={cx} y2={cy}
            stroke="rgba(255,255,255,0.12)"
            strokeDasharray="2,3"
            strokeWidth="0.5"
          />
        )}
      </svg>

      {/* Quadrant labels */}
      {QUADRANT_LABELS.map((q, i) => (
        <div
          key={i}
          className="absolute text-center pointer-events-none"
          style={{ left: q.x, top: q.y, transform: 'translate(-50%, -50%)' }}
        >
          <div className="text-[9px] font-display font-bold tracking-wider opacity-40" style={{ color: q.color }}>
            {q.label}
          </div>
          <div className="text-[7px] text-text-muted opacity-30">{q.sub}</div>
        </div>
      ))}

      {/* Compare dot (second dot, dimmer style, no pulsing ring) */}
      {compareAxes && (
        <div
          className="absolute w-3 h-3 rounded-full pointer-events-none"
          style={{
            background: 'rgba(255,255,255,0.5)',
            boxShadow: '0 0 10px rgba(255,255,255,0.2)',
            left: `calc(${cx}% - 6px)`,
            top: `calc(${cy}% - 6px)`,
          }}
        >
          {compareLabel && (
            <div
              className="absolute pointer-events-none whitespace-nowrap"
              style={{
                fontSize: '7px',
                color: 'rgba(255,255,255,0.4)',
                top: '14px',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              {compareLabel}
            </div>
          )}
        </div>
      )}

      {/* Animated marker */}
      <motion.div
        className="absolute w-5 h-5 rounded-full"
        style={{
          background: 'radial-gradient(circle, #00C8FF 0%, rgba(0,200,255,0.3) 70%)',
          boxShadow: '0 0 20px rgba(0,200,255,0.5), 0 0 40px rgba(0,200,255,0.2)',
        }}
        animate={{
          left: `calc(${x}% - 10px)`,
          top: `calc(${y}% - 10px)`,
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      />

      {/* Pulsing ring around marker */}
      <motion.div
        className="absolute w-8 h-8 rounded-full border border-cyan/30"
        animate={{
          left: `calc(${x}% - 16px)`,
          top: `calc(${y}% - 16px)`,
          scale: [1, 1.5, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          left: { type: 'spring', stiffness: 100, damping: 20 },
          top: { type: 'spring', stiffness: 100, damping: 20 },
          scale: { duration: 2, repeat: Infinity },
          opacity: { duration: 2, repeat: Infinity },
        }}
      />
    </div>
  )
}
