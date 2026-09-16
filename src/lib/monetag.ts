/**
 * Monetag rewarded-ad integration.
 *
 * Setup (one-time, in your Monetag account):
 *   1. Sign in at monetag.com and add your Mini App's URL.
 *   2. Create a "Rewarded Interstitial" zone for it.
 *   3. Copy the exact <script> snippet Monetag gives you into index.html.
 *      It defines a global function, typically named show_<ZONE_ID>.
 *   4. Set VITE_MONETAG_SHOW_FN in your .env to that exact function name.
 *
 * IMPORTANT: resolving this promise only means the ad UI finished playing —
 * it is a client-side signal and can be faked by anyone with devtools open.
 * Points must NEVER be credited directly from this result. Instead:
 *   - showRewardedAd() resolving true means "the user watched the ad; ask
 *     the server to open a pending reward" -> call the claim-ad-reward
 *     Edge Function, which records a `reward_events` row with status
 *     'pending'.
 *   - Monetag's own server-to-server postback (configured in your zone's
 *     settings) is what actually verifies the view and triggers
 *     award_points() via the monetag-postback Edge Function.
 * This two-step flow is what makes "never let the frontend touch points
 * directly" (see supabase/schema.sql) actually true, not just cosmetic.
 */

const SHOW_FN_NAME = import.meta.env.VITE_MONETAG_SHOW_FN as string | undefined

type MonetagShowFn = () => Promise<void>

function getShowFn(): MonetagShowFn | null {
  if (!SHOW_FN_NAME || typeof window === 'undefined') return null
  const candidate = (window as unknown as Record<string, unknown>)[SHOW_FN_NAME]
  return typeof candidate === 'function' ? (candidate as MonetagShowFn) : null
}

export function isMonetagReady(): boolean {
  return getShowFn() !== null
}

/** Resolves true if the ad played through, false if skipped/closed/unavailable. */
export async function showRewardedAd(): Promise<boolean> {
  const showFn = getShowFn()
  if (!showFn) {
    // eslint-disable-next-line no-console
    console.warn(
      SHOW_FN_NAME
        ? `[monetag] window.${SHOW_FN_NAME} is not defined yet — check the script tag in index.html`
        : '[monetag] VITE_MONETAG_SHOW_FN is not set — see .env.example',
    )
    return false
  }
  try {
    await showFn()
    return true
  } catch {
    return false // user closed or skipped the ad
  }
}
