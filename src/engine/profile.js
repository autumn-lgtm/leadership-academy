/**
 * Profile Generator
 *
 * Takes scored assessment data and produces a structured profile
 * object that the rest of the system consumes. This is the single
 * source of truth for a user's leadership profile.
 *
 * Downstream consumers:
 *   - Profile Lab (UI rendering)
 *   - Style Decoder (comparison logic)
 *   - Message Lab (translation context)
 *   - Simulation layer (behavior modeling)
 *   - Zone of Genius detection (future)
 */

import { CONSTRUCTS, GROUPS } from './constructs.js'
import { scoreAssessment } from './scoring.js'
import { QUESTIONS, QUESTION_COUNT } from './questions.js'

// ── Strength / Risk Detection ─────────────────────────────

/**
 * Thresholds for categorizing scores.
 * These are tunable — adjust as the system matures.
 */
const THRESHOLDS = {
  strength: 70,  // scores >= this are strengths
  risk: 35,      // scores <= this are blind spots
  high: 65,      // "high" for axis level labels
  low: 40,       // "low" for axis level labels
}

/**
 * Detect strengths from construct scores.
 * Returns the top constructs with context.
 */
function detectStrengths(scores, grouped) {
  const strengths = []

  for (const [id, score] of Object.entries(scores)) {
    if (score == null || score < THRESHOLDS.strength) continue
    const construct = CONSTRUCTS[id]
    if (!construct) continue

    strengths.push({
      construct: id,
      label: construct.label,
      group: construct.group,
      score,
      desc: construct.desc,
    })
  }

  // Sort by score descending, take top 5
  return strengths.sort((a, b) => b.score - a.score).slice(0, 5)
}

/**
 * Detect risks / blind spots from construct scores.
 */
function detectRisks(scores, grouped, stressDeltas) {
  const risks = []

  for (const [id, score] of Object.entries(scores)) {
    if (score == null || score > THRESHOLDS.risk) continue
    const construct = CONSTRUCTS[id]
    if (!construct) continue

    risks.push({
      construct: id,
      label: construct.label,
      group: construct.group,
      score,
      desc: construct.desc,
    })
  }

  // Also flag large negative stress deltas as risks
  for (const [axis, delta] of Object.entries(stressDeltas)) {
    if (delta < -15) {
      risks.push({
        construct: `stress_${axis}`,
        label: `${axis.toUpperCase()} drops under pressure`,
        group: 'stress',
        score: delta,
        desc: `Your ${axis.toUpperCase()} orientation drops significantly when stress increases. This is a common pattern — and one worth watching.`,
      })
    }
  }

  return risks.sort((a, b) => a.score - b.score).slice(0, 5)
}


// ── Tendency Detection ────────────────────────────────────

/**
 * Identify key behavioral tendencies from the profile.
 * These are narrative-ready observations.
 */
