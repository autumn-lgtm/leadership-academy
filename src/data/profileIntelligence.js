// src/data/profileIntelligence.js
// Formation narratives, response pattern copy, stress delta copy

export const FORMATION_NARRATIVES = {
  diplomatic: {
    paragraphs: [
      "Your Map shows someone who learned that reading the room before acting is how you stay effective. High WHO + WHY scores are the signature of a leader who built credibility through relationships before they built it through results.",
      "People trusted you before they followed you. That trust-first sequence is a skill — but it is also a pattern that can make hard things harder. When directness is required, the part of you that reads relational risk first has to be actively overridden.",
      "Your profile also shows high purpose orientation. That combination — people + purpose — means you are most effective when the work has meaning you can articulate and a team you can bring along. You are least effective when the work is transactional and the room is cold.",
    ],
    axonLine: "You lead through connection. The question is whether you can be direct when connection requires it.",
  },
  strategic: {
    paragraphs: [
      "Your Map shows someone who is more energized by the problem than the room. High WHY + WHAT scores are the signature of a leader who built credibility through insight — people followed your thinking before they followed you.",
      "You see systems and second-order effects that others miss. That capability is genuinely rare. But it can also mean you are further ahead of the room than you realize, and that gap can make you feel chronically under-utilized.",
      "Your profile shows that execution details are not where your attention lives. The HOW axis is lower — not meaning you cannot execute, but that staying in execution mode costs more energy for you than for leaders with different profiles.",
    ],
    axonLine: "You lead through vision. The question is whether you can slow down enough for the room to catch up.",
  },
  logistical: {
    paragraphs: [
      "Your Map shows someone who solved for reliability. High WHAT + HOW scores are the signature of a leader who learned that unclear systems create chaos — and that building the right structure is how you protect the people around you.",
      "You are the person who makes things actually work. The invisible infrastructure that others take for granted. The frustration you sometimes feel when others do not see the system behind the results is real — and it is data.",
      "Your profile shows that the relational and purpose dimensions are lower — not absent, but secondary. You build trust through reliability more than through warmth. People know they can count on you before they feel close to you.",
    ],
    axonLine: "You lead through structure. The question is whether people feel seen inside the system you build.",
  },
  tactical: {
    paragraphs: [
      "Your Map shows someone who built credibility through delivery. High HOW + WHO scores are the signature of a leader who was rewarded for getting things done fast and clean — and who built team identity around execution.",
      "The execution muscle is dominant because it worked. You move fast, you see blockers before others do, and you have a low tolerance for ambiguity without a plan. That is an asset in most environments and a liability in a specific few.",
      "Your profile shows that the systems and purpose dimensions are lower. In conversations about direction or long-range strategy, you may find yourself impatient in a way the room reads as disinterest. It is not disinterest. It is a different kind of intelligence.",
    ],
    axonLine: "You lead through action. The question is whether you can stay in the room when the answer is not a task.",
  },
};

export function getFormationNarrative(style) {
  return FORMATION_NARRATIVES[style] || FORMATION_NARRATIVES.diplomatic;
}

export const PATTERN_COPY = {
  relational_safety_first: {
    label: "Relational safety first",
    paragraphs: [
      "Your responses in the Communication and Feedback sections shaped your profile most. In both areas, your instinct is to read relational risk before taking action.",
      "This shows up in how you deliver feedback — you calibrate for the other person's emotional state before you calibrate for clarity. It is not a soft skill. It is a social intelligence capability that most leaders undervalue until it is missing.",
      "The cost is that direct communication sometimes requires an extra step. The gain is that you rarely blow up a relationship by moving too fast.",
    ],
  },
  systems_before_people: {
    label: "Systems before people",
    paragraphs: [
      "Your responses in the Direction and Accountability sections shaped your profile most. In both areas, your instinct moves to structure and outcome before it moves to the people involved.",
      "This produces clarity and reliability. It can also mean that the human experience of working inside the system you build is something you have to actively invest in — because it does not happen automatically.",
    ],
  },
  conflict_as_relational_risk: {
    label: "Conflict as relational risk",
    paragraphs: [
      "Your responses in the Conflict section shaped your WHO score more than any other section. When conflict arises, your primary read is relational — you process it as a threat to the relationship before information about the problem.",
      "This is the source of both your greatest strength (you can hold people through hard moments) and your greatest risk (you may resolve the surface without addressing the root).",
    ],
  },
  execution_first: {
    label: "Execution first",
    paragraphs: [
      "Your responses in the Delegation and Accountability sections shaped your HOW score most. In both areas, your instinct is to move — clarify the task, assign ownership, create the conditions for delivery.",
      "This makes you fast and clear. It can also mean that the people you lead know exactly what is expected but are less certain whether you know who they are.",
    ],
  },
  vision_without_systems: {
    label: "Vision without systems",
    paragraphs: [
      "Your responses in the Direction section drove your purpose score strongly but did not drive your systems score the same way. When you set direction, your natural language is about meaning and possibility — not architecture and process.",
      "The practical implication: the people you lead may feel inspired by the direction but unclear on how to move. Pairing your WHY with someone else's WHAT is not a weakness — it is a deliberate design choice.",
    ],
  },
};

