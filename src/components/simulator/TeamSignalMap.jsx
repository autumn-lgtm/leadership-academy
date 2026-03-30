// src/components/simulator/TeamSignalMap.jsx
// Team Signal Map — stage detection + animated spider chart alignment view

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { STAGES, QUESTIONS, scoreResponses, deriveInsights } from '../../lib/teamSignalMap'
import { SpiderMap, STAGE_DATA } from './SpiderMap'

const AXON_IMG = `${import.meta.env.BASE_URL}axon-final.webp`

const TEAM_TYPES = [
  { value: 'direct',       label: 'Direct reports' },
  { value: 'project',      label: 'Project team' },
  { value: 'crossfunctional', label: 'Cross-functional' },
  { value: 'other',        label: 'Other' },
]

const STAGE_COLORS = {
  forming: '#00C8FF', storming: '#FF6B6B',
  norming: '#00E896', performing: '#00C8FF', adjourning: '#FFB340',
}

const FIT_CONFIG = {
  strongest: { label: 'Strongest fit', color: '#00E896', bg: 'rgba(0,232,150,0.1)',   border: 'rgba(0,232,150,0.25)' },
  strong:    { label: 'Strong fit',    color: '#00E896', bg: 'rgba(0,232,150,0.08)',  border: 'rgba(0,232,150,0.2)'  },
  moderate:  { label: 'Moderate fit',  color: '#FFB340', bg: 'rgba(255,179,64,0.1)',  border: 'rgba(255,179,64,0.25)' },
  gap:       { label: 'Gap — watch this', color: '#FF6B6B', bg: 'rgba(255,107,107,0.1)', border: 'rgba(255,107,107,0.25)' },
}

