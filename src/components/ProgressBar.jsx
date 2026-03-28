import { motion } from 'framer-motion'

export default function ProgressBar({ progress, label }) {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-text-muted">{label}</span>
          <span className="text-sm font-semibold text-cyan">{Math.round(progress)}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-bg-surface2 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-cyan to-purple"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
