import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { validateInitData } from '../_shared/telegram.ts'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const { initData } = await req.json()
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN') || ''
    const result = await validateInitData(initData, botToken)
    if (!result.ok || !result.user?.id) {
      return json({ error: result.error || 'Unauthorized' }, 401)
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const tg = result.user
    const { data, error } = await supabase
      .from('users')
      .upsert(
        {
          telegram_id: tg.id,
          username: tg.username ?? null,
          first_name: tg.first_name ?? null,
          last_name: tg.last_name ?? null,
          photo_url: tg.photo_url ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'telegram_id' }
      )
      .select('id, telegram_id, username, first_name, last_name, photo_url, points')
      .single()

    if (error) return json({ error: error.message }, 500)
    return json({ user: data })
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
