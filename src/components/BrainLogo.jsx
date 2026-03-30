export default function BrainLogo({ size = 32, className = '' }) {
  const s = size
  return (
    <div
      className={`flex items-center justify-center rounded-xl shrink-0 ${className}`}
      style={{
        width: s,
        height: s,
        background: 'linear-gradient(135deg, #200c40 0%, #0b1e35 100%)',
        boxShadow: '0 0 16px rgba(184,138,255,0.30), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      <svg width={s * 0.68} height={s * 0.68} viewBox="0 0 22 22" fill="none">
        {/* Left hemisphere */}
        <path
          d="M11 3 C8.5 3 6.2 4.2 5 6.5 C3.7 9 3.9 12.2 5 14.3 C5.9 16 7.6 17.3 9.5 17.8 L11 18.2"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1.1"
          fill="rgba(184,138,255,0.07)"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Right hemisphere */}
        <path
          d="M11 3 C13.5 3 15.8 4.2 17 6.5 C18.3 9 18.1 12.2 17 14.3 C16.1 16 14.4 17.3 12.5 17.8 L11 18.2"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1.1"
          fill="rgba(0,200,255,0.05)"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Bottom stem connector */}
        <path
          d="M9 18 Q11 19.8 13 18"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="0.9"
          fill="none"
          strokeLinecap="round"
        />
        {/* Center divide */}
        <line x1="11" y1="3" x2="11" y2="18.2" stroke="rgba(255,255,255,0.16)" strokeWidth="0.7" />
        {/* Left wrinkles */}
        <path d="M6.2 8 Q7.8 7 8.8 9" stroke="rgba(255,255,255,0.32)" strokeWidth="0.75" fill="none" strokeLinecap="round"/>
        <path d="M5.5 12.5 Q7 11.5 8.5 13.2" stroke="rgba(255,255,255,0.28)" strokeWidth="0.65" fill="none" strokeLinecap="round"/>
        {/* Right wrinkles */}
        <path d="M15.8 8 Q14.2 7 13.2 9" stroke="rgba(255,255,255,0.32)" strokeWidth="0.75" fill="none" strokeLinecap="round"/>
        <path d="M16.5 12.5 Q15 11.5 13.5 13.2" stroke="rgba(255,255,255,0.28)" strokeWidth="0.65" fill="none" strokeLinecap="round"/>
        {/* Four axis accent nodes */}
        <circle cx="7.2" cy="9.5" r="1.3" fill="#B88AFF" opacity="0.95"/> {/* WHO — purple */}
        <circle cx="14.8" cy="9.5" r="1.3" fill="#00C8FF" opacity="0.95"/> {/* WHY — cyan */}
        <circle cx="7.2" cy="14.5" r="1.2" fill="#00E896" opacity="0.85"/> {/* WHAT — green */}
        <circle cx="14.8" cy="14.5" r="1.2" fill="#FFB340" opacity="0.85"/> {/* HOW — amber */}
        {/* Glow halos on dominant nodes */}
        <circle cx="7.2" cy="9.5" r="2.8" fill="#B88AFF" opacity="0.10"/>
        <circle cx="14.8" cy="9.5" r="2.8" fill="#00C8FF" opacity="0.10"/>
      </svg>
    </div>
  )
}