const STAGE_INSIGHTS = {
  forming: {
    need: 'Clear structure, explicit expectations, and visible presence. The team needs certainty before connection.',
    align: {
      diplomatic: 'Your relational instinct helps but structure is what Forming needs first. Lead with clarity, then connection.',
      strategic:  'Vision gives the forming team direction. Connect the work to the why.',
      logistical: 'Structure, clarity, and process are exactly what Forming needs. This is your natural stage.',
      tactical:   'Clear execution orientation gives Forming teams momentum. Drive early wins.',
    },
    week: {
      diplomatic: 'Define explicit expectations. Be visible and directive. Name what success looks like before you build relationships.',
      strategic:  'Run a team kickoff that connects the work to a larger purpose. Give them a north star.',
      logistical: 'Document the process, the standards, and the expectations in writing. Make the invisible visible.',
      tactical:   'Identify three quick wins the team can execute in week one. Get them moving.',
    },
    watch: {
      diplomatic: 'Being too relational too soon. Forming teams need certainty before warmth — reverse the order.',
      strategic:  'Getting too visionary before the basics are clear. Ground the vision in immediate structure.',
      logistical: 'Over-systematizing before the team has settled. Let people orient before adding process.',
      tactical:   'Moving too fast before alignment is established. Forming needs clarity before velocity.',
    },
    axon: '"A new team does not need inspiration first. It needs to know what done looks like."',
  },
  storming: {
    need: 'Directive clarity on non-negotiables combined with a real container for conflict. Name what is happening without smoothing it over.',
    align: {
      diplomatic: 'Your instinct is to smooth the conflict. Storming does not need smoothing — it needs naming. Say the thing nobody is saying.',
      strategic:  'You can hold the long view through the noise of conflict. This is where strategic orientation matters most.',
      logistical: 'Adding more process in response to conflict reads as control, not support. Address the people before the system.',
      tactical:   'The drive to execute can bypass the conflict that needs resolution. Stop. Address the team before the task.',
    },
    week: {
      diplomatic: 'Name the tension in your next meeting without blame. Hold one non-negotiable firm and let the team respond.',
      strategic:  'Reconnect the team to the larger purpose. Conflict often rises when people lose sight of why the work matters.',
      logistical: 'Clarify what is negotiable and what is not. Teams in Storming need to know the rules of the conflict.',
      tactical:   'Stop adding tasks. Create one structured conversation about what is not working. Make it safe to say it.',
    },
    watch: {
      diplomatic: 'Premature harmony. Resolving the surface without addressing the root makes Storming last significantly longer.',
      strategic:  'Getting too abstract when the team needs something concrete to hold onto.',
      logistical: 'Using more structure as a substitute for having the hard conversation.',
      tactical:   'Pushing through the conflict with pace and execution pressure. It does not resolve — it just goes underground.',
    },
    axon: '"The conflict is the information. Do not manage it away before you understand it."',
  },
  norming: {
    need: 'Step back and affirm. The team is developing its own identity. Enable rather than direct — this stage is about emergent norms.',
    align: {
      diplomatic: 'Your WHO connection is exactly what Norming needs. Natural affirmation and connection accelerate this stage. This is your home.',
      strategic:  "Keep introducing new challenges that extend the team's growth. Norming teams need a horizon to move toward.",
      logistical: 'Watch the urge to maintain control of the norms. The team needs to develop its own — not inherit yours.',
      tactical:   'Delivery focus can crowd out team autonomy. Delegate more than feels comfortable and hold back.',
    },
    week: {
      diplomatic: 'Let the team solve three problems before they reach you. Name what you see working out loud. Run 1:1s without an agenda.',
      strategic:  'Introduce a stretch challenge that requires the team to collaborate at a new level. Give them something to grow into.',
      logistical: 'Hand off one process you have been holding. Document it, transfer it, and step back.',
      tactical:   'Identify two decisions you\'ve been making that the team could make instead. Transfer them explicitly.',
    },
    watch: {
      diplomatic: 'Over-involvement. Your instinct to connect can crowd the autonomy the team needs to develop.',
      strategic:  'Introducing too much change before Norming is consolidated. Let the identity set before stretching it.',
      logistical: 'Creating systems around the emerging norms rather than letting them emerge organically.',
      tactical:   'Maintaining too much execution involvement. The team needs to own delivery — not just contribute to it.',
    },
    axon: '"Your Map tells you which leader you naturally are. Their stage tells you which leader they currently need."',
  },
  performing: {
    need: 'Strategic vision and obstacle removal. The team does not need direction — it needs to know where it is going.',
    align: {
      diplomatic: 'Relational maintenance keeps Performing teams cohesive. Stay connected without over-directing.',
      strategic:  'Vision and obstacle removal is exactly what Performing teams need. This is your stage.',
      logistical: "Process orientation can disrupt a self-organizing team. Get out of the way and run interference with the organization.",
      tactical:   'Execution excellence maintains Performing but may not sustain it. Introduce strategic stretch and a longer horizon.',
    },
    week: {
      diplomatic: 'Ask each person individually what would make their best work better. Listen without problem-solving.',
      strategic:  'Articulate the next horizon clearly. Performing teams need to know what they are building toward.',
      logistical: 'Identify the one organizational obstacle most limiting the team\'s output. Remove it.',
      tactical:   'Set one ambitious outcome for the quarter and give the team full ownership of how to reach it.',
    },
    watch: {
      diplomatic: 'Adding check-ins or connection rituals the team does not need. Performing teams can slide back when leaders over-manage.',
      strategic:  'Getting too future-focused while neglecting the present execution environment.',
      logistical: 'Introducing new process or audit mechanisms the team experiences as surveillance.',
      tactical:   'Continuing to direct execution for a team that is capable of self-organizing. Trust the system you built.',
    },
    axon: '"A Performing team does not need a manager. It needs someone to clear the road."',
  },
  adjourning: {
    need: 'Acknowledge and honor. Name what was accomplished. Give people permission to feel whatever they feel about it ending.',
    align: {
      diplomatic: 'You are built for this stage. Honoring endings is a WHO superpower. This is where you create irreplaceable value.',
      strategic:  "Connect the team's work to a lasting legacy and larger meaning. Give it significance beyond the project.",
      logistical: 'You can support the structure of closure. Invest deliberately in the relational dimension too.',
      tactical:   'Your instinct is to move to the next task. Resist it. The team needs you to mark the ending.',
    },
    week: {
      diplomatic: 'Name what the team accomplished in your next meeting. Thank each person specifically for what only they contributed.',
      strategic:  'Write a brief legacy document: what did this team accomplish and why does it matter beyond the deliverable?',
      logistical: 'Create a structured handoff that documents what was built. Then create a moment of closure alongside it.',
      tactical:   'Block time in your calendar for a closing conversation before the team disbands. Put it in writing.',
    },
    watch: {
      diplomatic: 'Moving on emotionally before the team has had the space to close. They need you present for the ending.',
      strategic:  'Making the ending too abstract or meaning-focused without specific personal acknowledgment.',
      logistical: 'Treating the handoff as the closure. The documentation is not the ending — the acknowledgment is.',
      tactical:   'Skipping the ending entirely because the next thing is already running. The team will remember what you did not do.',
    },
    axon: '"Most leaders skip the ending. It is the thing the team remembers longest."',
  },
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
          Start mapping <span>→</span>
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
  const progress = (current / QUESTIONS.length) * 100

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
function ResultsScreen({ teamName, teamType, answers, leaderStyle, profile, onReset }) {
  const result = scoreResponses(answers)
  const [selectedStage, setSelectedStage] = useState(result.stage)

  useEffect(() => {
    saveResult({ teamName, teamType, stage: result.stage, confidence: result.confidence, leaderStyle })
  }, [])

  const stageInfo = STAGE_DATA[selectedStage]
  const insights = STAGE_INSIGHTS[selectedStage]
  const { alignment } = deriveInsights(selectedStage, leaderStyle)
  const fitConfig = FIT_CONFIG[alignment?.fit] || FIT_CONFIG.moderate

  const confidenceLabel = {
    high: 'High confidence',
    moderate: 'Moderate confidence',
    transitional: 'Transitional — between stages',
  }[result.confidence]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

      {/* Header */}
      <div className="mb-5">
        <div className="text-[10px] font-bold uppercase tracking-widest text-cyan mb-1.5">
          Team Signal Map — {teamName}
        </div>
        <h2 className="font-display text-xl font-bold text-white mb-1">
          {teamName} is in{' '}
          <span style={{ color: STAGE_COLORS[result.stage] }}>{STAGES[result.stage]?.label}</span>.
          {result.confidence === 'transitional' && result.secondaryStage && (
            <span className="text-base font-normal text-white/40">
              {' '}Transitioning toward {STAGES[result.secondaryStage]?.label}
            </span>
          )}
        </h2>
        <p className="text-sm text-text-muted">
          {confidenceLabel} · Select a stage below to explore the full alignment map.
        </p>
      </div>

      {/* Stage selector pills */}
      <div className="flex gap-2 flex-wrap mb-4">
        {Object.entries(STAGES).map(([key, val]) => {
          const c = STAGE_COLORS[key]
          const isActive = selectedStage === key
          const isResult = key === result.stage
          return (
            <button
              key={key}
              onClick={() => setSelectedStage(key)}
              className="px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-200"
              style={{
                border: `1px solid ${isActive ? c : `${c}35`}`,
                background: isActive ? `${c}22` : `${c}10`,
                color: c,
                boxShadow: isActive ? `0 0 0 1px ${c}` : 'none',
              }}
            >
              {val.label}{isResult ? ' ●' : ''}
            </button>
          )
        })}
      </div>

      {/* Spider chart */}
      <SpiderMap stage={selectedStage} profile={profile} />

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 my-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-5" style={{ height: 0, borderTop: '2px dashed #B88AFF' }} />
          <span className="text-[10px] text-white/40">Stage needs</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-0.5 rounded-full bg-cyan" />
          <span className="text-[10px] text-white/40">Your Map</span>
        </div>
      </div>

      {/* Score strip */}
      <div className="flex items-center justify-center gap-6 mb-5 flex-wrap">
        <div className="text-center">
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">Alignment</div>
          <div className="font-mono text-3xl font-bold text-cyan">{stageInfo.score}</div>
        </div>
        <div
          className="px-4 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase"
          style={{ background: fitConfig.bg, border: `1px solid ${fitConfig.border}`, color: fitConfig.color }}
        >
          {fitConfig.label}
        </div>
        <div className="text-center">
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">Gap axes</div>
          <div className="font-mono text-3xl font-bold text-coral">{stageInfo.gaps}</div>
        </div>
      </div>

      {/* 4 insight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {[
          { label: 'What this stage needs', color: '#B88AFF', text: insights?.need },
          { label: 'Your alignment',        color: '#00C8FF', text: insights?.align?.[leaderStyle] },
          { label: 'This week',             color: '#FFB340', text: insights?.week?.[leaderStyle] },
          { label: 'Watch for',             color: '#FF6B6B', text: insights?.watch?.[leaderStyle] },
        ].map(({ label, color, text }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="bg-bg-surface/60 border border-white/[0.06] rounded-2xl p-4"
            style={{ borderLeft: `3px solid ${color}40` }}
          >
            <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color }}>
              {label}
            </div>
            <div className="text-sm text-white/75 leading-relaxed">{text}</div>
          </motion.div>
        ))}
      </div>

      {/* Axon quote */}
      <div className="bg-amber/[0.06] border border-amber/20 rounded-2xl px-5 py-4 flex items-start gap-3 mb-5">
        <img
          src={AXON_IMG}
          alt="Axon"
          style={{
            width: 40, height: 'auto', flexShrink: 0,
            mixBlendMode: 'screen',
            filter: 'drop-shadow(0 0 12px rgba(0,200,255,0.2))',
          }}
        />
        <div className="text-sm italic text-amber leading-relaxed">
          {insights?.axon}
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="border border-white/10 text-text-muted text-sm rounded-xl px-5 py-2.5 hover:border-white/20 hover:text-white transition-all"
      >
        Map a different team →
      </button>
    </motion.div>
  )
}

// ── Main component ───────────────────────────────────────────────────
export default function TeamSignalMap({ profile }) {
  const [screen, setScreen] = useState('setup')
  const [setup, setSetup] = useState(null)
  const [answers, setAnswers] = useState([])
  const [leaderStyle, setLeaderStyle] = useState('diplomatic')

  useEffect(() => {
    // Use prop profile first, fall back to localStorage
    const styleFromProp = profile?.dominantStyle || profile?.style
    if (styleFromProp) {
      setLeaderStyle(styleFromProp)
      return
    }
    const stored = localStorage.getItem('neuroleader_profile')
    if (stored) {
      const p = JSON.parse(stored)
      const style = p.dominantStyle || p.style || p.quadrant?.style
      if (style) setLeaderStyle(style)
    }
  }, [profile])

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
              profile={profile}
              onReset={handleReset}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
