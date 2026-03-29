/**
 * scoring.js — NeuroLeader Scoring Engine
 * 8 exported functions · 5 output layers · Trust 35/35/30
 * Source: NeuroLeader_MASTER_FINAL.docx Tables 36-38, 123, 125
 */

import { transformSliders } from '../utils/sliderTransforms.js';
import { SECTION_A } from './questions.js';
import { SECTION_C } from './sectionC.js';
import { SECTION_D } from './sectionD.js';
import { SECTION_E } from './sectionE.js';
import { EQ_ITEMS } from './eqItems.js';
import { WORD_BANKS } from './wordBanks.js';

// ── Helpers ──────────────────────────────────────────────────────────
const AXES = ['who', 'why', 'what', 'how'];
const ATTRS = ['achievement', 'independence', 'innovation', 'risk', 'recognition', 'multitask', 'financial'];
const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, Math.round(v)));

function accumulateScoring(scoring, axisAcc, attrAcc, trustAcc) {
  if (!scoring) return;
  for (const [key, val] of Object.entries(scoring)) {
    if (key.startsWith('_')) continue; // internal flags like _confirmationBias
    if (key === 'risk-reverse') { attrAcc.risk = (attrAcc.risk || 0) - val; continue; }
    if (AXES.includes(key)) axisAcc[key] = (axisAcc[key] || 0) + val;
    else if (ATTRS.includes(key)) attrAcc[key] = (attrAcc[key] || 0) + val;
    else if (key.startsWith('trust-')) trustAcc[key] = (trustAcc[key] || 0) + val;
    else if (key.startsWith('eq-')) trustAcc[key] = (trustAcc[key] || 0) + val;
  }
}

function normalizeAxis(raw, maxPossible) {
  if (maxPossible <= 0) return 50;
  return clamp((raw / maxPossible) * 100);
}

// ── 1. computeAxisScores ────────────────────────────────────────
/**
 * @param {number[]} scenarioAnswers - index of selected option per Q1-Q8
 * @param {number[]} fcAnswers - index of selected option per Q9-Q15
 * @param {object} sliderResult - output from transformSliders()
 * @param {object} wbAnswers - { 'WB-1': [...selectedWords], ... }
 * @returns {{ who, why, what, how }} each 0-100
 */
export function computeAxisScores(scenarioAnswers = [], fcAnswers = [], sliderResult = null, wbAnswers = {}) {
  const axis = { who: 0, why: 0, what: 0, how: 0 };
  const attr = {};
  const trust = {};

  // Section A scenarios
  SECTION_A.forEach((q, i) => {
    const sel = scenarioAnswers[i];
    if (sel == null || !q.options[sel]) return;
    accumulateScoring(q.options[sel].scoring, axis, attr, trust);
  });

  // Section C forced choice
  SECTION_C.forEach((q, i) => {
    const sel = fcAnswers[i];
    if (sel == null || !q.options[sel]) return;
    accumulateScoring(q.options[sel].scoring, axis, attr, trust);
  });

  // Slider axis contributions
  if (sliderResult) {
    for (const [a, v] of Object.entries(sliderResult.axisContributions)) {
      axis[a] = (axis[a] || 0) + (v / 100) * 3; // normalize slider 0-100 to 0-3 contribution scale
    }
  }

  // Word bank validation boost
  const wbAxisMap = { 'WB-1': 'who', 'WB-2': 'why', 'WB-3': 'what', 'WB-4': 'how' };
  for (const [wbId, axisKey] of Object.entries(wbAxisMap)) {
    const selections = wbAnswers[wbId];
    if (selections && selections.length > 0) {
      axis[axisKey] += selections.length * 0.5; // soft validation boost
    }
  }

  // Normalize to 0-100
  // Max possible per axis: ~21 from scenarios (3*8=24 theoretical) + ~10 from FC + 3 from sliders + 5 from WB
  const maxRaw = Math.max(...Object.values(axis), 1);
  return {
    who: normalizeAxis(axis.who, maxRaw),
    why: normalizeAxis(axis.why, maxRaw),
    what: normalizeAxis(axis.what, maxRaw),
    how: normalizeAxis(axis.how, maxRaw),
  };
}

