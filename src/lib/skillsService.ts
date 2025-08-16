import { supabase } from './supabaseClient'

export interface Skill {
  id: string
  user_id: string
  name: string
  created_at: string
}

export interface Session {
  id: string
  user_id: string
  skill_id: string
  start_time: string
  end_time: string
  duration_min: number
  note?: string
  created_at: string
  skills?: {
    name: string
  }
}

// Skills CRUD operations
export const skillsService = {
  // Get all skills for the current user
  async getUserSkills(): Promise<Skill[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Create a new skill
  async createSkill(name: string): Promise<Skill> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('skills')
      .insert([{ name, user_id: user.id }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete a skill
  async deleteSkill(skillId: string): Promise<void> {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', skillId)

    if (error) throw error
  }
}

// Sessions CRUD operations
export const sessionsService = {
  // Get all sessions for the current user
  async getUserSessions(): Promise<Session[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('sessions')
      .select(`
        *,
        skills(name)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Create a new session
  async createSession(skillId: string, startTime: string, endTime: string, note?: string): Promise<Session> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const start = new Date(startTime)
    const end = new Date(endTime)
    const durationMin = Math.round((end.getTime() - start.getTime()) / (1000 * 60))

    const { data, error } = await supabase
      .from('sessions')
      .insert([{
        user_id: user.id,
        skill_id: skillId,
        start_time: startTime,
        end_time: endTime,
        duration_min: durationMin,
        note
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get sessions for a specific skill
  async getSkillSessions(skillId: string): Promise<Session[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('skill_id', skillId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }
}
