import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RECOVERY_BEATS } from '../../data/questions'
import { GAP_PROMPT } from '../../utils/sliderTransforms'
import { getRecoveryQuote } from '../../data/quotes'
import AxonMascot from '../simulator/AxonMascot'

// ── Celebration particles ──────────────────────────────────────────
export function CelebrationBurst({ color = '#00C8FF' }) {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    angle: (i / 20) * Math.PI * 2,
    distance: 40 + Math.random() * 60,
    size: 3 + Math.random() * 4,
    delay: Math.random() * 0.2,
  }))
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ width: p.size, height: p.size, background: color }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: Math.cos(p.angle) * p.distance, y: Math.sin(p.angle) * p.distance, opacity: 0, scale: 0 }}
          transition={{ duration: 0.8, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

// ── Onboarding Screen ──────────────────────────────────────────────
export function Onboarding({ onStart }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4"
    >
      <AxonMascot size={140} mood="idle" showQuip={false} entrance="portal" />
      <h1 className="font-display text-4xl md:text-5xl font-bold text-white mt-6 mb-4">
        Your Leadership Map
      </h1>
      <p className="text-base text-text-muted max-w-md leading-relaxed mb-3">
        52 questions. 6 sections. About 18 minutes.
      </p>
      <p className="text-sm text-text-muted max-w-md leading-relaxed mb-2">
        This is not a test. There are no right answers. The only way to get a useful profile is to answer honestly — not as your best self, but as your real one.
      </p>
      <p className="text-sm text-text-muted max-w-md leading-relaxed mb-8">
        Your data stays on your device. Nothing is sent to a server.
      </p>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onStart}
        className="group px-10 py-4 rounded-2xl bg-white text-bg-primary font-bold text-base hover:bg-white/90 transition-all flex items-center gap-2"
      >
        Begin the Map
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </motion.button>
    </motion.div>
  )
}

// ── Recovery Screen ────────────────────────────────────────────────
export function RecoveryScreen({ beat, onContinue }) {
  const data = RECOVERY_BEATS.find(r => r.beat === beat)
  const quote = getRecoveryQuote(beat)

  useEffect(() => {
    if (data?.autoAdvance) {
      const t = setTimeout(onContinue, data.autoAdvance)
      return () => clearTimeout(t)
    }
  }, [data, onContinue])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
    >
      <CelebrationBurst color="#B88AFF" />
      <div className="mb-6">
        <AxonMascot size={100} mood="thinking" showQuip={false} entrance="portal" />
      </div>
      {quote && (
        <blockquote className="max-w-lg">
          <p className="font-display text-2xl md:text-3xl font-bold text-white leading-snug mb-3">
            &ldquo;{quote.text}&rdquo;
          </p>
          <cite className="text-sm text-text-muted not-italic">&mdash; {quote.attribution}</cite>
        </blockquote>
      )}
      {data?.tap && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          onClick={onContinue}
          className="mt-10 px-8 py-3.5 rounded-2xl bg-white/10 text-white font-medium text-sm hover:bg-white/15 transition-all"
        >
          Tap to continue
        </motion.button>
      )}
      {beat === 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <div className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-purple/30 border-t-purple animate-spin" />
          <p className="text-sm text-text-muted">Building your profile...</p>
        </motion.div>
      )}
    </motion.div>
  )
}

// ── Gap Prompt Screen ──────────────────────────────────────────────
export function GapPromptScreen({ sliderItems, onSelect }) {
  const [selected, setSelected] = useState(null)
  const scorableItems = sliderItems.filter(s => s.direction !== 'trap')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl mx-auto"
    >
      <h2 className="font-display text-3xl font-bold text-white mb-2">{GAP_PROMPT.preText}</h2>
      {GAP_PROMPT.promptLines.map((line, i) => (
        <p key={i} className="text-base text-text-muted leading-relaxed mb-2">{line}</p>
      ))}
      <p className="text-sm text-cyan font-medium mt-4 mb-6">{GAP_PROMPT.instruction}</p>
      <div className="space-y-2">
        {scorableItems.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.01 }}
            onClick={() => setSelected(item.position)}
            className={`w-full text-left p-4 rounded-xl border transition-all ${
              selected === item.position
                ? 'border-cyan bg-cyan/10'
                : 'border-white/[0.06] bg-bg-surface/60 hover:border-white/10'
            }`}
          >
            <span className="text-sm text-text-primary">{item.question}</span>
          </motion.button>
        ))}
      </div>
      {selected !== null && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-center">
          <p className="text-xs text-text-muted mb-4">{GAP_PROMPT.postText}</p>
          <button
            onClick={() => onSelect(selected)}
            className="px-8 py-3.5 rounded-2xl bg-white text-bg-primary font-bold text-sm hover:bg-white/90 transition-all"
          >
            Continue
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}

