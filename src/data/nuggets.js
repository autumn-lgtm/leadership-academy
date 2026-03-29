export const NUGGETS = [
  {
    id: 'NN-01',
    category: 'science',
    topic: 'Social cognition speed',
    text: 'Your brain allocates more processing resources to social information than any other category. When you walk into a room, your threat-detection system scans faces before you have consciously noticed anyone. WHO-dominant leaders do not choose to read people first. Their nervous system does it automatically.',
    axonLine: 'You do not decide to read people. Your brain does it before you get the chance.',
    trigger: (profile) => profile?.style === 'diplomatic',
    placement: 'profile',
  },
  {
    id: 'NN-13',
    category: 'science',
    topic: 'The stress delta',
    text: 'Cortisol does not make you worse under pressure. It redirects your brain — away from long-range thinking and toward immediate threat detection. Your prefrontal cortex, the part that handles strategic reasoning and empathy, gets the budget cut. That is why the version of you under pressure is different from the version of you in a calm meeting.',
    axonLine: 'The gap in your Map is not a character flaw. It is a cortisol budget.',
    trigger: (profile) => true,
    placement: 'profile',
  },
  {
    id: 'NN-14',
    category: 'science',
    topic: 'The 90-second window',
    text: 'Your emotional response to anything takes 90 seconds to fully process chemically. After that, if the feeling is still there, your brain is choosing to keep thinking the thought that started it. This is not a willpower failure. It is a loop you can interrupt.',
    axonLine: 'You have 90 seconds before it becomes a choice.',
    trigger: (profile) => true,
    placement: 'profile',
  },
  {
    id: 'NN-22',
    category: 'science',
    topic: 'Recognition and the reward circuit',
    text: 'Recognition activates the same reward circuit as food, money, and other external rewards. When that circuit gets enough external activation, it starts requiring it. Your brain learns to wait for acknowledgment before releasing the dopamine that drives effort. This does not make you weak. It makes you human. But it is worth knowing what happens to your output when the acknowledgment stops arriving.',
    axonLine: "If the dopamine driving your effort is coming from outside, it is on someone else's schedule.",
    trigger: (profile) => true,
    placement: 'profile',
  },
  {
    id: 'NN-31',
    category: 'theory',
    topic: 'Team stages',
    text: 'In 1965, a researcher identified that every group moves through four predictable stages: Forming, Storming, Norming, Performing. The insight most leaders miss is that each stage requires a fundamentally different leadership style. The leader who is excellent at Performing can make Storming significantly worse.',
    axonLine: 'Your Map tells you which leader you naturally are. Your team\'s stage tells you which leader they currently need.',
    trigger: (profile) => true,
    placement: 'simulator',
  },
  {
    id: 'NN-29',
    category: 'science',
    topic: 'Signal before content',
    text: 'The brain processes relational and status signals from a message before processing its informational content. By the time your recipient reads what you wrote, they have already had an emotional response to how you wrote it.',
    axonLine: 'They have already felt something about your message before they have understood it.',
    trigger: (profile) => true,
    placement: 'message_lab',
  },
  {
    id: 'NN-39',
    category: 'practice',
    topic: '1:1 consistency',
    text: 'Consistently held weekly 1:1s between a manager and each direct report are one of the strongest predictors of voluntary retention that organizational practice has identified. Not the quality of the 1:1. The consistency. A 30-minute conversation, same time, every week, that actually happens is more valuable than an excellent conversation that gets rescheduled.',
    axonLine: 'The 1:1 you cancel is the one they remember most.',
    trigger: (profile) => true,
    placement: 'profile',
  },
  {
    id: 'NN-40',
    category: 'practice',
    topic: 'Feedback timing',
    text: 'Feedback given within 24-48 hours of the observed behavior produces meaningfully better outcomes than feedback given weeks later in a scheduled review. The behavior is still in working memory. The emotional context is accessible. The connection between behavior and consequence is clear.',
    axonLine: 'Feedback that waits two weeks is history. Feedback that arrives tomorrow is a conversation.',
    trigger: (profile) => true,
    placement: 'profile',
  },
  {
    id: 'NN-43',
    category: 'practice',
    topic: 'Naming the elephant',
    text: 'The most productive thing a leader can do in a meeting where an important issue is not being discussed is to name that the issue is not being discussed. This single act, done without blame, changes the meeting. The issue becomes discussable. The energy that was being spent avoiding it becomes available for solving it.',
    axonLine: 'The thing nobody is saying is the thing the meeting is actually about.',
    trigger: (profile) => true,
    placement: 'profile',
  },
  {
    id: 'NN-45',
    category: 'practice',
    topic: 'Closing the loop',
    text: 'Leaders who consistently communicate the outcome of decisions their team contributed to build significantly higher levels of engagement than those who do not. The team does not need to agree with every decision. They need to know their input was heard and what happened next.',
    axonLine: 'Not knowing what happened to your input is the feeling that makes people stop giving it.',
    trigger: (profile) => true,
    placement: 'profile',
  },
  {
    id: 'NN-46',
    category: 'practice',
    topic: 'Catch people doing things right',
    text: 'Most leadership systems are built to catch what went wrong. Missed metrics, escalations, performance gaps. The problem is that these are lagging indicators — by the time they show up, the damage is already done. The leading indicator of culture and performance is recognition. Who is improving quietly. Who is carrying weight nobody is tracking. Who is doing the right thing when no one is watching. Building a system that surfaces those signals before any outcome appears in a dashboard is the difference between a culture that runs on fear of being caught and one that runs on the motivation of being seen.',
    axonLine: 'The best management system ever built is the one that catches people doing things right.',
    attribution: 'leader',
    trigger: (profile) => true,
    placement: ['profile', 'team_signal_map'],
  },
  {
    id: 'NN-47',
    category: 'practice',
    topic: 'What if it works out',
    text: 'Most leadership systems are built around risk. What could go wrong. Who might fail. What needs to be caught before it becomes a problem. The result is a culture oriented toward threat — and a brain that follows. Under perceived threat, your prefrontal cortex loses budget. Options narrow. Creativity drops. The room gets smaller. The leader who starts from "what if it works out" is not ignoring risk. They are choosing a different anchor question — one that opens the brain rather than closing it. That question pulls different thinking out of a team, different decisions, different energy into the room. Possibility is not naivety. It is a physiological starting condition.',
    axonLine: 'Risk mitigation protects you from the downside. Possibility thinking is the only thing that creates the upside.',
    attribution: 'leader',
    trigger: (profile) => true,
    placement: ['profile', 'activation_card'],
  },
];

export function getNuggetForPlacement(placement, profile) {
  const eligible = NUGGETS.filter(n => {
    const placements = Array.isArray(n.placement) ? n.placement : [n.placement]
    return placements.includes(placement) && n.trigger(profile)
  });
  const shown = JSON.parse(localStorage.getItem('nl_shown_nuggets') || '[]');
  const unseen = eligible.filter(n => !shown.includes(n.id));
  return unseen.length > 0 ? unseen[0] : eligible[0] || null;
}

export function markNuggetShown(id) {
  const shown = JSON.parse(localStorage.getItem('nl_shown_nuggets') || '[]');
  if (!shown.includes(id)) {
    localStorage.setItem('nl_shown_nuggets', JSON.stringify([...shown, id]));
  }
}
