export const STYLES = {
  diplomatic: {
    name: 'Diplomatic',
    color: '#B88AFF',
    axes: { who: 'high', why: 'high', what: 'low', how: 'low' },
    short: 'The Bridge-Builder',
    orientation: 'People & Purpose',
    orientDesc: 'You lead by connecting people to meaning. Your instinct is to align values before actions — building coalitions, reading rooms, and translating intent across teams.',
    env: 'Consensus-driven orgs, cross-functional teams, stakeholder-heavy environments',
    envDesc: 'Thrives in environments that reward relationship capital, mission alignment, and long-game influence. Struggles in command-and-control or hyper-tactical cultures.',
    neuro: 'Default Mode Network (DMN) dominant — strong theory of mind, social cognition, and narrative integration. High mirror neuron activation supports empathic accuracy.',
    desc: 'Diplomatic leaders prioritize alignment, relationships, and shared meaning. They lead by building bridges between people and ideas, ensuring everyone feels heard before action is taken. They excel in complex stakeholder environments where trust and coalition-building drive outcomes.',
    quadDetail: 'Upper-left quadrant: High WHO (people focus) + High WHY (purpose focus). You naturally ask "Who needs to be involved?" and "Why does this matter?" before "What do we do?" or "How do we do it?" This makes you exceptional at strategic alignment but potentially slow to execute.',
    compare: {
      strategic: 'Both think big-picture, but you prioritize people while Strategic prioritizes systems.',
      logistical: 'Opposite orientation — you build consensus, they build processes.',
      tactical: 'You persuade through relationship; they persuade through results.'
    },
    adjustTo: {
      strategic: 'Lead with frameworks and data before relationships. They respect systems thinking.',
      logistical: 'Be specific about timelines and deliverables. Show your plan, not just your vision.',
      tactical: 'Get to the point quickly. Lead with results and keep emotional framing minimal.'
    },
    translatePrinciple: {
      core: 'Reframe through their axis priorities',
      diplomatic: 'Speak naturally — shared values and people impact',
      strategic: 'Translate your people insight into systemic implications',
      logistical: 'Convert relationship context into process steps and timelines',
      tactical: 'Distill to action items and measurable outcomes'
    },
    complement: [
      { style: 'Tactical', why: 'Grounds your vision in execution speed', how: 'Pair on decisions where speed matters — let them drive the timeline' },
      { style: 'Logistical', why: 'Adds structure to your coalition-building', how: 'Use their process rigor to formalize the agreements you broker' },
      { style: 'Strategic', why: 'Elevates your people-focus into systems design', how: 'Collaborate on org-wide initiatives where both people and architecture matter' }
    ],
    scenarios: [
      { title: 'The Reorg Announcement', body: 'Your team is being restructured. People are anxious.', action: 'Host a listening session before the formal announcement. Map emotional concerns. Build a transition narrative that honors what was and frames what\'s next.' },
      { title: 'Cross-Team Conflict', body: 'Two teams are blaming each other for a missed deadline.', action: 'Facilitate a joint retrospective. Reframe from blame to shared learning. Build a relationship repair plan.' },
      { title: 'New Executive Stakeholder', body: 'A new VP joins and wants to understand your team fast.', action: 'Prepare a relationship map, not just an org chart. Brief them on team dynamics, values, and the informal power structure.' },
      { title: 'Budget Cuts', body: 'You need to cut 20% of your team\'s budget.', action: 'Engage the team in prioritization. Make the process transparent. Frame cuts as shared sacrifice with a clear "why."' },
      { title: 'Culture Drift', body: 'Your team\'s culture is shifting as it scales.', action: 'Run a values audit. Interview team members 1:1. Co-create updated team principles that reflect who you are now.' }
    ],
    reflects: [
      'When do your bridge-building instincts slow down critical decisions?',
      'How do you handle situations where consensus is impossible?',
      'What happens when your empathy becomes a liability — when you absorb too much?',
      'How do you distinguish between genuine alignment and polite agreement?',
      'What would it look like to lead with conviction instead of consensus?'
    ]
  },

  logistical: {
    name: 'Logistical',
    color: '#00E896',
    axes: { who: 'low', why: 'low', what: 'high', how: 'high' },
    short: 'The Architect',
    orientation: 'Systems & Process',
    orientDesc: 'You lead by building reliable systems. Your instinct is to organize, sequence, and optimize — creating order from chaos and ensuring nothing falls through the cracks.',
    env: 'Operations-heavy orgs, scaling companies, regulated industries',
    envDesc: 'Thrives in environments that reward precision, repeatability, and infrastructure thinking. Struggles in ambiguous, fast-pivoting, or highly political cultures.',
    neuro: 'Dorsolateral prefrontal cortex (DLPFC) dominant — strong working memory, sequential processing, and executive planning. High basal ganglia activation supports procedural learning and habit formation.',
    desc: 'Logistical leaders prioritize structure, process, and reliable execution. They lead by creating systems that scale — ensuring the machine runs smoothly regardless of who\'s operating it. They excel in environments where complexity needs to be tamed and repeatability drives success.',
    quadDetail: 'Lower-right quadrant: High WHAT (deliverable focus) + High HOW (process focus). You naturally ask "What exactly needs to happen?" and "How do we make this repeatable?" before "Who should be involved?" or "Why are we doing this?" This makes you exceptional at execution but potentially disconnected from people and purpose.',
    compare: {
      diplomatic: 'Opposite orientation — you build systems, they build relationships.',
      strategic: 'Both think structurally, but you optimize for efficiency while they optimize for leverage.',
      tactical: 'Both are execution-oriented, but you build processes while they drive results directly.'
    },
    adjustTo: {
      diplomatic: 'Lead with people impact and shared values. Show how your process serves the team.',
      strategic: 'Frame your systems in terms of leverage and scale. Show the architecture, not just the checklist.',
      tactical: 'Skip the process explanation. Lead with the bottom line and timeline.'
    },
    translatePrinciple: {
      core: 'Reframe through their axis priorities',
      logistical: 'Speak naturally — process steps, timelines, and deliverables',
      diplomatic: 'Show how the process serves people and preserves relationships',
      strategic: 'Frame the system as enabling leverage and strategic advantage',
      tactical: 'Distill to key actions, deadlines, and expected outcomes'
    },
    complement: [
      { style: 'Diplomatic', why: 'Adds human context to your systems', how: 'Pair on rollouts — let them handle communication and change management' },
      { style: 'Strategic', why: 'Elevates your processes into scalable architecture', how: 'Collaborate on org design where both structure and strategy matter' },
      { style: 'Tactical', why: 'Adds urgency and results-focus to your planning', how: 'Use their bias for action to stress-test your processes' }
    ],
    scenarios: [
      { title: 'Onboarding at Scale', body: 'You\'re hiring 10 people in the next quarter.', action: 'Build a repeatable onboarding system: checklists, mentors, 30/60/90 plans, and feedback loops. Document everything.' },
      { title: 'Process Breakdown', body: 'A critical workflow keeps failing at handoff points.', action: 'Map the full workflow end-to-end. Identify every handoff. Add checkpoints, ownership clarity, and escalation paths.' },
      { title: 'Tech Debt Negotiation', body: 'Engineering wants to pause features to pay down tech debt.', action: 'Quantify the cost of inaction. Build a phased plan that balances debt reduction with delivery commitments.' },
      { title: 'Compliance Audit', body: 'Your team needs to pass a SOC 2 audit.', action: 'Create a compliance matrix. Map controls to existing processes. Build a gap analysis with remediation timelines.' },
      { title: 'Remote Team Coordination', body: 'Your distributed team struggles with timezone-crossing work.', action: 'Implement async-first protocols: documented decisions, recorded standups, and clear SLAs for response times.' }
    ],
    reflects: [
      'When does your love of process become a barrier to speed?',
      'How do you handle ambiguity — situations where the process doesn\'t exist yet?',
      'What happens when people don\'t follow the system you built?',
      'How do you balance structure with flexibility?',
      'What would it look like to lead with inspiration instead of organization?'
    ]
  },

  strategic: {
    name: 'Strategic',
    color: '#00C8FF',
    axes: { who: 'low', why: 'high', what: 'high', how: 'low' },
    short: 'The Visionary',
    orientation: 'Purpose & Systems',
    orientDesc: 'You lead by seeing the big picture and designing for scale. Your instinct is to architect — finding leverage points, building frameworks, and thinking three moves ahead.',
    env: 'Growth-stage companies, innovation teams, executive leadership',
    envDesc: 'Thrives in environments that reward systems thinking, long-term planning, and architectural vision. Struggles in purely tactical, firefighting, or relationship-heavy cultures.',
    neuro: 'Frontoparietal network dominant — strong abstract reasoning, pattern recognition, and future simulation. High prefrontal activation supports long-range planning and model-building.',
    desc: 'Strategic leaders prioritize vision, leverage, and systemic design. They lead by seeing patterns others miss and building frameworks that create disproportionate impact. They excel in environments where the right architecture can multiply outcomes across teams and timelines.',
    quadDetail: 'Upper-right quadrant: High WHY (purpose focus) + High WHAT (deliverable focus). You naturally ask "Why does this matter at scale?" and "What\'s the highest-leverage thing we can build?" before "Who should do it?" or "How exactly will it work?" This makes you exceptional at strategy but potentially disconnected from execution details and people dynamics.',
    compare: {
      diplomatic: 'Both think big-picture, but you prioritize systems while they prioritize people.',
      logistical: 'Both think structurally, but you optimize for leverage while they optimize for efficiency.',
      tactical: 'Opposite orientation — you design architectures, they drive immediate results.'
    },
    adjustTo: {
      diplomatic: 'Lead with people impact and values alignment. Show who benefits from your architecture.',
      logistical: 'Be specific about implementation steps. Show the roadmap, not just the vision.',
      tactical: 'Lead with the action item and expected ROI. Keep the theory minimal.'
    },
    translatePrinciple: {
      core: 'Reframe through their axis priorities',
      strategic: 'Speak naturally — frameworks, leverage, and systemic implications',
      diplomatic: 'Show how the strategy serves people and aligns with shared values',
      logistical: 'Break the strategy into implementation phases with clear milestones',
      tactical: 'Distill to the single most important action and its expected result'
    },
    complement: [
      { style: 'Logistical', why: 'Turns your vision into executable processes', how: 'Pair on implementation — let them build the system that realizes your design' },
      { style: 'Diplomatic', why: 'Adds relationship intelligence to your architecture', how: 'Collaborate on change management — they handle the people side of your strategy' },
      { style: 'Tactical', why: 'Adds urgency and proof-of-concept speed', how: 'Use their execution speed to validate your hypotheses quickly' }
    ],
    scenarios: [
      { title: 'Market Shift', body: 'A competitor just launched a feature that challenges your core value prop.', action: 'Map the competitive landscape. Identify your moat. Design a 3-move response that strengthens your position rather than just reacting.' },
      { title: 'Team Architecture', body: 'Your team of 8 needs to become 3 teams of 5.', action: 'Design the team topology: mission, interfaces, ownership boundaries. Optimize for autonomy and minimal coordination cost.' },
      { title: 'Quarterly Planning', body: 'Leadership wants your team\'s OKRs for next quarter.', action: 'Start with the 12-month vision. Work backward to the quarter. Identify the 2-3 leverage points that create maximum optionality.' },
      { title: 'Technical Architecture Decision', body: 'The team is debating microservices vs. monolith.', action: 'Frame it as a reversibility question. Map the decision against team size, deployment frequency, and domain boundaries.' },
      { title: 'Innovation Sprint', body: 'You have 2 weeks and a small team to explore a new product area.', action: 'Define the hypothesis tree. Identify the riskiest assumption. Design the minimum experiment that validates or kills it.' }
    ],
    reflects: [
      'When does your systems thinking become over-engineering?',
      'How do you stay connected to the people affected by your architectures?',
      'What happens when your vision meets organizational inertia?',
      'How do you balance thinking time with execution time?',
      'What would it look like to lead with relationships instead of frameworks?'
    ]
  },

  tactical: {
    name: 'Tactical',
    color: '#FFB340',
    axes: { who: 'high', why: 'low', what: 'low', how: 'high' },
    short: 'The Operator',
    orientation: 'People & Execution',
    orientDesc: 'You lead by driving results through people. Your instinct is to act — making fast decisions, rallying teams, and clearing obstacles in real-time.',
    env: 'Fast-paced startups, sales orgs, crisis environments, turnarounds',
    envDesc: 'Thrives in environments that reward speed, decisiveness, and direct impact. Struggles in highly bureaucratic, consensus-heavy, or theory-driven cultures.',
    neuro: 'Anterior cingulate cortex (ACC) dominant — strong conflict monitoring, rapid decision-making, and action selection. High dopaminergic reward system activation supports results-driven behavior and urgency.',
    desc: 'Tactical leaders prioritize speed, directness, and measurable results. They lead by cutting through complexity and driving teams toward outcomes. They excel in high-pressure environments where velocity matters more than perfection and the ability to adapt in real-time is critical.',
    quadDetail: 'Lower-left quadrant: High WHO (people focus) + High HOW (execution focus). You naturally ask "Who\'s doing this?" and "How do we get it done now?" before "Why are we doing it?" or "What\'s the bigger picture?" This makes you exceptional at execution and team mobilization but potentially short-sighted on strategy and purpose.',
    compare: {
      diplomatic: 'Both are people-oriented, but you drive through results while they build through consensus.',
      logistical: 'Both are execution-oriented, but you drive results directly while they build processes.',
      strategic: 'Opposite orientation — you drive immediate results, they design long-term architectures.'
    },
    adjustTo: {
      diplomatic: 'Slow down. Lead with empathy and shared purpose. Ask for input before deciding.',
      logistical: 'Document your decisions. Show the process behind your action. Add checkpoints.',
      strategic: 'Frame your results in terms of systemic impact. Show how the win compounds.'
    },
    translatePrinciple: {
      core: 'Reframe through their axis priorities',
      tactical: 'Speak naturally — action items, results, and clear ownership',
      diplomatic: 'Frame actions in terms of team impact and shared values',
      logistical: 'Present your plan as a structured sequence with milestones',
      strategic: 'Connect your actions to the bigger picture and long-term leverage'
    },
    complement: [
      { style: 'Strategic', why: 'Adds long-range vision to your execution speed', how: 'Pair on planning — let them see the forest while you move through the trees' },
      { style: 'Diplomatic', why: 'Adds relationship depth to your results-focus', how: 'Collaborate on team dynamics — they handle buy-in while you handle delivery' },
      { style: 'Logistical', why: 'Adds sustainability to your speed', how: 'Use their process thinking to make your wins repeatable' }
    ],
    scenarios: [
      { title: 'Production Outage', body: 'The system is down. Customers are complaining. The team is panicking.', action: 'Take command. Assign roles: incident commander, communicator, debugger. Set a 15-minute check-in cadence. Drive to resolution.' },
      { title: 'Missed Sprint Goal', body: 'The team missed their commitment for the second sprint in a row.', action: 'Run a focused retro. Identify the top blocker. Remove it personally. Set a clear, achievable target for next sprint.' },
      { title: 'New Product Launch', body: 'You have 6 weeks to launch a new feature.', action: 'Cut scope to the essential. Assign clear owners. Set daily standups. Ship the MVP, then iterate.' },
      { title: 'Underperforming Team Member', body: 'A team member is consistently missing expectations.', action: 'Have the direct conversation this week. Be specific about the gap. Set a 30-day improvement plan with measurable milestones.' },
      { title: 'Resource Conflict', body: 'Another team is trying to poach your best engineer.', action: 'Talk to the engineer directly. Understand their motivations. Make a concrete counteroffer — growth, scope, or challenge.' }
    ],
    reflects: [
      'When does your bias for action lead to decisions you later regret?',
      'How do you handle situations that require patience instead of speed?',
      'What happens when your directness damages a relationship?',
      'How do you balance driving results with developing people?',
      'What would it look like to lead with vision instead of velocity?'
    ]
  }
};
