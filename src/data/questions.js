/**
 * questions.js — NeuroLeader Proprietary Assessment Instrument
 * 52 questions · 6 sections · 8 word banks · 8 EQ items
 * Source of truth: NeuroLeader_MASTER_FINAL.docx
 */

import { SLIDER_ITEMS, GAP_PROMPT } from '../utils/sliderTransforms.js';
import { SECTION_C } from './sectionC.js';
import { SECTION_D } from './sectionD.js';
import { SECTION_E } from './sectionE.js';
import { EQ_ITEMS } from './eqItems.js';
import { WORD_BANKS } from './wordBanks.js';

// ── Assessment modes ─────────────────────────────────────────────────────
export const MODES = {
  SHORT: { id: 'short', questions: 24, minutes: 8, outputs: ['quadrant', 'attributes'] },
  LONG:  { id: 'long',  questions: 52, minutes: 18, outputs: ['quadrant', 'attributes', 'stress', 'trust', 'eq'] },
};

// ── Section intro copy ───────────────────────────────────────────────────
export const SECTION_INTROS = {
  A: 'Six situations. Choose what\'s true for you.',
  B: 'Rate how true each statement is. Not your best self. The real one.',
  C: 'Two options. Pick one. No middle ground.',
  D: 'Same questions. Different version of you.',
  E: 'The last section. These ones feel different.',
  F: 'Fast. Instinctual. Select everything that feels true.',
};

export const SECTION_B_INSTRUCTION = {
  line1: 'Think about what you actually did in the last two weeks.',
  line2: 'Not what you usually try to do. Not your best week. What actually happened.',
  pause: 'Take 10 seconds. Think of one specific situation.',
};

// ── Recovery screens ─────────────────────────────────────────────────────
export const RECOVERY_BEATS = [
  { beat: 1, after: 'A', quote: 'Knowing yourself is the beginning of all wisdom.', attribution: 'Aristotle', autoAdvance: 3000 },
  { beat: 2, after: 'C', quote: 'It is not the strongest who survive. It is the most adaptable.', attribution: 'Megginson paraphrasing Darwin, 1963', tap: true },
  { beat: 3, before: 'D', quote: 'Between the stimulus and response, the most important thing is what happens inside us.', attribution: 'Covey', tap: true },
  { beat: 4, after: 'D', quote: 'We are wounded in relationship. We are healed in relationship.', attribution: 'Hendrix', tap: true },
  { beat: 5, before: 'profile', lines: ['You showed up honestly. That\'s the hardest part.'], loadingMs: 2000 },
];

