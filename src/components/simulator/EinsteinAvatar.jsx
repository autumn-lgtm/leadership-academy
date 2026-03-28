import einsteinImg from '../../assets/einstein-mascot.png'

export default function EinsteinAvatar({ size = 120, style: customStyle, className = '' }) {
  return (
    <img
      src={einsteinImg}
      alt="Einstein — your NeuroLeader guide"
      width={size}
      height={size}
      className={`einstein-float select-none pointer-events-none ${className}`}
      style={{
        objectFit: 'contain',
        filter: 'drop-shadow(0 4px 20px rgba(0, 200, 255, 0.15))',
        ...customStyle,
      }}
    />
  )
}
