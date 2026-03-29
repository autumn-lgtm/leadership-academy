// src/lib/parallelReality.js
// Parallel Reality Engine — generates natural and optimized responses
// plus simulated outcomes for each scenario + profile combination

import { SCENARIOS } from '../data/scenarios.js'

// ── NATURAL RESPONSES by scenario + sender style ──────────────────
const NATURAL_RESPONSES = {
  SCN_001: {
    diplomatic: 'I wanted to have a conversation about something I\'ve been noticing. I really value what you\'ve built here and I want to make sure I\'m being supportive. I\'ve been wondering if there might be some areas where we could think together about what\'s working and what might be worth exploring differently.',
    strategic: 'I\'ve been looking at the broader picture and I think there\'s a strategic gap in how we\'re approaching this function. The data suggests we\'re missing an opportunity and I want to explore whether you see what I\'m seeing before we talk about how to address it.',
    logistical: 'I\'ve documented three specific gaps in the current process. The first is the intake workflow — requests are taking 6 days when the benchmark is 2. The second is handoff clarity. The third is reporting cadence. I\'d like to walk through each one.',
    tactical: 'There\'s a gap and we need to address it. Conversion is at 23% when it should be 40%. Two things need to change by end of quarter. I want to align on what those are and who owns them.',
  },
  SCN_002: {
    diplomatic: 'I\'ve been thinking about how we tell the story of what the team has accomplished. I want to make sure we\'re doing it in a way that recognizes everyone\'s contributions, including some of the foundational work that made the results possible.',
    strategic: 'The outcomes leadership is seeing represent a system I built over 18 months. I want to make sure we\'re framing the attribution correctly — not for personal reasons, but because misattributing results leads to misunderstanding what\'s actually driving them.',
    logistical: 'For the board presentation I want to make sure we include the infrastructure work that produced these numbers. I\'ve put together a summary of the systems built, the decisions made, and the timeline. It\'s important that the full picture is visible.',
    tactical: 'I built that function. I need credit for it — not because of ego but because my next role depends on it being on my record. What\'s the best way to make sure that\'s visible to the right people?',
  },
  SCN_005: {
    diplomatic: 'I care about your growth and that\'s why I want to have this conversation. I\'ve noticed some things that I think are worth discussing and I want to do it in a way where you feel heard. Can we find some time to talk through what I\'ve been seeing?',
    strategic: 'I want to give you some feedback that I think will matter for where you\'re trying to go. The pattern I\'m seeing is getting in the way of the impact you\'re capable of. I want to name it directly because I think you can handle it and because avoiding it would be doing you a disservice.',
    logistical: 'I have specific feedback on three incidents from the past 30 days. I\'ll walk through each one: what I observed, what the impact was, and what I\'d suggest instead. I want this to be a practical conversation.',
    tactical: 'Here\'s the feedback: the presentation last Thursday lost the room in the first five minutes. The opening was too long and the ask was buried. Next time: lead with the ask, then the evidence. That\'s it.',
  },
  SCN_010: {
    diplomatic: 'I want to share a perspective on the decision and I hope it\'s useful. I understand the rationale and I support the leadership team. I\'m wondering if we\'ve fully considered the impact on the team\'s bandwidth given what\'s already in flight. I don\'t want to create friction — I just want to make sure we\'ve looked at all the angles.',
    strategic: 'I have a concern about this decision and I think it\'s worth naming before we execute. The strategic assumption underneath it may not hold given what I\'m seeing in the market. I\'d like ten minutes to walk through my thinking before we go further.',
    logistical: 'I\'ve modeled out the implementation and there are three capacity gaps that will create problems in Q2. I can share the analysis. I want to surface this early so we have time to adjust the plan rather than hit the issues at execution.',
    tactical: 'This decision is going to hit a wall at implementation. I\'ve seen this before. Before we commit I need 20 minutes to show you the three blockers. If we can\'t remove them, we should delay the decision.',
  },
  SCN_011: {
    diplomatic: 'I\'ve been thinking about how I can best support the team\'s growth. I realize I might be holding on to some things I should be handing off. I want to be intentional about creating space for people to step up, and I\'m wondering how to do that without dropping anything important.',
    strategic: 'I\'m operating too tactically. I need to shift my time allocation toward strategic work and get out of the execution layer. The question is what to let go of first and who\'s ready to take it on. I want to build a transition plan for the next 90 days.',
    logistical: 'I\'ve done a time audit. 60% of my week is in execution tasks that someone on the team could own. I\'ve identified four handoffs I can make in Q1. I\'ll document the processes, run a knowledge transfer, and set a check-in cadence for each one.',
    tactical: 'I need to stop doing the work and start directing it. This week I\'m identifying the three highest-value things I\'m doing that someone else can own. I\'m handing them off by Friday. Done.',
  },
}

