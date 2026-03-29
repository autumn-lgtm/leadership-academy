import { Link } from 'react-router-dom'

const MESSAGES = {
  diplomatic: `"I wanted to reach out because I know this has been a really tough sprint and I appreciate everything the team has put in. I'm a bit concerned about where we are on the timeline and I think we might need to talk about it. Would love to find some time this week if you have it."`,
  logistical: `"Quick update on the Henderson project — we're at risk on the Friday deadline. I've mapped the three blockers: sign-off from legal (waiting 4 days), dev resource conflict on Thursday, and the staging environment issue. I need a decision on which to prioritize by EOD today."`,
  strategic: `"I've been thinking about what this timeline shift means for where we're trying to go. The original direction had real merit but the market is moving faster than the roadmap anticipated. I think there's an opportunity here if we reframe it — the key is connecting it back to the outcomes we've always been building toward."`,
  tactical: `"The Henderson report is due Friday. Three things need to happen by Wednesday: legal sign-off, dev resource confirmed, staging fixed. I'm owning the staging issue. Who owns legal? Who owns dev? Need names by EOD."`,
}

const STYLE_LABELS = {
  diplomatic: 'Diplomatic',
  logistical: 'Logistical',
  strategic: 'Strategic',
  tactical: 'Tactical',
}

// WHO/WHY dominant styles → cross-translate to Tactical (action/execution axis)
// WHAT/HOW dominant styles → cross-translate to Diplomatic (people/purpose axis)
function getTranslation(styleName) {
  if (styleName === 'diplomatic' || styleName === 'strategic') {
    return { label: 'Tactical', message: MESSAGES.tactical }
  }
  return { label: 'Diplomatic', message: MESSAGES.diplomatic }
}

export default function ActivationCard({ styleName, open, onClose }) {
  if (!open || !MESSAGES[styleName]) return null

  const naturalLabel = STYLE_LABELS[styleName]
  const naturalMessage = MESSAGES[styleName]
  const { label: translatedLabel, message: translatedMessage } = getTranslation(styleName)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 animate-slide-up">

      <div className="max-w-2xl mx-auto px-4 pb-6">
        <div className="bg-gray-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/[0.06]">
            <span className="text-[10px] font-bold uppercase tracking-[4px] text-white/40">
              Activation
            </span>
            <button
              onClick={onClose}
              className="text-white/30 hover:text-white/60 text-sm transition-colors leading-none"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>

          <div className="px-6 pt-5 pb-6 space-y-5">
            {/* Section 1 — Natural message */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">
                Your natural message &middot; {naturalLabel}
              </div>
              <p className="text-sm text-white/75 leading-relaxed italic">
                {naturalMessage}
              </p>
            </div>

            {/* Section 2 — Translated */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400/70 mb-2">
                Translated for impact &middot; {translatedLabel}
              </div>
              <p className="text-sm text-white/75 leading-relaxed italic">
                {translatedMessage}
              </p>
            </div>

            {/* Section 3 — Gap line */}
            <p className="text-xs text-white/35 leading-relaxed">
              The gap between these two messages is where communication breaks down.
            </p>

            {/* CTA */}
            <Link
              to="/simulator?tab=2"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan hover:text-white transition-colors"
            >
              Try with your own message →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
