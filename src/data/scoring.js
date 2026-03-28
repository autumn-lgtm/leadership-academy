import { SECTIONS } from './questions.js';

/**
 * Compute the dominant leadership style from four axis values
 * @returns {string} style key: 'diplomatic' | 'logistical' | 'strategic' | 'tactical'
 */
export function computeStyle(who, why, what, how) {
  // Diplomatic: high WHO + high WHY
  // Strategic: high WHY + high WHAT
  // Logistical: high WHAT + high HOW
  // Tactical: high WHO + high HOW
  const scores = {
    diplomatic: who + why,
    strategic: why + what,
    logistical: what + how,
    tactical: who + how
  };

  let maxScore = -1;
  let dominant = 'diplomatic';
  for (const [style, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      dominant = style;
    }
  }
  return dominant;
}

/**
 * Compute full profile scores from all assessment answers
 * @param {Array} scenarioAnswers - array of selected option indices (0-3) for each scenario
 * @param {Array} sliderAnswers - array of slider values (0-100) for each slider
 * @param {Array} attrAnswers - array of attribute slider values (0-100)
 * @param {Array} questions - the SECTIONS array from questions.js
 * @returns {{ axisScores, attrScores, dominantStyle }}
 */
export function computeScores(scenarioAnswers, sliderAnswers, attrAnswers, questions = SECTIONS) {
  const axisScores = { who: 0, why: 0, what: 0, how: 0 };

  // Process scenarios (section 0)
  const scenarioSection = questions[0];
  if (scenarioSection && scenarioAnswers.length > 0) {
    scenarioAnswers.forEach((selectedIdx, qIdx) => {
      if (selectedIdx === null || selectedIdx === undefined) return;
      const question = scenarioSection.questions[qIdx];
      if (!question) return;
      const option = question.options[selectedIdx];
      if (!option) return;
      axisScores.who += option.axes.who || 0;
      axisScores.why += option.axes.why || 0;
      axisScores.what += option.axes.what || 0;
      axisScores.how += option.axes.how || 0;
    });
  }

  // Process sliders (section 1) — normalize 0-100 to 0-3 scale
  const sliderSection = questions[1];
  if (sliderSection && sliderAnswers.length > 0) {
    sliderAnswers.forEach((val, qIdx) => {
      const question = sliderSection.questions[qIdx];
      if (!question || val === undefined) return;
      const normalized = (val / 100) * 3;
      axisScores[question.axis] += normalized;
    });
  }

  // Normalize axis scores to 0-100 range
  const maxPossiblePerAxis = {
    who: 0, why: 0, what: 0, how: 0
  };

  // Max from scenarios: 6 questions * 3 max per axis
  // Max from sliders: varies by axis count * 3
  if (scenarioSection) {
    scenarioSection.questions.forEach(q => {
      q.options.forEach(opt => {
        Object.keys(maxPossiblePerAxis).forEach(axis => {
          maxPossiblePerAxis[axis] = Math.max(maxPossiblePerAxis[axis], maxPossiblePerAxis[axis]);
        });
      });
    });
  }

  // Simple normalization: find the max value and scale
  const maxAxis = Math.max(...Object.values(axisScores), 1);
  const normalizedAxes = {};
  for (const [axis, score] of Object.entries(axisScores)) {
    normalizedAxes[axis] = Math.round((score / maxAxis) * 100);
  }

  // Process attributes (section 2)
  const attrScores = {};
  const attrSection = questions[2];
  if (attrSection && attrAnswers.length > 0) {
    attrAnswers.forEach((val, qIdx) => {
      const question = attrSection.questions[qIdx];
      if (!question) return;
      attrScores[question.attr] = val !== undefined ? val : 50;
    });
  }

  const dominantStyle = computeStyle(
    normalizedAxes.who || 0,
    normalizedAxes.why || 0,
    normalizedAxes.what || 0,
    normalizedAxes.how || 0
  );

  return {
    axisScores: normalizedAxes,
    attrScores,
    dominantStyle
  };
}
