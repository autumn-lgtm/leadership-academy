/**
 * NeuroLeader Assessment Engine — Public API
 *
 * This is the single import for any module that needs to interact
 * with the assessment system. Import from here, not from individual files.
 *
 * Usage:
 *
 *   import { QUESTIONS, buildProfile, compareProfiles } from '../engine'
 *
 * Integration points:
 *
 *   Assessment UI     → QUESTIONS, categories(), SCALES
 *   Profile Lab       → buildProfile(responses)
 *   Style Decoder     → compareProfiles(mine, theirs)
 *   Message Lab       → translationContext(profile, targetStyle)
 *   Simulation Layer  → profile.constructs, profile.stressDeltas
 *   Zone of Genius    → profile.strengths, profile.tendencies (future)
 */

// Questions
export { QUESTIONS, QUESTION_COUNT, SCALES, questionsByCategory, categories, questionById } from './questions.js'

// Constructs
export { CONSTRUCTS, GROUPS, constructsByGroup, groupIds, isValidConstruct } from './constructs.js'

// Scoring (exposed for advanced use — most consumers use buildProfile)
export { scoreAssessment, computeRawScores, normalizeScores, groupScores } from './scoring.js'

// Profile (primary API for most consumers)
export { buildProfile, compareProfiles, translationContext } from './profile.js'
