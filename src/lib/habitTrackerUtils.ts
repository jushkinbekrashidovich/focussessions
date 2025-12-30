// lib/habitTrackerUtils.ts
// Business logic matching Excel habit tracker exactly

import type { Habit, HabitCompletion } from './habitsService'

export interface DayStats {
  date: string // YYYY-MM-DD
  dayOfWeek: number // 0 = Sunday, 1 = Monday, etc.
  done: number
  notDone: number
  progress: number // 0-100
}

export interface MonthStats {
  totalHabits: number
  completedHabits: number
  monthlyProgress: number // 0-100
  daysInMonth: number
}

/**
 * Get days in a month
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

/**
 * Get first day of month (0 = Sunday, 1 = Monday, etc.)
 */
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay()
}

/**
 * Get all dates in a month as YYYY-MM-DD strings
 * Uses manual formatting to avoid timezone issues with toISOString()
 */
export function getDatesInMonth(year: number, month: number): string[] {
  const daysInMonth = getDaysInMonth(year, month)
  const dates: string[] = []
  
  for (let day = 1; day <= daysInMonth; day++) {
    // Manually format to avoid timezone issues
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    dates.push(dateStr)
  }
  
  return dates
}

/**
 * Calculate daily stats for a month
 * Matches Excel logic exactly:
 * - done = number of habits marked completed on that day
 * - notDone = totalActiveHabits - done
 * - dailyProgress = done / totalActiveHabits
 */
export function calculateDailyStats(
  habits: Habit[],
  completions: HabitCompletion[],
  year: number,
  month: number
): DayStats[] {
  const activeHabits = habits.filter(h => h.is_active)
  const totalActiveHabits = activeHabits.length
  
  if (totalActiveHabits === 0) {
    // Return empty stats for all days
    const dates = getDatesInMonth(year, month)
    return dates.map(date => {
      // Parse date manually to avoid timezone issues
      const [y, m, d] = date.split('-').map(Number)
      const dateObj = new Date(y, m - 1, d)
      return {
        date,
        dayOfWeek: dateObj.getDay(),
        done: 0,
        notDone: 0,
        progress: 0,
      }
    })
  }

  // Create a map of habit_id -> date -> completed
  const completionMap = new Map<string, Map<string, boolean>>()
  
  completions.forEach(completion => {
    if (!completionMap.has(completion.habit_id)) {
      completionMap.set(completion.habit_id, new Map())
    }
    completionMap.get(completion.habit_id)!.set(completion.date, completion.completed)
  })

  const dates = getDatesInMonth(year, month)
  
  return dates.map(date => {
    // Parse date manually to avoid timezone issues
    const [y, m, d] = date.split('-').map(Number)
    const dateObj = new Date(y, m - 1, d)
    let done = 0
    
    // Count how many active habits were completed on this day
    activeHabits.forEach(habit => {
      const habitCompletions = completionMap.get(habit.id)
      if (habitCompletions) {
        const isCompleted = habitCompletions.get(date)
        if (isCompleted === true) {
          done++
        }
      }
    })
    
    const notDone = totalActiveHabits - done
    const progress = totalActiveHabits > 0 ? (done / totalActiveHabits) * 100 : 0
    
    return {
      date,
      dayOfWeek: dateObj.getDay(),
      done,
      notDone,
      progress: Math.round(progress * 100) / 100, // Round to 2 decimal places
    }
  })
}

/**
 * Calculate monthly progress
 * Matches Excel logic exactly:
 * monthlyProgress = totalCompletedHabitsInMonth / (totalActiveHabits × daysInMonth)
 */
export function calculateMonthlyStats(
  habits: Habit[],
  completions: HabitCompletion[],
  year: number,
  month: number
): MonthStats {
  const activeHabits = habits.filter(h => h.is_active)
  const totalHabits = activeHabits.length
  const daysInMonth = getDaysInMonth(year, month)
  
  if (totalHabits === 0 || daysInMonth === 0) {
    return {
      totalHabits: 0,
      completedHabits: 0,
      monthlyProgress: 0,
      daysInMonth,
    }
  }

  // Count total completed habits in the month
  const completedCount = completions.filter(c => c.completed).length
  
  const monthlyProgress = (completedCount / (totalHabits * daysInMonth)) * 100
  
  return {
    totalHabits,
    completedHabits: completedCount,
    monthlyProgress: Math.round(monthlyProgress * 100) / 100, // Round to 2 decimal places
    daysInMonth,
  }
}

/**
 * Group days into weeks (Week 1, Week 2, Week 3, Week 4/5)
 * Groups by 7-day chunks starting from the first day of the month
 */
export function groupDaysIntoWeeks(dayStats: DayStats[]): DayStats[][] {
  const weeks: DayStats[][] = []
  
  for (let i = 0; i < dayStats.length; i += 7) {
    weeks.push(dayStats.slice(i, i + 7))
  }
  
  return weeks
}

/**
 * Format month name
 */
export function getMonthName(month: number): string {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  return monthNames[month - 1]
}

/**
 * Format day abbreviation (Mo, Tu, We, etc.)
 */
export function getDayAbbreviation(dayOfWeek: number): string {
  const dayAbbrs = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  return dayAbbrs[dayOfWeek]
}

/**
 * Get day number from date string (YYYY-MM-DD)
 */
export function getDayNumber(date: string): number {
  return parseInt(date.split('-')[2], 10)
}