// ── 2. computeAttrScores ────────────────────────────────────────
/**
 * @returns {{ achievement, independence, innovation, risk, recognition, multitask, financial }} 0-100
 */
export function computeAttrScores(scenarioAnswers = [], sliderResult = null, fcAnswers = []) {
  const attr = { achievement: 0, independence: 0, innovation: 0, risk: 0, recognition: 0, multitask: 0, financial: 0 };
  const axis = {};
  const trust = {};

  // Accumulate from scenarios
  SECTION_A.forEach((q, i) => {
    const sel = scenarioAnswers[i];
    if (sel == null || !q.options[sel]) return;
    accumulateScoring(q.options[sel].scoring, axis, attr, trust);
  });

  // Accumulate from forced choice
  SECTION_C.forEach((q, i) => {
    const sel = fcAnswers[i];
    if (sel == null || !q.options[sel]) return;
    accumulateScoring(q.options[sel].scoring, axis, attr, trust);
  });

  // Slider attribute contributions
  if (sliderResult) {
    if (sliderResult.attrContributions.innovation) attr.innovation += sliderResult.attrContributions.innovation * 0.5;
    if (sliderResult.attrContributions.recognition) attr.recognition += sliderResult.attrContributions.recognition * 0.5;
    attr.independence += sliderResult.independenceScore * 0.3;
  }

  // Normalize each to 0-100
  // Max possible varies by attr; use relative normalization
  const maxAttr = Math.max(...Object.values(attr), 1);
  const result = {};
  for (const key of ATTRS) {
    result[key] = clamp((attr[key] / maxAttr) * 100);
  }

  return result;
}

// ── 3. computePressureAxes ──────────────────────────────────────
/**
 * @param {number[]} pressureAnswers - index of selected option per Q25-Q32
 * @returns {{ who_p, why_p, what_p, how_p }} 0-100
 */
export function computePressureAxes(pressureAnswers = []) {
  const axis = { who: 0, why: 0, what: 0, how: 0 };
  const attr = {};
  const trust = {};

  SECTION_D.forEach((q, i) => {
    const sel = pressureAnswers[i];
    if (sel == null || !q.options[sel]) return;
    accumulateScoring(q.options[sel].scoring, axis, attr, trust);
  });

  const maxRaw = Math.max(...Object.values(axis).map(Math.abs), 1);
  return {
    who_p: normalizeAxis(axis.who, maxRaw),
    why_p: normalizeAxis(axis.why, maxRaw),
    what_p: normalizeAxis(axis.what, maxRaw),
    how_p: normalizeAxis(axis.how, maxRaw),
  };
}

// ── 4. computeStressDelta ───────────────────────────────────────
/**
 * @param {{ who, why, what, how }} baseline
 * @param {{ who_p, why_p, what_p, how_p }} pressure
 * @returns {{ deltas: {who,why,what,how}, stressProfile: string }}
 */
export function computeStressDelta(baseline, pressure) {
  const deltas = {
    who: (pressure.who_p || 0) - (baseline.who || 0),
    why: (pressure.why_p || 0) - (baseline.why || 0),
    what: (pressure.what_p || 0) - (baseline.what || 0),
    how: (pressure.how_p || 0) - (baseline.how || 0),
  };

  // Classify stress profile based on delta patterns
  const whoDelta = deltas.who;
  const totalShift = Math.abs(deltas.who) + Math.abs(deltas.why) + Math.abs(deltas.what) + Math.abs(deltas.how);

  let stressProfile = 'resilient';
  if (totalShift < 15) {
    stressProfile = 'resilient';
  } else if (whoDelta < -20) {
    stressProfile = 'isolating'; // WHO drops significantly under pressure
  } else if (deltas.how > 20 && whoDelta < -10) {
    stressProfile = 'controlling'; // HOW spikes, WHO drops
  } else if (whoDelta < -10 && deltas.what < -10) {
    stressProfile = 'withdrawing'; // both WHO and WHAT drop
  } else if (deltas.how > 15 || deltas.what > 15) {
    stressProfile = 'intensifying'; // execution axes spike under pressure
  }

  return { deltas, stressProfile };
}

