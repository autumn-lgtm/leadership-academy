import { useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SECTION_A, SECTION_INTROS, SECTION_B_INSTRUCTION, RECOVERY_BEATS } from '../data/questions'
import { SLIDER_ITEMS } from '../utils/sliderTransforms'
import { SECTION_C } from '../data/sectionC'
import { SECTION_D } from '../data/sectionD'
import { SECTION_E } from '../data/sectionE'
import { EQ_ITEMS } from '../data/eqItems'
import { WORD_BANKS } from '../data/wordBanks'
import { computeFullProfile } from '../data/scoring'
import { PageFooter } from '../components/DesignSystem'
import {
  Onboarding, RecoveryScreen, GapPromptScreen,
  ScenarioQuestion, ForcedChoiceQuestion, SliderQuestion,
  WordBankQuestion, SectionHeader, EncouragementToast,
} from '../components/assessment/QuestionTypes'

// ── Flow: Onboard → A → R1 → B → Gap → C → R2 → D → R3 → E → F → EQ → R5 → Profile
const STEPS = [
  'onboarding', 'section-A', 'recovery-1', 'section-B', 'gap-prompt',
  'section-C', 'recovery-2', 'section-D', 'recovery-3',
  'section-E', 'section-F', 'section-EQ', 'recovery-5',
]

const STEP_SECTION_MAP = {
  'section-A': { label: 'A', total: SECTION_A.length },
  'section-B': { label: 'B', total: SLIDER_ITEMS.length },
  'section-C': { label: 'C', total: SECTION_C.length },
  'section-D': { label: 'D', total: SECTION_D.length },
  'section-E': { label: 'E', total: SECTION_E.length },
  'section-F': { label: 'F', total: WORD_BANKS.length },
  'section-EQ': { label: 'EQ', total: EQ_ITEMS.length },
}

function getOverallProgress(step, qIndex) {
  const sectionSteps = Object.keys(STEP_SECTION_MAP)
  const totalQuestions = sectionSteps.reduce((s, k) => s + STEP_SECTION_MAP[k].total, 0)
  let completed = 0
  for (const k of sectionSteps) {
    if (STEPS.indexOf(k) < STEPS.indexOf(step)) completed += STEP_SECTION_MAP[k].total
    else if (k === step) completed += qIndex
  }
  return Math.min((completed / totalQuestions) * 100, 100)
}

