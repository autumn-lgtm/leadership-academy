import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { analyzeTrustSignals } from '../../api/anthropic'

// ── Trust Index table ─────────────────────────────────────────────
const TI_TABLE = [
  { min: 0,  max: 19, color: '#FF6B6B', label: 'Critical.',   text: 'This relationship is running on compliance, not belief.' },
  { min: 20, max: 39, color: '#FFB340', label: 'Fragile.',    text: 'Trust exists in pockets. One failure could collapse the whole thing.' },
  { min: 40, max: 59, color: '#FFB340', label: 'Building.',   text: 'Functional, not anchored. One breach shifts it.' },
  { min: 60, max: 79, color: '#00C8FF', label: 'Strong.',     text: 'People extend good faith here. Hard-earned — protect it.' },
  { min: 80, max: 100,color: '#00E896', label: 'Anchored.',   text: 'This is a competitive advantage. People go beyond because they believe.' },
]

const RINS = [
  [0,  3, 'Information is arriving filtered. Bad news is being held.'],
  [4,  6, 'Safety exists in some conditions. People self-censor on the hard things.'],
  [7, 10, 'Open channel. People treat you as a safe receiver of the real picture.'],
]
const CINS = [
  [0,  3, 'People follow direction but privately reserve judgment.'],
  [4,  6, 'Track record is working for you. Share more reasoning and it compounds.'],
  [7, 10, 'People trust your calls. Less consensus-seeking needed. Faster execution.'],
]
const SINS = [
  [0,  3, 'People see the system as arbitrary. Discretionary effort is at risk.'],
  [4,  6, 'Uncertainty about whether good work is reliably seen. Watch for quiet cynicism.'],
  [7, 10, 'People believe good work is seen and rewarded. A retention multiplier.'],
]
const AXON_LINES = [
  'Think about last week. Not your best week. Last week.',
  'Every number here is a behavior, not a trait.',
  'Trust is built in small moments. It collapses in one.',
  'The gap between what you intend and what lands is where this lives.',
]
const LOAD_MSGS = [
  'Reading the language…',
  'Looking for what\'s missing…',
  'Scoring the signals…',
  'Almost done.',
]

function getTI(score) {
  return TI_TABLE.find(t => score >= t.min && score <= t.max) || TI_TABLE[2]
}
function getIns(val, table) {
  return (table.find(([lo, hi]) => val >= lo && val <= hi) || table[2])[2]
}

// ── Reusable sub-components ──────────────────────────────────────

function AxonNudge({ text }) {
  return (
    <div className="flex items-center gap-3 mb-5 p-3 rounded-xl border"
      style={{ background: 'rgba(255,179,64,0.04)', borderColor: 'rgba(255,179,64,0.12)' }}>
      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs border"
        style={{ background: 'rgba(255,179,64,0.1)', borderColor: 'rgba(255,179,64,0.2)', color: '#FFB340' }}>
        ◎
      </div>
      <p className="text-xs italic leading-relaxed" style={{ color: '#FFB340' }}>{text}</p>
    </div>
  )
}