// ── 5. computeTrustIndex ────────────────────────────────────────
/**
 * Weights: Relational 35% · Competence 35% · Systemic 30%
 * @param {number[]} trustAnswers - index of selected option per Q33-Q44
 * @param {object} wbAnswers - word bank selections
 * @returns {{ relational, competence, systemic, composite }} 0-100
 */
export function computeTrustIndex(trustAnswers = [], wbAnswers = {}) {
  const trust = { 'trust-relational': 0, 'trust-competence': 0, 'trust-systemic': 0 };
  const axis = {};
  const attr = {};

  SECTION_E.forEach((q, i) => {
    const sel = trustAnswers[i];
    if (sel == null || !q.options[sel]) return;
    accumulateScoring(q.options[sel].scoring, axis, attr, trust);
  });

  // WB-6 trust-relational validation boost
  const wb6 = wbAnswers['WB-6'];
  if (wb6 && wb6.length > 0) {
    trust['trust-relational'] += wb6.length * 0.3;
  }

  // Normalize each dimension to 0-100
  // Relational max: ~22 from items + WB boost
  // Competence max: ~15 from items
  // Systemic max: ~14 from items
  const relational = clamp((trust['trust-relational'] / 22) * 100);
  const competence = clamp((trust['trust-competence'] / 15) * 100);
  const systemic = clamp((trust['trust-systemic'] / 14) * 100);

  // Weighted composite: 35/35/30
  const composite = clamp(
    (relational * 0.35) + (competence * 0.35) + (systemic * 0.30)
  );

  return { relational, competence, systemic, composite };
}

// ── 6. computeEQScore ──────────────────────────────────────────
/**
 * Formula from spec Table 123:
 * selfAwareness (20%): stressDelta magnitude + shadow WB
 * selfRegulation (30%): EQ-1 + EQ-2(slider*0.25) + EQ-3(+2) + EQ-4
 * motivation (15%): achievement*0.6 + why*0.4
 * empathy (25%): (EQ-5..8 accumulated * 0.6) + (trust.relational * 0.4)
 * socialSkill (10%): who*0.7 + Q7score*0.3
 * @param {number[]} eqAnswers - index per EQ-1..8 (EQ-2 is slider 0-100)
 * @param {{ axisScores, attrScores, trustIndex, stressDelta, scenarioAnswers }} existing
 * @returns {{ selfAwareness, selfRegulation, motivation, empathy, socialSkill, composite, regulationStyle }}
 */
