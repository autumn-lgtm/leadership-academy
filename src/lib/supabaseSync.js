// src/lib/supabaseSync.js
// Supabase data sync layer — behavior logging, session tracking, profile persistence

import { supabase } from './supabase'

function getProfile() {
  try {
    return JSON.parse(localStorage.getItem('neuroleader_profile') || '{}')
  } catch {
    return {}
  }
}

function getSessionId() {
  let id = sessionStorage.getItem('nl_session_id')
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem('nl_session_id', id)
  }
  return id
}

// ── Sync behavior event (nugget view, card interaction, etc.) ────────
export async function syncBehaviorLog(eventType, metadata = {}) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const profile = getProfile()
  const style = profile?.dominantStyle || profile?.style || null

  await supabase.from('behavior_events').insert({
    user_id: user.id,
    event_type: eventType,
    session_id: getSessionId(),
    leadership_style: style,
    metadata,
  })
}

// ── Sync dwell events (called by useDwellTime hook flush) ────────────
export async function syncDwellEvent(contentType, contentId, dwellMs) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('dwell_events').insert({
    user_id: user.id,
    session_id: getSessionId(),
    content_type: contentType,
    content_id: contentId,
    dwell_ms: dwellMs,
  })
}

// ── Sync session lifecycle (called on mount + beforeunload) ──────────
export async function syncSession(event = 'start') {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const profile = getProfile()
  const style = profile?.dominantStyle || profile?.style || null
  const sessionStart = parseInt(localStorage.getItem('nl_session_start') || '0', 10)
  const durationMs = event === 'end' && sessionStart ? Date.now() - sessionStart : null

  const sessionId = getSessionId()

  if (event === 'start') {
    await supabase.from('sessions').upsert({
      session_id: sessionId,
      user_id: user.id,
      leadership_style: style,
      started_at: new Date().toISOString(),
    }, { onConflict: 'session_id' })
  } else {
    await supabase.from('sessions').update({
      ended_at: new Date().toISOString(),
      duration_ms: durationMs,
    }).eq('session_id', sessionId)
  }
}

// ── Sync map completion ──────────────────────────────────────────────
export async function syncMapCompletion(mapData) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('team_signal_maps').insert({
    user_id: user.id,
    session_id: getSessionId(),
    map_data: mapData,
    completed_at: new Date().toISOString(),
  })
}

// ── Sync profile to Supabase ─────────────────────────────────────────
export async function syncProfile(profileData) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const style = profileData?.dominantStyle || profileData?.style || null

  await supabase.from('profiles').upsert({
    user_id: user.id,
    dominant_style: style,
    axis_scores: profileData?.axisScores || null,
    raw_profile: profileData,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' })
}
