import { motion } from 'framer-motion'

export default function ScenarioQuestion({ question, index, selected, onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="mb-8"
    >
      <h3 className="font-display text-lg font-semibold text-text-primary mb-4">
        {index + 1}. {question.text}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {question.options.map((option, optIdx) => (
          <button
            key={optIdx}
            onClick={() => onSelect(optIdx)}
            className={`text-left p-4 rounded-xl border transition-all duration-200 ${
              selected === optIdx
                ? 'border-cyan bg-cyan/10 shadow-[0_0_20px_rgba(0,200,255,0.15)]'
                : 'border-white/8 bg-bg-surface hover:border-white/15 hover:bg-bg-surface2'
            }`}
          >
            <span className={`text-sm leading-relaxed ${
              selected === optIdx ? 'text-cyan' : 'text-text-primary'
            }`}>
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  )
}
