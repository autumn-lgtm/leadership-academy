import { useState } from 'react'

const CDQ = [
  {ctx:"Information flow",text:"A project is behind schedule. What happens first?",scenario:null,axon:"Watch who moves first. That tells you everything about where the power sits.",options:[{text:"Someone on the team flags it before you have to ask.",scores:{signal:3}},{text:"It comes up in a status meeting, framed carefully.",scores:{armor:2,drift:1}},{text:"You find out from someone outside the team.",scores:{armor:3}},{text:"It surfaces when the deadline passes.",scores:{drift:3}}]},
  {ctx:"Accountability",text:"A mistake gets made in a high-visibility deliverable. What happens next?",scenario:"The error is visible to leadership.",axon:"Blame always travels somewhere. The question is which direction.",options:[{text:"The person who made it names it and owns the fix.",scores:{signal:3}},{text:"The team rallies around fixing it. No one names who did it.",scores:{signal:1,siege:1}},{text:"There's a conversation about process, not people.",scores:{drift:2}},{text:"Someone gets quietly blamed. Not in the room.",scores:{armor:3}}]},
  {ctx:"Meetings",text:"In your team meetings, who speaks?",scenario:null,axon:"The people who don't speak have already decided what's safe.",options:[{text:"Different people depending on the topic. Real back-and-forth.",scores:{signal:3}},{text:"A few consistent voices. Others listen.",scores:{armor:2,drift:1}},{text:"Mostly you, and whoever you direct questions to.",scores:{armor:3}},{text:"People speak, but agreement happens fast — rarely any pushback.",scores:{siege:2,armor:1}}]},
  {ctx:"Bad news",text:"Someone knows a decision you made isn't working. What do they do?",scenario:null,axon:"The speed of bad news is the most honest metric you have.",options:[{text:"They tell you directly. Same day.",scores:{signal:3}},{text:"They mention it sideways — as a question, not a statement.",scores:{armor:2}},{text:"They wait for a 1:1 to bring it up privately.",scores:{armor:1,drift:1}},{text:"They don't say anything. They work around it.",scores:{armor:3,drift:1}}]},
  {ctx:"Failure",text:"A team member fails publicly. How does the team respond?",scenario:"The failure was visible outside the team.",axon:"How a team treats its own after a failure tells you who they are.",options:[{text:"People rally. They help fix it and don't make it a story.",scores:{signal:3}},{text:"People are supportive privately but careful publicly.",scores:{siege:2,armor:1}},{text:"There's visible distance. People don't want the association.",scores:{armor:3}},{text:"It becomes an example people reference to avoid similar risks.",scores:{armor:2,drift:1}}]},
  {ctx:"Cross-team",text:"Another team causes a problem that impacts yours. What happens?",scenario:null,axon:"Watch who gets blamed. Then watch how fast.",options:[{text:"Your team names the impact and works on the fix together.",scores:{signal:3}},{text:"There's frustration internally but professionalism externally.",scores:{siege:1,signal:1}},{text:"Your team closes ranks. Us vs. them language starts.",scores:{siege:3}},{text:"People point to the other team. Accountability lands there.",scores:{siege:2,armor:1}}]},
  {ctx:"Standards",text:"Your team's standards vary by person. Some hold themselves to high expectations. Others don't.",scenario:"This has been true for a while.",axon:"Inconsistent standards don't enforce themselves. Someone chose not to address them.",options:[{text:"You address it directly with the individuals involved.",scores:{signal:2}},{text:"The high performers carry the load. It's understood but not discussed.",scores:{drift:3}},{text:"It gets mentioned in team conversations but nothing changes.",scores:{drift:2,armor:1}},{text:"The low standards belong to someone you don't want to confront.",scores:{armor:2,drift:1}}]},
  {ctx:"Recognition",text:"A team member does excellent work that isn't visible to leadership.",scenario:null,axon:"What gets recognized shapes what gets repeated.",options:[{text:"You make it visible. You name it specifically and publicly.",scores:{signal:3}},{text:"You mention it in their next 1:1.",scores:{signal:1}},{text:"It gets noted internally but doesn't go anywhere.",scores:{drift:2}},{text:"You wait until their review to bring it up.",scores:{drift:2,armor:1}}]},
  {ctx:"Disagreement",text:"Two strong people on your team disagree. Publicly.",scenario:"Both are senior. Both are confident they're right.",axon:"The way conflict ends tells you more than the way it started.",options:[{text:"It gets resolved in the room. Both leave with a shared position.",scores:{signal:3}},{text:"It gets tabled. Resolved offline, never fully surfaced.",scores:{armor:2,drift:1}},{text:"One person wins. The other disengages.",scores:{armor:2,siege:1}},{text:"You step in and make the call to end it.",scores:{armor:1,drift:1}}]},
  {ctx:"Newcomers",text:"A new person joins the team. How do they learn what's actually expected?",scenario:null,axon:"Culture is most visible to the person seeing it for the first time.",options:[{text:"The norms are named explicitly. They're told what good looks like.",scores:{signal:3}},{text:"They figure it out by watching what gets rewarded and what doesn't.",scores:{drift:2}},{text:"Someone takes them aside and gives them the real story.",scores:{siege:2}},{text:"They ask questions. Some answers are inconsistent.",scores:{drift:3}}]},
  {ctx:"Pressure",text:"The team is under serious deadline pressure. What changes?",scenario:"Not a normal sprint — sustained, high-stakes pressure.",axon:"Culture is what happens under pressure. Everything else is just the story you tell about it.",options:[{text:"People lean in. Communication speeds up. Less process, more direct.",scores:{signal:3}},{text:"Everyone works harder but in parallel. Less coordination.",scores:{drift:2}},{text:"Status protection increases. People guard their lane.",scores:{armor:3}},{text:"The team closes ranks. Strong internal loyalty but less transparency upward.",scores:{siege:2,armor:1}}]},
  {ctx:"Truth vs. safety",text:"You have information leadership above you needs to hear. It reflects poorly on your team.",scenario:null,axon:"What you do with uncomfortable truth is the real diagnostic.",options:[{text:"You share it directly. They need the accurate picture.",scores:{signal:3}},{text:"You share it, but frame it carefully to protect your team.",scores:{siege:1,armor:1}},{text:"You wait until you have more context before surfacing it.",scores:{armor:2}},{text:"You don't share it. Your job is to protect your team.",scores:{siege:3}}]},
  {ctx:"Revenue miss",text:"The team is behind on revenue goals. Everyone knows it. Leadership asks for an update.",scenario:"You're two-thirds through the quarter. The gap is significant.",axon:"Watch what happens to the number between what people know and what gets said out loud.",options:[{text:"Someone gives the honest number with a clear recovery plan. No spin.",scores:{signal:3}},{text:"The update focuses on activity and pipeline. The gap gets acknowledged at the end.",scores:{armor:2,drift:1}},{text:"The number gets shared but the narrative is optimistic in a way that isn't quite accurate.",scores:{armor:3}},{text:"People wait to see what you say first before they speak.",scores:{armor:2,siege:1}}]},
  {ctx:"Customer loss",text:"You've lost customers. More than you should have. How does the team talk about it?",scenario:"The churn is visible and the pattern has been there for a while.",axon:"The story a team tells about lost customers is the story they tell about themselves.",options:[{text:"The team names what's actually causing it — including things within their control.",scores:{signal:3}},{text:"There's a post-mortem process. Thorough on data, careful on ownership.",scores:{drift:2,armor:1}},{text:"The reasons are mostly external. Market, pricing, competition.",scores:{armor:3}},{text:"One function or person gets associated with the problem. Quietly.",scores:{armor:2,siege:1}}]},
]

