import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { validateInitData } from '../_shared/telegram.ts'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * Awards +1 DevOptimizeBot Point after a verified Monetag reward.
 * Frontend never writes points directly.
 */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const { initData, monetagEventId, provider } = await req.json()
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN') || ''
    const result = await validateInitData(initData, botToken)
    if (!result.ok || !result.user?.id) {
      return json({ error: result.error || 'Unauthorized' }, 401)
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { data: user, error: userErr } = await supabase
      .from('users')
      .select('id, points')
      .eq('telegram_id', result.user.id)
      .single()

    if (userErr || !user) return json({ error: 'User not found. Auth first.' }, 404)

    if (monetagEventId) {
      const { data: existing } = await supabase
        .from('monetag_events')
        .select('id')
        .eq('payload->>event_id', monetagEventId)
        .maybeSingle()
      if (existing) return json({ error: 'Reward already claimed', points: user.points }, 409)
    }

    const { data: newBalance, error: fnErr } = await supabase.rpc('add_points', {
      p_user_id: user.id,
      p_amount: 1,
      p_type: 'reward_ad',
      p_description: '+1 DevOptimizeBot Point — Rewarded Ad',
    })
    if (fnErr) return json({ error: fnErr.message }, 500)

    await supabase.from('reward_events').insert({
      user_id: user.id,
      points: 1,
      ad_provider: provider || 'monetag',
    })

    await supabase.from('monetag_events').insert({
      user_id: user.id,
      event_type: 'rewarded',
      payload: { event_id: monetagEventId || null },
    })

    return json({
      points: newBalance,
      message: '+1 DevOptimizeBot Point — Rewarded Ad',
    })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  })
}
