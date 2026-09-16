// supabase/functions/claim-ad-reward/index.ts
//
// Called by the client (src/lib/points.ts) right after a Monetag rewarded
// ad finishes playing. This does NOT credit points — it only opens a
// `reward_events` row with status='pending'. Points are credited later,
// only when monetag-postback receives and verifies Monetag's own
// server-to-server confirmation that the ad view actually happened.
// This two-step split is what makes the client unable to fabricate points
// by itself (see supabase/schema.sql and the README's "Points integrity"
// section).
//
// Deploy with default JWT verification ON (no --no-verify-jwt) — only a
// signed-in client should be able to open a pending reward.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, json } from '../_shared/http.ts'
import { getUserIdFromRequest } from '../_shared/auth.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

// How many points a single verified rewarded-ad view is worth. Kept here as
// a fallback; if an app_settings row with key 'points_per_rewarded_ad'
// exists, that value wins — see readPointsPerAd() below.
const DEFAULT_POINTS_PER_AD = 1

// If the same user calls this again within this window, reuse their
// existing pending request instead of creating a new row — guards against
// accidental double-submits (e.g. a double-tapped button), not abuse.
const DEDUPE_WINDOW_SECONDS = 30

async function readPointsPerAd(admin: ReturnType<typeof createClient>): Promise<number> {
  const { data } = await admin.from('app_settings').select('value').eq('key', 'points_per_rewarded_ad').maybeSingle()
  const value = data?.value
  return typeof value === 'number' ? value : DEFAULT_POINTS_PER_AD
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405)

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return json({ error: 'Server misconfiguration: missing service role key.' }, 500)
  }

  const userId = getUserIdFromRequest(req)
  if (!userId) return json({ error: 'Not authenticated.' }, 401)

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

  const since = new Date(Date.now() - DEDUPE_WINDOW_SECONDS * 1000).toISOString()
  const { data: recent } = await admin
    .from('reward_events')
    .select('id, monetag_event_id, status')
    .eq('user_id', userId)
    .eq('status', 'pending')
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (recent) {
    return json({ request_id: recent.monetag_event_id, status: 'pending', reused: true })
  }

  const requestId = crypto.randomUUID()
  const pointsAwarded = await readPointsPerAd(admin)

  const { error } = await admin.from('reward_events').insert({
    user_id: userId,
    type: 'rewarded_ad',
    status: 'pending',
    points_awarded: pointsAwarded,
    monetag_event_id: requestId,
  })

  if (error) return json({ error: `Could not open a pending reward: ${error.message}` }, 500)

  return json({ request_id: requestId, status: 'pending', reused: false })
})
