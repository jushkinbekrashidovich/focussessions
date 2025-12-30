// lib/habitsService.ts
import { supabase } from './supabaseClient'

export interface Habit {
  id: string
  user_id: string
  name: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface HabitCompletion {
  id: string
  habit_id: string
  user_id: string
  date: string // YYYY-MM-DD format
  completed: boolean
  created_at: string
  updated_at: string
}

// Get all habits for the current user
export async function getUserHabits(): Promise<Habit[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching habits:', error)
    throw error
  }

  return data || []
}

// Get habit completions for a specific month
export async function getHabitCompletionsForMonth(
  year: number,
  month: number
): Promise<HabitCompletion[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  // Calculate date range for the month
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const endDate = new Date(year, month, 0).toISOString().split('T')[0] // Last day of month

  const { data, error } = await supabase
    .from('habit_completions')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', startDate)
    .lte('date', endDate)

  if (error) {
    console.error('Error fetching habit completions:', error)
    throw error
  }

  return data || []
}

// Create a new habit
export async function createHabit(name: string): Promise<Habit> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('habits')
    .insert({
      user_id: user.id,
      name,
      is_active: true,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating habit:', error)
    throw error
  }

  return data
}

// Update a habit
export async function updateHabit(
  habitId: string,
  updates: { name?: string; is_active?: boolean }
): Promise<Habit> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('habits')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', habitId)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating habit:', error)
    throw error
  }

  return data
}

// Delete a habit
export async function deleteHabit(habitId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', habitId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting habit:', error)
    throw error
  }
}

// Toggle habit completion for a specific date
export async function toggleHabitCompletion(
  habitId: string,
  date: string // YYYY-MM-DD format
): Promise<HabitCompletion> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  // First, try to get existing completion
  const { data: existing } = await supabase
    .from('habit_completions')
    .select('*')
    .eq('habit_id', habitId)
    .eq('date', date)
    .single()

  if (existing) {
    // Update existing completion
    const { data, error } = await supabase
      .from('habit_completions')
      .update({
        completed: !existing.completed,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating habit completion:', error)
      throw error
    }

    return data
  } else {
    // Create new completion
    const { data, error } = await supabase
      .from('habit_completions')
      .insert({
        habit_id: habitId,
        user_id: user.id,
        date,
        completed: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating habit completion:', error)
      throw error
    }

    return data
  }
}

