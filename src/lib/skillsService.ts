import { supabase } from './supabaseClient'

export interface Skill {
  id: string
  user_id: string
  name: string
  target_hours: number
  description: string
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
  async createSkill(name: string, targetHours: number, description: string): Promise<Skill> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Use provided description or create a meaningful default
    const finalDescription = description.trim() || `Master ${name} and achieve ${targetHours} hours of focused practice`

    const { data, error } = await supabase
      .from('skills')
      .insert([{ 
        name, 
        target_hours: targetHours, 
        description: finalDescription, 
        user_id: user.id
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update an existing skill
  async updateSkill(skillId: string, updates: { name?: string; target_hours?: number; description?: string }): Promise<Skill> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('skills')
      .update(updates)
      .eq('id', skillId)
      .eq('user_id', user.id) // Ensure user can only update their own skills
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get skill progress (completed hours vs target hours)
  async getSkillProgress(skillId: string): Promise<{ completedHours: number; targetHours: number; progressPercentage: number }> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Get the skill to get target hours
    const { data: skill, error: skillError } = await supabase
      .from('skills')
      .select('target_hours')
      .eq('id', skillId)
      .eq('user_id', user.id)
      .single()

    if (skillError) throw skillError

    // Get total completed minutes for this skill
    const { data: sessions, error: sessionsError } = await supabase
      .from('sessions')
      .select('duration_min')
      .eq('user_id', user.id)
      .eq('skill_id', skillId)

    if (sessionsError) throw sessionsError

    const totalMinutes = sessions.reduce((sum, session) => sum + session.duration_min, 0)
    const completedHours = totalMinutes / 60
    const targetHours = skill.target_hours
    const progressPercentage = Math.min((completedHours / targetHours) * 100, 100)

    return {
      completedHours: Math.round(completedHours * 100) / 100, // Round to 2 decimal places
      targetHours,
      progressPercentage
    }
  },

  // Delete a skill
  async deleteSkill(skillId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', skillId)
      .eq('user_id', user.id) // Ensure user can only delete their own skills

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
