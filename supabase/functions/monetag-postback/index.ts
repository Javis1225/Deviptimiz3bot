// supabase/functions/monetag-postback/index.ts
//
// Receives Monetag's server-to-server ("S2S") postback confirming a
// rewarded ad view actually happened, and is the ONLY place in this whole
// system that calls award_points() for ad rewards. Nothing the client does
// can reach this path — see claim-ad-reward and the README's "Points
// integrity" section.
//
// SETUP — you'll need to adjust this against your actual Monetag zone:
//   1. In your Monetag zone's postback/S2S settings, set the postback URL to:
//      https://<project>.functions.supabase.co/monetag-postback
//        ?secret=<MONETAG_POSTBACK_SECRET>&request_id={your_click_id_macro}
//      The exact macro name Monetag uses for "the custom ID I passed in
//      when the ad was requested" varies by zone type — check your zone's
//      postback documentation and swap {your_click_id_macro} for the right
//      one. CORRELATION_PARAM_NAMES below lists the ones this function will
//      look for; add yours if it isn't already there.
//   2. Generate a random MONETAG_POSTBACK_SECRET yourself and set it both
//      here (as a Supabase secret) and in the postback URL above — this is
//      what stops anyone else from hitting this endpoint and faking a
//      verified ad view, since Monetag's calls aren't authenticated with a
//      Supabase session the way the rest of this app is.
//
// Deploy with: supabase functions deploy monetag-postback --no-verify-jwt
// (Monetag's servers have no Supabase session, so the shared secret above
// is what replaces JWT verification for this one function.)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { json } from '../_shared/http.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const POSTBACK_SECRET = Deno.env.get('MONETAG_POSTBACK_SECRET') ?? ''

// Common macro/param names ad networks use for "the custom ID you gave us
// when the ad was requested". Checked in order; first match wins. Add your
// zone's actual macro name here if it isn't one of these.
const CORRELATION_PARAM_NAMES = ['request_id', 'ymid', 'click_id', 'sub1', 'zone_request_id']

Deno.serve(async (req: Request) => {
  const url = new URL(req.url)

  if (!POSTBACK_SECRET || url.searchParams.get('secret') !== POSTBACK_SECRET) {
    // Deliberately vague response — don't help an attacker distinguish
    // "wrong secret" from "not found".
    return json({ ok: false }, 403)
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return json({ ok: false, error: 'server misconfiguration' }, 500)
  }

  let bodyParams: Record<string, unknown> = {}
  if (req.method === 'POST') {
    bodyParams = await req.json().catch(() => ({}))
  }

  const requestId = CORRELATION_PARAM_NAMES.map((name) => url.searchParams.get(name) ?? bodyParams[name]).find(Boolean) as
    | string
    | undefined

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

  // Log every inbound postback for auditing, whether or not it matches a
  // known pending reward.
  await admin.from('monetag_events').insert({
    zone_id: url.searchParams.get('zone_id') ?? null,
    event_type: url.searchParams.get('event') ?? 'postback',
    raw_payload: { query: Object.fromEntries(url.searchParams), body: bodyParams },
    verified: Boolean(requestId),
  })

  if (!requestId) {
    return json({ ok: false, error: 'no correlation ID found in postback — check CORRELATION_PARAM_NAMES' }, 400)
  }

  const { data: pending, error: findError } = await admin
    .from('reward_events')
    .select('id, user_id, points_awarded, status')
    .eq('monetag_event_id', requestId)
    .maybeSingle()

  if (findError || !pending) {
    return json({ ok: false, error: 'no matching pending reward for this request_id' }, 404)
  }
  if (pending.status !== 'pending') {
    return json({ ok: true, alreadyProcessed: true }) // idempotent — Monetag may retry postbacks
  }

  const { error: awardError } = await admin.rpc('award_points', {
    p_user_id: pending.user_id,
    p_delta: pending.points_awarded,
    p_reason: 'rewarded_ad',
    p_reference_type: 'reward_events',
    p_reference_id: pending.id,
  })
  if (awardError) return json({ ok: false, error: `award_points failed: ${awardError.message}` }, 500)

  await admin.from('reward_events').update({ status: 'verified', verified_at: new Date().toISOString() }).eq('id', pending.id)

  return json({ ok: true })
})
