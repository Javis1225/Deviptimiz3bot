// Shared by every function in supabase/functions/*. Supabase deploys each
// function folder independently but bundles relative imports like this one
// in at deploy time, so this file doesn't need its own deployment step.

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
