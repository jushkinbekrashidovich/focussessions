import { supabase } from './supabaseClient'

export interface UserPreferences {
  id: string
  user_id: string
  timezone: string
  created_at: string
  updated_at: string
}

export const userPreferencesService = {
  // Get user preferences for the current user
  async getUserPreferences(): Promise<UserPreferences | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      throw error
    }

    return data
  },

  // Create or update user preferences
  async upsertUserPreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('user_preferences')
      .upsert([{
        user_id: user.id,
        ...preferences,
        updated_at: new Date().toISOString()
      }], {
        onConflict: 'user_id'
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update timezone specifically
  async updateTimezone(timezone: string): Promise<UserPreferences> {
    return this.upsertUserPreferences({ timezone })
  }
}