export default function Assessment() {
  const navigate = useNavigate()
  const [step, setStep] = useState('onboarding')
  const [qIndex, setQIndex] = useState(0)
  const [showEncourage, setShowEncourage] = useState(null)

  const [answers, setAnswers] = useState({
    scenarioAnswers: Array(SECTION_A.length).fill(null),
    sliderValues: Array(SLIDER_ITEMS.length).fill(50),
    fcAnswers: Array(SECTION_C.length).fill(null),
    pressureAnswers: Array(SECTION_D.length).fill(null),
    trustAnswers: Array(SECTION_E.length).fill(null),
    eqAnswers: Array(EQ_ITEMS.length).fill(null),
    wbAnswers: {},
    gapSelection: null,
  })

  const progress = getOverallProgress(step, qIndex)
  const stepInfo = STEP_SECTION_MAP[step]

  function advanceStep() {
    const idx = STEPS.indexOf(step)
    if (idx < STEPS.length - 1) {
      setStep(STEPS[idx + 1])
      setQIndex(0)
      window.scrollTo(0, 0)
    } else {
      handleSubmit()
    }
  }

  const advanceStepCb = useCallback(advanceStep, [step])

  function handleScenarioSelect(sectionKey, items, optIdx) {
    const key = sectionKey === 'A' ? 'scenarioAnswers'
      : sectionKey === 'D' ? 'pressureAnswers'
      : sectionKey === 'E' ? 'trustAnswers' : 'eqAnswers'
    const next = [...answers[key]]
    next[qIndex] = optIdx
    setAnswers(prev => ({ ...prev, [key]: next }))
    setShowEncourage(qIndex)
    setTimeout(() => setShowEncourage(null), 1500)
    setTimeout(() => {
      if (qIndex < items.length - 1) setQIndex(qIndex + 1)
      else advanceStep()
    }, 800)
  }

  function handleForcedChoiceSelect(sectionKey, items, optIdx) {
    const key = sectionKey === 'C' ? 'fcAnswers'
      : sectionKey === 'E' ? 'trustAnswers' : 'eqAnswers'
    const next = [...answers[key]]
    next[qIndex] = optIdx
    setAnswers(prev => ({ ...prev, [key]: next }))
    setTimeout(() => {
      if (qIndex < items.length - 1) setQIndex(qIndex + 1)
      else advanceStep()
    }, 600)
  }

  function handleSliderChange(idx, value) {
    const next = [...answers.sliderValues]
    next[idx] = value
    setAnswers(prev => ({ ...prev, sliderValues: next }))
  }

  function handleEQSliderChange(eqIdx, value) {
    const next = [...answers.eqAnswers]
    next[eqIdx] = value
    setAnswers(prev => ({ ...prev, eqAnswers: next }))
  }

  function handleWordToggle(bankId, word) {
    setAnswers(prev => {
      const current = prev.wbAnswers[bankId] || []
      const updated = current.includes(word)
        ? current.filter(w => w !== word)
        : [...current, word]
      return { ...prev, wbAnswers: { ...prev.wbAnswers, [bankId]: updated } }
    })
  }

  function handleGapSelect(position) {
    setAnswers(prev => ({ ...prev, gapSelection: position }))
    advanceStep()
  }

  function handleSubmit() {
    try {
      const profile = computeFullProfile({ ...answers, mode: 'long' })
      localStorage.setItem('neuroleader_profile', JSON.stringify({
        ...profile, answers, completedAt: new Date().toISOString(),
      }))
    } catch (err) {
      console.error('Scoring failed:', err)
      // Persist whatever we have so the profile screen can still render
      localStorage.setItem('neuroleader_profile', JSON.stringify({
        answers, completedAt: new Date().toISOString(), _scoringError: true,
      }))
    } finally {
      navigate('/profile')
    }
  }

  function renderStepContent() {
    switch (step) {
      case 'onboarding':
        return <Onboarding onStart={advanceStep} />

      case 'recovery-1':
        return <RecoveryScreen beat={1} onContinue={advanceStepCb} partialAnswers={answers} />
      case 'recovery-2':
        return <RecoveryScreen beat={2} onContinue={advanceStepCb} partialAnswers={answers} />
      case 'recovery-3':
        return <RecoveryScreen beat={3} onContinue={advanceStepCb} partialAnswers={answers} />
      case 'recovery-5':
        return <RecoveryScreen beat={5} onContinue={handleSubmit} partialAnswers={answers} />

      case 'gap-prompt':
        return <GapPromptScreen sliderItems={SLIDER_ITEMS} onSelect={handleGapSelect} />

      case 'section-A':
        return (
          <div>
            <SectionHeader section="A" intro={SECTION_INTROS.A} />
            <ScenarioQuestion question={SECTION_A[qIndex]} questionIndex={qIndex}
              totalQuestions={SECTION_A.length} selected={answers.scenarioAnswers[qIndex]}
              onSelect={(optIdx) => handleScenarioSelect('A', SECTION_A, optIdx)} />
            <EncouragementToast show={showEncourage !== null} index={qIndex} />
            {qIndex > 0 && answers.scenarioAnswers[qIndex] === null && (
              <button onClick={() => setQIndex(qIndex - 1)} className="mt-6 text-xs text-text-muted hover:text-white transition-colors">
                ← Previous question
              </button>
            )}
          </div>
        )

      case 'section-B':
        return (
          <div>
            <SectionHeader section="B" intro={SECTION_INTROS.B} />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mb-6 p-5 rounded-xl bg-bg-surface/40 border border-white/[0.04]">
              <p className="text-sm text-white font-medium">{SECTION_B_INSTRUCTION.line1}</p>
              <p className="text-sm text-text-muted mt-1">{SECTION_B_INSTRUCTION.line2}</p>
              <p className="text-xs text-cyan/70 mt-2 italic">{SECTION_B_INSTRUCTION.pause}</p>
            </motion.div>
            <div className="space-y-4">
              {SLIDER_ITEMS.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <SliderQuestion item={item} value={answers.sliderValues[i]}
                    onChange={(val) => handleSliderChange(i, val)} />
                </motion.div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <button onClick={advanceStep}
                className="px-8 py-3.5 rounded-2xl bg-white text-bg-primary font-bold text-sm hover:bg-white/90 transition-all">
                Continue
              </button>
            </div>
          </div>
        )

      case 'section-C':
        return (
          <div>
            <SectionHeader section="C" intro={SECTION_INTROS.C} />
            <ForcedChoiceQuestion question={SECTION_C[qIndex]} questionIndex={qIndex}
              totalQuestions={SECTION_C.length} selected={answers.fcAnswers[qIndex]}
              onSelect={(optIdx) => handleForcedChoiceSelect('C', SECTION_C, optIdx)} />
          </div>
        )

      case 'section-D':
        return (
          <div>
            <SectionHeader section="D" intro={SECTION_INTROS.D} />
            <ScenarioQuestion question={SECTION_D[qIndex]} questionIndex={qIndex}
              totalQuestions={SECTION_D.length} selected={answers.pressureAnswers[qIndex]}
              onSelect={(optIdx) => handleScenarioSelect('D', SECTION_D, optIdx)} />
            <EncouragementToast show={showEncourage !== null} index={qIndex} />
          </div>
        )

      case 'section-E': {
        const q = SECTION_E[qIndex]
        return (
          <div>
            <SectionHeader section="E" intro={SECTION_INTROS.E} />
            {q.type === 'forcedChoice' ? (
              <ForcedChoiceQuestion question={q} questionIndex={qIndex}
                totalQuestions={SECTION_E.length} selected={answers.trustAnswers[qIndex]}
                onSelect={(optIdx) => handleForcedChoiceSelect('E', SECTION_E, optIdx)} />
            ) : (
              <ScenarioQuestion question={q} questionIndex={qIndex}
                totalQuestions={SECTION_E.length} selected={answers.trustAnswers[qIndex]}
                onSelect={(optIdx) => handleScenarioSelect('E', SECTION_E, optIdx)} />
            )}
          </div>
        )
      }

      case 'section-F':
        return (
          <div>
            <SectionHeader section="F" intro={SECTION_INTROS.F} />
            <div className="space-y-8">
              {WORD_BANKS.map((bank) => (
                <motion.div key={bank.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                  <WordBankQuestion bank={bank} selected={answers.wbAnswers[bank.id] || []}
                    onToggle={(word) => handleWordToggle(bank.id, word)} />
                </motion.div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <button onClick={advanceStep}
                className="px-8 py-3.5 rounded-2xl bg-white text-bg-primary font-bold text-sm hover:bg-white/90 transition-all">
                Continue
              </button>
            </div>
          </div>
        )

      case 'section-EQ': {
        const eq = EQ_ITEMS[qIndex]
        const eqIntro = "Almost there. This measures how you handle emotions \u2014 yours and others'."
        if (eq.type === 'slider') {
          return (
            <div>
              <SectionHeader section="EQ" intro={eqIntro} />
              <div className="flex items-center gap-2 mb-6">
                {Array.from({ length: EQ_ITEMS.length }, (_, i) => (
                  <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                    style={{ background: i < qIndex ? '#FFB340' : i === qIndex ? 'rgba(255,179,64,0.4)' : 'rgba(255,255,255,0.06)' }} />
                ))}
              </div>
              <SliderQuestion item={eq} value={answers.eqAnswers[qIndex] ?? 50}
                onChange={(val) => handleEQSliderChange(qIndex, val)} />
              <div className="mt-6 text-center">
                <button onClick={() => { if (qIndex < EQ_ITEMS.length - 1) setQIndex(qIndex + 1); else advanceStep() }}
                  className="px-8 py-3.5 rounded-2xl bg-white text-bg-primary font-bold text-sm hover:bg-white/90 transition-all">
                  Continue
                </button>
              </div>
            </div>
          )
        }
        if (eq.type === 'forcedChoice') {
          return (
            <div>
              <SectionHeader section="EQ" intro={eqIntro} />
              <ForcedChoiceQuestion question={eq} questionIndex={qIndex}
                totalQuestions={EQ_ITEMS.length} selected={answers.eqAnswers[qIndex]}
                onSelect={(optIdx) => handleForcedChoiceSelect('EQ', EQ_ITEMS, optIdx)} />
            </div>
          )
        }
        return (
          <div>
            <SectionHeader section="EQ" intro={eqIntro} />
            <ScenarioQuestion question={eq} questionIndex={qIndex}
              totalQuestions={EQ_ITEMS.length} selected={answers.eqAnswers[qIndex]}
              onSelect={(optIdx) => handleScenarioSelect('EQ', EQ_ITEMS, optIdx)} />
            <EncouragementToast show={showEncourage !== null} index={qIndex} />
          </div>
        )
      }

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <header className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/60 backdrop-blur-2xl border-b border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between mb-3">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan via-purple to-coral flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">N</span>
              </div>
              <span className="font-display font-bold text-white text-lg tracking-tight">NeuroLeader</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link to="/profile" className="text-sm text-text-muted hover:text-white transition-colors hidden md:block">Profile</Link>
              <Link to="/simulator" className="text-sm text-text-muted hover:text-white transition-colors hidden md:block">Simulator</Link>
              {stepInfo && (
                <div className="flex items-center gap-3 pl-4 border-l border-white/[0.06]">
                  <span className="text-xs text-text-muted">Section {stepInfo.label}</span>
                  <span className="text-xs font-semibold text-cyan">{Math.round(progress)}%</span>
                </div>
              )}
            </div>
          </div>
          <div className="w-full h-1 bg-bg-surface2 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #00C8FF, #B88AFF, #00E896)' }}
              animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-8 pt-28 pb-32">
        <AnimatePresence mode="wait">
          <motion.div key={`${step}-${qIndex}`}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}>
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </main>
      <PageFooter />
    </div>
  )
}
