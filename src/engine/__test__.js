/**
 * Engine verification script.
 * Run: node --experimental-vm-modules src/engine/__test__.js
 *
 * Simulates a full assessment and prints the profile output.
 */

import { QUESTIONS, QUESTION_COUNT, categories, buildProfile, compareProfiles, translationContext } from './index.js'

console.log('═══════════════════════════════════════════')
console.log('  NeuroLeader Assessment Engine — Test Run')
console.log('═══════════════════════════════════════════\n')

// ── Question Bank Stats ──────────────────────────────────

console.log(`Total questions: ${QUESTION_COUNT}`)
console.log(`Categories: ${categories().join(', ')}`)
console.log()

for (const cat of categories()) {
  const qs = QUESTIONS.filter(q => q.category === cat)
  console.log(`  ${cat}: ${qs.length} questions`)
}
console.log()

// ── Simulate Responses ───────────────────────────────────
// Simulates a WHO+HOW heavy leader (tactical style)

const responses = {}
for (const q of QUESTIONS) {
  let answer
  const constructs = q.constructs.map(c => c.id)

  // Simulate a tactical leader: high WHO + HOW, moderate WHY, lower WHAT
  if (constructs.includes('who') || constructs.includes('stress_who'))         answer = 4
  else if (constructs.includes('how') || constructs.includes('stress_how'))    answer = 5
  else if (constructs.includes('why') || constructs.includes('stress_why'))    answer = 3
  else if (constructs.includes('what') || constructs.includes('stress_what'))  answer = 2
  else if (constructs.includes('comm_tactical'))                               answer = 5
  else if (constructs.includes('comm_diplomatic'))                             answer = 4
  else if (constructs.includes('eq_empathy'))                                  answer = 4
  else if (constructs.includes('eq_self_regulation'))                          answer = 3
  else if (constructs.includes('trust_relational'))                            answer = 4
  else if (constructs.includes('trust_competence'))                            answer = 5
  else                                                                         answer = 3

  responses[q.id] = answer
}

// ── Build Profile ────────────────────────────────────────

const profile = buildProfile(responses)

console.log('═══════════════════════════════════════════')
console.log('  PROFILE OUTPUT')
console.log('═══════════════════════════════════════════\n')

console.log('── Meta ──')
console.log(`  Version:         ${profile.version}`)
console.log(`  Questions:       ${profile.answeredCount}/${profile.questionCount}`)
console.log(`  Completion:      ${profile.completionRate}%`)
console.log()

console.log('── Core Identity ──')
console.log(`  Dominant Style:  ${profile.dominantStyle}`)
console.log(`  Primary Axis:    ${profile.primaryAxis.toUpperCase()}`)
console.log(`  Secondary Axis:  ${profile.secondaryAxis.toUpperCase()}`)
console.log()

console.log('── Summary ──')
console.log(`  Headline:        ${profile.summary.headline}`)
console.log(`  EQ Overall:      ${profile.eqOverall}`)
console.log(`  Comm Dominant:   ${profile.communicationStyle.dominant}`)
console.log(`  Trust Dominant:   ${profile.trustProfile.dominant}`)
console.log()

console.log('── Axis Scores (0-100) ──')
for (const [axis, score] of Object.entries(profile.axisScores)) {
  const bar = '█'.repeat(Math.round(score / 5)) + '░'.repeat(20 - Math.round(score / 5))
  console.log(`  ${axis.toUpperCase().padEnd(5)} ${bar} ${score}`)
}
console.log()

console.log('── Constructs by Group ──')
for (const [group, scores] of Object.entries(profile.constructs)) {
  console.log(`\n  [${group}]`)
  for (const [id, score] of Object.entries(scores)) {
    const label = id.replace(/^(comm_|attr_|stress_|trust_|eq_)/, '')
    console.log(`    ${label.padEnd(20)} ${score ?? 'n/a'}`)
  }
}

