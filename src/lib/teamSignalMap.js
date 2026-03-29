export const STAGES = {
  forming: {
    label: 'Forming',
    color: '#00E896',
    description: 'The team is new or newly configured. People are orienting to each other and to you. Uncertainty is high. Everyone is polite because nobody is comfortable enough to disagree yet.',
    teamSigns: 'People ask lots of logistics questions. They look to you for direction on almost everything. Energy is cautious. No one challenges anything directly.',
    leaderNeeds: 'Clear structure, explicit expectations, and visible presence. The team needs to know the rules, what success looks like, and that there is a leader with a plan.',
  },
  storming: {
    label: 'Storming',
    color: '#FF6B6B',
    description: 'The team is working and the differences are now visible. Conflict has emerged. People are discovering they do not all see things the same way. Frustration is rising.',
    teamSigns: 'Disagreements, sometimes direct, sometimes passive. Subgroups forming. People bypassing the process. Productivity has dipped. You hear more complaints.',
    leaderNeeds: 'Directive clarity on the non-negotiables combined with a genuine container for conflict. The team needs to know what can be debated and what cannot. Smoothing the conflict without addressing it makes Storming last longer.',
  },
  norming: {
    label: 'Norming',
    color: '#B88AFF',
    description: 'The team has come through the conflict and is developing its own identity and ways of working. Energy is rising. Trust is building. The leader becomes less central.',
    teamSigns: 'The team starts solving problems without you. People are covering for each other. Norms form without you setting them. Feedback flows more freely.',
    leaderNeeds: "Step back deliberately. The leader's job is to enable and affirm, not direct. Over-involvement at this stage is the most common cause of a team sliding back to Storming.",
  },
  performing: {
    label: 'Performing',
    color: '#00C8FF',
    description: 'The team is functioning at high capability with low need for directive leadership. They are self-organizing, proactive, and producing.',
    teamSigns: 'The team runs meetings you are not in. Problems get solved before they reach you. People are growing each other. The quality of work is high and rising.',
    leaderNeeds: 'Strategic vision and removal of obstacles. The team does not need direction. It needs to know where it is going and to have you running interference with the organization on its behalf.',
  },
  adjourning: {
    label: 'Adjourning',
    color: '#FFB340',
    description: 'The team is ending — through project completion, reorg, or departure. This stage is consistently underinvested by leaders and consistently meaningful to team members.',
    teamSigns: 'A mix of relief, loss, pride, and anxiety about what comes next. Some people are already mentally detaching.',
    leaderNeeds: 'Acknowledge and honor. Name what was accomplished. Give people permission to feel whatever they feel about it ending.',
  },
};

export const QUESTIONS = [
  {
    id: 'q1',
    text: 'How does your team handle disagreement?',
    options: [
      { label: 'Avoids it — people are polite but not honest', stage: 'forming' },
      { label: 'Openly, sometimes too openly — conflict is frequent', stage: 'storming' },
      { label: 'Constructively — people disagree and move forward', stage: 'norming' },
      { label: 'Rarely needed — they resolve things themselves', stage: 'performing' },
    ],
  },
  {
    id: 'q2',
    text: 'How much does your team need you to make decisions?',
    options: [
      { label: 'Almost everything comes to me first', stage: 'forming' },
      { label: 'Mixed — some bypass me, some over-rely on me', stage: 'storming' },
      { label: 'They decide most things and escalate when needed', stage: 'norming' },
      { label: 'They rarely need me in the decision at all', stage: 'performing' },
    ],
  },
  {
    id: 'q3',
    text: 'How would you describe energy in team meetings?',
    options: [
      { label: 'Cautious — people wait to see what others say', stage: 'forming' },
      { label: 'Variable — some tension under the surface', stage: 'storming' },
      { label: 'Collaborative — people build on each other', stage: 'norming' },
      { label: 'High — ideas move fast, people challenge well', stage: 'performing' },
    ],
  },
  {
    id: 'q4',
    text: 'How often do team members help each other without being asked?',
    options: [
      { label: 'Rarely — people focus on their own work', stage: 'forming' },
      { label: 'Inconsistently — depends on who is involved', stage: 'storming' },
      { label: 'Often — there is a sense of mutual responsibility', stage: 'norming' },
      { label: 'Consistently — it is just how the team operates', stage: 'performing' },
    ],
  },
  {
    id: 'q5',
    text: 'How does the team respond to ambiguity or change?',
    options: [
      { label: 'With anxiety — they need clarity before they move', stage: 'forming' },
      { label: 'With tension — change often triggers conflict', stage: 'storming' },
      { label: 'With discussion, then alignment', stage: 'norming' },
      { label: 'With curiosity — they figure it out as a team', stage: 'performing' },
    ],
  },
  {
    id: 'q6',
    text: 'How would you describe feedback flow in the team?',
    options: [
      { label: 'One direction only — I give it, they receive it', stage: 'forming' },
      { label: 'Charged — feedback feels risky or is avoided', stage: 'storming' },
      { label: 'Starting to flow both ways, still careful', stage: 'norming' },
      { label: 'Natural — people give and receive freely', stage: 'performing' },
    ],
  },
  {
    id: 'q7',
    text: 'How often does the team solve problems before they reach you?',
    options: [
      { label: 'Rarely — problems come to me early and often', stage: 'forming' },
      { label: 'Sometimes, but inconsistently', stage: 'storming' },
      { label: 'Often — I hear about problems after they are solved', stage: 'norming' },
      { label: 'Almost always — I find out when the solution is ready', stage: 'performing' },
    ],
  },
  {
    id: 'q8',
    text: "How would you describe your team's identity?",
    options: [
      { label: 'It does not really have one yet', stage: 'forming' },
      { label: 'It is forming, with some tensions around it', stage: 'storming' },
      { label: 'It is emerging — people identify with the team', stage: 'norming' },
      { label: 'Strong and distinct — the team has a culture', stage: 'performing' },
    ],
  },
];