function TrustBar({ score, numId }) {
  const ti = getTI(score)
  return (
    <div className="rounded-2xl border p-5" style={{ background: '#0D1422', borderColor: 'rgba(255,255,255,0.06)' }}>
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/40">Trust Index</span>
        <motion.span
          key={score}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="font-display text-4xl font-black"
          style={{ color: ti.color }}
        >
          {score}
        </motion.span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden mb-1.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <motion.div
          className="h-full rounded-full"
          animate={{ width: `${score}%`, background: ti.color }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
      <div className="flex justify-between mb-3">
        {['Critical', 'Fragile', 'Building', 'Strong', 'Anchored'].map(z => (
          <span key={z} className="text-[9px]" style={{ color: 'rgba(100,180,255,0.2)' }}>{z}</span>
        ))}
      </div>
      <div className="flex items-start gap-2.5">
        <motion.div
          className="w-2 h-2 rounded-full shrink-0 mt-1"
          animate={{ background: ti.color }}
          transition={{ duration: 0.5 }}
        />
        <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
          <strong style={{ color: ti.color }}>{ti.label}</strong> {ti.text}
        </p>
      </div>
    </div>
  )
}

function SliderRow({ label, value, onChange, colorClass, colorHex }) {
  const pct = (value / 10) * 100
  return (
    <div className="flex items-center gap-3 mb-2.5">
      <p className="text-xs flex-1 leading-snug" style={{ color: 'rgba(255,255,255,0.8)' }}>{label}</p>
      <div className="w-24 shrink-0">
        <input
          type="range" min="0" max="10" step="1" value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full h-[3px] rounded-sm cursor-pointer outline-none appearance-none"
          style={{
            background: `linear-gradient(to right, ${colorHex} ${pct}%, rgba(255,255,255,0.06) ${pct}%)`,
          }}
        />
      </div>
      <span className="text-[11px] font-bold w-4 text-right tabular-nums" style={{ color: colorHex }}>{value}</span>
    </div>
  )
}

function DimCard({ score, label, color }) {
  return (
    <div className="rounded-xl border p-3 text-center" style={{ background: '#0D1422', borderColor: 'rgba(255,255,255,0.06)' }}>
      <div className="font-display text-2xl font-black mb-1" style={{ color }}>{score}</div>
      <div className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</div>
    </div>
  )
}

const CHIP_COLORS = {
  green:  { bg: 'rgba(0,232,150,0.07)',   border: 'rgba(0,232,150,0.2)',   color: '#00E896' },
  amber:  { bg: 'rgba(255,179,64,0.07)',  border: 'rgba(255,179,64,0.2)',  color: '#FFB340' },
  coral:  { bg: 'rgba(255,107,107,0.07)', border: 'rgba(255,107,107,0.2)', color: '#FF6B6B' },
  cyan:   { bg: 'rgba(0,200,255,0.07)',   border: 'rgba(0,200,255,0.2)',   color: '#00C8FF' },
  purple: { bg: 'rgba(184,138,255,0.07)', border: 'rgba(184,138,255,0.2)', color: '#B88AFF' },
}

const FINDING_COLORS = {
  positive: { border: '#00E896', labelColor: '#00E896' },
  caution:  { border: '#FFB340', labelColor: '#FFB340' },
  concern:  { border: '#FF6B6B', labelColor: '#FF6B6B' },
}

// ── Self-Report view ──────────────────────────────────────────────

function SelfReport() {
  const [r, setR] = useState([5, 5, 5, 5])
  const [c, setC] = useState([5, 5, 5, 5])
  const [s, setS] = useState([5, 5, 5, 5])

  const avg = arr => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)
  const rAvg = avg(r), cAvg = avg(c), sAvg = avg(s)
  const ti = Math.round(((rAvg + cAvg + sAvg) / 3) * 10)
  const axonIdx = ti < 30 ? 0 : ti < 50 ? 1 : ti < 70 ? 2 : 3

  const R_QUESTIONS = [
    'You do what you said you would do.',
    'People challenge you in the room, not after.',
    'Bad news arrives fast and unfiltered.',
    'After friction, the relationship repairs quickly.',
  ]
  const C_QUESTIONS = [
    'You explain why, not just what.',
    'You say "I don\'t know" without flinching.',
    'When a commitment is at risk, you say so first.',
    'Mistakes get named by the person who made them.',
  ]
  const S_QUESTIONS = [
    'Good work gets noticed — not just by you.',
    'People ask for help before they\'re drowning.',
    'Decisions that affect people include people.',
    'People advocate for each other, not just themselves.',
  ]

  const DIM_CARDS = [
    { color: '#00C8FF', title: 'Relational', sub: 'Do people bring you the real picture?',
      icon: '◈', iconBg: 'rgba(0,200,255,0.08)', iconBorder: 'rgba(0,200,255,0.15)',
      vals: r, setVals: setR, questions: R_QUESTIONS, insTable: RINS, avg: rAvg },
    { color: '#B88AFF', title: 'Competence', sub: 'Do people trust your calls?',
      icon: '⬡', iconBg: 'rgba(184,138,255,0.08)', iconBorder: 'rgba(184,138,255,0.15)',
      vals: c, setVals: setC, questions: C_QUESTIONS, insTable: CINS, avg: cAvg },
    { color: '#00E896', title: 'Systemic', sub: 'Do people believe the system is fair?',
      icon: '◉', iconBg: 'rgba(0,232,150,0.08)', iconBorder: 'rgba(0,232,150,0.15)',
      vals: s, setVals: setS, questions: S_QUESTIONS, insTable: SINS, avg: sAvg },
  ]

  return (
    <div>
      <AxonNudge text={AXON_LINES[axonIdx]} />

      {DIM_CARDS.map(dim => (
        <div key={dim.title} className="rounded-2xl border p-5 mb-3"
          style={{ background: '#0D1422', borderColor: 'rgba(255,255,255,0.06)' }}>
          {/* Card header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs border"
              style={{ background: dim.iconBg, borderColor: dim.iconBorder, color: dim.color }}>
              {dim.icon}
            </div>
            <div>
              <div className="font-display text-sm font-bold text-white">{dim.title}</div>
              <div className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{dim.sub}</div>
            </div>
          </div>

          {dim.questions.map((q, i) => (
            <SliderRow
              key={i} label={q}
              value={dim.vals[i]}
              onChange={v => { const next = [...dim.vals]; next[i] = v; dim.setVals(next) }}
              colorHex={dim.color}
            />
          ))}

          <motion.div
            key={dim.avg}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            className="mt-3 px-3 py-2 rounded-lg text-xs leading-relaxed"
            style={{
              background: '#111b28',
              borderLeft: `2px solid ${dim.color}40`,
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            {getIns(dim.avg, dim.insTable)}
          </motion.div>
        </div>
      ))}

      {/* High trust signals */}
      <div className="rounded-2xl border p-5 mb-3" style={{ background: '#0D1422', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="text-[10px] font-bold uppercase tracking-[0.12em] mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
          What high trust actually looks like
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { c: 'cyan',   label: 'Relational', text: 'Bad news travels fast and arrives unfiltered.' },
            { c: 'cyan',   label: 'Relational', text: 'Disagreement happens in the room, not after it.' },
            { c: 'purple', label: 'Competence', text: '"I don\'t know" said without flinching.' },
            { c: 'purple', label: 'Competence', text: 'Commitments made slowly and kept completely.' },
            { c: 'green',  label: 'Systemic',   text: 'People ask for help before they\'re drowning.' },
            { c: 'green',  label: 'Systemic',   text: 'Good news and bad news move at the same speed.' },
          ].map((item, i) => {
            const col = { cyan: '#00C8FF', purple: '#B88AFF', green: '#00E896' }[item.c]
            return (
              <div key={i} className="rounded-lg px-3 py-2"
                style={{ background: '#111b28', borderLeft: `2px solid ${col}30` }}>
                <div className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: col }}>{item.label}</div>
                <div className="text-[11px] leading-snug" style={{ color: 'rgba(255,255,255,0.5)' }}>{item.text}</div>
              </div>
            )
          })}
        </div>
      </div>

      <TrustBar score={ti} />

      {/* V2 gap panel */}
      <div className="rounded-2xl border p-5 mt-3" style={{ background: '#0D1422', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Leader vs Team Gap
          </span>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded border"
            style={{ background: 'rgba(255,179,64,0.08)', borderColor: 'rgba(255,179,64,0.2)', color: '#FFB340', letterSpacing: '0.07em' }}>
            V2
          </span>
        </div>
        <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
          The most important number isn't your score. It's the distance between your score and your team's score of you.
        </p>
        {[
          { label: 'Relational', pct: 22, color: '#00C8FF' },
          { label: 'Competence', pct: 38, color: '#B88AFF' },
          { label: 'Systemic',   pct: 14, color: '#00E896' },
        ].map(row => (
          <div key={row.label} className="flex items-center gap-3 mb-2">
            <span className="text-[10px] w-20 shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }}>{row.label}</span>
            <div className="flex-1 h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="h-full rounded-full" style={{ width: `${row.pct}%`, background: row.color, opacity: 0.35 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Behavioral view ───────────────────────────────────────────────

function BehavioralView() {
  const [text, setText] = useState('')
  const [contextType, setContextType] = useState('')
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadMsg, setLoadMsg] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFile = useCallback(e => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setText(ev.target.result)
    reader.readAsText(file)
  }, [])

  async function run() {
    if (text.trim().length < 30) return
    setLoading(true)
    setError(null)
    setResult(null)
    let mi = 0
    setLoadMsg(LOAD_MSGS[0])
    const ticker = setInterval(() => {
      mi++
      setLoadMsg(LOAD_MSGS[mi % LOAD_MSGS.length])
    }, 1300)
    try {
      const data = await analyzeTrustSignals(text, contextType, role)
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      clearInterval(ticker)
      setLoading(false)
    }
  }

  const rS = result ? Math.min(10, Math.max(0, Math.round(result.relational_score))) : null
  const cS = result ? Math.min(10, Math.max(0, Math.round(result.competence_score))) : null
  const sS = result ? Math.min(10, Math.max(0, Math.round(result.systemic_score))) : null
  const bTI = rS !== null ? Math.round(((rS + cS + sS) / 3) * 10) : null

  return (
    <div>
      <AxonNudge text="The pattern is in the language. You just have to know what to look for." />

      {/* Drop / paste area */}
      <label
        className="block rounded-2xl border border-dashed p-6 text-center cursor-pointer transition-all mb-3"
        style={{ borderColor: 'rgba(100,180,255,0.15)', background: 'transparent' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,200,255,0.3)'; e.currentTarget.style.background = 'rgba(0,200,255,0.02)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(100,180,255,0.15)'; e.currentTarget.style.background = 'transparent' }}
      >
        <input type="file" accept=".txt,.md" className="hidden" onChange={handleFile} />
        <div className="font-display text-sm font-bold text-white mb-1">Drop a conversation</div>
        <div className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Slack thread · 1:1 transcript · Email · Meeting notes · Described situation<br />Nothing is stored.
        </div>
        <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all"
          style={{ background: '#111b28', borderColor: 'rgba(100,180,255,0.15)', color: 'rgba(255,255,255,0.7)' }}>
          Choose file
        </span>
      </label>

      <div className="flex items-center gap-3 my-3">
        <div className="flex-1 h-px" style={{ background: 'rgba(100,180,255,0.07)' }} />
        <span className="text-[11px]" style={{ color: 'rgba(100,180,255,0.25)' }}>or paste it</span>
        <div className="flex-1 h-px" style={{ background: 'rgba(100,180,255,0.07)' }} />
      </div>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={5}
        placeholder={"Paste or describe what happened. The more specific, the sharper the signal.\n\nExample: 'In our 1:1 Sarah said the project was on track. Two days later engineering told me it was 3 weeks behind.'"}
        className="w-full rounded-2xl border p-4 text-sm leading-relaxed resize-y outline-none transition-colors"
        style={{
          background: '#0D1422', borderColor: 'rgba(255,255,255,0.07)',
          color: 'rgba(255,255,255,0.85)', minHeight: 120,
        }}
        onFocus={e => e.target.style.borderColor = 'rgba(100,180,255,0.18)'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.07)'}
      />

      <div className="grid grid-cols-2 gap-2 mt-2 mb-3">
        {[
          { id: 'ctx', val: contextType, set: setContextType, placeholder: 'What kind of conversation?', options: [
            ['1on1', '1:1 meeting'], ['slack', 'Slack / async'], ['email', 'Email thread'],
            ['perf', 'Performance conversation'], ['team', 'Team meeting'],
            ['situation', 'Described situation'], ['feedback', 'Feedback conversation'],
          ]},
          { id: 'role', val: role, set: setRole, placeholder: 'Your role?', options: [
            ['leader', "I'm the leader"], ['member', "I'm the team member"],
            ['peer', 'Peer or observer'], ['hr', 'HR / People Ops'],
          ]},
        ].map(sel => (
          <select
            key={sel.id}
            value={sel.val}
            onChange={e => sel.set(e.target.value)}
            className="rounded-xl border px-3 py-2 text-xs outline-none cursor-pointer"
            style={{ background: '#0D1422', borderColor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)' }}
          >
            <option value="">{sel.placeholder}</option>
            {sel.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        ))}
      </div>

      <button
        onClick={run}
        disabled={loading || text.trim().length < 30}
        className="w-full py-3 rounded-xl border font-bold text-[11px] uppercase tracking-wider transition-all"
        style={{
          background: '#111b28',
          borderColor: loading || text.trim().length < 30 ? 'rgba(255,255,255,0.06)' : 'rgba(100,180,255,0.18)',
          color: loading || text.trim().length < 30 ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.85)',
          cursor: loading || text.trim().length < 30 ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? loadMsg : 'Read the Trust Signals →'}
      </button>

      {loading && (
        <div className="flex justify-center mt-5">
          <motion.div
            className="w-6 h-6 rounded-full border-2"
            style={{ borderColor: 'rgba(0,200,255,0.15)', borderTopColor: '#00C8FF' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      )}

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 rounded-xl p-3 border"
            style={{ background: 'rgba(255,107,107,0.06)', borderColor: 'rgba(255,107,107,0.2)' }}
          >
            <p className="text-xs" style={{ color: '#FF6B6B' }}>{error}</p>
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 160, damping: 20 }}
            className="mt-5 space-y-3"
          >
            <div className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: 'rgba(255,255,255,0.35)' }}>
              What came up
            </div>

            {/* Chips */}
            <div className="flex flex-wrap gap-1.5">
              {(result.chips || []).map((ch, i) => {
                const col = CHIP_COLORS[ch.type] || CHIP_COLORS.cyan
                return (
                  <span key={i} className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border"
                    style={{ background: col.bg, borderColor: col.border, color: col.color }}>
                    {ch.label}
                  </span>
                )
              })}
            </div>

            {/* Dimension scores */}
            <div className="grid grid-cols-3 gap-2">
              <DimCard score={rS} label="Relational" color="#00C8FF" />
              <DimCard score={cS} label="Competence" color="#B88AFF" />
              <DimCard score={sS} label="Systemic"   color="#00E896" />
            </div>

            {/* Findings */}
            <div className="space-y-2">
              {(result.findings || []).map((f, i) => {
                const col = FINDING_COLORS[f.type] || FINDING_COLORS.caution
                return (
                  <div key={i} className="rounded-xl px-3.5 py-3" style={{ background: '#111b28', borderLeft: `3px solid ${col.border}` }}>
                    <div className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: col.labelColor }}>{f.label}</div>
                    <div className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>{f.text}</div>
                  </div>
                )
              })}
            </div>

            <TrustBar score={bTI} />

            <div className="text-[10px] font-bold uppercase tracking-[0.12em] pt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
              What to do next
            </div>
            <div className="space-y-2">
              {(result.priority_actions || []).map((a, i) => (
                <div key={i} className="flex gap-3 items-start rounded-xl px-3.5 py-3" style={{ background: '#111b28' }}>
                  <span className="text-sm shrink-0 mt-0.5" style={{ color: '#00C8FF' }}>→</span>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#00C8FF' }}>{a.label}</div>
                    <div className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{a.text}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-lg px-3 py-2.5 text-[10px] leading-relaxed"
              style={{ background: '#111b28', color: 'rgba(100,180,255,0.25)' }}>
              One conversation is a data point, not a verdict. Patterns across many conversations are diagnostic.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────

export default function TrustPulse() {
  const [mode, setMode] = useState('self')

  return (
    <div>
      {/* Editorial header */}
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-3">Trust Pulse</p>
        <h1 className="font-display text-4xl md:text-5xl font-black text-white leading-none mb-3">
          How Much Do<br />
          <span className="bg-gradient-to-r from-cyan to-emerald bg-clip-text text-transparent">
            They Trust You?
          </span>
        </h1>
        <p className="text-sm max-w-md leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Two ways to read the signal. Rate yourself, or drop a real conversation.
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-1 p-1 rounded-xl border mb-6"
        style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
        {[
          { key: 'self', label: '◈ Self-Report' },
          { key: 'beh',  label: '⬡ Read a Conversation' },
        ].map(m => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className="flex-1 py-2 px-3 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all"
            style={mode === m.key ? {
              background: '#18263a', color: 'rgba(255,255,255,0.9)',
              border: '1px solid rgba(100,180,255,0.14)',
            } : {
              background: 'transparent', color: 'rgba(255,255,255,0.35)',
              border: '1px solid transparent',
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {mode === 'self' ? <SelfReport /> : <BehavioralView />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