const CDCT = {
  signal: {
    name: 'Signal Culture', color: '#00e896',
    def: 'High trust, fast truth, open learning. Bad news travels fast. Mistakes are named by the people who made them. Disagreement happens in the room, not after it.',
    neuro: 'Operating in reward state. The prefrontal cortex is engaged. People are thinking clearly, taking risks, and learning from failure.',
    axon: 'Your team treats you like a safe receiver of the real picture. That took time to build. It will take less time to lose.',
    gap: 'The risk in a Signal culture is complacency. High trust can become low urgency. Watch for slipping standards hidden by good relationships.',
    action_label: 'Protect the signal',
    action: 'Name one recent moment where someone brought you uncomfortable truth. Tell them specifically what it meant that they did. Recognition of that behavior is what keeps the channel open.',
  },
  armor: {
    name: 'Armor Culture', color: '#ff6b6b',
    def: 'Status protection, filtered information, downward blame. Bad news arrives late and managed. People perform confidence they don\'t feel. Meetings are theater.',
    neuro: 'Operating in status-threat state. Amygdala activation is high. The brain\'s threat response is running — people are protecting themselves, not solving problems.',
    axon: 'Information is being managed before it reaches you. The question is not whether this is happening. It\'s how long it\'s been happening.',
    gap: 'You may be reading the culture as collaborative when it\'s actually compliant. High engagement scores in an Armor culture often reflect fear of being seen as disengaged.',
    action_label: 'Create one honest moment',
    action: 'In your next team meeting, share something that didn\'t go the way you planned — specifically, what you got wrong. Watch what happens in the room after you do.',
  },
  drift: {
    name: 'Drift Culture', color: '#ffb340',
    def: 'Unclear ownership, inconsistent standards, low accountability. Good work and poor work both pass. Norms exist but aren\'t enforced. Energy is high but execution is soft.',
    neuro: 'Operating in certainty-threat state. Without clear expectations, the brain defaults to prediction error — chronic low-grade stress that drains cognitive resources.',
    axon: 'Everyone on your team has a different understanding of what good looks like. They\'re all correct, because you haven\'t decided.',
    gap: 'Drift cultures often score high on psychological safety because nothing is ever called out. The absence of conflict isn\'t safety — it\'s avoidance.',
    action_label: 'Name one standard',
    action: 'Pick one behavior your team does inconsistently. Define what it looks like when done right. Say it out loud in your next team meeting — not as a critique. As a standard.',
  },
  siege: {
    name: 'Siege Culture', color: '#b88aff',
    def: 'Strong internal loyalty, low cross-team trust. The team protects its own. Information flows freely inside but not across teams or upward. Us vs. them is the operating frame.',
    neuro: 'Operating in relatedness-threat state. In-group/out-group activation is high. The same oxytocin creating strong team bonds is suppressing cooperation with everyone outside.',
    axon: 'Your team would run through a wall for each other. The question is whether they\'d tell you the truth about the wall.',
    gap: 'Siege cultures often look like high performance from the inside. The cost shows up in cross-functional projects, leadership trust, and organizational information flow.',
    action_label: 'Open one channel',
    action: 'Identify one piece of information your team has been holding internally that leadership or another team actually needs. Surface it this week — without framing it as someone else\'s failure.',
  },
}