const ALIGNMENT = {
  diplomatic: {
    forming:    { fit: 'moderate',  note: 'Your WHO connection helps but HOW clarity is what Forming needs first. Lead with structure.' },
    storming:   { fit: 'gap',       note: 'Your instinct is to smooth the conflict. Storming does not need smoothing — it needs naming. Say the thing that is not being said.' },
    norming:    { fit: 'strong',    note: 'Natural affirmation and connection accelerate Norming. This is your stage.' },
    performing: { fit: 'strong',    note: 'Relational maintenance keeps Performing teams cohesive. Stay connected without over-directing.' },
    adjourning: { fit: 'strongest', note: 'You are built for this. Honoring endings is a WHO superpower.' },
  },
  logistical: {
    forming:    { fit: 'strongest', note: 'Structure, clarity, and process are exactly what Forming needs. This is your natural stage.' },
    storming:   { fit: 'gap',       note: 'Adding more process in response to conflict reads as control, not support. Address the people, not the system.' },
    norming:    { fit: 'moderate',  note: 'Watch the urge to maintain structure. The team needs to develop its own norms now.' },
    performing: { fit: 'gap',       note: 'Process orientation can disrupt a self-organizing team. Get out of the way.' },
    adjourning: { fit: 'moderate',  note: 'You can support the structure of closure but invest deliberately in the relational dimension.' },
  },
  strategic: {
    forming:    { fit: 'strong',    note: 'Vision gives the forming team direction and purpose. Connect the work to the why.' },
    storming:   { fit: 'strongest', note: 'You can hold the long view through the noise of conflict. This is where strategic orientation matters most.' },
    norming:    { fit: 'moderate',  note: "Keep introducing new challenges that extend the team's growth." },
    performing: { fit: 'strongest', note: 'Vision and obstacle removal is exactly what Performing needs. This is your stage.' },
    adjourning: { fit: 'strong',    note: "Connect the team's work to a lasting legacy. Give it meaning." },
  },
  tactical: {
    forming:    { fit: 'strong',    note: 'Clear execution orientation gives Forming teams momentum. Drive early wins.' },
    storming:   { fit: 'gap',       note: 'The drive to execute can bypass the conflict that needs resolution. Stop. Address the team before the task.' },
    norming:    { fit: 'moderate',  note: 'Delivery focus can crowd out the team autonomy developing at Norming. Delegate more than feels comfortable.' },
    performing: { fit: 'moderate',  note: 'Execution excellence maintains Performing but may not sustain it. Introduce stretch and vision.' },
    adjourning: { fit: 'gap',       note: 'Your instinct is to move to the next task. Resist it. The team needs you to mark the ending.' },
  },
};

export function scoreResponses(answers) {
  const counts = { forming: 0, storming: 0, norming: 0, performing: 0 };
  answers.forEach(a => { if (counts[a.stage] !== undefined) counts[a.stage]++; });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const primary = sorted[0][0];
  const isTransitional = sorted[0][1] - sorted[1][1] <= 1;
  const secondary = isTransitional ? sorted[1][0] : null;
  const confidence = isTransitional ? 'transitional' : sorted[0][1] >= 6 ? 'high' : 'moderate';
  return { stage: primary, secondaryStage: secondary, confidence, counts };
}

export function deriveInsights(stage, leaderStyle) {
  const stageData = STAGES[stage];
  const alignment = ALIGNMENT[leaderStyle]?.[stage];
  return { stageData, alignment };
}
