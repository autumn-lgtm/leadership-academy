/**
 * Scoring Engine
 *
 * Takes raw responses (question ID → numeric answer) and produces
 * normalized scores per construct, grouped by scoring bucket.
 *
 * Design:
 *   - No hardcoded question IDs. Everything is driven by the
 *     construct mappings in questions.js.
 *   - Adding a question or construct requires zero changes here.
 *   - Normalization maps raw weighted sums to a 0–100 scale.
 *   - Stress Delta is computed as baseline minus stress-context scores.
 */

import { QUESTIONS } from './questions.js'
import { CONSTRUCTS, GROUPS, constructsByGroup, groupIds } from './constructs.js'

// ── Core Scoring ──────────────────────────────────────────

/**
 * Compute raw weighted scores per construct from responses.
 *
 * @param {Object} responses – { questionId: numericAnswer (1-5) }
 * @returns {Object} – { constructId: { sum, weightSum, count } }
 */
export function computeRawScores(responses) {
  const raw = {}

  // Initialize all constructs
  for (const id of Object.keys(CONSTRUCTS)) {
    raw[id] = { sum: 0, weightSum: 0, count: 0 }
  }

  for (const question of QUESTIONS) {
    const answer = responses[question.id]
    if (answer == null) continue

    const { min, max } = question.scale
    // Normalize answer to 0–1 range
    const normalized = (answer - min) / (max - min)

    for (const mapping of question.constructs) {
      const { id, weight, inverse } = mapping
      if (!raw[id]) continue

      // If inverse, flip the normalized value
      const value = inverse ? 1 - normalized : normalized

      raw[id].sum += value * weight
      raw[id].weightSum += weight
      raw[id].count += 1
    }
  }

  return raw
}

/**
 * Normalize raw scores to 0–100 scale.
 *
 * For each construct: score = (sum / weightSum) * 100
 * This gives the weighted average as a percentage.
 * Constructs with no responses return null.
 *
 * @param {Object} raw – output of computeRawScores
 * @returns {Object} – { constructId: number | null }
 */
export function normalizeScores(raw) {
  const scores = {}
  for (const [id, data] of Object.entries(raw)) {
    if (data.weightSum === 0) {
      scores[id] = null
    } else {
      scores[id] = Math.round((data.sum / data.weightSum) * 100)
    }
  }
  return scores
}

/**
 * Group normalized scores by their construct group.
 *
 * @param {Object} scores – { constructId: number | null }
 * @returns {Object} – { groupId: { constructId: score, ... } }
 */
export function groupScores(scores) {
  const grouped = {}
  for (const groupId of groupIds()) {
    grouped[groupId] = {}
    for (const constructId of constructsByGroup(groupId)) {
      grouped[groupId][constructId] = scores[constructId]
    }
  }
  return grouped
}


// ── Derived Computations ──────────────────────────────────

/**
 * Determine dominant leadership style from baseline scores.
 * Style = combination of top-2 axes.
 *
 * @param {Object} grouped – output of groupScores
 * @returns {{ style: string, primary: string, secondary: string }}
 */
export function computeLeadershipStyle(grouped) {
  const baseline = grouped.baseline
  const axes = ['who', 'why', 'what', 'how']
  const sorted = axes
    .filter(a => baseline[a] != null)
    .sort((a, b) => baseline[b] - baseline[a])

  const primary = sorted[0] || 'who'
  const secondary = sorted[1] || 'why'

  // Style mapping based on top-2 axes
  const STYLE_MAP = {
    'who+why':  'diplomatic',
    'why+who':  'diplomatic',
    'why+what': 'strategic',
    'what+why': 'strategic',
    'what+how': 'logistical',
    'how+what': 'logistical',
    'who+how':  'tactical',
    'how+who':  'tactical',
    // Edge cases — same-group pairings
    'who+what': 'diplomatic',
    'what+who': 'logistical',
    'why+how':  'strategic',
    'how+why':  'tactical',
  }

  const key = `${primary}+${secondary}`
  const style = STYLE_MAP[key] || 'diplomatic'

  return { style, primary, secondary }
}

