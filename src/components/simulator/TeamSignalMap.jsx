import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { STAGES, QUESTIONS, scoreResponses, deriveInsights } from '../../lib/teamSignalMap'

const TEAM_TYPES = [
  { value: 'direct', label: 'Direct reports' },
  { value: 'project', label: 'Project team' },
  { value: 'crossfunctional', label: 'Cross-functional' },
  { value: 'other', label: 'Other' },
]

const THIS_WEEK = {
  diplomatic: {
    forming: [
      'Hold a structured conversation that clarifies roles, expectations, and what success looks like — before you try to build connection.',
      'Ask each team member one question about what they need from you this week.',
      'Resist leading with relationship. Sequence it: clarity first, then warmth.',
    ],
    storming: [
      'Call out the dynamic directly in your next team conversation — without assigning blame.',
      'Ask "what is not being said in this team right now?" and let silence do the work.',
      'Resist smoothing the conflict. Hold the tension long enough for it to become productive.',
    ],
    norming: [
      'Publicly affirm two or three specific behaviors you want to see more of.',
      'Deliberately step back from one decision and let the team make it without you.',
      'Check in individually with each person to reinforce the emerging culture.',
    ],
    performing: [
      'Stay connected through brief, frequent check-ins rather than structured meetings.',
      'Ask the team what obstacles you can remove — then remove them.',
      'Celebrate a win publicly this week. Performing teams still need recognition.',
    ],
    adjourning: [
      'Name specifically what the team accomplished — out loud, in a team setting.',
      'Create a moment for the team to mark the ending, even if it is only 20 minutes.',
      'Check in individually with each person about what comes next for them.',
    ],
  },
  logistical: {
    forming: [
      'Document the three most important operating norms and share them with the team this week.',
      'Create a simple reference that answers the most common logistics questions before they are asked.',
      'Run a structured kickoff with a clear agenda, explicit role assignments, and documented next steps.',
    ],
    storming: [
      'Identify the specific unresolved issue driving the conflict — name it in your next team conversation.',
      'Run one-to-ones this week focused on listening, not problem-solving.',
      'Suspend the process improvement instinct temporarily. Fix the relationship first.',
    ],
    norming: [
      'Delegate ownership of one process to the team and let them define how it works.',
      'Resist the urge to refine systems that are working well enough. Norming needs emergence, not optimization.',
      'Document the norms forming naturally and reflect them back to the team.',
    ],
    performing: [
      'Ask the team what process friction is slowing them down — and remove it.',
      'Step back from one area of oversight this week and observe what happens.',
      'Direct your energy toward organizational interference. Be a shield, not a manager.',
    ],
    adjourning: [
      'Create a structured closure document — what was built, what was learned, what was decided.',
      'Carve out time in your next team meeting specifically to acknowledge the ending, not just the transition.',
      'Ask each person what they are most proud of from this team\'s work.',
    ],
  },
  strategic: {
    forming: [
      'Share a clear and honest account of where this team is going and why it matters.',
      'Connect each person\'s role to the larger purpose in your one-to-ones this week.',
      'Create a simple team north star document and share it — one page is enough.',
    ],
    storming: [
      'Reframe the current conflict publicly as productive disagreement toward a shared goal.',
      'Hold the long view in your next team conversation. Name what the team is working toward beyond the immediate tension.',
      'State the non-negotiables clearly so the team knows what can be debated and what cannot.',
    ],
    norming: [
      'Introduce a new challenge or stretch goal that gives the emerging team something to grow toward.',
      'Ask the team to define their own operating norms — then affirm them.',
      'Step back from tactical involvement and focus on where the team is heading next quarter.',
    ],
    performing: [
      'Share a vision that extends beyond the current scope — give the team something new to build toward.',
      'Run interference with the organization this week. Your job is to protect the team\'s capacity.',
      'Ask the team what they would build if there were no constraints. Listen carefully to the answer.',
    ],
    adjourning: [
      'Connect this team\'s work to a lasting impact — what did this change beyond the deliverable?',
      'Name the significance of what was accomplished in the context of the larger mission.',
      'Help each person see how this chapter connects to the next one in their development.',
    ],
  },
  tactical: {
    forming: [
      'Drive one early, visible win this week to give the team momentum and a shared reference point.',
      'Define exactly what success looks like in the next 30 days — be specific and measurable.',
      'Assign clear ownership to every major task on the team\'s plate before the week is out.',
    ],
    storming: [
      'Stop for one hour this week and just listen to the team\'s frustrations — without solving.',
      'Identify the one relationship tension most affecting performance and address it directly.',
      'Resist the urge to out-execute the conflict. It will resurface if you do.',
    ],
    norming: [
      'Delegate one decision area fully this week and do not re-enter it.',
      'When you see the team solving something well, name it out loud in the moment.',
      'Resist adding tasks to a team that is developing its own rhythm. Protect the space.',
    ],
    performing: [
      'Introduce a stretch target that requires the team to operate at a genuinely new level.',
      'Identify what execution bottlenecks exist at the organizational level — and remove them.',
      'Spend this week working on the strategy, not inside the team\'s execution.',
    ],
    adjourning: [
      'Block 30 minutes in your next team meeting specifically to mark the ending — nothing else on the agenda.',
      'Ask each team member what they are most proud of and listen to the full answer before responding.',
      'Resist moving immediately to the next objective. This team earned a moment.',
    ],
  },
}

