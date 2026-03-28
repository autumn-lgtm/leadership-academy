/**
 * Construct Definitions
 *
 * Every measurable dimension in the NeuroLeader system.
 * Questions map to one or more constructs via weighted links.
 * Adding a new construct here automatically makes it available
 * to the scoring engine and profile generator.
 *
 * Shape:
 *   id        – unique key, used everywhere
 *   group     – which scoring bucket this belongs to
 *   label     – human-readable name
 *   desc      – short description for profile output
 *   range     – [min, max] normalized output range
 */

// ── Groups ────────────────────────────────────────────────
// Each group becomes a top-level key in the profile output.

export const GROUPS = {
  baseline:      { label: 'Baseline Leadership Patterns', desc: 'Your natural leadership orientation across four axes' },
  communication: { label: 'Communication Quadrant',       desc: 'How you naturally communicate and influence' },
  attributes:    { label: 'Attribute Signal Map',         desc: 'Observable leadership attributes others experience' },
  stress:        { label: 'Stress Delta',                 desc: 'How your leadership shifts under pressure' },
  trust:         { label: 'Science of Trust',             desc: 'The three pillars of how you build trust' },
  eq:            { label: 'EQ Layer',                     desc: 'Emotional intelligence dimensions' },
}

// ── Constructs ────────────────────────────────────────────

export const CONSTRUCTS = {
  // Baseline Leadership Patterns (the 4 axes)
  who:  { group: 'baseline', label: 'WHO — People',    desc: 'Empathy, trust, team dynamics, interpersonal connection' },
  why:  { group: 'baseline', label: 'WHY — Purpose',   desc: 'Meaning, strategy, long-term thinking, values alignment' },
  what: { group: 'baseline', label: 'WHAT — Systems',  desc: 'Process, organization, architecture, reliable execution' },
  how:  { group: 'baseline', label: 'HOW — Execution', desc: 'Action, results, decisiveness, real-time adaptation' },

  // Communication Quadrant (derived from axes, but also directly measured)
  comm_diplomatic: { group: 'communication', label: 'Diplomatic', desc: 'Bridge-building, consensus, relational framing' },
  comm_strategic:  { group: 'communication', label: 'Strategic',  desc: 'Big-picture, vision-casting, conceptual framing' },
  comm_logistical: { group: 'communication', label: 'Logistical', desc: 'Structured, precise, process-oriented framing' },
  comm_tactical:   { group: 'communication', label: 'Tactical',   desc: 'Direct, action-oriented, results-first framing' },

  // Attribute Signal Map
  attr_empathy:        { group: 'attributes', label: 'Empathy',        desc: 'Ability to sense and respond to others\' emotions' },
  attr_vision:         { group: 'attributes', label: 'Vision',         desc: 'Capacity to see and articulate a compelling future' },
  attr_structure:      { group: 'attributes', label: 'Structure',      desc: 'Drive to organize, systematize, and create order' },
  attr_decisiveness:   { group: 'attributes', label: 'Decisiveness',   desc: 'Speed and confidence in making decisions' },
  attr_communication:  { group: 'attributes', label: 'Communication',  desc: 'Clarity and impact of verbal and written expression' },
  attr_risk_tolerance: { group: 'attributes', label: 'Risk Tolerance', desc: 'Comfort with uncertainty and bold moves' },
  attr_collaboration:  { group: 'attributes', label: 'Collaboration',  desc: 'Tendency to include others in decisions and work' },

  // Stress Delta (same axes, measured under pressure context)
  stress_who:  { group: 'stress', label: 'WHO under stress',  desc: 'People orientation when pressure is high' },
  stress_why:  { group: 'stress', label: 'WHY under stress',  desc: 'Purpose orientation when pressure is high' },
  stress_what: { group: 'stress', label: 'WHAT under stress', desc: 'Systems orientation when pressure is high' },
  stress_how:  { group: 'stress', label: 'HOW under stress',  desc: 'Execution orientation when pressure is high' },

  // Science of Trust
  trust_relational: { group: 'trust', label: 'Relational Trust', desc: 'Trust built through care, vulnerability, and personal connection' },
  trust_competence: { group: 'trust', label: 'Competence Trust', desc: 'Trust built through demonstrated ability and reliability' },
  trust_systemic:   { group: 'trust', label: 'Systemic Trust',   desc: 'Trust built through fair processes and transparent systems' },

  // EQ Layer (Goleman model)
  eq_self_awareness:  { group: 'eq', label: 'Self-Awareness',  desc: 'Recognizing your own emotions and their effect on behavior' },
  eq_self_regulation: { group: 'eq', label: 'Self-Regulation', desc: 'Managing impulses and adapting to changing situations' },
  eq_motivation:      { group: 'eq', label: 'Motivation',      desc: 'Internal drive beyond external reward' },
  eq_empathy:         { group: 'eq', label: 'Empathy',         desc: 'Reading and responding to others\' emotional states' },
  eq_social_skill:    { group: 'eq', label: 'Social Skill',    desc: 'Managing relationships and building networks effectively' },
}

// ── Helpers ───────────────────────────────────────────────

/** Get all construct IDs belonging to a group */
export function constructsByGroup(groupId) {
  return Object.entries(CONSTRUCTS)
    .filter(([, c]) => c.group === groupId)
    .map(([id]) => id)
}

/** Get all group IDs */
export function groupIds() {
  return Object.keys(GROUPS)
}

/** Validate that a construct ID exists */
export function isValidConstruct(id) {
  return id in CONSTRUCTS
}