export function computeEQScore(eqAnswers = [], existingScores = {}) {
  const { axisScores = {}, attrScores = {}, trustIndex = {}, stressDelta = {}, scenarioAnswers = [], wbAnswers = {} } = existingScores;

  // ── Self-Regulation (from EQ-1, EQ-2, EQ-3, EQ-4) ───
  let selfRegRaw = 0;
  let regulationStyle = null;

  // EQ-1 (scenario, index 0)
  if (eqAnswers[0] != null && EQ_ITEMS[0].options[eqAnswers[0]]) {
    selfRegRaw += EQ_ITEMS[0].options[eqAnswers[0]].scoring['eq-self-reg'] || 0;
  }
  // EQ-2 (slider, index 1) — value / 100 * 25
  if (eqAnswers[1] != null) {
    selfRegRaw += (eqAnswers[1] / 100) * 25;
  }
  // EQ-3 (forced choice, index 2) — both options = +2, store regulationStyle
  if (eqAnswers[2] != null && EQ_ITEMS[2].options[eqAnswers[2]]) {
    selfRegRaw += 2;
    regulationStyle = EQ_ITEMS[2].options[eqAnswers[2]].regulationStyle || null;
  }
  // EQ-4 (scenario, index 3)
  if (eqAnswers[3] != null && EQ_ITEMS[3].options[eqAnswers[3]]) {
    selfRegRaw += EQ_ITEMS[3].options[eqAnswers[3]].scoring['eq-self-reg'] || 0;
  }
  // Max self-reg raw: 4 + 25 + 2 + 4 = 35
  const selfRegulation = clamp((selfRegRaw / 35) * 100);

  // ── Empathy (from EQ-5, EQ-6, EQ-7, EQ-8) ───
  let empathyRaw = 0;
  for (let i = 4; i <= 7; i++) {
    if (eqAnswers[i] != null && EQ_ITEMS[i] && EQ_ITEMS[i].options[eqAnswers[i]]) {
      empathyRaw += EQ_ITEMS[i].options[eqAnswers[i]].scoring['eq-empathy'] || 0;
    }
  }
  // Max empathy raw: 4+4+3+4 = 15
  const empathyFromEQ = clamp((empathyRaw / 15) * 100);
  const empathy = clamp((empathyFromEQ * 0.6) + ((trustIndex.relational || 50) * 0.4));

  // ── Self-Awareness: stressDelta magnitude + shadow WB (WB-8) ───
  let saRaw = 30; // baseline
  if (stressDelta && stressDelta.deltas) {
    const totalDeltaMag = Object.values(stressDelta.deltas).reduce((s, d) => s + Math.abs(d), 0);
    // Higher awareness of stress patterns = higher score. Map 0-80 range to 0-35 bonus.
    saRaw += clamp((totalDeltaMag / 80) * 35, 0, 35);
  }
  // WB-8 shadow side: more selections = higher self-awareness of development areas
  const wb8 = wbAnswers['WB-8'];
  if (wb8 && wb8.length > 0) {
    // WB-8 has 11 words. Selecting 3-6 is healthy self-awareness. Map to 0-35 bonus.
    saRaw += clamp((Math.min(wb8.length, 8) / 8) * 35, 0, 35);
  }
  const selfAwareness = clamp(saRaw);

  // ── Motivation: achievement*0.6 + why*0.4 ───
  const motivation = clamp(
    ((attrScores.achievement || 50) * 0.6) + ((axisScores.why || 50) * 0.4)
  );

  // ── Social Skill: who*0.7 + Q7score*0.3 ───
  let q7Score = 50;
  if (scenarioAnswers[6] != null && SECTION_A[6] && SECTION_A[6].options[scenarioAnswers[6]]) {
    const q7Scoring = SECTION_A[6].options[scenarioAnswers[6]].scoring;
    // Q7 max WHO contribution is 3, scale to 0-100
    q7Score = clamp(((q7Scoring.who || 0) / 3) * 100);
  }
  const socialSkill = clamp(
    ((axisScores.who || 50) * 0.7) + (q7Score * 0.3)
  );

  // ── Composite: weighted ───
  const composite = clamp(
    (selfAwareness * 0.20) +
    (selfRegulation * 0.30) +
    (motivation * 0.15) +
    (empathy * 0.25) +
    (socialSkill * 0.10)
  );

  return { selfAwareness, selfRegulation, motivation, empathy, socialSkill, composite, regulationStyle };
}

// ── 7. computeStyle ────────────────────────────────────────────
/**
 * @returns {'diplomatic'|'logistical'|'strategic'|'tactical'}
 */
export function computeStyle(who, why, what, how) {
  const scores = {
    diplomatic: who + why,   // People + Purpose
    strategic: why + what,    // Purpose + Systems
    logistical: what + how,   // Systems + Execution
    tactical: who + how,      // People + Execution
  };
  let max = -1;
  let style = 'diplomatic';
  for (const [s, v] of Object.entries(scores)) {
    if (v > max) { max = v; style = s; }
  }
  return style;
}

// ── 8. computeFullProfile ───────────────────────────────────────
/**
 * Master function. Takes all answers, returns complete profile object.
 * @param {object} allAnswers
 *   .scenarioAnswers  number[]  Q1-Q8 selected option index
 *   .sliderValues     number[]  10 raw slider values 0-100
 *   .fcAnswers        number[]  Q9-Q15 selected option index
 *   .pressureAnswers  number[]  Q25-Q32 selected option index
 *   .trustAnswers     number[]  Q33-Q44 selected option index
 *   .eqAnswers        (number|null)[]  EQ-1..8 (index or slider value)
 *   .wbAnswers        object    { 'WB-1': [...words], ... }
 *   .gapSelection     number|null  gap prompt selection index 0-9
 *   .mode             'short'|'long'
 * @returns {object} Complete profile for localStorage and downstream consumption
 */
