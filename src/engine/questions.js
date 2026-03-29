/**
 * Question Bank
 *
 * Every assessment question lives here. The scoring engine reads
 * `constructs` to know where each answer goes. Adding a question
 * means adding an object to QUESTIONS — nothing else changes.
 *
 * Shape:
 *   id         – unique string (prefix = category)
 *   category   – grouping for display/ordering
 *   text       – the question the user sees
 *   scale      – { type, min, max, labels? }
 *   constructs – [{ id, weight, ?inverse }]
 *                weight: how much this question affects the construct (0–1)
 *                inverse: if true, high answer = low construct score
 *   context    – optional tag ('baseline' | 'stress' | 'trust' | etc.)
 */

// ── Scale Presets ─────────────────────────────────────────

export const SCALES = {
  likert5: {
    type: 'likert',
    min: 1,
    max: 5,
    labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
  },
  frequency5: {
    type: 'likert',
    min: 1,
    max: 5,
    labels: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
  },
  intensity5: {
    type: 'likert',
    min: 1,
    max: 5,
    labels: ['Not at all', 'Slightly', 'Moderately', 'Very', 'Extremely'],
  },
}

// ── Question Bank ─────────────────────────────────────────

export const QUESTIONS = [

  // ═══════════════════════════════════════════════════════
  // BASELINE LEADERSHIP PATTERNS (BLP) — 16 questions
  // 4 per axis, measuring natural orientation
  // ═══════════════════════════════════════════════════════

  // WHO — People
  {
    id: 'BLP-01',
    category: 'baseline',
    text: 'I naturally check in on how people are feeling before diving into the agenda.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'who', weight: 0.9 },
      { id: 'attr_empathy', weight: 0.5 },
      { id: 'eq_empathy', weight: 0.4 },
    ],
  },
  {
    id: 'BLP-02',
    category: 'baseline',
    text: 'When someone on my team is struggling, my first instinct is to listen — not solve.',
    scale: SCALES.likert5,
    constructs: [
      { id: 'who', weight: 0.8 },
      { id: 'attr_empathy', weight: 0.7 },
      { id: 'trust_relational', weight: 0.4 },
    ],
  },
  {
    id: 'BLP-03',
    category: 'baseline',
    text: 'I invest significant time building relationships with each person I work with.',
    scale: SCALES.likert5,
    constructs: [
      { id: 'who', weight: 0.8 },
      { id: 'trust_relational', weight: 0.6 },
      { id: 'attr_collaboration', weight: 0.3 },
    ],
  },
  {
    id: 'BLP-04',
    category: 'baseline',
    text: 'I believe the quality of a team\'s relationships determines the quality of its output.',
    scale: SCALES.likert5,
    constructs: [
      { id: 'who', weight: 0.7 },
      { id: 'comm_diplomatic', weight: 0.5 },
      { id: 'eq_social_skill', weight: 0.3 },
    ],
  },

  // WHY — Purpose
  {
    id: 'BLP-05',
    category: 'baseline',
    text: 'I regularly connect daily work back to the bigger mission.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'why', weight: 0.9 },
      { id: 'attr_vision', weight: 0.5 },
      { id: 'comm_strategic', weight: 0.4 },
    ],
  },
  {
    id: 'BLP-06',
    category: 'baseline',
    text: 'I spend more time thinking about where we\'re going than where we are.',
    scale: SCALES.likert5,
    constructs: [
      { id: 'why', weight: 0.8 },
      { id: 'attr_vision', weight: 0.7 },
    ],
  },
  {
    id: 'BLP-07',
    category: 'baseline',
    text: 'I can explain why our work matters in a way that energizes people.',
    scale: SCALES.likert5,
    constructs: [
      { id: 'why', weight: 0.7 },
      { id: 'attr_communication', weight: 0.5 },
      { id: 'eq_motivation', weight: 0.4 },
    ],
  },
  {
    id: 'BLP-08',
    category: 'baseline',
    text: 'I push back on tasks that don\'t align with our core purpose, even when they\'re easy wins.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'why', weight: 0.8 },
      { id: 'comm_strategic', weight: 0.4 },
    ],
  },

  // WHAT — Systems
  {
    id: 'BLP-09',
    category: 'baseline',
    text: 'I prefer to have a clear process in place before starting new work.',
    scale: SCALES.likert5,
    constructs: [
      { id: 'what', weight: 0.9 },
      { id: 'attr_structure', weight: 0.7 },
      { id: 'comm_logistical', weight: 0.4 },
    ],
  },
  {
    id: 'BLP-10',
    category: 'baseline',
    text: 'When I see repeated problems, I build a system to prevent them.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'what', weight: 0.8 },
      { id: 'attr_structure', weight: 0.6 },
      { id: 'trust_systemic', weight: 0.4 },
    ],
  },
  {
    id: 'BLP-11',
    category: 'baseline',
    text: 'I document decisions and processes so the team doesn\'t depend on tribal knowledge.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'what', weight: 0.7 },
      { id: 'trust_systemic', weight: 0.5 },
      { id: 'comm_logistical', weight: 0.3 },
    ],
  },
  {
    id: 'BLP-12',
    category: 'baseline',
    text: 'I\'d rather get the architecture right than ship something fragile fast.',
    scale: SCALES.likert5,
    constructs: [
      { id: 'what', weight: 0.8 },
      { id: 'attr_decisiveness', weight: 0.3, inverse: true },
      { id: 'how', weight: 0.3, inverse: true },
    ],
  },

  // HOW — Execution
  {
    id: 'BLP-13',
    category: 'baseline',
    text: 'I\'d rather make a fast decision and adjust than wait for perfect information.',
    scale: SCALES.likert5,
    constructs: [
      { id: 'how', weight: 0.9 },
      { id: 'attr_decisiveness', weight: 0.7 },
      { id: 'attr_risk_tolerance', weight: 0.5 },
    ],
  },
  {
    id: 'BLP-14',
    category: 'baseline',
    text: 'I measure my day by what got shipped, not what got discussed.',
    scale: SCALES.likert5,
    constructs: [
      { id: 'how', weight: 0.8 },
      { id: 'comm_tactical', weight: 0.5 },
    ],
  },
  {
    id: 'BLP-15',
    category: 'baseline',
    text: 'When a project stalls, I step in and drive it to completion personally.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'how', weight: 0.7 },
      { id: 'attr_decisiveness', weight: 0.5 },
      { id: 'comm_tactical', weight: 0.4 },
    ],
  },
  {
    id: 'BLP-16',
    category: 'baseline',
    text: 'I set aggressive deadlines because they push the team to perform.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'how', weight: 0.8 },
      { id: 'attr_risk_tolerance', weight: 0.4 },
      { id: 'who', weight: 0.3, inverse: true },
    ],
  },


  // ═══════════════════════════════════════════════════════
  // COMMUNICATION QUADRANT (CQ) — 8 questions
  // Directly measures communication style preference
  // ═══════════════════════════════════════════════════════

  {
    id: 'CQ-01',
    category: 'communication',
    text: 'In meetings, I focus on making sure everyone feels heard before making decisions.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'comm_diplomatic', weight: 0.9 },
      { id: 'attr_collaboration', weight: 0.4 },
    ],
  },
  {
    id: 'CQ-02',
    category: 'communication',
    text: 'I frame problems in terms of long-term impact rather than immediate fixes.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'comm_strategic', weight: 0.9 },
      { id: 'attr_vision', weight: 0.3 },
    ],
  },
  {
    id: 'CQ-03',
    category: 'communication',
    text: 'When presenting a plan, I lead with the data and the steps, not the story.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'comm_logistical', weight: 0.9 },
      { id: 'attr_structure', weight: 0.3 },
    ],
  },
  {
    id: 'CQ-04',
    category: 'communication',
    text: 'I communicate in short, direct messages. Less context, more action.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'comm_tactical', weight: 0.9 },
      { id: 'attr_decisiveness', weight: 0.3 },
    ],
  },
  {
    id: 'CQ-05',
    category: 'communication',
    text: 'I naturally adapt my communication style depending on who I\'m talking to.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'comm_diplomatic', weight: 0.5 },
      { id: 'eq_social_skill', weight: 0.7 },
      { id: 'eq_empathy', weight: 0.4 },
    ],
  },
  {
    id: 'CQ-06',
    category: 'communication',
    text: 'I prefer to provide written briefs with context rather than quick verbal updates.',
    scale: SCALES.likert5,
    constructs: [
      { id: 'comm_logistical', weight: 0.6 },
      { id: 'comm_strategic', weight: 0.4 },
      { id: 'attr_communication', weight: 0.3 },
    ],
  },
  {
    id: 'CQ-07',
    category: 'communication',
    text: 'I use stories and metaphors to make my point more than charts and data.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'comm_diplomatic', weight: 0.5 },
      { id: 'comm_strategic', weight: 0.5 },
      { id: 'attr_communication', weight: 0.4 },
    ],
  },
  {
    id: 'CQ-08',
    category: 'communication',
    text: 'When giving feedback, I lead with what needs to change — not how the person feels about it.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'comm_tactical', weight: 0.7 },
      { id: 'comm_diplomatic', weight: 0.5, inverse: true },
      { id: 'attr_decisiveness', weight: 0.3 },
    ],
  },


  // ═══════════════════════════════════════════════════════
  // ATTRIBUTE SIGNAL MAP (ASM) — 7 questions
  // Measures observable leadership attributes
  // ═══════════════════════════════════════════════════════

  {
    id: 'ASM-01',
    category: 'attributes',
    text: 'People come to me when they need to talk through something emotional, not just tactical.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'attr_empathy', weight: 0.9 },
      { id: 'eq_empathy', weight: 0.5 },
    ],
  },
  {
    id: 'ASM-02',
    category: 'attributes',
    text: 'I can articulate a compelling future that gets people excited even when the present is messy.',
    scale: SCALES.likert5,
    constructs: [
      { id: 'attr_vision', weight: 0.9 },
      { id: 'eq_motivation', weight: 0.4 },
    ],
  },
  {
    id: 'ASM-03',
    category: 'attributes',
    text: 'My workspace (physical or digital) is organized and systematic.',
    scale: SCALES.likert5,
    constructs: [
      { id: 'attr_structure', weight: 0.9 },
    ],
  },
  {
    id: 'ASM-04',
    category: 'attributes',
    text: 'I make decisions quickly, even with incomplete data, and rarely second-guess myself.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'attr_decisiveness', weight: 0.9 },
      { id: 'attr_risk_tolerance', weight: 0.5 },
    ],
  },
  {
    id: 'ASM-05',
    category: 'attributes',
    text: 'People frequently tell me I explain complex things in a way that clicks.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'attr_communication', weight: 0.9 },
      { id: 'eq_social_skill', weight: 0.3 },
    ],
  },
  {
    id: 'ASM-06',
    category: 'attributes',
    text: 'I\'m comfortable making bets that might not pay off if the upside is big enough.',
    scale: SCALES.likert5,
    constructs: [
      { id: 'attr_risk_tolerance', weight: 0.9 },
      { id: 'attr_decisiveness', weight: 0.3 },
    ],
  },
  {
    id: 'ASM-07',
    category: 'attributes',
    text: 'My default is to include others in decisions rather than decide alone.',
    scale: SCALES.likert5,
    constructs: [
      { id: 'attr_collaboration', weight: 0.9 },
      { id: 'comm_diplomatic', weight: 0.3 },
    ],
  },


  // ═══════════════════════════════════════════════════════
  // STRESS DELTA (SD) — 8 questions
  // Same axes, but in high-pressure context
  // Delta = baseline - stress score → shows shift
  // ═══════════════════════════════════════════════════════

  {
    id: 'SD-01',
    category: 'stress',
    text: 'Under pressure, I still take time to check in on my team\'s emotional state.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'stress_who', weight: 0.9 },
      { id: 'eq_self_regulation', weight: 0.4 },
    ],
  },
  {
    id: 'SD-02',
    category: 'stress',
    text: 'When deadlines are tight, I maintain focus on the bigger purpose — not just the task.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'stress_why', weight: 0.9 },
      { id: 'eq_motivation', weight: 0.3 },
    ],
  },
  {
    id: 'SD-03',
    category: 'stress',
    text: 'In a crisis, I rely on established processes rather than improvising.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'stress_what', weight: 0.9 },
    ],
  },
  {
    id: 'SD-04',
    category: 'stress',
    text: 'When everything is on fire, my instinct is to take action immediately — think later.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'stress_how', weight: 0.9 },
      { id: 'attr_decisiveness', weight: 0.3 },
    ],
  },
  {
    id: 'SD-05',
    category: 'stress',
    text: 'High-stakes situations make me more collaborative, not less.',
    scale: SCALES.likert5,
    constructs: [
      { id: 'stress_who', weight: 0.7 },
      { id: 'eq_social_skill', weight: 0.4 },
    ],
  },
  {
    id: 'SD-06',
    category: 'stress',
    text: 'Under stress, I tend to abandon long-term thinking and focus on what\'s immediately in front of me.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'stress_why', weight: 0.8, inverse: true },
      { id: 'stress_how', weight: 0.5 },
    ],
  },
  {
    id: 'SD-07',
    category: 'stress',
    text: 'When the pressure is on, I skip documentation and process steps to move faster.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'stress_what', weight: 0.8, inverse: true },
      { id: 'stress_how', weight: 0.4 },
    ],
  },
  {
    id: 'SD-08',
    category: 'stress',
    text: 'In high-pressure moments, I become more directive and less open to input.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'stress_how', weight: 0.6 },
      { id: 'stress_who', weight: 0.6, inverse: true },
      { id: 'eq_self_regulation', weight: 0.4, inverse: true },
    ],
  },


  // ═══════════════════════════════════════════════════════
  // SCIENCE OF TRUST (ST) — 6 questions
  // Three pillars: relational, competence, systemic
  // ═══════════════════════════════════════════════════════

  {
    id: 'ST-01',
    category: 'trust',
    text: 'I share personal experiences and vulnerabilities with my team to build connection.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'trust_relational', weight: 0.9 },
      { id: 'eq_social_skill', weight: 0.3 },
    ],
  },
  {
    id: 'ST-02',
    category: 'trust',
    text: 'I make an effort to remember personal details about the people I work with.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'trust_relational', weight: 0.8 },
      { id: 'eq_empathy', weight: 0.4 },
    ],
  },
  {
    id: 'ST-03',
    category: 'trust',
    text: 'I consistently deliver on my commitments — even the small ones.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'trust_competence', weight: 0.9 },
    ],
  },
  {
    id: 'ST-04',
    category: 'trust',
    text: 'People trust my judgment because I have a track record of getting things right.',
    scale: SCALES.likert5,
    constructs: [
      { id: 'trust_competence', weight: 0.8 },
      { id: 'attr_decisiveness', weight: 0.3 },
    ],
  },
  {
    id: 'ST-05',
    category: 'trust',
    text: 'I make sure decisions are transparent and the reasoning is visible to the team.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'trust_systemic', weight: 0.9 },
      { id: 'attr_communication', weight: 0.3 },
    ],
  },
  {
    id: 'ST-06',
    category: 'trust',
    text: 'I actively build fair processes so trust doesn\'t depend on any single person.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'trust_systemic', weight: 0.8 },
      { id: 'attr_structure', weight: 0.4 },
    ],
  },


  // ═══════════════════════════════════════════════════════
  // EQ LAYER (EQ) — 11 questions
  // Goleman's 5 dimensions of emotional intelligence
  // ═══════════════════════════════════════════════════════

  // Self-Awareness
  {
    id: 'EQ-01',
    category: 'eq',
    text: 'I can usually name exactly what I\'m feeling and why.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'eq_self_awareness', weight: 0.9 },
    ],
  },
  {
    id: 'EQ-02',
    category: 'eq',
    text: 'I notice when my mood is affecting how I treat the people around me.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'eq_self_awareness', weight: 0.8 },
      { id: 'eq_self_regulation', weight: 0.3 },
    ],
  },

  // Self-Regulation
  {
    id: 'EQ-03',
    category: 'eq',
    text: 'When I feel frustrated, I pause before responding rather than reacting.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'eq_self_regulation', weight: 0.9 },
    ],
  },
  {
    id: 'EQ-04',
    category: 'eq',
    text: 'I can stay calm and focused even when the people around me are anxious.',
    scale: SCALES.likert5,
    constructs: [
      { id: 'eq_self_regulation', weight: 0.8 },
      { id: 'eq_self_awareness', weight: 0.3 },
    ],
  },

  // Motivation
  {
    id: 'EQ-05',
    category: 'eq',
    text: 'I stay driven even when there\'s no external recognition or reward.',
    scale: SCALES.likert5,
    constructs: [
      { id: 'eq_motivation', weight: 0.9 },
    ],
  },
  {
    id: 'EQ-06',
    category: 'eq',
    text: 'I set personal standards for my work that go beyond what\'s required.',
    scale: SCALES.likert5,
    constructs: [
      { id: 'eq_motivation', weight: 0.8 },
      { id: 'attr_decisiveness', weight: 0.2 },
    ],
  },

  // Empathy
  {
    id: 'EQ-07',
    category: 'eq',
    text: 'I can tell when someone is upset even when they say they\'re fine.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'eq_empathy', weight: 0.9 },
      { id: 'attr_empathy', weight: 0.4 },
    ],
  },
  {
    id: 'EQ-08',
    category: 'eq',
    text: 'I consider how a decision will emotionally impact the team before making it.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'eq_empathy', weight: 0.8 },
      { id: 'who', weight: 0.3 },
    ],
  },

  // Social Skill
  {
    id: 'EQ-09',
    category: 'eq',
    text: 'I can bring a tense room to consensus without forcing a decision.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'eq_social_skill', weight: 0.9 },
      { id: 'comm_diplomatic', weight: 0.4 },
    ],
  },
  {
    id: 'EQ-10',
    category: 'eq',
    text: 'I build genuine connections across teams and levels — not just within my direct reports.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'eq_social_skill', weight: 0.8 },
      { id: 'trust_relational', weight: 0.3 },
    ],
  },
  {
    id: 'EQ-11',
    category: 'eq',
    text: 'I know how to motivate different people in different ways.',
    scale: SCALES.frequency5,
    constructs: [
      { id: 'eq_social_skill', weight: 0.7 },
      { id: 'eq_empathy', weight: 0.4 },
      { id: 'attr_communication', weight: 0.3 },
    ],
  },
]


// ── Helpers ───────────────────────────────────────────────

/** Get questions filtered by category */
export function questionsByCategory(category) {
  return QUESTIONS.filter(q => q.category === category)
}

/** Get all unique categories in order of appearance */
export function categories() {
  const seen = new Set()
  return QUESTIONS.reduce((acc, q) => {
    if (!seen.has(q.category)) {
      seen.add(q.category)
      acc.push(q.category)
    }
    return acc
  }, [])
}

/** Get a question by ID */
export function questionById(id) {
  return QUESTIONS.find(q => q.id === id)
}

/** Total question count */
export const QUESTION_COUNT = QUESTIONS.length