const LETTERS = ['A', 'B', 'C', 'D']

function computeScores(answers) {
  const sc = { signal: 0, armor: 0, drift: 0, siege: 0 }
  CDQ.forEach((q, qi) => {
    if (answers[qi] !== undefined) {
      Object.entries(q.options[answers[qi]].scores).forEach(([k, v]) => { sc[k] += v })
    }
  })
  return sc
}

function Results({ answers, onRestart }) {
  const scores = computeScores(answers)
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])
  const primary = sorted[0][0]
  const secondary = sorted[1][0]
  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1
  const ct = CDCT[primary]

  const evidence = CDQ
    .map((q, qi) => answers[qi] !== undefined && q.options[answers[qi]].scores[primary] >= 2
      ? { ctx: q.ctx, text: q.options[answers[qi]].text }
      : null
    )
    .filter(Boolean)
    .slice(0, 3)

  return (
    <div>
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-cyan mb-1">Culture Diagnostic</p>
        <p className="text-xs text-text-muted">Your team's behavioral fingerprint</p>
      </div>

      {/* Primary culture hero */}
      <div className="rounded-2xl p-5 mb-4 border" style={{ background: `${ct.color}08`, borderColor: `${ct.color}33` }}>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-1" style={{ color: ct.color }}>Primary Culture Type</p>
        <h2 className="font-display text-3xl font-black mb-2" style={{ color: ct.color }}>{ct.name}</h2>
        <p className="text-sm text-text-primary leading-relaxed mb-2">{ct.def}</p>
        <p className="text-xs text-text-muted leading-relaxed italic">{ct.neuro}</p>
      </div>

      {/* Score grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {sorted.map(([type, score]) => {
          const c = CDCT[type].color
          const pct = Math.round((score / total) * 100)
          return (
            <div key={type} className="rounded-xl p-3 border border-white/[0.06] bg-bg-surface">
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.09em]" style={{ color: c }}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
                <span className="font-display text-base font-black text-white">{pct}%</span>
              </div>
              <div className="h-[3px] rounded-full bg-white/[0.07] overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: c }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Secondary badge */}
      <div className="mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-[0.08em]"
          style={{ borderColor: `${CDCT[secondary].color}40`, color: CDCT[secondary].color, background: `${CDCT[secondary].color}0f` }}>
          Secondary: {secondary.charAt(0).toUpperCase() + secondary.slice(1)} Culture
        </span>
      </div>

      {/* Axon quote */}
      <div className="flex items-start gap-3 p-4 rounded-xl border mb-4"
        style={{ background: 'rgba(255,180,64,0.04)', borderColor: 'rgba(255,180,64,0.15)' }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
          style={{ background: 'rgba(255,180,64,0.1)', border: '1px solid rgba(255,180,64,0.2)' }}>◎</div>
        <p className="text-sm text-amber-400 italic leading-relaxed">{ct.axon}</p>
      </div>

      {/* Evidence */}
      {evidence.length > 0 && (
        <div className="rounded-2xl p-4 border border-white/[0.06] bg-bg-surface mb-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted mb-3">Behavioral Evidence</p>
          {evidence.map((e, i) => (
            <div key={i} className={`flex gap-2.5 items-start ${i < evidence.length - 1 ? 'mb-3 pb-3 border-b border-white/[0.06]' : ''}`}>
              <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: ct.color }} />
              <div>
                <p className="text-xs text-text-primary leading-relaxed">{e.text}</p>
                <p className="text-[10px] text-text-muted mt-0.5 italic">{e.ctx}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* The Gap */}
      <div className="rounded-2xl p-4 border border-white/[0.06] bg-bg-surface mb-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted mb-3">The Gap</p>
        <div className="rounded-lg p-3 border-l-[3px]" style={{ background: '#131e2c', borderColor: '#ffb340' }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-amber-400 mb-1">What to watch for</p>
          <p className="text-xs text-text-primary leading-relaxed">{ct.gap}</p>
        </div>
      </div>

      {/* This Week */}
      <div className="rounded-2xl p-4 border border-white/[0.06] bg-bg-surface mb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted mb-3">This Week</p>
        <div className="flex gap-2.5 items-start rounded-lg p-3" style={{ background: '#131e2c' }}>
          <span className="text-cyan text-base shrink-0 mt-0.5">→</span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.09em] text-cyan mb-1">{ct.action_label}</p>
            <p className="text-xs text-text-primary leading-relaxed">{ct.action}</p>
          </div>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="w-full py-3 rounded-xl border border-white/[0.08] text-text-muted text-[11px] font-bold uppercase tracking-[0.1em] hover:text-white transition-colors"
        style={{ background: '#18263a' }}
      >
        Run it again →
      </button>
    </div>
  )
}

export default function CultureDiagnostic() {
  const [cur, setCur] = useState(0)
  const [answers, setAnswers] = useState({})
  const [done, setDone] = useState(false)

  const q = CDQ[cur]
  const pct = Math.round((cur / CDQ.length) * 100)
  const isLast = cur === CDQ.length - 1
  const picked = answers[cur]

  const pick = (i) => setAnswers(prev => ({ ...prev, [cur]: i }))

  const next = () => {
    if (picked === undefined) return
    if (!isLast) setCur(c => c + 1)
    else setDone(true)
  }

  const back = () => { if (cur > 0) setCur(c => c - 1) }

  const restart = () => { setCur(0); setAnswers({}); setDone(false) }

  if (done) return <Results answers={answers} onRestart={restart} />

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-cyan mb-1">Culture Diagnostic</p>
        <p className="text-xs text-text-muted">What culture are you actually running?</p>
      </div>

      {/* Axon nudge */}
      <div className="flex items-center gap-2.5 p-3 rounded-xl border mb-5"
        style={{ background: 'rgba(255,180,64,0.04)', borderColor: 'rgba(255,180,64,0.12)' }}>
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] shrink-0"
          style={{ background: 'rgba(255,180,64,0.1)', border: '1px solid rgba(255,180,64,0.18)' }}>◎</div>
        <p className="text-xs text-amber-400 italic leading-relaxed">{q.axon}</p>
      </div>

      {/* Progress */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">
          Question {cur + 1} of {CDQ.length}
        </span>
        <span className="text-[10px] font-bold text-white/20">{pct}% complete</span>
      </div>
      <div className="h-[2px] rounded-full bg-white/[0.07] mb-5 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#00c8ff,#b88aff)' }} />
      </div>

      {/* Question card */}
      <div key={cur} className="rounded-2xl p-5 border border-white/[0.07] bg-bg-surface mb-4"
        style={{ animation: 'cd-fadein 0.3s ease' }}>
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-text-muted mb-2">{q.ctx}</p>
        <p className="font-display text-base font-bold text-white leading-snug mb-4">{q.text}</p>
        {q.scenario && (
          <p className="text-xs text-text-muted italic leading-relaxed mb-4 px-3 py-2.5 rounded-lg border-l-2 border-white/10"
            style={{ background: '#131e2c' }}>{q.scenario}</p>
        )}
        <div className="flex flex-col gap-2">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => pick(i)}
              className="flex items-start gap-3 text-left px-4 py-3 rounded-xl border transition-all"
              style={{
                background: picked === i ? 'rgba(0,200,255,0.05)' : '#131e2c',
                borderColor: picked === i ? '#00c8ff' : 'rgba(100,180,255,0.07)',
              }}
            >
              <span className="text-[11px] font-bold w-4 shrink-0 mt-0.5 transition-colors"
                style={{ color: picked === i ? '#00c8ff' : 'rgba(255,255,255,0.3)' }}>
                {LETTERS[i]}
              </span>
              <span className="text-xs text-text-primary leading-relaxed">{opt.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Nav */}
      <div className="flex justify-between items-center">
        <button
          onClick={back}
          className="px-5 py-2.5 rounded-xl border border-white/[0.07] text-[11px] font-bold uppercase tracking-[0.1em] text-text-muted hover:text-white transition-colors"
          style={{ visibility: cur === 0 ? 'hidden' : 'visible' }}
        >
          ← Back
        </button>
        <button
          onClick={next}
          disabled={picked === undefined}
          className="px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.1em] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={isLast
            ? { background: '#00c8ff', color: '#060a0e', border: '1px solid #00c8ff' }
            : { background: '#18263a', color: 'white', border: '1px solid rgba(100,180,255,0.14)' }
          }
        >
          {isLast ? 'See Results →' : 'Next →'}
        </button>
      </div>

      <style>{`@keyframes cd-fadein { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }`}</style>
    </div>
  )
}