/**
 * Compute stress deltas: how each axis shifts under pressure.
 * Positive delta = you lean MORE into this under stress.
 * Negative delta = you drop this under stress.
 *
 * @param {Object} grouped – output of groupScores
 * @returns {Object} – { who: number, why: number, what: number, how: number }
 */
export function computeStressDeltas(grouped) {
  const baseline = grouped.baseline
  const stress = grouped.stress

  const axes = ['who', 'why', 'what', 'how']
  const deltas = {}

  for (const axis of axes) {
    const baseScore = baseline[axis]
    const stressScore = stress[`stress_${axis}`]
    if (baseScore == null || stressScore == null) {
      deltas[axis] = 0
    } else {
      deltas[axis] = stressScore - baseScore
    }
  }

  return deltas
}

/**
 * Determine dominant communication style from communication scores.
 *
 * @param {Object} grouped – output of groupScores
 * @returns {{ dominant: string, scores: Object }}
 */
export function computeCommunicationStyle(grouped) {
  const comm = grouped.communication
  const styles = ['comm_diplomatic', 'comm_strategic', 'comm_logistical', 'comm_tactical']
  const sorted = styles
    .filter(s => comm[s] != null)
    .sort((a, b) => comm[b] - comm[a])

  return {
    dominant: sorted[0]?.replace('comm_', '') || 'diplomatic',
    scores: {
      diplomatic: comm.comm_diplomatic,
      strategic:  comm.comm_strategic,
      logistical: comm.comm_logistical,
      tactical:   comm.comm_tactical,
    },
  }
}

/**
 * Compute overall EQ score (average of dimensions).
 *
 * @param {Object} grouped – output of groupScores
 * @returns {number}
 */
export function computeEQOverall(grouped) {
  const eq = grouped.eq
  const dims = Object.values(eq).filter(v => v != null)
  if (dims.length === 0) return 0
  return Math.round(dims.reduce((s, v) => s + v, 0) / dims.length)
}

/**
 * Compute overall trust profile.
 *
 * @param {Object} grouped – output of groupScores
 * @returns {{ dominant: string, scores: Object, overall: number }}
 */
export function computeTrustProfile(grouped) {
  const trust = grouped.trust
  const types = ['trust_relational', 'trust_competence', 'trust_systemic']
  const sorted = types
    .filter(t => trust[t] != null)
    .sort((a, b) => trust[b] - trust[a])

  const scores = {
    relational: trust.trust_relational,
    competence: trust.trust_competence,
    systemic:   trust.trust_systemic,
  }

  const vals = Object.values(scores).filter(v => v != null)
  const overall = vals.length > 0
    ? Math.round(vals.reduce((s, v) => s + v, 0) / vals.length)
    : 0

  return {
    dominant: sorted[0]?.replace('trust_', '') || 'relational',
    scores,
    overall,
  }
}


// ── Full Pipeline ─────────────────────────────────────────

/**
 * Run the complete scoring pipeline.
 *
 * @param {Object} responses – { questionId: numericAnswer }
 * @returns {Object} – all computed scores and derived data
 */
export function scoreAssessment(responses) {
  const raw = computeRawScores(responses)
  const scores = normalizeScores(raw)
  const grouped = groupScores(scores)

  const leadershipStyle = computeLeadershipStyle(grouped)
  const stressDeltas = computeStressDeltas(grouped)
  const communicationStyle = computeCommunicationStyle(grouped)
  const eqOverall = computeEQOverall(grouped)
  const trustProfile = computeTrustProfile(grouped)

  return {
    scores,
    grouped,
    leadershipStyle,
    stressDeltas,
    communicationStyle,
    eqOverall,
    trustProfile,
  }
}
