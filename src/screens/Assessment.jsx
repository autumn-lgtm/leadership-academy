import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SECTIONS } from '../data/questions'
import { computeScores, computeStyle } from '../data/scoring'
import { STYLES } from '../data/styles'
import QuadrantPlot from '../components/QuadrantPlot'

const ENCOURAGE = [
  'Great choice.',
  'Interesting pattern emerging...',
  'Your style is taking shape.',
  'That says a lot about how you lead.',
  'The picture is getting clearer.',
  'Almost there — powerful insights ahead.',
]

const SECTION_INTROS = [
  { title: 'Scenario Responses', sub: 'How would you handle each situation? Pick the response that feels most natural — not the "right" answer.', icon: '01' },
  { title: 'Leadership Signals', sub: 'Where do you fall on each spectrum? Slide toward your honest default, not your aspirational self.', icon: '02' },
  { title: 'Leadership Attributes', sub: 'Rate yourself on each dimension. This calibrates the nuance of your profile.', icon: '03' },
]

function CelebrationBurst({ color = '#00C8FF' }) {
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
          style={{
            width: p.size,
            height: p.size,
            background: color,
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos(p.angle) * p.distance,
            y: Math.sin(p.angle) * p.distance,
            opacity: 0,
            scale: 0,
          }}
          transition={{ duration: 0.8, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

function LiveInsight({ answers }) {
  const partialWho = answers.scenarios.reduce((s, idx, qi) => {
    if (idx === null) return s
    const opt = SECTIONS[0].questions[qi]?.options[idx]
    return s + (opt?.axes.who || 0)
  }, 0)
  const partialWhy = answers.scenarios.reduce((s, idx, qi) => {
    if (idx === null) return s
    const opt = SECTIONS[0].questions[qi]?.options[idx]
    return s + (opt?.axes.why || 0)
  }, 0)
  const partialWhat = answers.scenarios.reduce((s, idx, qi) => {
    if (idx === null) return s
    const opt = SECTIONS[0].questions[qi]?.options[idx]
    return s + (opt?.axes.what || 0)
  }, 0)
  const partialHow = answers.scenarios.reduce((s, idx, qi) => {
    if (idx === null) return s
    const opt = SECTIONS[0].questions[qi]?.options[idx]
    return s + (opt?.axes.how || 0)
  }, 0)

  const answered = answers.scenarios.filter(a => a !== null).length
  if (answered < 2) return null

  const max = Math.max(partialWho, partialWhy, partialWhat, partialHow, 1)
  const norm = { who: (partialWho / max) * 80 + 10, why: (partialWhy / max) * 80 + 10, what: (partialWhat / max) * 80 + 10, how: (partialHow / max) * 80 + 10 }
  const style = computeStyle(norm.who, norm.why, norm.what, norm.how)
  const styleData = STYLES[style]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-4 p-4 rounded-2xl bg-bg-surface/80 border border-white/[0.06]"
    >
      <div className="shrink-0">
        <QuadrantPlot {...norm} size={80} />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] text-text-muted uppercase tracking-widest mb-0.5">Emerging pattern</div>
        <div className="font-display text-sm font-bold" style={{ color: styleData.color }}>
          {styleData.name} — {styleData.short}
        </div>
      </div>
    </motion.div>
  )
}

function SectionComplete({ sectionIndex, onContinue }) {
  const section = SECTION_INTROS[sectionIndex]
  const next = SECTION_INTROS[sectionIndex + 1]
  const colors = ['#00C8FF', '#B88AFF', '#00E896']

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center relative"
    >
      <CelebrationBurst color={colors[sectionIndex]} />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
        style={{ background: `${colors[sectionIndex]}20`, border: `2px solid ${colors[sectionIndex]}` }}
      >
        <span className="text-2xl">✓</span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="font-display text-2xl font-bold text-white mb-2"
      >
        {section.title} complete
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-text-muted text-sm mb-8"
      >
        {sectionIndex < 2 ? `Next up: ${next.title}` : 'Your profile is ready.'}
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        onClick={onContinue}
        className="px-8 py-3.5 rounded-2xl bg-white text-bg-primary font-bold text-sm hover:bg-white/90 transition-all"
      >
        {sectionIndex < 2 ? 'Continue' : 'See My Profile →'}
      </motion.button>
    </motion.div>
  )
}

