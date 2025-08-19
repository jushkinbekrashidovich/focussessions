// lib/supabaseClient.ts
import { createBrowserClient } from '@supabase/ssr'

let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

export const supabase = {
  get auth() {
    if (!supabaseInstance) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('@supabase/ssr: Your project\'s URL and API key are required to create a Supabase client!')
      }
      
      supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey)
    }
    return supabaseInstance.auth
  },
  
  get from() {
    if (!supabaseInstance) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('@supabase/ssr: Your project\'s URL and API key are required to create a Supabase client!')
      }
      
      supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey)
    }
    return supabaseInstance.from
  }
}