// ── Scenario Question (Section A, D) ───────────────────────────────
export function ScenarioQuestion({ question, questionIndex, totalQuestions, onSelect, selected }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        {Array.from({ length: totalQuestions }, (_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{
              background: i < questionIndex ? '#00C8FF'
                : i === questionIndex ? 'rgba(0,200,255,0.4)'
                : 'rgba(255,255,255,0.06)'
            }}
          />
        ))}
      </div>
      <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-8 leading-snug whitespace-pre-line">
        {question.prompt}
      </h3>
      <div className="space-y-3">
        {question.options.map((option, optIdx) => (
          <motion.button
            key={optIdx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: optIdx * 0.08 }}
            onClick={() => onSelect(optIdx)}
            disabled={selected !== null}
            className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 ${
              selected === optIdx
                ? 'border-cyan bg-cyan/10 shadow-[0_0_30px_rgba(0,200,255,0.12)] scale-[1.01]'
                : selected !== null
                ? 'border-white/[0.04] bg-bg-surface/40 opacity-40'
                : 'border-white/[0.06] bg-bg-surface/60 hover:border-white/10 hover:bg-bg-surface hover:scale-[1.01]'
            }`}
          >
            <span className={`text-base leading-relaxed ${
              selected === optIdx ? 'text-cyan font-medium' : 'text-text-primary'
            }`}>
              {option.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// ── Forced Choice (Section C, some E, EQ-3) ────────────────────────
export function ForcedChoiceQuestion({ question, questionIndex, totalQuestions, onSelect, selected }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        {Array.from({ length: totalQuestions }, (_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{
              background: i < questionIndex ? '#B88AFF'
                : i === questionIndex ? 'rgba(184,138,255,0.4)'
                : 'rgba(255,255,255,0.06)'
            }}
          />
        ))}
      </div>
      <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-8 leading-snug whitespace-pre-line">
        {question.prompt}
      </h3>
      <div className="space-y-3">
        {question.options.map((option, optIdx) => (
          <motion.button
            key={optIdx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: optIdx * 0.1 }}
            onClick={() => onSelect(optIdx)}
            disabled={selected !== null}
            className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 ${
              selected === optIdx
                ? 'border-purple bg-purple/10 shadow-[0_0_30px_rgba(184,138,255,0.12)] scale-[1.01]'
                : selected !== null
                ? 'border-white/[0.04] bg-bg-surface/40 opacity-40'
                : 'border-white/[0.06] bg-bg-surface/60 hover:border-white/10 hover:bg-bg-surface hover:scale-[1.01]'
            }`}
          >
            <span className={`text-base leading-relaxed ${
              selected === optIdx ? 'text-purple font-medium' : 'text-text-primary'
            }`}>
              {option.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// ── Slider Question (Section B, EQ-2) ──────────────────────────────
export function SliderQuestion({ item, value, onChange }) {
  return (
    <div className="p-5 rounded-2xl bg-bg-surface/60 border border-white/[0.06]">
      {item.recallPrompt && (
        <p className="text-xs text-cyan/70 italic mb-2">{item.recallPrompt}</p>
      )}
      <label className="block text-base font-medium text-white mb-4">{item.question || item.prompt}</label>
      <div className="flex items-center gap-4">
        <span className="text-xs text-text-muted w-28 text-right shrink-0">{item.pole0?.substring(0, 40) || 'Low'}</span>
        <input
          type="range" min="0" max="100"
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="flex-1"
          style={{
            background: `linear-gradient(to right, #00C8FF ${value}%, rgba(255,255,255,0.06) ${value}%)`
          }}
        />
        <span className="text-xs text-text-muted w-28 shrink-0">{item.pole100?.substring(0, 40) || 'High'}</span>
      </div>
      <div className="text-center mt-2">
        <span className="text-sm font-bold text-cyan">{value}</span>
      </div>
    </div>
  )
}

// ── Word Bank Question (Section F) ─────────────────────────────────
export function WordBankQuestion({ bank, selected, onToggle }) {
  return (
    <div>
      <h3 className="font-display text-xl font-bold text-white mb-2">{bank.prompt}</h3>
      <p className="text-xs text-text-muted mb-6">Tap all that apply. Go fast.</p>
      <div className="flex flex-wrap gap-2">
        {bank.words.map((word) => {
          const isSelected = selected.includes(word)
          return (
            <motion.button
              key={word}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onToggle(word)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                isSelected
                  ? 'bg-green/20 border border-green text-green'
                  : 'bg-bg-surface/60 border border-white/[0.06] text-text-primary hover:border-white/10'
              }`}
            >
              {word}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

// ── Section Header ─────────────────────────────────────────────────
export function SectionHeader({ section, intro }) {
  return (
    <div className="mb-10">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] mb-4">
        <div className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
        <span className="text-xs text-text-muted font-medium tracking-widest uppercase">
          Section {section}
        </span>
      </div>
      <p className="text-base text-text-muted leading-relaxed max-w-lg">{intro}</p>
    </div>
  )
}

// ── Encouragement Toast ────────────────────────────────────────────
const ENCOURAGE = [
  'Great choice.',
  'Interesting pattern emerging...',
  'Your style is taking shape.',
  'That says a lot about how you lead.',
  'The picture is getting clearer.',
  'Almost there — powerful insights ahead.',
  'Noted.',
  'Honest answer. Good.',
]

export function EncouragementToast({ show, index }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-6 text-center"
        >
          <span className="text-base text-cyan font-medium">{ENCOURAGE[index % ENCOURAGE.length]}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
