export const SECTIONS = [
  {
    type: 'scenarios',
    title: 'Scenario Responses',
    subtitle: 'How would you handle each situation?',
    questions: [
      {
        text: 'A key team member tells you they\'re thinking about leaving. What do you do first?',
        ctx: 'retention',
        options: [
          { label: 'Have a deep 1:1 to understand their motivations and feelings', axes: { who: 3, why: 1, what: 0, how: 0 } },
          { label: 'Review their growth path and connect their role to the company mission', axes: { who: 1, why: 3, what: 0, how: 0 } },
          { label: 'Build a concrete retention plan with milestones and compensation review', axes: { who: 0, why: 0, what: 3, how: 1 } },
          { label: 'Make a direct counteroffer and ask what it would take to stay', axes: { who: 1, why: 0, what: 0, how: 3 } }
        ]
      },
      {
        text: 'You\'re leading a cross-functional project that\'s behind schedule. What\'s your first move?',
        ctx: 'project-recovery',
        options: [
          { label: 'Meet with each team lead to understand their blockers and rebuild trust', axes: { who: 3, why: 1, what: 0, how: 0 } },
          { label: 'Reframe the project purpose and realign everyone on why it matters', axes: { who: 0, why: 3, what: 1, how: 0 } },
          { label: 'Audit the project plan, identify gaps, and restructure the timeline', axes: { who: 0, why: 0, what: 3, how: 1 } },
          { label: 'Cut scope immediately, reassign owners, and set daily check-ins', axes: { who: 1, why: 0, what: 0, how: 3 } }
        ]
      },
      {
        text: 'Your team just shipped a major feature that\'s getting mixed reviews. How do you respond?',
        ctx: 'feedback-response',
        options: [
          { label: 'Acknowledge the team\'s effort publicly and create a safe space for honest debrief', axes: { who: 3, why: 0, what: 1, how: 0 } },
          { label: 'Analyze the feedback patterns to understand what the market is really telling you', axes: { who: 0, why: 3, what: 1, how: 0 } },
          { label: 'Build a structured feedback categorization system and prioritized fix roadmap', axes: { who: 0, why: 1, what: 3, how: 0 } },
          { label: 'Identify the top 3 complaints, assign owners, and set a 2-week fix sprint', axes: { who: 0, why: 0, what: 1, how: 3 } }
        ]
      },
      {
        text: 'You\'re asked to present your team\'s strategy to the executive team. What do you emphasize?',
        ctx: 'exec-communication',
        options: [
          { label: 'The people — who\'s on the team, what they\'re capable of, and how they\'re growing', axes: { who: 3, why: 0, what: 1, how: 0 } },
          { label: 'The vision — why this work matters for the company\'s long-term trajectory', axes: { who: 0, why: 3, what: 1, how: 0 } },
          { label: 'The system — architecture, dependencies, risk mitigation, and scalability', axes: { who: 0, why: 1, what: 3, how: 0 } },
          { label: 'The results — what we shipped, metrics moved, and what we\'re shipping next', axes: { who: 0, why: 0, what: 1, how: 3 } }
        ]
      },
      {
        text: 'Two of your direct reports are in conflict. How do you handle it?',
        ctx: 'conflict-resolution',
        options: [
          { label: 'Mediate a conversation focused on understanding each person\'s perspective', axes: { who: 3, why: 1, what: 0, how: 0 } },
          { label: 'Help them see how the conflict connects to misaligned values or goals', axes: { who: 1, why: 3, what: 0, how: 0 } },
          { label: 'Document the issues, create clear role boundaries, and formalize agreements', axes: { who: 0, why: 0, what: 3, how: 1 } },
          { label: 'Have direct 1:1s with each person, set expectations, and hold them accountable', axes: { who: 1, why: 0, what: 0, how: 3 } }
        ]
      },
      {
        text: 'You\'ve been given a new team with low morale. What\'s your approach in the first month?',
        ctx: 'turnaround',
        options: [
          { label: 'Listen deeply — 1:1s with everyone, understand history, build trust first', axes: { who: 3, why: 1, what: 0, how: 0 } },
          { label: 'Reconnect the team to purpose — why their work matters and what success looks like', axes: { who: 1, why: 3, what: 0, how: 0 } },
          { label: 'Audit current processes, remove friction, and give the team structure to rely on', axes: { who: 0, why: 0, what: 3, how: 1 } },
          { label: 'Identify one quick win, deliver it together, and build momentum from there', axes: { who: 1, why: 0, what: 0, how: 3 } }
        ]
      }
    ]
  },
  {
    type: 'sliders',
    title: 'Leadership Signals',
    subtitle: 'Where do you fall on each spectrum?',
    questions: [
      { label: 'I lead with relationships', axis: 'who', color: '#B88AFF' },
      { label: 'I lead with purpose and meaning', axis: 'why', color: '#00C8FF' },
      { label: 'I lead with systems and structure', axis: 'what', color: '#00E896' },
      { label: 'I lead with speed and action', axis: 'how', color: '#FFB340' },
      { label: 'I prioritize team harmony over individual performance', axis: 'who', color: '#B88AFF' },
      { label: 'I need to understand "why" before I can commit', axis: 'why', color: '#00C8FF' },
      { label: 'I naturally create processes and documentation', axis: 'what', color: '#00E896' },
      { label: 'I\'d rather ship imperfect than wait for perfect', axis: 'how', color: '#FFB340' },
      { label: 'I invest heavily in 1:1 relationships with my team', axis: 'who', color: '#B88AFF' },
      { label: 'I think about long-term impact more than short-term wins', axis: 'why', color: '#00C8FF' },
      { label: 'I believe most problems are process problems', axis: 'what', color: '#00E896' },
      { label: 'I make decisions quickly, even with incomplete information', axis: 'how', color: '#FFB340' }
    ]
  },
  {
    type: 'attributes',
    title: 'Leadership Attributes',
    subtitle: 'Rate yourself on each dimension',
    questions: [
      { label: 'Empathy', attr: 'empathy', lo: 'Task-focused', hi: 'People-focused', color: '#B88AFF' },
      { label: 'Vision', attr: 'vision', lo: 'Pragmatic', hi: 'Visionary', color: '#00C8FF' },
      { label: 'Structure', attr: 'structure', lo: 'Flexible', hi: 'Systematic', color: '#00E896' },
      { label: 'Decisiveness', attr: 'decisiveness', lo: 'Deliberate', hi: 'Decisive', color: '#FFB340' },
      { label: 'Communication', attr: 'communication', lo: 'Direct', hi: 'Diplomatic', color: '#B88AFF' },
      { label: 'Risk Tolerance', attr: 'risk', lo: 'Risk-averse', hi: 'Risk-taking', color: '#FFB340' },
      { label: 'Collaboration', attr: 'collaboration', lo: 'Independent', hi: 'Collaborative', color: '#B88AFF' },
      { label: 'Innovation', attr: 'innovation', lo: 'Conservative', hi: 'Innovative', color: '#00C8FF' }
    ]
  }
];
