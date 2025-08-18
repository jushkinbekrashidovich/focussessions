import { sessionsService, Session } from './skillsService'

export interface DeepWorkStats {
  monthlyHours: number
  monthlyMinutes: number
  totalMonthlyMinutes: number
  streak: number
  missedDaysThisWeek: number
  totalDaysThisWeek: number
  currentMonthProgress: number
  currentMonthTotalDays: number
  currentMonthPassedDays: number
}

export const statsService = {
  // Calculate all deep work statistics
  async getDeepWorkStats(): Promise<DeepWorkStats> {
    try {
      const sessions = await sessionsService.getUserSessions()
      
      const now = new Date()
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth()
      
      // Filter sessions for current month
      const currentMonthSessions = sessions.filter(session => {
        const sessionDate = new Date(session.created_at)
        return sessionDate.getFullYear() === currentYear && 
               sessionDate.getMonth() === currentMonth
      })
      
      // Calculate monthly stats
      const totalMonthlyMinutes = currentMonthSessions.reduce((total, session) => {
        return total + session.duration_min
      }, 0)
      
      const monthlyHours = Math.floor(totalMonthlyMinutes / 60)
      const monthlyMinutes = totalMonthlyMinutes % 60
      
      // Calculate streak
      const streak = this.calculateStreak(sessions)
      
      // Calculate missed days this week (Monday to Sunday)
      const { missedDaysThisWeek, totalDaysThisWeek } = this.calculateMissedDaysThisWeek(sessions)
      
      // Calculate current month progress
      const currentMonthTotalDays = new Date(currentYear, currentMonth + 1, 0).getDate()
      const currentMonthPassedDays = now.getDate()
      const currentMonthProgress = (currentMonthPassedDays / currentMonthTotalDays) * 100
      
      // Ensure progress doesn't exceed 100%
      const clampedProgress = Math.min(currentMonthProgress, 100)
      
      return {
        monthlyHours,
        monthlyMinutes,
        totalMonthlyMinutes,
        streak,
        missedDaysThisWeek,
        totalDaysThisWeek,
        currentMonthProgress: clampedProgress,
        currentMonthTotalDays,
        currentMonthPassedDays
      }
    } catch (error) {
      console.error('Error calculating stats:', error)
      // Return default values on error
      return {
        monthlyHours: 0,
        monthlyMinutes: 0,
        totalMonthlyMinutes: 0,
        streak: 0,
        missedDaysThisWeek: 0, // Placeholder, will be implemented
        totalDaysThisWeek: 7, // Placeholder, will be implemented
        currentMonthProgress: 0,
        currentMonthTotalDays: 30,
        currentMonthPassedDays: 0
      }
    }
  },

  // Calculate consecutive days streak
  calculateStreak(sessions: Session[]): number {
    if (sessions.length === 0) return 0
    
    const now = new Date()
    const today = new Date(now)
    today.setHours(0, 0, 0, 0)
    
    // Group sessions by date and calculate total minutes per day
    const dailyMinutes = new Map<string, number>()
    sessions.forEach(session => {
      const date = new Date(session.created_at)
      date.setHours(0, 0, 0, 0)
      const dateKey = date.getTime()
      const currentMinutes = dailyMinutes.get(dateKey.toString()) || 0
      dailyMinutes.set(dateKey.toString(), currentMinutes + session.duration_min)
    })
    
    let streak = 0
    let currentDate = new Date(today)
    
    // Check if today has at least 10 minutes of sessions
    const todayMinutes = dailyMinutes.get(today.getTime().toString()) || 0
    const todayCompleted = todayMinutes >= 10
    
    // If today is not completed yet, start from yesterday
    if (!todayCompleted) {
      currentDate.setDate(currentDate.getDate() - 1)
    }
    
    // Count consecutive days with at least 10 minutes
    while (true) {
      const dateKey = currentDate.getTime().toString()
      const dayMinutes = dailyMinutes.get(dateKey) || 0
      
      if (dayMinutes >= 10) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }
    
    return streak
  },

  // Calculate missed days this week (Monday to Sunday)
  calculateMissedDaysThisWeek(sessions: Session[]): { missedDaysThisWeek: number; totalDaysThisWeek: number } {
    const now = new Date()
    const today = new Date(now)
    
    // Find the most recent Monday (start of week)
    const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, etc.
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Days since last Monday
    
    const monday = new Date(today)
    monday.setDate(monday.getDate() - daysSinceMonday)
    monday.setHours(0, 0, 0, 0)
    
    // Find the next Sunday (end of week)
    const sunday = new Date(monday)
    sunday.setDate(sunday.getDate() + 6)
    sunday.setHours(23, 59, 59, 999)
    
    // Group sessions by date and calculate total minutes per day
    const dailyMinutes = new Map<string, number>()
    sessions.forEach(session => {
      const sessionDate = new Date(session.created_at)
      if (sessionDate >= monday && sessionDate <= sunday) {
        const dateKey = sessionDate.toDateString()
        const currentMinutes = dailyMinutes.get(dateKey) || 0
        dailyMinutes.set(dateKey, currentMinutes + session.duration_min)
      }
    })
    
    let missedDays = 0
    const currentDate = new Date(monday)
    
    // Count days without at least 10 minutes of sessions
    while (currentDate <= sunday) {
      const dateKey = currentDate.toDateString()
      const dayMinutes = dailyMinutes.get(dateKey) || 0
      
      if (dayMinutes < 10) {
        missedDays++
      }
      
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return {
      missedDaysThisWeek: missedDays,
      totalDaysThisWeek: 7
    }
  },

  // Check if year is leap year
  isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
  }
}