export function computeFullProfile(allAnswers = {}) {
  const {
    scenarioAnswers = [],
    sliderValues = [],
    fcAnswers = [],
    pressureAnswers = [],
    trustAnswers = [],
    eqAnswers = [],
    wbAnswers = {},
    gapSelection = null,
    mode = 'long',
  } = allAnswers;

  // 1. Slider psychometrics
  const sliderResult = sliderValues.length >= 10
    ? transformSliders(sliderValues, gapSelection)
    : null;

  // 2. Layer 1 — Communication Quadrant
  const axisScores = computeAxisScores(scenarioAnswers, fcAnswers, sliderResult, wbAnswers);
  const style = computeStyle(axisScores.who, axisScores.why, axisScores.what, axisScores.how);

  // 3. Layer 2 — Attribute Signal Map
  const attrScores = computeAttrScores(scenarioAnswers, sliderResult, fcAnswers);

  // 4. Layer 3 — Stress Delta (long form only)
  let stressDeltaResult = null;
  if (mode === 'long' && pressureAnswers.length > 0) {
    const pressureAxes = computePressureAxes(pressureAnswers);
    stressDeltaResult = computeStressDelta(axisScores, pressureAxes);
    stressDeltaResult.baseline = axisScores;
    stressDeltaResult.pressure = pressureAxes;
  }

  // 5. Layer 4 — Science of Trust (long form only)
  let trustIndex = null;
  if (mode === 'long' && trustAnswers.length > 0) {
    trustIndex = computeTrustIndex(trustAnswers, wbAnswers);
  }

  // 6. Layer 5 — EQ (long form only)
  let eqScore = null;
  if (mode === 'long' && eqAnswers.length > 0) {
    eqScore = computeEQScore(eqAnswers, {
      axisScores,
      attrScores,
      trustIndex: trustIndex || {},
      stressDelta: stressDeltaResult,
      scenarioAnswers,
      wbAnswers,
    });
  }

  // 7. Build profile metadata
  const metadata = {
    mode,
    completedAt: new Date().toISOString(),
    lowReliability: sliderResult?.lowReliability || false,
    acquiescenceFlag: sliderResult?.acquiescenceFlag || false,
    recognitionWatch: sliderResult?.recognitionWatch || false,
    isolationRisk: sliderResult?.independenceFlags?.isolationRisk || false,
    overConsensusRisk: sliderResult?.independenceFlags?.overConsensusRisk || false,
    gapItem: sliderResult?.gapItem || null,
    confirmationBias: fcAnswers[6] === 0, // Q15 option A
  };

  // Response patterns derived from axis scores
  const responsePatterns = detectPatternsFromAxes(axisScores);

  return {
    // Layer 1: Communication Quadrant
    quadrant: { ...axisScores, style },
    // Convenience aliases used by Profile screen
    axisScores,
    dominantStyle: style,
    // Layer 2: Attribute Signal Map
    attributes: attrScores,
    // Layer 3: Stress Delta
    stressDelta: stressDeltaResult,
    // Layer 4: Science of Trust
    trust: trustIndex,
    // Layer 5: EQ
    eq: eqScore,
    // Response patterns
    responsePatterns,
    // Metadata
    metadata,
    // Raw slider data for debugging/re-scoring
    _sliderDetail: sliderResult ? {
      raw: sliderResult.raw,
      transformed: sliderResult.transformed,
      consistency: sliderResult.consistency,
    } : null,
  };
}