// ── SECTION A: Leadership Scenarios (Q1-Q8) — Short + Long ──────────────
export const SECTION_A = [
  {
    id: 'Q1', section: 'A', form: 'both', type: 'scenario',
    prompt: 'A decision needs to be made today. You have 60% of the information you\'d want.',
    options: [
      { label: 'I move. Waiting for more data costs more than deciding with what I have.', scoring: { what: 2, risk: 2 } },
      { label: 'I identify the one person whose input would change my decision and get it.', scoring: { who: 2, why: 1 } },
      { label: 'I map the downside scenarios first, then decide based on what I can absorb.', scoring: { risk: 2, independence: 1 } },
      { label: 'I ask what reversing this decision would cost if I\'m wrong.', scoring: { what: 1, why: 2 } },
    ],
  },
  {
    id: 'Q2', section: 'A', form: 'both', type: 'scenario',
    prompt: 'Your team just delivered something that missed the mark. The client is unhappy.',
    options: [
      { label: 'I want to understand what the team experienced before I say anything to the client.', scoring: { who: 2, why: 1 } },
      { label: 'I want the specific data on where and why it fell short before I form any view.', scoring: { what: 3 } },
      { label: 'I get on a call with the client immediately \u2014 the relationship is the first priority.', scoring: { who: 3, 'trust-relational': 1 } },
      { label: 'I want a corrective plan in my hands within 24 hours.', scoring: { how: 3, achievement: 1 } },
    ],
  },
  {
    id: 'Q3', section: 'A', form: 'both', type: 'scenario',
    prompt: 'You\'re asked to build a team from scratch. What do you do first?',
    options: [
      { label: 'I define the outcomes the team needs to produce, then work backward to the roles.', scoring: { what: 2, achievement: 2 } },
      { label: 'I map the skills gaps, then find people who complement each other.', scoring: { how: 2, what: 1 } },
      { label: 'I think about the culture first \u2014 what does this team need to feel like to do its best work?', scoring: { who: 3, why: 2, 'trust-relational': 1 } },
      { label: 'I design the operating system: how decisions get made, how work flows, how we communicate.', scoring: { how: 3, independence: 1 } },
    ],
  },
  {
    id: 'Q4', section: 'A', form: 'both', type: 'scenario',
    prompt: 'A peer leader consistently takes credit for collaborative work in front of senior leadership.',
    options: [
      { label: 'I address it directly with them \u2014 privately, specifically, once.', scoring: { independence: 2, 'trust-relational': 2 } },
      { label: 'I make my own contributions more visible without making it a conflict.', scoring: { achievement: 2, recognition: 2 } },
      { label: 'I talk to my manager about the pattern before it damages the relationship further.', scoring: { who: 1, 'trust-systemic': 1 } },
      { label: 'I document my contributions more carefully going forward.', scoring: { what: 2, how: 2 } },
    ],
  },
  {
    id: 'Q5', section: 'A', form: 'both', type: 'scenario',
    prompt: 'You are brought into a failing project midway through. The previous leader is still on the team.',
    options: [
      { label: 'I spend the first week listening \u2014 I want to understand what happened from everyone\'s perspective.', scoring: { who: 3, 'trust-relational': 1 } },
      { label: 'I get the data: what was promised, what was delivered, where the gaps are.', scoring: { what: 3 } },
      { label: 'I establish clear ownership and process changes immediately \u2014 the team needs stability.', scoring: { how: 3, achievement: 1 } },
      { label: 'I understand the original intent of the project before I change anything.', scoring: { why: 3 } },
    ],
  },
  {
    id: 'Q6', section: 'A', form: 'both', type: 'scenario',
    prompt: 'Someone on your team is technically excellent but quietly disengaged.',
    options: [
      { label: 'I create a direct conversation about what they need to feel energized here.', scoring: { who: 2, why: 1, 'trust-relational': 1 } },
      { label: 'I look at what they\'re working on \u2014 I think the problem is the work, not them.', scoring: { what: 2, how: 1 } },
      { label: 'I find out if there\'s something happening outside work that I should know about.', scoring: { who: 3 } },
      { label: 'I give them more ownership and autonomy and see if that changes things.', scoring: { how: 2, independence: 1 } },
    ],
  },
  {
    id: 'Q7', section: 'A', form: 'both', type: 'scenario',
    prompt: 'You have to deliver feedback that will be painful to receive. You know the person will get defensive.',
    options: [
      { label: 'I deliver it directly and let them have their reaction \u2014 it\'s not mine to manage.', scoring: { independence: 2, how: 1 } },
      { label: 'I build the relational context first, then deliver the feedback in that container.', scoring: { who: 3, 'trust-relational': 2 } },
      { label: 'I prepare specific examples so the conversation stays anchored in what actually happened.', scoring: { what: 3 } },
      { label: 'I think carefully about what outcome I\'m trying to achieve before I say a word.', scoring: { why: 2, achievement: 1 } },
    ],
  },
  {
    id: 'Q8', section: 'A', form: 'both', type: 'scenario',
    prompt: 'Senior leadership announces a major strategic shift. You have concerns about the direction.',
    options: [
      { label: 'I ask for a meeting to share my concerns with specifics \u2014 I owe them my honest assessment.', scoring: { independence: 2, why: 1, 'trust-competence': 1 } },
      { label: 'I voice my concerns in the announcement meeting so others know the questions are on the table.', scoring: { who: 1, recognition: 1 } },
      { label: 'I implement the direction and document my concerns \u2014 I\'ve said my piece, now I execute.', scoring: { how: 2, independence: 1 } },
      { label: 'I understand the full rationale before I form a view on whether I agree.', scoring: { why: 3 } },
    ],
  },
];

// ── Re-export all sections for unified access ─────────────────────────
export const SECTION_B = SLIDER_ITEMS;
export const SECTION_B_GAP = GAP_PROMPT;
export { SLIDER_ITEMS, GAP_PROMPT };
export { SECTION_C } from './sectionC.js';
export { SECTION_D } from './sectionD.js';
export { SECTION_E } from './sectionE.js';
export { EQ_ITEMS } from './eqItems.js';
export { WORD_BANKS } from './wordBanks.js';

// ── Master question list ─────────────────────────────────────────────────
export function getAllQuestions(mode = 'long') {
  const all = [...SECTION_A, ...SECTION_C, ...SECTION_D, ...SECTION_E, ...EQ_ITEMS];
  if (mode === 'short') return all.filter(q => q.form === 'both' || q.form === 'short');
  return all;
}

export function getQuestionsBySection(section) {
  switch (section) {
    case 'A': return SECTION_A;
    case 'B': return SECTION_B;
    case 'C': return SECTION_C;
    case 'D': return SECTION_D;
    case 'E': return SECTION_E;
    case 'EQ': return EQ_ITEMS;
    case 'F': return WORD_BANKS;
    default: return [];
  }
}