// ── OPTIMIZED RESPONSES by scenario ───────────────────────────────
// Written for maximum cross-style impact
const OPTIMIZED_RESPONSES = {
  SCN_001: 'I want to share an observation and I\'d value your reaction. I\'ve noticed [specific behavior/metric]. My read is that it\'s creating [specific downstream impact]. I could be missing context — what\'s your view on what\'s driving it?',
  SCN_002: 'I want to make sure leadership has the full picture of what drove these results. The outcomes came from a system I built over [timeframe] — [specific components]. I\'d like to put together a one-pager that captures the causal chain. Would that be useful for the board deck?',
  SCN_003: 'Before we look at individuals I want to make sure we\'ve ruled out system causes. In my experience, when [metric] drops across a whole team, it\'s usually structural. Can we spend 20 minutes on root cause before we make any people decisions?',
  SCN_004: 'The turnover data concerns me and I want to make sure we\'re solving the right problem. I\'ve run the numbers and attrition is highest in the first 90 days and in [specific role]. That pattern usually points to onboarding or manager factors, not talent. Can I share the analysis before we make hiring decisions?',
  SCN_005: 'I have feedback that I think will matter for your trajectory and I want to give it to you directly. [Specific observation]. The impact I\'ve seen is [specific consequence]. I\'m sharing this because I think you can handle it and because not saying it would be a disservice. What\'s your reaction?',
  SCN_006: 'I want to have a conversation about scope and growth. Over the past [timeframe] I\'ve been operating at [specific examples of higher-level work]. I want to understand what it would take to make that level formal, and whether it\'s the right direction from your perspective.',
  SCN_007: 'The results you\'re seeing come from a system that took [timeframe] to build. I want to make sure you understand what\'s underneath them — not because I need credit, but because if we change anything without understanding the dependencies, we risk the outcomes. Can I walk you through the architecture?',
  SCN_008: 'I want to check in on something I\'ve been noticing. Over the past few weeks I\'ve observed [specific pattern] in our interactions. I want to make sure I understand what\'s going on for you and whether there\'s something I can do differently. What\'s your experience of how things have been?',
  SCN_009: 'I\'ve been tracking a pattern and I want to test whether you see it too. [Specific pattern description]. I\'ve noticed it in [3 specific examples]. My concern is [downstream consequence]. What\'s your read on it?',
  SCN_010: 'I want to raise a concern before we move forward. I support the direction and I want to make sure we\'ve thought through [specific risk]. My concern is [specific consequence with evidence]. I\'m not trying to slow things down — I want to raise it now while we still have room to adjust. Are you open to a quick conversation?',
  SCN_011: 'I\'ve been doing a time audit and I\'m spending [X]% of my week on execution work that someone else could own. I want to build a delegation plan for Q1. I\'d like your input on who\'s ready to take on what, and where you think my time is most valuable.',
  SCN_012: 'I want to test something with you. I\'m going to share the same insight two ways and I want your honest reaction to both. [Version 1]. [Version 2]. Which one landed better and why? I\'m trying to calibrate my delivery.',
}

// ── SIMULATED OUTCOMES by scenario + sender/recipient combo ────────
export function simulateOutcome(scenarioId, senderStyle, recipientStyle, version) {
  const key = `${scenarioId}_${senderStyle}_${recipientStyle}_${version}`
  return OUTCOMES[key] || generateDefaultOutcome(scenarioId, senderStyle, recipientStyle, version)
}