// ── Legacy compatibility (consumed by existing Assessment.jsx) ──────────
// Maps old computeScores(scenarios, sliders, attrs) → new engine
export function computeScores(scenarioAnswers = [], sliderAnswers = [], attrAnswers = []) {
  const axis = { who: 0, why: 0, what: 0, how: 0 };

  // Process old-format scenario answers (selected option index per question)
  SECTION_A.forEach((q, i) => {
    const sel = scenarioAnswers[i];
    if (sel == null || !q.options[sel]) return;
    const s = q.options[sel].scoring;
    if (s.who) axis.who += s.who;
    if (s.why) axis.why += s.why;
    if (s.what) axis.what += s.what;
    if (s.how) axis.how += s.how;
  });

  // Process slider values (0-100 per slider)
  sliderAnswers.forEach((val, i) => {
    if (val == null) return;
    const axes = ['who', 'why', 'who', 'how', 'who', 'who', 'why', 'what', 'who', 'what'];
    const a = axes[i % axes.length];
    axis[a] += (val / 100) * 3;
  });

  const maxAxis = Math.max(...Object.values(axis), 1);
  const axisScores = {
    who: clamp((axis.who / maxAxis) * 100),
    why: clamp((axis.why / maxAxis) * 100),
    what: clamp((axis.what / maxAxis) * 100),
    how: clamp((axis.how / maxAxis) * 100),
  };

  const attrScores = {};
  const attrKeys = ['empathy', 'vision', 'structure', 'decisiveness', 'communication', 'risk', 'collaboration', 'innovation'];
  attrAnswers.forEach((val, i) => {
    if (attrKeys[i]) attrScores[attrKeys[i]] = val ?? 50;
  });

  const dominantStyle = computeStyle(axisScores.who, axisScores.why, axisScores.what, axisScores.how);

  return { axisScores, attrScores, dominantStyle };
}

// ── Response pattern detection ──────────────────────────────────

export function computeSectionWeights(responses) {
  // responses: array of { sectionId, axisWeights, value }
  // axisWeights: { who: 0-1, why: 0-1, what: 0-1, how: 0-1 }
  const weights = { who: {}, why: {}, what: {}, how: {} };

  (responses || []).forEach(r => {
    Object.entries(r.axisWeights || {}).forEach(([axis, weight]) => {
      if (weights[axis] === undefined) return;
      if (!weights[axis][r.sectionId]) weights[axis][r.sectionId] = 0;
      weights[axis][r.sectionId] += weight * (r.value || 0);
    });
  });

  const topSections = {};
  Object.entries(weights).forEach(([axis, sectionScores]) => {
    topSections[axis] = Object.entries(sectionScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([sectionId]) => sectionId);
  });

  return topSections;
}

export function detectResponsePattern(sectionWeights) {
  const patterns = [];
  const w = sectionWeights || {};

  if (w.who?.includes('communication') && w.who?.includes('feedback')) {
    patterns.push('relational_safety_first');
  }
  if (w.what?.includes('direction') && w.how?.includes('accountability')) {
    patterns.push('systems_before_people');
  }
  if (w.who?.includes('conflict')) {
    patterns.push('conflict_as_relational_risk');
  }
  if (w.how?.includes('delegation') && w.how?.includes('accountability')) {
    patterns.push('execution_first');
  }
  if (w.why?.includes('direction') && !w.what?.includes('direction')) {
    patterns.push('vision_without_systems');
  }

  return patterns.slice(0, 2);
}

// Derive response patterns from axis scores when section-level data is unavailable
export function detectPatternsFromAxes(axisScores) {
  const { who = 50, why = 50, what = 50, how = 50 } = axisScores;
  const patterns = [];

  if (who >= 60 && why >= 55 && who > what && who > how) {
    patterns.push('relational_safety_first');
  } else if (who >= 60 && how >= 55 && how > why && how > what) {
    patterns.push('execution_first');
  } else if (what >= 60 && how >= 55 && what > who && how > who) {
    patterns.push('systems_before_people');
  } else if (why >= 60 && what < 50 && why > how) {
    patterns.push('vision_without_systems');
  } else if (who >= 55 && who > why && who > how) {
    patterns.push('conflict_as_relational_risk');
  }

  return patterns.slice(0, 2);
}
