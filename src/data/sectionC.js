/**
 * Section C: Forced Choice (Q9-Q15) — Short + Long form
 * Source: NeuroLeader_MASTER_FINAL.docx Tables 87-92, 136
 */
export const SECTION_C = [
  {
    id: 'Q9', section: 'C', form: 'both', type: 'forcedChoice',
    prompt: 'Choose one. No middle ground.',
    options: [
      { label: 'I\'d rather be the person who got the team aligned.', scoring: { who: 3, why: 2 } },
      { label: 'I\'d rather be the person who got the result.', scoring: { what: 2, how: 2, achievement: 2 } },
    ],
  },
  {
    id: 'Q10', section: 'C', form: 'both', type: 'forcedChoice',
    prompt: 'Choose one. No middle ground.',
    options: [
      { label: 'I need to understand why before I\'ll fully commit to how.', scoring: { why: 3 } },
      { label: 'I need to see how before I can trust the why.', scoring: { how: 3 } },
    ],
  },
  {
    id: 'Q11', section: 'C', form: 'both', type: 'forcedChoice',
    prompt: 'Choose one. No middle ground.',
    options: [
      { label: 'A team that trusts each other can overcome almost any strategic mistake.', scoring: { who: 2, 'trust-relational': 2 } },
      { label: 'A clear strategy executed well can overcome almost any team dynamic problem.', scoring: { what: 2, how: 2 } },
    ],
  },
  {
    id: 'Q12', section: 'C', form: 'both', type: 'forcedChoice',
    prompt: 'Choose one. No middle ground.',
    options: [
      { label: 'I\'d rather make a fast decision and correct it than a slow decision that\'s right.', scoring: { risk: 3, independence: 2 } },
      { label: 'I\'d rather make the right decision late than the wrong decision on time.', scoring: { what: 2, 'risk-reverse': 2 } },
    ],
  },
  {
    id: 'Q13', section: 'C', form: 'both', type: 'forcedChoice',
    prompt: 'Choose one. No middle ground.',
    options: [
      { label: 'The most important thing I can do as a leader is grow the people around me.', scoring: { who: 3, why: 2, 'trust-relational': 1 } },
      { label: 'The most important thing I can do as a leader is deliver results my organization can build on.', scoring: { what: 2, achievement: 3 } },
    ],
  },
  {
    id: 'Q14', section: 'C', form: 'both', type: 'forcedChoice',
    prompt: 'Choose one. No middle ground.',
    options: [
      { label: 'I am more energized by a new problem I\'ve never seen before.', scoring: { innovation: 3, why: 1 } },
      { label: 'I am more energized by executing a known process exceptionally well.', scoring: { how: 3, achievement: 1 } },
    ],
  },
  {
    id: 'Q15', section: 'C', form: 'both', type: 'forcedChoice',
    prompt: 'Choose one. No middle ground.',
    scienceNote: 'Confirmation bias item (Nickerson, 1998). A = diagnostic signal, not penalized. B = independence+1, innovation+1.',
    options: [
      { label: 'When I have a strong conviction about something, I am more likely to look for evidence that confirms it.', scoring: { _confirmationBias: true } },
      { label: 'When I have a strong conviction about something, I am more likely to look for evidence that challenges it.', scoring: { independence: 1, innovation: 1 } },
    ],
  },
];
