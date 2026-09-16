export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  photo_url?: string
}

interface TelegramWebApp {
  initData: string
  initDataUnsafe: { user?: TelegramUser; [key: string]: unknown }
  ready: () => void
  expand: () => void
  close: () => void
  openTelegramLink: (url: string) => void
  colorScheme: 'light' | 'dark'
  themeParams: Record<string, string>
  HapticFeedback?: { impactOccurred: (style: string) => void }
}

declare global {
  interface Window {
    Telegram?: { WebApp: TelegramWebApp }
  }
}

/** Returns the Telegram WebApp bridge, or null when not running inside Telegram. */
export function getTelegramWebApp(): TelegramWebApp | null {
  return typeof window !== 'undefined' && window.Telegram?.WebApp ? window.Telegram.WebApp : null
}

/** Call once on app boot. Safe to call outside Telegram — it just does nothing. */
export function initTelegram(): TelegramWebApp | null {
  const webApp = getTelegramWebApp()
  if (!webApp) return null
  webApp.ready()
  webApp.expand()
  return webApp
}

/**
 * Client-side-visible profile info only. This is NOT authentication — it can
 * be spoofed by anyone running the page outside Telegram. Anything that
 * matters (crediting points, reading another user's data) must instead send
 * getTelegramInitData() to the server and verify it there — see
 * supabase/functions/telegram-auth.
 */
export function getTelegramUser(): TelegramUser | null {
  return getTelegramWebApp()?.initDataUnsafe.user ?? null
}

/** The raw, signed init data string to send to the server for verification. */
export function getTelegramInitData(): string | null {
  return getTelegramWebApp()?.initData || null
}

export function shareApp(url: string, text: string) {
  const webApp = getTelegramWebApp()
  if (webApp) {
    webApp.openTelegramLink(
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    )
    return
  }
  if (navigator.share) {
    navigator.share({ url, text }).catch(() => {
      /* user cancelled the share sheet — nothing to do */
    })
    return
  }
  navigator.clipboard?.writeText(url)
}