const FIT_CONFIG = {
  strongest: { label: 'Strong fit',    color: '#00E896', headerColor: 'text-green' },
  strong:    { label: 'Good fit',      color: '#00C8FF', headerColor: 'text-cyan' },
  moderate:  { label: 'Moderate fit',  color: '#B88AFF', headerColor: 'text-purple' },
  gap:       { label: 'Watch point',   color: '#FFB340', headerColor: 'text-amber' },
}

function saveResult({ teamName, teamType, stage, confidence, leaderStyle }) {
  const maps = JSON.parse(localStorage.getItem('nl_team_maps') || '[]')
  maps.unshift({ teamName, teamType, stage, confidence, leaderStyle, date: new Date().toISOString() })
  localStorage.setItem('nl_team_maps', JSON.stringify(maps.slice(0, 20)))
}

// ── Screen 1: Setup ──────────────────────────────────────────────────
function SetupScreen({ onStart }) {
  const [teamName, setTeamName] = useState('')
  const [teamType, setTeamType] = useState('direct')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-lg"
    >
      <h2 className="font-display text-2xl font-bold text-white mb-2">
        Map your team's stage
      </h2>
      <p className="text-sm text-text-muted mb-8 leading-relaxed">
        Answer 8 observations about how your team is operating right now.
        Your Map result shapes the interpretation.
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">
            What do you call this team?
          </label>
          <input
            type="text"
            value={teamName}
            onChange={e => setTeamName(e.target.value)}
            placeholder="My direct reports"
            className="w-full px-4 py-3 rounded-xl bg-bg-surface border border-white/10 text-white placeholder-text-muted focus:outline-none focus:border-cyan/30 transition-colors text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-3">
            Team type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {TEAM_TYPES.map(t => (
              <button
                key={t.value}
                onClick={() => setTeamType(t.value)}
                className={`px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all ${
                  teamType === t.value
                    ? 'border-cyan/40 bg-cyan/8 text-cyan'
                    : 'border-white/[0.06] text-text-muted hover:border-white/10 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onStart({ teamName: teamName.trim() || 'My team', teamType })}
          className="px-8 py-3.5 rounded-2xl bg-white text-bg-primary font-bold text-sm hover:bg-white/90 transition-all flex items-center gap-2"
        >
          Start mapping
          <span>→</span>
        </button>
      </div>
    </motion.div>
  )
}

// ── Screen 2: Questions ──────────────────────────────────────────────
function QuestionsScreen({ onComplete }) {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)
  const [animating, setAnimating] = useState(false)

  const q = QUESTIONS[current]
  const progress = ((current) / QUESTIONS.length) * 100

  function handleSelect(option) {
    if (animating) return
    setSelected(option.stage)
    setAnimating(true)
    const next = [...answers, { questionId: q.id, stage: option.stage }]
    setTimeout(() => {
      if (current + 1 < QUESTIONS.length) {
        setCurrent(current + 1)
        setSelected(null)
        setAnimating(false)
      } else {
        onComplete(next)
      }
    }, 380)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-xl"
    >
      {/* Progress */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-cyan rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <span className="text-xs text-text-muted whitespace-nowrap">
          {current + 1} of {QUESTIONS.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <h3 className="font-display text-xl font-bold text-white mb-6 leading-snug">
            {q.text}
          </h3>
          <div className="space-y-3">
            {q.options.map((option, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleSelect(option)}
                disabled={selected !== null}
                className={`w-full text-left px-5 py-4 rounded-2xl border text-sm transition-all duration-300 ${
                  selected === option.stage
                    ? 'border-cyan bg-cyan/10 text-cyan scale-[1.01]'
                    : selected !== null
                    ? 'border-white/[0.04] bg-bg-surface/30 text-text-muted opacity-40'
                    : 'border-white/[0.06] bg-bg-surface/60 text-text-primary hover:border-white/10 hover:scale-[1.005]'
                }`}
              >
                {option.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

// ── Screen 3: Results ────────────────────────────────────────────────
function ResultsScreen({ teamName, teamType, answers, leaderStyle, onReset }) {
  const result = scoreResponses(answers)
  const { stageData, alignment } = deriveInsights(result.stage, leaderStyle)
  const fitConfig = FIT_CONFIG[alignment?.fit] || FIT_CONFIG.moderate
  const thisWeek = THIS_WEEK[leaderStyle]?.[result.stage] || []

  useEffect(() => {
    saveResult({ teamName, teamType, stage: result.stage, confidence: result.confidence, leaderStyle })
  }, [])

  const confidenceLabel = {
    high: 'High confidence',
    moderate: 'Moderate confidence',
    transitional: 'Transitional — between stages',
  }[result.confidence]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl space-y-5"
    >
      {/* Section A: Stage identified */}
      <div
        className="rounded-2xl border p-6"
        style={{ borderColor: `${stageData.color}30`, background: `${stageData.color}06` }}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">Stage identified</div>
            <h3 className="font-display text-2xl font-bold" style={{ color: stageData.color }}>
              {teamName} is in {stageData.label}.
            </h3>
          </div>
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shrink-0"
            style={{ background: `${stageData.color}15`, color: stageData.color }}
          >
            {confidenceLabel}
          </span>
        </div>
        <p className="text-sm text-text-primary leading-relaxed mb-3">{stageData.description}</p>
        <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">What you are seeing</div>
        <p className="text-sm text-text-muted leading-relaxed">{stageData.teamSigns}</p>

        {result.secondaryStage && (
          <div className="mt-3 pt-3 border-t border-white/[0.04]">
            <p className="text-xs text-text-muted">
              Also showing signs of{' '}
              <span className="text-white font-medium">{STAGES[result.secondaryStage]?.label}</span>
              {' '}— the team may be transitioning.
            </p>
          </div>
        )}
      </div>

      {/* Section B: What this stage needs */}
      <div className="rounded-2xl border border-white/[0.06] bg-bg-surface/60 p-6">
        <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">
          What {stageData.label} needs from a leader
        </div>
        <p className="text-sm text-text-primary leading-relaxed">{stageData.leaderNeeds}</p>
      </div>

      {/* Section C: Map alignment */}
      {alignment && (
        <div className="rounded-2xl border border-white/[0.06] bg-bg-surface/60 p-6">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest"
              style={{ background: `${fitConfig.color}15`, color: fitConfig.color }}
            >
              {fitConfig.label}
            </span>
            <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
              {alignment.fit === 'gap' ? 'Where your Map works against you' : 'Where your Map fits'}
            </div>
          </div>
          <p className="text-sm text-text-primary leading-relaxed">{alignment.note}</p>
        </div>
      )}

      {/* Section D: This week */}
      {thisWeek.length > 0 && (
        <div className="rounded-2xl border border-white/[0.06] bg-bg-surface/60 p-6">
          <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-4">
            This week
          </div>
          <div className="space-y-3">
            {thisWeek.map((action, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3"
              >
                <div
                  className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                  style={{ background: `${stageData.color}20`, color: stageData.color }}
                >
                  {i + 1}
                </div>
                <p className="text-sm text-text-primary leading-relaxed">{action}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onReset}
        className="text-sm text-text-muted hover:text-white transition-colors"
      >
        ← Map another team
      </button>
    </motion.div>
  )
}

// ── Main component ───────────────────────────────────────────────────
export default function TeamSignalMap() {
  const [screen, setScreen] = useState('setup')
  const [setup, setSetup] = useState(null)
  const [answers, setAnswers] = useState([])
  const [leaderStyle, setLeaderStyle] = useState('diplomatic')

  useEffect(() => {
    const stored = localStorage.getItem('neuroleader_profile')
    if (stored) {
      const p = JSON.parse(stored)
      const style = p.dominantStyle || p.quadrant?.style
      if (style) setLeaderStyle(style)
    }
  }, [])

  function handleStart(setupData) {
    setSetup(setupData)
    setScreen('questions')
  }

  function handleComplete(ans) {
    setAnswers(ans)
    setScreen('results')
  }

  function handleReset() {
    setSetup(null)
    setAnswers([])
    setScreen('setup')
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-white mb-1">
          Where is your team right now?
        </h2>
        <p className="text-sm text-text-muted">
          Eight observations. A stage. A read on what your Map means for this team today.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {screen === 'setup' && (
          <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SetupScreen onStart={handleStart} />
          </motion.div>
        )}
        {screen === 'questions' && (
          <motion.div key="questions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <QuestionsScreen onComplete={handleComplete} />
          </motion.div>
        )}
        {screen === 'results' && setup && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ResultsScreen
              teamName={setup.teamName}
              teamType={setup.teamType}
              answers={answers}
              leaderStyle={leaderStyle}
              onReset={handleReset}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
