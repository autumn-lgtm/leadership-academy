import { motion } from 'framer-motion'

export default function AttrSlider({ question, index, value, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="mb-6 p-5 rounded-xl bg-bg-surface border border-white/8"
    >
      <label className="block text-sm font-medium text-text-primary mb-3">
        {question.label}
      </label>
      <div className="flex items-center gap-4">
        <span className="text-xs text-text-muted w-20 text-right shrink-0">{question.lo}</span>
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1"
          style={{
            background: `linear-gradient(to right, ${question.color} ${value}%, #1a2a3a ${value}%)`
          }}
        />
        <span className="text-xs text-text-muted w-20 shrink-0">{question.hi}</span>
      </div>
      <div className="text-center mt-1">
        <span className="text-xs font-semibold" style={{ color: question.color }}>{value}</span>
      </div>
    </motion.div>
  )
}