function detectTendencies(grouped, leadershipStyle, stressDeltas, communicationStyle, trustProfile) {
  const tendencies = []
  const baseline = grouped.baseline

  // Axis balance
  const axes = ['who', 'why', 'what', 'how']
  const axisScores = axes.map(a => baseline[a] || 0)
  const maxAxis = Math.max(...axisScores)
  const minAxis = Math.min(...axisScores)
  const range = maxAxis - minAxis

  if (range < 15) {
    tendencies.push({
      type: 'balance',
      label: 'Balanced leader',
      desc: 'Your axes are relatively even — you flex across all four dimensions. The upside: adaptability. The risk: you might lack a sharp edge when one is needed.',
    })
  } else if (range > 40) {
    const dominant = axes[axisScores.indexOf(maxAxis)]
    const weak = axes[axisScores.indexOf(minAxis)]
    tendencies.push({
      type: 'specialization',
      label: `Strong ${dominant.toUpperCase()} lean`,
      desc: `You lead heavily through ${dominant.toUpperCase()} and underindex on ${weak.toUpperCase()}. This gives you a clear identity but may create blind spots when ${weak.toUpperCase()}-heavy situations arise.`,
    })
  }

  // Communication vs. leadership alignment
  const commDom = communicationStyle.dominant
  const leadStyle = leadershipStyle.style
  if (commDom !== leadStyle) {
    tendencies.push({
      type: 'comm_mismatch',
      label: 'Communication-style gap',
      desc: `Your leadership style is ${leadStyle} but your communication leans ${commDom}. This gap can create confusion — people may hear a different leader than you intend to be.`,
    })
  } else {
    tendencies.push({
      type: 'comm_alignment',
      label: 'Aligned communicator',
      desc: `Your communication style matches your leadership style (${leadStyle}). People experience you as consistent — what you say lines up with how you lead.`,
    })
  }

  // Stress pattern
  const bigDrops = Object.entries(stressDeltas).filter(([, d]) => d < -10)
  const bigGains = Object.entries(stressDeltas).filter(([, d]) => d > 10)

  if (bigDrops.length > 0) {
    const dropped = bigDrops.map(([a]) => a.toUpperCase()).join(', ')
    tendencies.push({
      type: 'stress_drop',
      label: `Stress vulnerability: ${dropped}`,
      desc: `Under pressure, your ${dropped} orientation drops. This means the skills you rely on in calm moments aren't fully available when stakes are highest.`,
    })
  }

  if (bigGains.length > 0) {
    const gained = bigGains.map(([a]) => a.toUpperCase()).join(', ')
    tendencies.push({
      type: 'stress_gain',
      label: `Stress amplifier: ${gained}`,
      desc: `You lean harder into ${gained} under pressure. This can be a strength (you double down on what works) or a risk (you over-rotate and miss other signals).`,
    })
  }

  // Trust profile
  const trustDom = trustProfile.dominant
  tendencies.push({
    type: 'trust_style',
    label: `${trustDom.charAt(0).toUpperCase() + trustDom.slice(1)} trust builder`,
    desc: trustDom === 'relational'
      ? 'You build trust primarily through personal connection and vulnerability. People trust you because they feel known by you.'
      : trustDom === 'competence'
      ? 'You build trust through track record and reliability. People trust you because you consistently deliver.'
      : 'You build trust through fair systems and transparent processes. People trust the structures you create.',
  })

  return tendencies
}


// ── Summary Generation ────────────────────────────────────

/**
 * Generate a short narrative summary of the profile.
 */
function generateSummary(leadershipStyle, communicationStyle, trustProfile, eqOverall, grouped) {
  const baseline = grouped.baseline
  const axes = ['who', 'why', 'what', 'how']
  const highAxes = axes.filter(a => (baseline[a] || 0) >= THRESHOLDS.high)
  const lowAxes = axes.filter(a => (baseline[a] || 0) <= THRESHOLDS.low)

  const styleLabel = leadershipStyle.style.charAt(0).toUpperCase() + leadershipStyle.style.slice(1)
  const axisLevels = {}
  for (const axis of axes) {
    axisLevels[axis] = (baseline[axis] || 0) >= THRESHOLDS.high ? 'high' : (baseline[axis] || 0) <= THRESHOLDS.low ? 'low' : 'moderate'
  }

  return {
    style: styleLabel,
    headline: `${styleLabel} leader with ${highAxes.length > 0 ? `strong ${highAxes.map(a => a.toUpperCase()).join(' + ')}` : 'balanced'} orientation`,
    axisLevels,
    eqOverall,
    trustDominant: trustProfile.dominant,
    commDominant: communicationStyle.dominant,
    highAxes: highAxes.map(a => a.toUpperCase()),
    lowAxes: lowAxes.map(a => a.toUpperCase()),
  }
}


// ── Profile Builder ───────────────────────────────────────

/**
 * Build the complete profile object from raw responses.
 * This is the primary export — everything else is internal.
 *
 * @param {Object} responses – { questionId: numericAnswer (1-5) }
 * @returns {Object} – the full NeuroLeader profile
 */
