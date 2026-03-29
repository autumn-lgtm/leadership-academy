const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

export async function analyzeTrustSignals(text, contextType, role) {
  if (!API_KEY || API_KEY === 'your_key_here') {
    throw new Error('Please set VITE_ANTHROPIC_API_KEY in your .env file');
  }

  const system = `You are a behavioral trust analyst. Frameworks: Mayer/Davis/Schoorman (1995), Edmondson (1999) psychological safety, Colquitt (2001) organizational justice, Pennebaker linguistic inquiry.

Score three dimensions 0-10:
- Relational: say/do alignment, psychological safety, bad news flow, repair after friction
- Competence: decision transparency, commitment delivery, epistemic humility, proactive bad news
- Systemic: meritocracy signals, fairness perception, recognition reliability, cynicism markers

High trust signals: "I missed this" (active accountability), reasoning shared not just directives, early bad news, genuine two-way questioning, "I don't know" said clearly, acknowledgment before redirection.
Low trust signals: passive voice for failure, delayed bad news, no pushback from team, forced positivity, missing repair after friction, opacity on reasoning.

Write all copy in plain direct language. Short sentences. No jargon. Name the behavior, not the category.

Respond ONLY in valid JSON, no markdown:
{
  "relational_score": 0-10,
  "competence_score": 0-10,
  "systemic_score": 0-10,
  "chips": [{"label":"max 3 words","type":"green|amber|coral|cyan|purple"}],
  "findings": [{"type":"positive|caution|concern","label":"short label","text":"1-2 plain sentences naming the specific behavior observed."}],
  "priority_actions": [{"label":"max 5 words","text":"One specific behavior to change. Plain language. No jargon."}]
}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system,
      messages: [{
        role: 'user',
        content: `Type: ${contextType || 'conversation'}, Role: ${role || 'leader'}\n\n${text}`,
      }],
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  const raw = (data.content?.[0]?.text || '').replace(/```json|```/g, '').trim();
  return JSON.parse(raw);
}

export async function translateMessage(message, targetStyle) {
  if (!API_KEY || API_KEY === 'your_key_here') {
    throw new Error('Please set VITE_ANTHROPIC_API_KEY in your .env file');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: `You are NeuroLeader's Communication Style Translator. Your job is to take a message and translate it into the communication style of a specific leadership type.

The four leadership styles are:
- DIPLOMATIC (People + Purpose): Leads with empathy, shared values, coalition-building. Communication is warm, inclusive, purpose-driven. Uses "we" language, acknowledges feelings, connects to meaning.
- STRATEGIC (Purpose + Systems): Leads with vision, frameworks, leverage. Communication is structured, forward-looking, systems-oriented. Uses data, patterns, long-term implications.
- LOGISTICAL (Systems + Execution): Leads with process, structure, reliability. Communication is precise, sequential, documented. Uses checklists, timelines, clear ownership.
- TACTICAL (People + Execution): Leads with speed, directness, results. Communication is concise, action-oriented, results-focused. Uses deadlines, metrics, clear assignments.

When translating, maintain the core meaning but adapt:
1. Word choice and tone
2. Structure and format
3. What's emphasized vs. de-emphasized
4. The implicit "ask" or call to action

Respond with a JSON object (no markdown, just raw JSON):
{
  "translated": "The translated message in the target style",
  "principle": "A one-sentence explanation of the translation principle used",
  "versions": {
    "diplomatic": "Brief version in diplomatic style",
    "strategic": "Brief version in strategic style",
    "logistical": "Brief version in logistical style",
    "tactical": "Brief version in tactical style"
  }
}`,
      messages: [
        {
          role: 'user',
          content: `Translate this message into the ${targetStyle.toUpperCase()} leadership communication style:\n\n"${message}"`
        }
      ]
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.content[0].text;

  try {
    return JSON.parse(text);
  } catch {
    return {
      translated: text,
      principle: 'Style-adapted communication',
      versions: { diplomatic: text, strategic: text, logistical: text, tactical: text }
    };
  }
}