const OUTCOMES = {
  // SCN_001: Feedback Defensiveness
  'SCN_001_diplomatic_who_natural': {
    interpretation: 'They care but they are not telling me what the actual problem is.',
    emotionalResponse: 'Confusion with mild anxiety',
    behavioralResponse: 'Agrees to talk but does not know what to prepare for. Arrives at the conversation on guard.',
    downstreamImpact: 'Conversation starts with defensiveness already activated. The softness created the problem it was trying to prevent.',
    score: 35,
  },
  'SCN_001_diplomatic_who_optimized': {
    interpretation: 'They have a specific observation, they want my take, they are not attacking me.',
    emotionalResponse: 'Mild alertness, curiosity',
    behavioralResponse: 'Engages with the question. More likely to share context that changes the picture.',
    downstreamImpact: 'Productive conversation. Defensiveness reduced because there was no attack to defend against.',
    score: 78,
  },
  'SCN_001_tactical_what_natural': {
    interpretation: 'They are flagging a metric problem. They want names and fixes.',
    emotionalResponse: 'Urgency, slight impatience',
    behavioralResponse: 'Moves immediately to solutions. Skips the diagnostic.',
    downstreamImpact: 'Wrong problem gets solved fast. Root cause remains.',
    score: 42,
  },
  'SCN_001_tactical_what_optimized': {
    interpretation: 'They have a specific observation, they want calibration, they are open to being wrong.',
    emotionalResponse: 'Engagement, slight relief',
    behavioralResponse: 'Shares data they have. Offers context. Becomes a partner in diagnosis.',
    downstreamImpact: 'Correct root cause identified. Solution addresses actual problem.',
    score: 85,
  },

  // SCN_005: Hard Feedback Delivery
  'SCN_005_diplomatic_who_natural': {
    interpretation: 'Something is wrong but they will not tell me what. Now I am anxious.',
    emotionalResponse: 'Anticipatory anxiety, hypervigilance',
    behavioralResponse: 'Arrives at the conversation already defensive. Reads every word for threat signals.',
    downstreamImpact: 'Feedback lands worse than if delivered directly. Relationship takes a hit.',
    score: 28,
  },
  'SCN_005_diplomatic_who_optimized': {
    interpretation: 'This is a direct person who respects me enough to be honest. They are doing this because they think I can handle it.',
    emotionalResponse: 'Initial sting, then openness',
    behavioralResponse: 'Processes the feedback. Asks follow-up questions. Takes notes.',
    downstreamImpact: 'Behavior change is more likely. Relationship strengthens.',
    score: 82,
  },
  'SCN_005_tactical_who_natural': {
    interpretation: 'That was fast and blunt. They do not care how I feel about this.',
    emotionalResponse: 'Hurt, then defensiveness',
    behavioralResponse: 'Complies on the surface. Disengages emotionally. Does not internalize the feedback.',
    downstreamImpact: 'Surface behavior changes. Underlying pattern continues. Trust decreases.',
    score: 38,
  },
  'SCN_005_tactical_who_optimized': {
    interpretation: 'Specific, honest, they believe I can change it. They want me to succeed.',
    emotionalResponse: 'Surprise, then genuine engagement',
    behavioralResponse: 'Asks what a better version would have looked like. Makes it concrete.',
    downstreamImpact: 'Real behavior change. Trusts the giver more, not less.',
    score: 88,
  },

  // SCN_010: Challenging Upward
  'SCN_010_diplomatic_why_natural': {
    interpretation: 'They have a concern but they are not sure it is worth raising. Probably fine.',
    emotionalResponse: 'Slight dismissal',
    behavioralResponse: 'Files it away. Does not engage further. Decision proceeds.',
    downstreamImpact: 'Valid concern is ignored. Problem manifests at execution. Leader\'s credibility suffers.',
    score: 25,
  },
  'SCN_010_diplomatic_why_optimized': {
    interpretation: 'They have done their homework, they support the direction, and they have a specific risk worth knowing about.',
    emotionalResponse: 'Respect, curiosity',
    behavioralResponse: 'Engages with the risk. May adjust the decision or add a contingency.',
    downstreamImpact: 'Decision improves. Leader gains credibility as someone who adds value when they push back.',
    score: 86,
  },
  'SCN_010_strategic_why_natural': {
    interpretation: 'They think they see something I missed. Strong signal. Worth listening to.',
    emotionalResponse: 'Intellectual engagement',
    behavioralResponse: 'Creates space for the conversation. Asks for the analysis.',
    downstreamImpact: 'High probability the concern surfaces. Decision quality improves.',
    score: 74,
  },
  'SCN_010_strategic_why_optimized': {
    interpretation: 'Specific concern, evidence-based, constructive framing, respects the decision while surfacing the risk.',
    emotionalResponse: 'Trust, engagement',
    behavioralResponse: 'Pulls the person in closer. Values their judgment. Acts on the concern.',
    downstreamImpact: 'Best possible outcome. Decision improves and relationship strengthens.',
    score: 92,
  },
}

