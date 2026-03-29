/**
 * EQ Items: EQ-1 through EQ-8 — Long form only
 * Source: NeuroLeader_MASTER_FINAL.docx Tables 114-121
 * Dimensions: Self-Regulation (EQ-1 to EQ-4), Empathy (EQ-5 to EQ-8)
 */
export const EQ_ITEMS = [
  {
    id: 'EQ-1', section: 'EQ', form: 'long', type: 'scenario', eqDimension: 'selfRegulation',
    prompt: 'You receive critical feedback in a public setting that you believe is unfair.\nYour immediate internal response \u2014 not what you say, what you feel.',
    options: [
      { label: 'Heat. I feel it physically and it takes real effort not to show it.', scoring: { 'eq-self-reg': 2 } },
      { label: 'Detachment. I go cold and analytical while I process.', scoring: { 'eq-self-reg': 2 }, note: 'suppression/dissociation pattern' },
      { label: 'Curiosity. My first instinct is to understand what\'s driving it.', scoring: { 'eq-self-reg': 4 }, note: 'cognitive reappraisal — highest order' },
      { label: 'Deflection. I mentally catalog why they\'re wrong before I\'ve fully heard them.', scoring: { 'eq-self-reg': 0 } },
    ],
  },
  {
    id: 'EQ-2', section: 'EQ', form: 'long', type: 'slider', eqDimension: 'selfRegulation',
    prompt: 'After a difficult interaction, I can return to a clear headspace within a reasonable time.',
    pole0: 'Carry it for hours or days',
    pole100: 'Clear within minutes',
    scoringFormula: 'value / 100 * 25',
    scoringTarget: 'eq-self-reg',
  },
  {
    id: 'EQ-3', section: 'EQ', form: 'long', type: 'forcedChoice', eqDimension: 'selfRegulation',
    prompt: 'Choose one.',
    options: [
      { label: 'I am more likely to say something I regret when I\'m angry than when I\'m calm.', scoring: { 'eq-self-reg': 2 }, regulationStyle: 'externalizing' },
      { label: 'I tend to shut down and go quiet when I\'m angry rather than say something I\'ll regret.', scoring: { 'eq-self-reg': 2 }, regulationStyle: 'internalizing' },
    ],
  },
  {
    id: 'EQ-4', section: 'EQ', form: 'long', type: 'scenario', eqDimension: 'selfRegulation',
    prompt: 'You are in back-to-back difficult conversations all morning. By afternoon you are depleted.\nYou have one more significant conversation ahead.',
    options: [
      { label: 'I push through. The other person deserves my full attention regardless of my state.', scoring: { 'eq-self-reg': 1 } },
      { label: 'I take 10 minutes before the next conversation to reset \u2014 even if I have to make time.', scoring: { 'eq-self-reg': 4 }, note: 'active regulation' },
      { label: 'I let the person know I\'m running low and ask if we can reschedule.', scoring: { 'eq-self-reg': 3 }, note: 'boundary + transparency' },
      { label: 'I go into the conversation knowing I\'m depleted and compensate by listening more than talking.', scoring: { 'eq-self-reg': 3 }, note: 'adaptive compensation' },
    ],
  },
  {
    id: 'EQ-5', section: 'EQ', form: 'long', type: 'scenario', eqDimension: 'empathy',
    prompt: 'Someone on your team is presenting. You can tell they are not landing with the room.\nThey have not noticed yet.',
    options: [
      { label: 'I let them finish. Interrupting would embarrass them more than the silence.', scoring: { 'eq-empathy': 1 } },
      { label: 'I find a way to redirect the conversation that gives them a natural entry point.', scoring: { 'eq-empathy': 3 } },
      { label: 'I watch the room carefully and signal to them privately if I can.', scoring: { 'eq-empathy': 3 } },
      { label: 'I jump in with a supporting question that gives them a foothold.', scoring: { 'eq-empathy': 4 } },
    ],
  },
  {
    id: 'EQ-6', section: 'EQ', form: 'long', type: 'scenario', eqDimension: 'empathy',
    prompt: 'A team member gives you an update that is technically accurate but something feels off.\nYou can\'t point to what specifically.',
    options: [
      { label: 'I ask a follow-up question. Something in how they said it told me more than what they said.', scoring: { 'eq-empathy': 3 } },
      { label: 'I stay with the content. Feelings without evidence aren\'t actionable.', scoring: { 'eq-empathy': 0 } },
      { label: 'I note it and watch for it in the next interaction before I say anything.', scoring: { 'eq-empathy': 2 } },
      { label: 'I check in directly: "Is there something else going on?"', scoring: { 'eq-empathy': 4 } },
    ],
  },
  {
    id: 'EQ-7', section: 'EQ', form: 'long', type: 'forcedChoice', eqDimension: 'empathy',
    prompt: 'Choose one.',
    options: [
      { label: 'I am more likely to feel what someone else is feeling than to analyze what they are feeling.', scoring: { 'eq-empathy': 3 }, empathyMode: 'affective' },
      { label: 'I am more likely to analyze what someone else is feeling than to actually feel it with them.', scoring: { 'eq-empathy': 2 }, empathyMode: 'cognitive' },
    ],
  },
  {
    id: 'EQ-8', section: 'EQ', form: 'long', type: 'scenario', eqDimension: 'empathy',
    prompt: 'You notice a pattern: one team member always has energy in one-on-ones but goes quiet in group settings.',
    options: [
      { label: 'I create more one-on-one space for them and adjust how I draw on them in groups.', scoring: { 'eq-empathy': 3 } },
      { label: 'I observe more before drawing any conclusions \u2014 I might be misreading.', scoring: { 'eq-empathy': 1 } },
      { label: 'I name what I\'ve noticed directly and ask them about it.', scoring: { 'eq-empathy': 4 }, note: 'highest relational courage' },
      { label: 'I structure group conversations differently so there\'s more space for different input styles.', scoring: { 'eq-empathy': 3 } },
    ],
  },
];
