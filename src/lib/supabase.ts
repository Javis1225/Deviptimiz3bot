import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          telegram_id: number
          username: string | null
          first_name: string | null
          last_name: string | null
          photo_url: string | null
          points: number
          created_at: string
          updated_at: string
        }
      }
      categories: {
        Row: {
          id: number
          name: string
          slug: string
          description: string | null
          icon: string | null
          sort_order: number
        }
      }
      tools: {
        Row: {
          id: number
          name: string
          slug: string
          category_id: number
          description: string | null
          enabled: boolean
          usage_count: number
        }
      }
      tool_usage: {
        Row: {
          id: string
          user_id: string | null
          tool_id: number
          used_at: string
        }
      }
      points_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          type: string
          description: string | null
          created_at: string
        }
      }
      reward_events: {
        Row: {
          id: string
          user_id: string
          points: number
          ad_provider: string
          created_at: string
        }
      }
      monetag_events: {
        Row: {
          id: string
          user_id: string | null
          event_type: string
          payload: any
          created_at: string
        }
      }
      admin_users: {
        Row: {
          id: string
          email: string
          role: string
          created_at: string
        }
      }
      app_settings: {
        Row: {
          key: string
          value: any
          updated_at: string
        }
      }
    }
  }
}