function generateDefaultOutcome(scenarioId, senderStyle, recipientStyle, version) {
  const isOptimized = version === 'optimized'
  return {
    interpretation: isOptimized
      ? 'Message was clear, specific, and left room for dialogue.'
      : 'Message was heard but the intent was unclear or the framing created friction.',
    emotionalResponse: isOptimized ? 'Engagement' : 'Caution or mild defensiveness',
    behavioralResponse: isOptimized
      ? 'Recipient engages constructively and moves toward resolution.'
      : 'Recipient responds cautiously or deflects.',
    downstreamImpact: isOptimized
      ? 'Productive outcome. Relationship maintained or strengthened.'
      : 'Partial outcome. Relationship may be affected.',
    score: isOptimized ? 76 : 42,
  }
}

// ── AXON LINES ────────────────────────────────────────────────────
function getScenarioAxonism(scenarioId) {
  const axonisms = {
    SCN_001: 'You are right about the gap. You are also responsible for whether they can hear it.',
    SCN_002: 'Visibility without self-promotion requires someone else to tell your story. Start there.',
    SCN_003: 'When the same problem happens across different people, it is not the people.',
    SCN_004: 'The data already has the answer. The question is whether you frame it before someone else does.',
    SCN_005: 'Softening the message to protect them is often about protecting yourself.',
    SCN_006: 'Operating above your title and being seen doing it are two different skills.',
    SCN_007: 'The system is invisible because you made it look easy. That is the problem.',
    SCN_008: 'At a distance, silence reads as absence. Presence is a communication strategy.',
    SCN_009: 'The pattern you see is data. The question is whether you can make others see the data.',
    SCN_010: 'The best time to challenge a decision is before it is announced. The second best time is now.',
    SCN_011: 'You cannot lead and do at the same time. Pick one.',
    SCN_012: 'Intent does not equal impact. Impact is the only thing the other person experiences.',
  }
  return axonisms[scenarioId] || 'The gap between what you said and what they heard is where the work is.'
}

// ── MAIN ENGINE FUNCTION ───────────────────────────────────────────
export function runParallelReality(scenarioId, profile) {
  const scenario = SCENARIOS.find(s => s.id === scenarioId)
  if (!scenario) return null

  // Support both profile.dominantStyle (stored profiles) and profile.style
  const style = profile?.dominantStyle || profile?.style || 'diplomatic'
  const natural = NATURAL_RESPONSES[scenarioId]?.[style] ||
    'I want to address this situation. Can we find time to talk?'
  const optimized = OPTIMIZED_RESPONSES[scenarioId] ||
    'I have a specific observation and I would value your perspective on it.'

  const recipientStyle = scenario.recipientProfile === 'mixed' ? 'who' : scenario.recipientProfile

  const naturalOutcome = simulateOutcome(scenarioId, style, recipientStyle, 'natural')
  const optimizedOutcome = simulateOutcome(scenarioId, style, recipientStyle, 'optimized')

  return {
    scenario,
    senderStyle: style,
    naturalMessage: natural,
    optimizedMessage: optimized,
    naturalOutcome,
    optimizedOutcome,
    gapScore: optimizedOutcome.score - naturalOutcome.score,
    axonLine: getScenarioAxonism(scenarioId),
  }
}

export { SCENARIOS }