export function getPatternCopy(pattern) {
  return PATTERN_COPY[pattern] || null;
}

export function getDeltaTier(avgDelta) {
  if (avgDelta <= 10) return "small";
  if (avgDelta <= 25) return "medium";
  return "large";
}

export const DELTA_COPY = {
  small: {
    paragraphs: [
      "Your style is stable. Under pressure you lead essentially the same way you do in calm conditions — same priorities, same instincts, same defaults.",
      "There are two ways to read this. The first: your leadership style is genuinely integrated — the values and behaviors are yours and they hold under load. The second: you have not yet encountered the kind of pressure that exposes the gap.",
      "The Map cannot tell you which one is true. Pay attention the next time conditions get genuinely hard.",
    ],
    axonLine: "A small delta means either deep integration or an unchallenged assumption. Only time and hard conditions reveal which.",
  },
  medium: {
    paragraphs: [
      "Under pressure, your [DOMINANT_AXIS] drops measurably. The leader who shows up in a difficult meeting is not identical to the leader who shows up on a good day.",
      "This is the normal pattern for your style. It does not mean the pressure version of you is bad — it means it is different. The people you lead have noticed the difference even if you have not named it.",
      "The most useful thing you can do with this is name it. 'When things get hard, I tend to [behavior]. If you see that happening, it helps to [specific request].' That conversation changes everything.",
    ],
    axonLine: "The version of you under pressure is not broken. It is just running a different program. The question is whether you know it.",
  },
  large: {
    paragraphs: [
      "Your profile changes significantly under pressure. The gap between how you lead on a good day and how you lead in a difficult moment is wide enough that the people around you experience it as a different leader.",
      "This is not a character flaw. It is a cortisol budget. Under perceived threat, your prefrontal cortex loses resources to the part of your brain that handles immediate survival. The result is a narrower, faster, more reactive version of your leadership.",
      "The gap in your Map is the job. Not the job of eliminating it — that is not realistic. The job of knowing it is happening, slowing down when you can, and being honest with your team about what pressure does to you.",
    ],
    axonLine: "The gap between your calm Map and your pressure Map is not a weakness to fix. It is a pattern to name.",
  },
};

export function getDeltaCopy(tier) {
  return DELTA_COPY[tier] || DELTA_COPY.medium;
}

export const AXIS_DELTA_COPY = {
  who: "Under pressure, your connection to the people around you narrows. You may become curt, less curious about others' perspectives, or simply less present relationally. People experience this as distance. It is not withdrawal — it is focus. But from the outside it reads the same.",
  why: "Under pressure, the meaning and purpose layer closes down. You move from 'here is why this matters' to 'here is what needs to happen.' People stop feeling led and start feeling managed.",
  what: "Under pressure, your systems thinking drops out. You move faster with less architecture and more tolerance for improvised solutions that create downstream problems. The cost is often paid weeks later.",
  how: "Under pressure, your execution orientation drops. Decisions that would normally get made clearly get deferred. Tasks that would normally get delegated cleanly get muddled — exactly when delivery is most critical.",
};

export function getAxisDeltaCopy(axis) {
  return AXIS_DELTA_COPY[axis] || null;
}
