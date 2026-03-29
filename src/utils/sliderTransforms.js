/**
 * sliderTransforms.js — Psychometric slider scoring layer
 * Behavioral anchoring, reverse scoring, acquiescence detection,
 * consistency checking, ideal-range logic, reliability flags, gap prompt.
 */

export const SLIDER_ITEMS = [
  {
    id: 'SB-1', position: 0, axis: 'who', direction: 'forward',
    recallPrompt: 'Think of a specific person on your team right now.',
    question: 'How often, in the last two weeks, did you initiate a conversation with a team member that was about them — not a task, not a project status, just them?',
    pole0: 'I did not do this once in the last two weeks.',
    pole100: 'I did this multiple times, unprompted, with multiple people. It is just how I operate.',
    scoringTarget: 'who', flags: {},
  },
  {
    id: 'SB-2', position: 1, axis: 'why', direction: 'forward',
    recallPrompt: 'Pick the most significant decision you made in the last two weeks.',
    question: 'When you last made a significant decision, how clearly could you articulate to someone else why this decision — not what or how, but why it mattered?',
    pole0: 'I would have struggled to explain the why. I knew what needed to happen but not why it mattered beyond the immediate task.',
    pole100: 'I could explain the why immediately, compellingly, to anyone in the organization. It was fully formed before I acted.',
    scoringTarget: 'why', flags: {},
  },
  {
    id: 'SB-3', position: 2, axis: 'independence', direction: 'reversed',
    recallPrompt: 'Think of the last three significant decisions you made. How many involved genuine input from others before you decided?',
    question: 'Before making a significant decision, I typically seek input from at least two or three people whose perspective I respect, even when I am fairly confident in my own read.',
    pole0: 'I almost never seek input before deciding. I trust my own judgment and move.',
    pole100: 'I always seek input before significant decisions. Acting without at least two external perspectives feels like a mistake.',
    scoringTarget: 'independence',
    flags: { reversed: true, idealRange: [35, 65] },
  },
  {
    id: 'SB-4', position: 3, axis: 'how', direction: 'forward',
    recallPrompt: 'Think about how work actually flows in your team right now.',
    question: 'How structured is the way your team currently operates — the processes, decision rights, communication rhythms — that you personally designed or significantly shaped?',
    pole0: 'My team\'s operating structure is mostly informal or inherited. I have not designed much of it intentionally.',
    pole100: 'My team operates within a clear structure I deliberately designed. The way we work is a result of my active choices.',
    scoringTarget: 'how', flags: {},
  },
  {
    id: 'SB-5', position: 4, axis: null, direction: 'trap',
    recallPrompt: 'Answer honestly — think about last week specifically.',
    question: 'I respond to every team member concern or request within the same business day it is raised, without exception.',
    pole0: 'This is almost never true. I respond when I can.',
    pole100: 'This is always true. No exception, no matter the volume.',
    scoringTarget: null,
    flags: { acquiescenceTrap: true },
  },
  {
    id: 'SB-6', position: 5, axis: 'who', direction: 'reversed',
    recallPrompt: 'Think about the last time you were genuinely overloaded. What actually got deprioritized?',
    question: 'When my workload gets heavy, keeping up with how my team members are doing personally is usually one of the first things that slips.',
    pole0: 'This never happens. Even under maximum load, I stay connected to how my team is doing as people.',
    pole100: 'This is completely true. When I am overloaded, relational check-ins are the first thing to go.',
    scoringTarget: 'who',
    flags: { reversed: true, consistencyPairWith: 'SB-1' },
  },
  {
    id: 'SB-7', position: 6, axis: 'innovation', direction: 'forward',
    recallPrompt: 'Count specific instances only. If you cannot think of a specific example, that is data.',
    question: 'In the last month, how many times did you propose or implement an approach that had not been tried before in your team or organization — not an improvement on existing practice, a genuinely new one?',
    pole0: 'Zero. Everything I did last month was an iteration on something that already existed.',
    pole100: 'Multiple times. New approaches are a regular feature of how I lead, not an occasional event.',
    scoringTarget: 'innovation', flags: {},
  },
  {
    id: 'SB-8', position: 7, axis: 'recognition', direction: 'forward',
    recallPrompt: 'Think about the last time a project you contributed significantly to was recognized by leadership.',
    question: 'When a project goes well and leadership acknowledges the outcome, I notice whether my specific contribution was named — and it affects how I feel about the work.',
    pole0: 'I genuinely do not track whether my contribution is named. The outcome matters; the credit does not.',
    pole100: 'I always notice. If my contribution is not specifically named, I feel underacknowledged regardless of the overall praise.',
    scoringTarget: 'recognition',
    flags: { watch: true, watchThreshold: 70 },
  },
  {
    id: 'SB-9', position: 8, axis: 'trust-relational', direction: 'forward',
    recallPrompt: 'Think of the person on your team who is most cautious about bringing bad news. Would they come to you early?',
    question: 'How confident are you that someone on your team would bring you a problem before it became a crisis — because they trust you will respond without making it worse for them?',
    pole0: 'Not confident. My team generally manages problems until they have no choice but to escalate.',
    pole100: 'Completely confident. Even the most cautious person on my team would come to me early because they have seen it is safe.',
    scoringTarget: 'trust-relational',
    flags: { consistencyPairA: true },
  },
  {
    id: 'SB-10', position: 9, axis: 'trust-competence', direction: 'forward',
    recallPrompt: 'Count actual commitments you did not fully deliver on last month. Be specific.',
    question: 'In the last month, how many commitments did you make — to your team, your manager, or your stakeholders — that you did not fully deliver on as stated?',
    pole0: 'Multiple. I regularly make more commitments than I can fully honor, and people have adjusted for this.',
    pole100: 'None. My commitments are calibrated to what I can actually deliver. If I say I will do something, it is done.',
    scoringTarget: 'trust-competence', flags: {},
  },
];

