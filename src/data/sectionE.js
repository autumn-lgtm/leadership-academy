/**
 * Section E: Science of Trust (Q33-Q44) — Long form only
 * Source: NeuroLeader_MASTER_FINAL.docx Tables 102-113
 */
export const SECTION_E = [
  // ── Relational Trust (Q33-Q36) ───
  {
    id: 'Q33', section: 'E', form: 'long', type: 'scenario', trustDimension: 'relational',
    prompt: 'How often do people on your team bring you a problem before it becomes a crisis?',
    options: [
      { label: 'Regularly. They know I want to hear it early.', scoring: { 'trust-relational': 4 } },
      { label: 'Sometimes. It depends on the person.', scoring: { 'trust-relational': 2 } },
      { label: 'Occasionally. Most people solve their own problems before coming to me.', scoring: { 'trust-relational': 1 } },
      { label: 'Rarely. By the time I hear it, it\'s already escalated.', scoring: { 'trust-relational': 0 } },
    ],
  },
  {
    id: 'Q34', section: 'E', form: 'long', type: 'scenario', trustDimension: 'relational',
    prompt: 'Think about the last time you were wrong about something important at work.\nWhat did you do?',
    options: [
      { label: 'I said so directly to the people who needed to know.', scoring: { 'trust-relational': 4, 'trust-competence': 2 } },
      { label: 'I corrected course without making a big deal of it.', scoring: { 'trust-competence': 2 } },
      { label: 'I acknowledged it when asked directly.', scoring: { 'trust-relational': 1 } },
      { label: 'I\'m not sure this has come up recently.', scoring: { 'trust-relational': -1 } },
    ],
  },
  {
    id: 'Q35', section: 'E', form: 'long', type: 'forcedChoice', trustDimension: 'relational',
    prompt: 'Choose one. No middle ground.',
    options: [
      { label: 'My team would describe me as someone who is consistent \u2014 they know what to expect from me.', scoring: { 'trust-relational': 3 } },
      { label: 'My team would describe me as someone who is responsive \u2014 they know I\'ll adapt to what they need.', scoring: { 'trust-relational': 2 } },
    ],
  },
  {
    id: 'Q36', section: 'E', form: 'long', type: 'scenario', trustDimension: 'relational',
    prompt: 'Someone on your team is struggling \u2014 professionally and personally. They haven\'t told you directly.\nYou\'ve noticed.',
    options: [
      { label: 'I create a space for them to tell me if they want to. I open the door.', scoring: { 'trust-relational': 2 } },
      { label: 'I check in directly: "I\'ve noticed something feels different. How are you?"', scoring: { 'trust-relational': 3, who: 2 } },
      { label: 'I adjust their workload and keep an eye on it without making it a conversation.', scoring: { 'trust-relational': 1, how: 1 } },
      { label: 'I tell them specifically what I\'ve observed and ask if there\'s anything I should know.', scoring: { 'trust-relational': 3, what: 1 } },
    ],
  },
  // ── Competence Trust (Q37-Q40) ───
  {
    id: 'Q37', section: 'E', form: 'long', type: 'forcedChoice', trustDimension: 'competence',
    prompt: 'Choose one. No middle ground.',
    options: [
      { label: 'I would rather underpromise and consistently deliver than reach for a commitment I\'m not sure I can keep.', scoring: { 'trust-competence': 3 } },
      { label: 'I would rather commit to what\'s needed and find a way to deliver, even if it stretches me.', scoring: { 'trust-competence': 2, achievement: 2, risk: 1 } },
    ],
  },
  {
    id: 'Q38', section: 'E', form: 'long', type: 'scenario', trustDimension: 'competence',
    prompt: 'You are asked for your opinion on something outside your area of expertise.\nThere is social pressure to have an answer.',
    options: [
      { label: 'I give my honest read with a clear caveat that it\'s outside my lane.', scoring: { 'trust-competence': 3 } },
      { label: 'I ask a clarifying question to buy time and think it through.', scoring: { 'trust-competence': 2 } },
      { label: 'I defer to someone who knows more: "That\'s not my area \u2014 here\'s who I\'d ask."', scoring: { 'trust-competence': 3, 'trust-relational': 1 } },
      { label: 'I engage with the question and form a view, even if I\'m less certain than I\'d like.', scoring: { independence: 2, 'trust-competence': 1 } },
    ],
  },
  {
    id: 'Q39', section: 'E', form: 'long', type: 'scenario', trustDimension: 'competence',
    prompt: 'How do people on your team experience your decision-making?\nChoose the most accurate option \u2014 not the most aspirational.',
    options: [
      { label: 'They see my reasoning. I explain my thinking, not just my conclusions.', scoring: { 'trust-competence': 3 } },
      { label: 'They trust the outcome. I don\'t always explain, but I deliver.', scoring: { 'trust-competence': 2 } },
      { label: 'They\'re sometimes surprised. My decisions aren\'t always predictable to them.', scoring: { 'trust-competence': 1 } },
      { label: 'They feel part of it. I bring them into decisions that affect them.', scoring: { 'trust-relational': 2, 'trust-competence': 1 } },
    ],
  },
  {
    id: 'Q40', section: 'E', form: 'long', type: 'scenario', trustDimension: 'competence',
    prompt: 'A major commitment you made is at risk of not being delivered on time.\nNo one outside your team knows yet.',
    options: [
      { label: 'I tell the stakeholder immediately \u2014 they need to plan around reality, not my hope.', scoring: { 'trust-competence': 3, 'trust-relational': 2 } },
      { label: 'I assess whether I can recover it before I create alarm I might not need to create.', scoring: { independence: 2, 'trust-competence': 1 } },
      { label: 'I find out exactly what has to happen to still deliver and go do that first.', scoring: { how: 2, achievement: 2 } },
      { label: 'I bring the team together to understand where we are before I say anything externally.', scoring: { who: 2, 'trust-relational': 1 } },
    ],
  },
  // ── Systemic Trust (Q41-Q44) ───
  {
    id: 'Q41', section: 'E', form: 'long', type: 'scenario', trustDimension: 'systemic',
    prompt: 'Honestly: do you believe that doing excellent work is reliably recognized in your organization?',
    options: [
      { label: 'Yes. Consistently.', scoring: { 'trust-systemic': 4 } },
      { label: 'Usually. There are exceptions but they\'re not the norm.', scoring: { 'trust-systemic': 3 } },
      { label: 'Sometimes. It depends on who sees it.', scoring: { 'trust-systemic': 1 } },
      { label: 'Rarely. Recognition is more political than meritocratic here.', scoring: { 'trust-systemic': 0 } },
    ],
  },
  {
    id: 'Q42', section: 'E', form: 'long', type: 'forcedChoice', trustDimension: 'systemic',
    prompt: 'Choose one. No middle ground.',
    options: [
      { label: 'I believe the people making decisions above me are generally operating with good intent, even when I disagree with their choices.', scoring: { 'trust-systemic': 3 } },
      { label: 'I have learned to be skeptical about whether decisions above me account for what actually happens at my level.', scoring: { 'trust-systemic': 0 } },
    ],
  },
  {
    id: 'Q43', section: 'E', form: 'long', type: 'scenario', trustDimension: 'systemic',
    prompt: 'When decisions are made that affect your team without their input, how do you handle it?',
    options: [
      { label: 'I translate the decision faithfully and help my team understand the reasoning.', scoring: { 'trust-systemic': 2, how: 1 } },
      { label: 'I advocate internally for more inclusion before it happens again.', scoring: { independence: 2, 'trust-systemic': 2 } },
      { label: 'I\'m honest with my team that I didn\'t have input either, and we navigate it together.', scoring: { 'trust-relational': 3, 'trust-systemic': 1, who: 2 } },
      { label: 'I shield my team from the organizational noise and just tell them what they need to do.', scoring: { how: 2 } },
    ],
  },
  {
    id: 'Q44', section: 'E', form: 'long', type: 'scenario', trustDimension: 'systemic',
    prompt: 'If you had a serious concern about how the organization is being run, what would you do?',
    options: [
      { label: 'I would raise it directly with the person who could act on it.', scoring: { independence: 2, 'trust-systemic': 2, 'trust-competence': 1 } },
      { label: 'I would raise it through the appropriate formal channels.', scoring: { 'trust-systemic': 3, how: 1 } },
      { label: 'I would discuss it with peers I trust first to test whether my read is accurate.', scoring: { who: 2, 'trust-relational': 1 } },
      { label: 'I would document it and watch to see if the pattern continues before acting.', scoring: { what: 2, 'risk-reverse': 1 } },
    ],
  },
];