console.log('\n── Stress Deltas ──')
for (const [axis, delta] of Object.entries(profile.stressDeltas)) {
  const sign = delta >= 0 ? '+' : ''
  console.log(`  ${axis.toUpperCase().padEnd(5)} ${sign}${delta}`)
}

console.log('\n── Communication Style ──')
for (const [style, score] of Object.entries(profile.communicationStyle.scores)) {
  console.log(`  ${style.padEnd(12)} ${score}`)
}

console.log('\n── Trust Profile ──')
console.log(`  Dominant: ${profile.trustProfile.dominant}`)
for (const [type, score] of Object.entries(profile.trustProfile.scores)) {
  console.log(`  ${type.padEnd(12)} ${score}`)
}

console.log('\n── Strengths ──')
for (const s of profile.strengths) {
  console.log(`  ✓ ${s.label} (${s.score}) — ${s.group}`)
}

console.log('\n── Risks / Blind Spots ──')
for (const r of profile.risks) {
  console.log(`  ⚠ ${r.label} (${r.score}) — ${r.group}`)
}

console.log('\n── Tendencies ──')
for (const t of profile.tendencies) {
  console.log(`  → ${t.label}`)
  console.log(`    ${t.desc}`)
}

console.log('\n── Attribute Scores (backward compat) ──')
for (const [attr, score] of Object.entries(profile.attrScores)) {
  console.log(`  ${attr.padEnd(15)} ${score}`)
}

// ── Integration Demo: Compare Profiles ───────────────────

console.log('\n═══════════════════════════════════════════')
console.log('  INTEGRATION: Style Decoder Comparison')
console.log('═══════════════════════════════════════════\n')

// Simulate a second profile (strategic leader)
const responses2 = {}
for (const q of QUESTIONS) {
  const constructs = q.constructs.map(c => c.id)
  if (constructs.includes('why'))       responses2[q.id] = 5
  else if (constructs.includes('what')) responses2[q.id] = 4
  else if (constructs.includes('who'))  responses2[q.id] = 2
  else if (constructs.includes('how'))  responses2[q.id] = 3
  else                                  responses2[q.id] = 3
}

const profile2 = buildProfile(responses2)
const comparison = compareProfiles(profile, profile2)

console.log(`  Your style:    ${comparison.yourStyle}`)
console.log(`  Their style:   ${comparison.theirStyle}`)
console.log(`  Same style:    ${comparison.sameStyle}`)
console.log(`  Biggest gap:   ${comparison.biggestGap.axis.toUpperCase()} (delta: ${comparison.biggestGap.delta})`)
console.log(`  Comm gap:      ${comparison.communicationGap}`)
console.log(`  Trust gap:     ${comparison.trustGap}`)

console.log('\n  Axis-by-axis:')
for (const [axis, data] of Object.entries(comparison.axisDiffs)) {
  console.log(`    ${axis.toUpperCase().padEnd(5)} You: ${data.you}  Them: ${data.them}  (${data.alignment})`)
}

// ── Integration Demo: Message Lab Context ────────────────

console.log('\n═══════════════════════════════════════════')
console.log('  INTEGRATION: Message Lab Context')
console.log('═══════════════════════════════════════════\n')

const ctx = translationContext(profile, 'strategic')
console.log('  Translation context for tactical → strategic:')
console.log(`    Sender style:  ${ctx.senderStyle}`)
console.log(`    Target style:  ${ctx.targetStyle}`)
console.log(`    Sender comm:   ${ctx.senderComm}`)
console.log(`    Sender trust:  ${ctx.senderTrust}`)
console.log(`    Same style:    ${ctx.sameStyle}`)
console.log(`    Sender axes:   WHO=${ctx.senderAxes.who} WHY=${ctx.senderAxes.why} WHAT=${ctx.senderAxes.what} HOW=${ctx.senderAxes.how}`)

console.log('\n✅ Engine verification complete.')
