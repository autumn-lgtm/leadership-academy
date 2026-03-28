/**
 * Section D: Pressure Profile (Q25-Q32) — Long form only
 * Source: NeuroLeader_MASTER_FINAL.docx Tables 94-101
 * Intro: "Same questions. Different version of you."
 */
export const SECTION_D = [
  {
    id: 'Q25', section: 'D', form: 'long', type: 'scenario',
    prompt: 'The project is on fire. A key deliverable is due in 4 hours and something critical just broke.\nThink about who you actually become in this moment \u2014 not who you want to be.',
    options: [
      { label: 'I go quiet and solve it myself. I don\'t want to alarm anyone until I know I can fix it.', scoring: { who: -3 } },
      { label: 'I immediately tell the team what\'s happening and ask who can help.', scoring: { who: 2, 'trust-relational': 1 } },
      { label: 'I triage: what can we cut, what must survive, and who needs to know right now?', scoring: { what: 2, how: 2 } },
      { label: 'I contact the stakeholder immediately \u2014 they need to know before they hear it another way.', scoring: { who: 1, 'trust-relational': 2 } },
    ],
  },
  {
    id: 'Q26', section: 'D', form: 'long', type: 'scenario',
    prompt: 'You are in a high-stakes meeting. Your position is being challenged publicly and you believe you\'re right.',
    options: [
      { label: 'I hold my ground with specifics. I don\'t concede under social pressure.', scoring: { independence: 3, what: 1 } },
      { label: 'I ask a question instead of defending. I want to understand what they\'re actually saying.', scoring: { who: 2, why: 2 } },
      { label: 'I acknowledge their point and then make mine. Both can be true.', scoring: { who: 1, why: 1 } },
      { label: 'I read the room. If I\'m losing the group, I adjust \u2014 I can win the argument later.', scoring: { who: 2, recognition: 2 } },
    ],
  },
  {
    id: 'Q27', section: 'D', form: 'long', type: 'scenario',
    prompt: 'You have made a significant decision that is not working. The cost of reversing it is visible to everyone.',
    options: [
      { label: 'I reverse it immediately and explain why. The sunk cost is already spent.', scoring: { independence: 2, risk: 2, 'trust-competence': 2 } },
      { label: 'I give it more time \u2014 I don\'t want to reverse based on early data.', scoring: { what: 2 } },
      { label: 'I modify rather than reverse \u2014 find a version that works.', scoring: { how: 2, innovation: 1 } },
      { label: 'I own it publicly with the team before I decide what to do next.', scoring: { who: 2, 'trust-relational': 2, 'trust-competence': 1 } },
    ],
  },
  {
    id: 'Q28', section: 'D', form: 'long', type: 'scenario',
    prompt: 'A trusted team member tells you something about the organization that, if true, is serious.\nYou have not been able to verify it yet.',
    options: [
      { label: 'I take it seriously immediately and start looking for corroboration.', scoring: { what: 2, 'trust-systemic': 2 } },
      { label: 'I ask them to give me more detail before I form any view.', scoring: { what: 3 } },
      { label: 'I tell them I\'ll look into it and do so quietly \u2014 I don\'t want to create alarm.', scoring: { how: 2, independence: 1 } },
      { label: 'I ask what they need from me right now before I decide what I do with this.', scoring: { who: 3, 'trust-relational': 2 } },
    ],
  },
  {
    id: 'Q29', section: 'D', form: 'long', type: 'scenario',
    prompt: 'You have to let someone go who has not done anything wrong. It\'s a business decision.',
    options: [
      { label: 'I have the conversation directly, personally, and as soon as the decision is final.', scoring: { independence: 2, how: 1 } },
      { label: 'I make sure they have everything they need \u2014 references, transition support \u2014 before the conversation.', scoring: { who: 3, 'trust-relational': 2 } },
      { label: 'I focus on being honest about why, even though the reason isn\'t their fault.', scoring: { why: 2, 'trust-relational': 1 } },
      { label: 'I think about who else needs to know and how to handle the rest of the team first.', scoring: { who: 2, how: 1 } },
    ],
  },
  {
    id: 'Q30', section: 'D', form: 'long', type: 'scenario',
    prompt: 'You are running behind on your own deliverable because you\'ve been supporting your team.',
    options: [
      { label: 'I communicate proactively to my stakeholder \u2014 they shouldn\'t be surprised.', scoring: { 'trust-competence': 2, who: 1 } },
      { label: 'I stay late and get it done. I said I would deliver and I will.', scoring: { achievement: 3, independence: 2 } },
      { label: 'I ask for help. I\'d rather be honest about needing it than miss the commitment.', scoring: { who: 2, 'trust-relational': 1 } },
      { label: 'I reassess what can be cut from scope without losing what matters most.', scoring: { what: 2, how: 1 } },
    ],
  },
  {
    id: 'Q31', section: 'D', form: 'long', type: 'scenario',
    prompt: 'Your team is exhausted. The work is not done. You have the authority to call it.',
    options: [
      { label: 'I call it. Sustainable pace is a leadership responsibility, not a preference.', scoring: { who: 2, why: 2, independence: 2 } },
      { label: 'I ask the team what they want to do \u2014 it\'s their energy I\'d be spending.', scoring: { who: 3, 'trust-relational': 2 } },
      { label: 'I look at what specifically is left and make a judgment call on what actually has to happen.', scoring: { what: 2, how: 2 } },
      { label: 'I push through. The commitment was made and the team will recover.', scoring: { achievement: 3, risk: 1 } },
    ],
  },
  {
    id: 'Q32', section: 'D', form: 'long', type: 'scenario',
    prompt: 'You disagree with a decision made above you that affects your team directly.',
    options: [
      { label: 'I advocate for my team\'s position through the appropriate channels, clearly and specifically.', scoring: { independence: 2, why: 2, 'trust-systemic': 1 } },
      { label: 'I implement the decision and protect my team from the noise around it.', scoring: { who: 2, how: 1 } },
      { label: 'I find the part of the decision I can get behind and lead from there.', scoring: { why: 2, how: 1 } },
      { label: 'I tell my team honestly that I disagree and why, and then we execute together.', scoring: { who: 3, 'trust-relational': 2, why: 1 } },
    ],
  },
];
