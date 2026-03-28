import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SECTIONS } from '../data/questions'
import { computeScores } from '../data/scoring'
import ScenarioQuestion from '../components/ScenarioQuestion'
import SliderQuestion from '../components/SliderQuestion'
import AttrSlider from '../components/AttrSlider'
import ProgressBar from '../components/ProgressBar'

export default function Assessment() {
  const navigate = useNavigate()
  const [currentSection, setCurrentSection] = useState(0)
  const [answers, setAnswers] = useState({
    scenarios: Array(SECTIONS[0].questions.length).fill(null),
    sliders: Array(SECTIONS[1].questions.length).fill(50),
    attrs: Array(SECTIONS[2].questions.length).fill(50),
  })

  const section = SECTIONS[currentSection]
  const totalQuestions = SECTIONS.reduce((s, sec) => s + sec.questions.length, 0)
  const answeredCount =
    answers.scenarios.filter(a => a !== null).length +
    answers.sliders.length +
    answers.attrs.length
  const progress = (answeredCount / totalQuestions) * 100

  const sectionLabels = ['Scenarios', 'Signals', 'Attributes']

  function handleScenarioSelect(qIdx, optIdx) {
    const next = [...answers.scenarios]
    next[qIdx] = optIdx
    setAnswers({ ...answers, scenarios: next })
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

  function handleNext() {
    if (currentSection < SECTIONS.length - 1) {
      setCurrentSection(currentSection + 1)
      window.scrollTo(0, 0)
    } else {
      handleSubmit()
    }
  }

  function handleBack() {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
      window.scrollTo(0, 0)
    }
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

  const canProceed = currentSection === 0
    ? answers.scenarios.every(a => a !== null)
    : true

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan to-purple flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">N</span>
              </div>
              <span className="font-display font-bold text-text-primary">NeuroLeader</span>
            </div>
            <span className="text-sm text-text-muted">{sectionLabels[currentSection]}</span>
          </div>
          <ProgressBar progress={progress} />
        </div>
      </header>

      {/* Section Content */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
                {section.title}
              </h1>
              <p className="text-text-muted">{section.subtitle}</p>
            </div>

            {section.type === 'scenarios' &&
              section.questions.map((q, i) => (
                <ScenarioQuestion
                  key={i}
                  question={q}
                  index={i}
                  selected={answers.scenarios[i]}
                  onSelect={(optIdx) => handleScenarioSelect(i, optIdx)}
                />
              ))
            }

            {section.type === 'sliders' &&
              section.questions.map((q, i) => (
                <SliderQuestion
                  key={i}
                  question={q}
                  index={i}
                  value={answers.sliders[i]}
                  onChange={(val) => handleSliderChange(i, val)}
                />
              ))
            }

            {section.type === 'attributes' &&
              section.questions.map((q, i) => (
                <AttrSlider
                  key={i}
                  question={q}
                  index={i}
                  value={answers.attrs[i]}
                  onChange={(val) => handleAttrChange(i, val)}
                />
              ))
            }
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Fixed Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-bg-primary/90 backdrop-blur-xl border-t border-white/5 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center">
          {currentSection > 0 ? (
            <button
              onClick={handleBack}
              className="px-6 py-2.5 rounded-xl border border-white/10 text-text-muted hover:text-text-primary hover:border-white/20 transition-all text-sm"
            >
              Back
            </button>
          ) : (
            <div />
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`px-8 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              canProceed
                ? 'bg-gradient-to-r from-cyan to-purple text-white shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:shadow-[0_0_30px_rgba(0,200,255,0.5)]'
                : 'bg-bg-surface2 text-text-muted cursor-not-allowed'
            }`}
          >
            {currentSection < SECTIONS.length - 1 ? 'Continue' : 'Submit'}
          </button>
        </div>
      </nav>
    </div>
  )
}