export const GAP_PROMPT = {
  id: 'SB-13', type: 'gapPrompt',
  preText: 'Before you see your profile —',
  promptLines: [
    'Think of someone who has watched you lead. Someone who was in the room when things got hard.',
    'If they answered these questions about you — where do you think they would score you lower than you scored yourself?',
  ],
  instruction: 'Select one item from the list.',
  postText: 'That gap is real. We\'ve noted it. You\'ll see it again in Go Deeper.',
};

export function reverseScore(raw) { return 100 - raw; }

export function applyAcquiescenceCorrection(transformedValues) {
  const corrected = { ...transformedValues };
  for (const item of SLIDER_ITEMS) {
    if (item.direction === 'forward' && corrected[item.id] != null) {
      corrected[item.id] = Math.max(0, corrected[item.id] - 8);
    }
  }
  return corrected;
}

export function computeIndependenceFlags(rawSB3) {
  if (rawSB3 < 15) return { isolationRisk: true, overConsensusRisk: false, independenceLevel: 'extreme-high' };
  if (rawSB3 < 35) return { isolationRisk: false, overConsensusRisk: false, independenceLevel: 'high' };
  if (rawSB3 <= 65) return { isolationRisk: false, overConsensusRisk: false, independenceLevel: 'ideal' };
  if (rawSB3 <= 85) return { isolationRisk: false, overConsensusRisk: false, independenceLevel: 'moderate' };
  return { isolationRisk: false, overConsensusRisk: true, independenceLevel: 'low' };
}

export function checkWHOConsistency(rawSB1, rawSB6) {
  const sb6Inverted = 100 - rawSB6;
  const divergence = Math.abs(rawSB1 - sb6Inverted);
  return { divergence, reliable: divergence <= 30 };
}

export function checkTrustConsistency(rawSB9, rawSB6) {
  const sb6Inverted = 100 - rawSB6;
  const sum = rawSB9 + sb6Inverted;
  return { sum, reliable: sum <= 160 };
}

export function idealRangeScore(raw, lo = 35, hi = 65) {
  if (raw >= lo && raw <= hi) return 100;
  if (raw < lo) return Math.round((raw / lo) * 100);
  return Math.round(((100 - raw) / (100 - hi)) * 100);
}

export function transformSliders(rawValues, gapSelection = null) {
  if (!rawValues || rawValues.length < 10) throw new Error('Slider section requires exactly 10 raw values');
  const raw = {};
  const transformed = {};
  for (const item of SLIDER_ITEMS) { raw[item.id] = rawValues[item.position]; }
  const acquiescenceFlag = raw['SB-5'] > 80;
  for (const item of SLIDER_ITEMS) {
    if (item.direction === 'reversed') transformed[item.id] = reverseScore(raw[item.id]);
    else if (item.direction === 'trap') transformed[item.id] = null;
    else transformed[item.id] = raw[item.id];
  }
  const finalValues = acquiescenceFlag ? applyAcquiescenceCorrection(transformed) : { ...transformed };
  const independenceFlags = computeIndependenceFlags(raw['SB-3']);
  const independenceIdealScore = idealRangeScore(reverseScore(raw['SB-3']));
  const whoConsistency = checkWHOConsistency(raw['SB-1'], raw['SB-6']);
  const trustConsistency = checkTrustConsistency(raw['SB-9'], raw['SB-6']);
  const lowReliability = !whoConsistency.reliable || !trustConsistency.reliable;
  const recognitionWatch = raw['SB-8'] > 70;
  const axisContributions = { who: 0, why: 0, what: 0, how: 0 };
  const attrContributions = { independence: 0, innovation: 0, recognition: 0, 'trust-relational': 0, 'trust-competence': 0 };
  for (const item of SLIDER_ITEMS) {
    const val = finalValues[item.id];
    if (val == null) continue;
    const target = item.scoringTarget;
    if (!target) continue;
    if (target in axisContributions) axisContributions[target] += val;
    else if (target in attrContributions) attrContributions[target] = val;
  }
  const gapItem = gapSelection != null ? {
    index: gapSelection,
    label: SLIDER_ITEMS[gapSelection]?.question || null,
    itemId: SLIDER_ITEMS[gapSelection]?.id || null,
  } : null;
  return {
    raw, transformed: finalValues, axisContributions, attrContributions,
    independenceScore: independenceIdealScore, independenceFlags,
    acquiescenceFlag, lowReliability, recognitionWatch, gapItem,
    consistency: { who: whoConsistency, trust: trustConsistency },
  };
}
