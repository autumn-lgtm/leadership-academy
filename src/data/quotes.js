/**
 * quotes.js — NeuroLeader Quote System
 * 48 quotes · 3 zones · 4 helpers
 * Source: NeuroLeader_MASTER_FINAL.docx Chapter 05, Tables 127-129
 *
 * Zone 1 — Landing Screen (16 quotes): Rotating, 10-second fade
 * Zone 2 — Recovery Screens (5 quotes): Fixed, editorially matched
 * Zone 3 — Profile Header (16 quotes): 4 per style, random on load
 * Supplemental (12 quotes): EQ card, stress delta, trust screens
 */

export const QUOTES = [
  // ── ZONE 1: Landing Screen (16 quotes) ────────────────────────
  { id: 'L1', text: 'We cannot solve our problems with the same thinking we used when we created them.', attribution: 'Albert Einstein', theme: 'metacognition', zone: ['landing'] },
  { id: 'L2', text: 'The measure of intelligence is the ability to change.', attribution: 'Albert Einstein', theme: 'adaptability', zone: ['landing'] },
  { id: 'L3', text: 'Between stimulus and response there is a space. In that space is our power to choose our response.', attribution: 'Viktor Frankl', theme: 'self-regulation', zone: ['landing'] },
  { id: 'L4', text: 'The most dangerous leadership myth is that leaders are born.', attribution: 'Warren Bennis', theme: 'development', zone: ['landing'] },
  { id: 'L5', text: 'Leadership is not about being in charge. It is about taking care of those in your charge.', attribution: 'Simon Sinek', theme: 'who', zone: ['landing'] },
  { id: 'L6', text: 'The task of leadership is not to put greatness into people, but to elicit it, for the greatness is there already.', attribution: 'John Buchan', theme: 'development', zone: ['landing'] },
  { id: 'L7', text: 'What gets measured gets managed.', attribution: 'Peter Drucker', theme: 'what', zone: ['landing'] },
  { id: 'L8', text: 'The best way to predict the future is to create it.', attribution: 'Peter Drucker', theme: 'how', zone: ['landing'] },
  { id: 'L9', text: 'People do not care how much you know until they know how much you care.', attribution: 'Theodore Roosevelt', theme: 'trust', zone: ['landing'] },
  { id: 'L10', text: 'He who knows others is wise. He who knows himself is enlightened.', attribution: 'Lao Tzu', theme: 'self-awareness', zone: ['landing'] },
  { id: 'L11', text: 'The first responsibility of a leader is to define reality. The last is to say thank you.', attribution: 'Max De Pree', theme: 'why', zone: ['landing'] },
  { id: 'L12', text: 'Trust is built in very small moments.', attribution: 'John Gottman', theme: 'trust', zone: ['landing'] },
  { id: 'L13', text: 'Vulnerability is not winning or losing. It is having the courage to show up when you cannot control the outcome.', attribution: 'Brené Brown', theme: 'trust', zone: ['landing'] },
  { id: 'L14', text: 'The greatest weapon against stress is our ability to choose one thought over another.', attribution: 'William James', theme: 'self-regulation', zone: ['landing'] },
  { id: 'L15', text: 'A leader is best when people barely know he exists. When his work is done, they say: we did it ourselves.', attribution: 'Lao Tzu', theme: 'who', zone: ['landing'] },
  { id: 'L16', text: 'The quality of a leader is reflected in the standards they set for themselves.', attribution: 'Ray Kroc', theme: 'achievement', zone: ['landing'] },

  // ── ZONE 2: Recovery Screens (5 quotes, fixed) ────────────────
  { id: 'R1', text: 'Knowing yourself is the beginning of all wisdom.', attribution: 'Aristotle', source: 'Nicomachean Ethics', theme: 'self-awareness', zone: ['recovery'], recoveryBeat: 1 },
  { id: 'R2', text: 'It is not the strongest who survive. It is the most adaptable.', attribution: 'Megginson paraphrasing Darwin, 1963', theme: 'adaptability', zone: ['recovery'], recoveryBeat: 2 },
  { id: 'R3', text: 'Between the stimulus and response, the most important thing is what happens inside us.', attribution: 'Stephen Covey', source: '7 Habits of Highly Effective People', theme: 'self-regulation', zone: ['recovery'], recoveryBeat: 3 },
  { id: 'R4', text: 'We are wounded in relationship. We are healed in relationship.', attribution: 'Harville Hendrix', source: 'Getting the Love You Want', theme: 'trust', zone: ['recovery'], recoveryBeat: 4 },
  { id: 'R5', text: 'You showed up honestly. That\'s the hardest part.', attribution: 'NeuroLeader', theme: 'completion', zone: ['recovery'], recoveryBeat: 5 },

  // ── ZONE 3: Profile Header (4 per style × 4 styles = 16) ─────
  // Diplomatic
  { id: 'P-D1', text: 'You lead with people at the center. That\'s not softness. It\'s one of the rarest forms of intelligence an organization can have.', attribution: 'NeuroLeader', theme: 'who', zone: ['profile'], styleMatch: 'diplomatic' },
  { id: 'P-D2', text: 'The best leaders don\'t create followers. They create more leaders.', attribution: 'Tom Peters', theme: 'who', zone: ['profile'], styleMatch: 'diplomatic' },
  { id: 'P-D3', text: 'Empathy is not a soft skill. It is the hardest skill there is.', attribution: 'NeuroLeader', theme: 'empathy', zone: ['profile'], styleMatch: 'diplomatic' },
  { id: 'P-D4', text: 'Diplomacy is the art of letting someone else have your way.', attribution: 'Daniele Vare', theme: 'influence', zone: ['profile'], styleMatch: 'diplomatic' },

  // Strategic
  { id: 'P-S1', text: 'You think further ahead than most people around you. That gap is both your greatest contribution and your most common frustration.', attribution: 'NeuroLeader', theme: 'why', zone: ['profile'], styleMatch: 'strategic' },
  { id: 'P-S2', text: 'Strategy without execution is hallucination.', attribution: 'Thomas Edison', theme: 'why', zone: ['profile'], styleMatch: 'strategic' },
  { id: 'P-S3', text: 'The essence of strategy is choosing what not to do.', attribution: 'Michael Porter', theme: 'why', zone: ['profile'], styleMatch: 'strategic' },
  { id: 'P-S4', text: 'Vision without action is a daydream. Action without vision is a nightmare.', attribution: 'Japanese Proverb', theme: 'why', zone: ['profile'], styleMatch: 'strategic' },

  // Logistical
  { id: 'P-L1', text: 'You hold complexity most people cannot see. The systems that keep things running — that is yours. It rarely gets the credit it deserves.', attribution: 'NeuroLeader', theme: 'what', zone: ['profile'], styleMatch: 'logistical' },
  { id: 'P-L2', text: 'Good process is invisible. Bad process is all anyone talks about.', attribution: 'NeuroLeader', theme: 'what', zone: ['profile'], styleMatch: 'logistical' },
  { id: 'P-L3', text: 'For every minute spent organizing, an hour is earned.', attribution: 'Benjamin Franklin', theme: 'what', zone: ['profile'], styleMatch: 'logistical' },
  { id: 'P-L4', text: 'Systems run the business. People run the systems.', attribution: 'Michael Gerber', theme: 'what', zone: ['profile'], styleMatch: 'logistical' },

  // Tactical
  { id: 'P-T1', text: 'You actually finish things. In a world of good intentions, that is rarer than it sounds.', attribution: 'NeuroLeader', theme: 'how', zone: ['profile'], styleMatch: 'tactical' },
  { id: 'P-T2', text: 'Done is better than perfect.', attribution: 'Sheryl Sandberg', theme: 'how', zone: ['profile'], styleMatch: 'tactical' },
  { id: 'P-T3', text: 'Execution eats strategy for breakfast.', attribution: 'NeuroLeader', theme: 'how', zone: ['profile'], styleMatch: 'tactical' },
  { id: 'P-T4', text: 'The way to get started is to quit talking and begin doing.', attribution: 'Walt Disney', theme: 'how', zone: ['profile'], styleMatch: 'tactical' },

  // ── SUPPLEMENTAL (12 quotes) ──────────────────────────────────
  // EQ
  { id: 'S-EQ1', text: 'Emotional intelligence is not the opposite of intelligence. It is not the triumph of heart over head. It is the unique intersection of both.', attribution: 'David Caruso', theme: 'eq', zone: ['supplemental'] },
  { id: 'S-EQ2', text: 'Anyone can become angry — that is easy. But to be angry with the right person, to the right degree, at the right time, for the right purpose — that is not easy.', attribution: 'Aristotle', theme: 'eq', zone: ['supplemental'] },
  { id: 'S-EQ3', text: 'The emotionally intelligent person is skilled in four areas: identifying, using, understanding, and regulating emotions.', attribution: 'Salovey & Mayer', theme: 'eq', zone: ['supplemental'] },

  // Stress / Pressure
  { id: 'S-ST1', text: 'The greatest glory in living lies not in never falling, but in rising every time we fall.', attribution: 'Nelson Mandela', theme: 'stress', zone: ['supplemental'] },
  { id: 'S-ST2', text: 'Calm is a superpower.', attribution: 'NeuroLeader', theme: 'stress', zone: ['supplemental'] },
  { id: 'S-ST3', text: 'Under pressure, you don\'t rise to the occasion. You fall to the level of your training.', attribution: 'Navy SEAL saying', theme: 'stress', zone: ['supplemental'] },

  // Trust
  { id: 'S-TR1', text: 'Trust is the glue of life. It is the foundational principle that holds all relationships.', attribution: 'Stephen Covey', theme: 'trust', zone: ['supplemental'] },
  { id: 'S-TR2', text: 'The best way to find out if you can trust somebody is to trust them.', attribution: 'Ernest Hemingway', theme: 'trust', zone: ['supplemental'] },
  { id: 'S-TR3', text: 'Psychological safety is the single most important predictor of team effectiveness.', attribution: 'Google Project Aristotle, 2016', theme: 'trust', zone: ['supplemental'] },

  // Self-Awareness / Development
  { id: 'S-SA1', text: 'Until you make the unconscious conscious, it will direct your life and you will call it fate.', attribution: 'Carl Jung', theme: 'self-awareness', zone: ['supplemental'] },
  { id: 'S-SA2', text: 'The curious paradox is that when I accept myself just as I am, then I change.', attribution: 'Carl Rogers', theme: 'self-awareness', zone: ['supplemental'] },
  { id: 'S-SA3', text: 'Your data is accurate. What you do with it is the actual question.', attribution: 'NeuroLeader', theme: 'development', zone: ['supplemental'] },
];

// ── Helper functions ─────────────────────────────────────────────

/** Zone 1: Landing screen quotes (rotating pool) */
export function getLandingQuotes() {
  return QUOTES.filter(q => q.zone.includes('landing'));
}

/** Zone 2: Single recovery quote for a specific beat (1-5) */
export function getRecoveryQuote(beat) {
  return QUOTES.find(q => q.recoveryBeat === beat) || null;
}

/** Zone 3: Profile header quotes matched to leadership style */
export function getProfileQuotes(style) {
  return QUOTES.filter(q => q.zone.includes('profile') && q.styleMatch === style);
}

/** Supplemental: quotes by theme for EQ, stress, trust screens */
export function getThemeQuotes(theme) {
  return QUOTES.filter(q => q.theme === theme);
}

/** Random quote from a filtered set */
export function getRandomQuote(quotes) {
  if (!quotes || quotes.length === 0) return null;
  return quotes[Math.floor(Math.random() * quotes.length)];
}
