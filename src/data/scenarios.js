// src/data/scenarios.js
// Core Leadership Scenarios — Parallel Reality Engine
// High-fidelity, emotionally accurate, real workplace dynamics
// Do not generalize or dilute. Preserve tension, stakes, realism.

export const SCENARIOS = [
  {
    id: 'SCN_001',
    title: 'I see the gap, they get defensive',
    description: 'You identify a clear performance or strategic gap in a leader\'s function. When you bring it up, they become defensive or shut down instead of engaging.',
    tension: 'You are right, but your delivery triggers defensiveness, preventing progress.',
    useCases: ['feedback delivery', 'executive communication', 'influence without resistance'],
    tags: ['feedback', 'defensiveness', 'leadership gap'],
    recipientProfile: 'mixed',
    stakes: 'high',
    emotionalCharge: 'high',
  },
  {
    id: 'SCN_002',
    title: 'I own the function, but don\'t get credit',
    description: 'You have built or transformed a function, but another leader presents or receives recognition for the outcomes.',
    tension: 'You need visibility and acknowledgment without appearing political or self-serving.',
    useCases: ['executive presence', 'upward communication', 'attribution'],
    tags: ['credit', 'visibility', 'leadership perception'],
    recipientProfile: 'who',
    stakes: 'high',
    emotionalCharge: 'high',
  },
  {
    id: 'SCN_003',
    title: 'People vs system accountability',
    description: 'The company defaults to blaming individuals when metrics are missed instead of diagnosing system or strategic issues.',
    tension: 'You see root causes, but others default to blaming people.',
    useCases: ['organizational influence', 'problem framing', 'leadership mindset'],
    tags: ['culture', 'accountability', 'systems thinking'],
    recipientProfile: 'what',
    stakes: 'high',
    emotionalCharge: 'moderate',
  },
  {
    id: 'SCN_004',
    title: 'Is it the people or the system?',
    description: 'Sales and customer success turnover is high. Leadership assumes poor talent fit, but you suspect structural or leadership issues.',
    tension: 'You must challenge the narrative using data without creating friction.',
    useCases: ['data communication', 'root cause analysis', 'strategic influence'],
    tags: ['turnover', 'diagnosis', 'data vs narrative'],
    recipientProfile: 'what',
    stakes: 'high',
    emotionalCharge: 'moderate',
  },
  {
    id: 'SCN_005',
    title: 'Say the hard thing without shutting them down',
    description: 'You need to deliver critical feedback to someone who tends to react emotionally or defensively.',
    tension: 'Balance candor and clarity with emotional receptivity.',
    useCases: ['difficult conversations', 'emotional intelligence', 'trust'],
    tags: ['feedback', 'emotion', 'performance'],
    recipientProfile: 'who',
    stakes: 'high',
    emotionalCharge: 'high',
  },
  {
    id: 'SCN_006',
    title: 'Operating above your title',
    description: 'You are performing at a higher strategic level than your current title reflects, but leadership has not fully recognized it.',
    tension: 'You need to signal your level without sounding entitled.',
    useCases: ['career positioning', 'executive signaling', 'upward influence'],
    tags: ['promotion', 'perception', 'leadership level'],
    recipientProfile: 'why',
    stakes: 'high',
    emotionalCharge: 'moderate',
  },
  {
    id: 'SCN_007',
    title: 'They don\'t see the system behind the results',
    description: 'You have built systems and infrastructure, but leadership only sees surface outcomes and not the underlying complexity.',
    tension: 'Translate depth into visible impact without overwhelming your audience.',
    useCases: ['executive communication', 'system translation', 'visibility'],
    tags: ['systems', 'communication', 'visibility'],
    recipientProfile: 'why',
    stakes: 'moderate',
    emotionalCharge: 'moderate',
  },
  {
    id: 'SCN_008',
    title: 'Leading through distance and emotion',
    description: 'You are leading remotely and navigating a team member with emotional variability or negative patterns.',
    tension: 'Limited visibility amplifies misinterpretation and inconsistency.',
    useCases: ['remote leadership', 'tone calibration', 'emotional management'],
    tags: ['remote', 'communication', 'emotion'],
    recipientProfile: 'who',
    stakes: 'moderate',
    emotionalCharge: 'high',
  },
  {
    id: 'SCN_009',
    title: 'You see it, others don\'t',
    description: 'You recognize interpersonal or systemic patterns clearly, but others do not see or validate them.',
    tension: 'Translate intuition into something others trust and act on.',
    useCases: ['pattern communication', 'influence', 'data framing'],
    tags: ['insight', 'alignment', 'credibility'],
    recipientProfile: 'mixed',
    stakes: 'moderate',
    emotionalCharge: 'moderate',
  },
  {
    id: 'SCN_010',
    title: 'Challenge leadership without creating friction',
    description: 'You need to challenge a decision made by senior leadership in a constructive way.',
    tension: 'Balance courage with political awareness and timing.',
    useCases: ['executive challenge', 'strategic dissent', 'influence'],
    tags: ['leadership', 'power dynamics', 'decision making'],
    recipientProfile: 'why',
    stakes: 'high',
    emotionalCharge: 'high',
  },
  {
    id: 'SCN_011',
    title: 'Stop doing, start leading',
    description: 'You are still heavily involved in execution but need to shift toward delegation and strategic leadership.',
    tension: 'Letting go of control while maintaining standards.',
    useCases: ['delegation', 'leadership growth', 'zone of genius'],
    tags: ['scale', 'delegation', 'leadership evolution'],
    recipientProfile: 'how',
    stakes: 'moderate',
    emotionalCharge: 'moderate',
  },
  {
    id: 'SCN_012',
    title: 'Same message, different impact',
    description: 'You notice that the same insight lands differently depending on how it is delivered.',
    tension: 'Intent does not equal impact.',
    useCases: ['communication optimization', 'message lab', 'influence'],
    tags: ['communication', 'impact', 'delivery'],
    recipientProfile: 'mixed',
    stakes: 'moderate',
    emotionalCharge: 'low',
  },
]

// Get scenario by ID
export function getScenario(id) {
  return SCENARIOS.find(s => s.id === id) || null
}

// Get scenarios relevant to a profile style
export function getScenariosForStyle(style) {
  const styleMap = {
    diplomatic: ['SCN_001', 'SCN_005', 'SCN_008', 'SCN_009', 'SCN_012'],
    strategic:  ['SCN_003', 'SCN_006', 'SCN_007', 'SCN_009', 'SCN_010'],
    logistical: ['SCN_003', 'SCN_004', 'SCN_007', 'SCN_011', 'SCN_012'],
    tactical:   ['SCN_001', 'SCN_002', 'SCN_004', 'SCN_006', 'SCN_011'],
  }
  const ids = styleMap[style] || SCENARIOS.map(s => s.id)
  return ids.map(id => getScenario(id)).filter(Boolean)
}