export function buildProfile(responses) {
  const answeredCount = Object.keys(responses).length
  const scored = scoreAssessment(responses)

  const {
    scores,
    grouped,
    leadershipStyle,
    stressDeltas,
    communicationStyle,
    eqOverall,
    trustProfile,
  } = scored

  const strengths = detectStrengths(scores, grouped)
  const risks = detectRisks(scores, grouped, stressDeltas)
  const tendencies = detectTendencies(grouped, leadershipStyle, stressDeltas, communicationStyle, trustProfile)
  const summary = generateSummary(leadershipStyle, communicationStyle, trustProfile, eqOverall, grouped)

  return {
    // Meta
    version: '2.0',
    completedAt: new Date().toISOString(),
    questionCount: QUESTION_COUNT,
    answeredCount,
    completionRate: Math.round((answeredCount / QUESTION_COUNT) * 100),

    // Core identity
    dominantStyle: leadershipStyle.style,
    primaryAxis: leadershipStyle.primary,
    secondaryAxis: leadershipStyle.secondary,

    // Summary
    summary,

    // All scores by group
    constructs: grouped,

    // Flat scores (for quick lookups)
    flatScores: scores,

    // Derived insights
    stressDeltas,
    communicationStyle,
    trustProfile,
    eqOverall,

    // Human-readable insights
    strengths,
    risks,
    tendencies,

    // Axis scores shorthand (backward compatible with existing UI)
    axisScores: {
      who:  grouped.baseline.who  || 0,
      why:  grouped.baseline.why  || 0,
      what: grouped.baseline.what || 0,
      how:  grouped.baseline.how  || 0,
    },

    // Attribute scores shorthand (backward compatible with existing UI)
    attrScores: {
      empathy:       grouped.attributes.attr_empathy       || 50,
      vision:        grouped.attributes.attr_vision        || 50,
      structure:     grouped.attributes.attr_structure      || 50,
      decisiveness:  grouped.attributes.attr_decisiveness   || 50,
      communication: grouped.attributes.attr_communication  || 50,
      risk:          grouped.attributes.attr_risk_tolerance || 50,
      collaboration: grouped.attributes.attr_collaboration  || 50,
    },
  }
}


// ── Profile Diffing (for Style Decoder) ───────────────────

/**
 * Compare two profiles and return the key differences.
 * Used by the Style Decoder to show "You vs Them" analysis.
 *
 * @param {Object} profileA – your profile
 * @param {Object} profileB – their profile (or decoded estimate)
 * @returns {Object} – comparison data
 */
export function compareProfiles(profileA, profileB) {
  const axes = ['who', 'why', 'what', 'how']
  const axisDiffs = {}
  for (const axis of axes) {
    const a = profileA.axisScores[axis]
    const b = profileB.axisScores[axis]
    axisDiffs[axis] = {
      you: a,
      them: b,
      delta: b - a,
      alignment: Math.abs(b - a) < 15 ? 'aligned' : b > a ? 'they_lean_more' : 'you_lean_more',
    }
  }

  const sameStyle = profileA.dominantStyle === profileB.dominantStyle
  const biggestGap = Object.entries(axisDiffs)
    .sort((a, b) => Math.abs(b[1].delta) - Math.abs(a[1].delta))[0]

  return {
    yourStyle: profileA.dominantStyle,
    theirStyle: profileB.dominantStyle,
    sameStyle,
    axisDiffs,
    biggestGap: { axis: biggestGap[0], ...biggestGap[1] },
    communicationGap: profileA.communicationStyle.dominant !== profileB.communicationStyle.dominant,
    trustGap: profileA.trustProfile.dominant !== profileB.trustProfile.dominant,
  }
}


// ── Message Lab Helpers ───────────────────────────────────

/**
 * Extract the context needed by the Message Lab to translate
 * a message for a target style.
 *
 * @param {Object} profile – the sender's profile
 * @param {string} targetStyle – the target leadership style
 * @returns {Object} – translation context
 */
export function translationContext(profile, targetStyle) {
  return {
    senderStyle: profile.dominantStyle,
    targetStyle,
    senderAxes: profile.axisScores,
    senderComm: profile.communicationStyle.dominant,
    senderTrust: profile.trustProfile.dominant,
    sameStyle: profile.dominantStyle === targetStyle,
  }
}
