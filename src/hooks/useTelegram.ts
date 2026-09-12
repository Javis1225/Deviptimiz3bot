import { useEffect, useState } from 'react'

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string
        initDataUnsafe: {
          user?: {
            id: number
            first_name?: string
            last_name?: string
            username?: string
            photo_url?: string
            language_code?: string
          }
          start_param?: string
        }
        ready: () => void
        expand: () => void
        close: () => void
        MainButton: {
          text: string
          show: () => void
          hide: () => void
          onClick: (cb: () => void) => void
        }
        BackButton: {
          show: () => void
          hide: () => void
          onClick: (cb: () => void) => void
        }
        themeParams: Record<string, string>
        colorScheme: 'light' | 'dark'
        setHeaderColor: (color: string) => void
        setBackgroundColor: (color: string) => void
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy') => void
        }
      }
    }
  }
}

export function useTelegram() {
  const [webApp, setWebApp] = useState<typeof window.Telegram.WebApp | null>(null)
  const [user, setUser] = useState<any>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (tg) {
      tg.ready()
      tg.expand()
      tg.setHeaderColor('#0a0f1c')
      tg.setBackgroundColor('#0a0f1c')
      setWebApp(tg)
      setUser(tg.initDataUnsafe?.user || null)
      setIsReady(true)
    } else {
      // Development fallback
      setUser({
        id: 123456789,
        first_name: 'Dev',
        last_name: 'User',
        username: 'devuser',
      })
      setIsReady(true)
    }
  }, [])

  return { webApp, user, isReady }
}