export default function Assessment() {
  const navigate = useNavigate()
  const [currentSection, setCurrentSection] = useState(0)
  const [currentQ, setCurrentQ] = useState(0)
  const [showSectionComplete, setShowSectionComplete] = useState(false)
  const [showEncourage, setShowEncourage] = useState(null)
  const [answers, setAnswers] = useState({
    scenarios: Array(SECTIONS[0].questions.length).fill(null),
    sliders: Array(SECTIONS[1].questions.length).fill(50),
    attrs: Array(SECTIONS[2].questions.length).fill(50),
  })

  const section = SECTIONS[currentSection]
  const totalAllQuestions = SECTIONS.reduce((s, sec) => s + sec.questions.length, 0)
  const completedCount =
    answers.scenarios.filter(a => a !== null).length +
    (currentSection > 0 ? answers.sliders.length : 0) +
    (currentSection > 1 ? answers.attrs.length : 0)
  const progress = Math.min((completedCount / totalAllQuestions) * 100, 100)

  // For scenarios: one at a time
  const scenarioQ = currentSection === 0 ? section.questions[currentQ] : null
  const totalInSection = section.questions.length

  function handleScenarioSelect(optIdx) {
    const next = [...answers.scenarios]
    next[currentQ] = optIdx
    setAnswers({ ...answers, scenarios: next })

    // Show encouragement
    setShowEncourage(currentQ)
    setTimeout(() => setShowEncourage(null), 1500)

    // Auto-advance after a brief pause
    setTimeout(() => {
      if (currentQ < totalInSection - 1) {
        setCurrentQ(currentQ + 1)
      } else {
        setShowSectionComplete(true)
      }
    }, 800)
  }

  function handleSliderChange(qIdx, value) {
    const next = [...answers.sliders]
    next[qIdx] = value
    setAnswers({ ...answers, sliders: next })
  }

  function handleAttrChange(qIdx, value) {
    const next = [...answers.attrs]
    next[qIdx] = value
    setAnswers({ ...answers, attrs: next })
  }

  function handleSectionContinue() {
    if (currentSection < SECTIONS.length - 1) {
      setCurrentSection(currentSection + 1)
      setCurrentQ(0)
      setShowSectionComplete(false)
      window.scrollTo(0, 0)
    } else {
      handleSubmit()
    }
  }

  function handleSlidersSubmit() {
    setShowSectionComplete(true)
  }

  function handleSubmit() {
    const results = computeScores(answers.scenarios, answers.sliders, answers.attrs)
    const profile = {
      ...results,
      answers,
      completedAt: new Date().toISOString(),
    }
    localStorage.setItem('neuroleader_profile', JSON.stringify(profile))
    navigate('/profile')
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/60 backdrop-blur-2xl border-b border-white/[0.04]">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan via-purple to-coral flex items-center justify-center">
                <span className="text-white font-display font-bold text-xs">N</span>
              </div>
              <span className="font-display font-bold text-white text-sm">NeuroLeader</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-text-muted">
                {SECTION_INTROS[currentSection].icon} / 03
              </span>
              <span className="text-xs font-semibold text-cyan">{Math.round(progress)}%</span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1 bg-bg-surface2 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #00C8FF, #B88AFF, #00E896)' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 pt-28 pb-32">
        <AnimatePresence mode="wait">
          {showSectionComplete ? (
            <SectionComplete
              key={`complete-${currentSection}`}
              sectionIndex={currentSection}
              onContinue={handleSectionContinue}
            />
          ) : (
            <motion.div
              key={`section-${currentSection}-${currentQ}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
            >
              {/* Section header */}
              <div className="mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] mb-4">
                  <span className="text-[10px] text-text-muted font-medium tracking-widest uppercase">
                    Section {SECTION_INTROS[currentSection].icon}
                  </span>
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
                  {SECTION_INTROS[currentSection].title}
                </h1>
                <p className="text-sm text-text-muted leading-relaxed max-w-md">
                  {SECTION_INTROS[currentSection].sub}
                </p>
              </div>

              {/* === SCENARIOS: one at a time === */}
              {currentSection === 0 && scenarioQ && (
                <div>
                  {/* Question counter */}
                  <div className="flex items-center gap-2 mb-6">
                    {section.questions.map((_, i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                          background: i < currentQ ? '#00C8FF'
                            : i === currentQ ? 'rgba(0,200,255,0.4)'
                            : 'rgba(255,255,255,0.06)'
                        }}
                      />
                    ))}
                  </div>

                  <h3 className="font-display text-xl font-bold text-white mb-6 leading-snug">
                    {scenarioQ.text}
                  </h3>

                  <div className="space-y-3">
                    {scenarioQ.options.map((option, optIdx) => (
                      <motion.button
                        key={optIdx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: optIdx * 0.08 }}
                        onClick={() => handleScenarioSelect(optIdx)}
                        disabled={answers.scenarios[currentQ] !== null}
                        className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 ${
                          answers.scenarios[currentQ] === optIdx
                            ? 'border-cyan bg-cyan/10 shadow-[0_0_30px_rgba(0,200,255,0.12)]'
                            : answers.scenarios[currentQ] !== null
                            ? 'border-white/[0.04] bg-bg-surface/40 opacity-40'
                            : 'border-white/[0.06] bg-bg-surface/60 hover:border-white/10 hover:bg-bg-surface'
                        }`}
                      >
                        <span className={`text-sm leading-relaxed ${
                          answers.scenarios[currentQ] === optIdx ? 'text-cyan' : 'text-text-primary'
                        }`}>
                          {option.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Encouragement toast */}
                  <AnimatePresence>
                    {showEncourage !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-6 text-center"
                      >
                        <span className="text-sm text-cyan font-medium">{ENCOURAGE[currentQ] || ENCOURAGE[0]}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Live insight after 2+ answers */}
                  {answers.scenarios.filter(a => a !== null).length >= 2 && (
                    <div className="mt-8">
                      <LiveInsight answers={answers} />
                    </div>
                  )}

                  {/* Back button for scenarios */}
                  {currentQ > 0 && answers.scenarios[currentQ] === null && (
                    <button
                      onClick={() => setCurrentQ(currentQ - 1)}
                      className="mt-6 text-xs text-text-muted hover:text-white transition-colors"
                    >
                      ← Previous question
                    </button>
                  )}
                </div>
              )}

              {/* === SLIDERS === */}
              {currentSection === 1 && (
                <div>
                  <div className="space-y-4">
                    {section.questions.map((q, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="p-5 rounded-2xl bg-bg-surface/60 border border-white/[0.06]"
                      >
                        <label className="block text-sm font-medium text-white mb-3">{q.label}</label>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] text-text-muted w-14 text-right shrink-0">Disagree</span>
                          <input
                            type="range" min="0" max="100"
                            value={answers.sliders[i]}
                            onChange={e => handleSliderChange(i, Number(e.target.value))}
                            className="flex-1"
                            style={{ background: `linear-gradient(to right, ${q.color} ${answers.sliders[i]}%, rgba(255,255,255,0.06) ${answers.sliders[i]}%)` }}
                          />
                          <span className="text-[10px] text-text-muted w-14 shrink-0">Agree</span>
                        </div>
                        <div className="text-center mt-1">
                          <span className="text-xs font-bold" style={{ color: q.color }}>{answers.sliders[i]}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-8 text-center">
                    <button
                      onClick={handleSlidersSubmit}
                      className="px-8 py-3.5 rounded-2xl bg-white text-bg-primary font-bold text-sm hover:bg-white/90 transition-all"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* === ATTRIBUTES === */}
              {currentSection === 2 && (
                <div>
                  <div className="space-y-4">
                    {section.questions.map((q, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="p-5 rounded-2xl bg-bg-surface/60 border border-white/[0.06]"
                      >
                        <label className="block text-sm font-medium text-white mb-3">{q.label}</label>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] text-text-muted w-20 text-right shrink-0">{q.lo}</span>
                          <input
                            type="range" min="0" max="100"
                            value={answers.attrs[i]}
                            onChange={e => handleAttrChange(i, Number(e.target.value))}
                            className="flex-1"
                            style={{ background: `linear-gradient(to right, ${q.color} ${answers.attrs[i]}%, rgba(255,255,255,0.06) ${answers.attrs[i]}%)` }}
                          />
                          <span className="text-[10px] text-text-muted w-20 shrink-0">{q.hi}</span>
                        </div>
                        <div className="text-center mt-1">
                          <span className="text-xs font-bold" style={{ color: q.color }}>{answers.attrs[i]}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setShowSectionComplete(true)}
                      className="group px-8 py-3.5 rounded-2xl bg-white text-bg-primary font-bold text-sm hover:bg-white/90 transition-all flex items-center gap-2 mx-auto"
                    >
                      See My Profile
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
