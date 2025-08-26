import { sessionsService, Session } from './skillsService'

export interface DeepWorkStats {
  monthlyHours: number
  monthlyMinutes: number
  totalMonthlyMinutes: number
  streak: number
  longestSession: {
    duration_min: number
    created_at: string
  } | null
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
      
      // Calculate longest focus session
      const longestSession = this.calculateLongestSession(sessions)
      
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
        longestSession,
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
        longestSession: null,
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
    const currentDate = new Date(today)
    
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



  // Calculate longest focus session
  calculateLongestSession(sessions: Session[]): { duration_min: number; created_at: string } | null {
    if (sessions.length === 0) return null
    
    // Find the session with the longest duration
    const longestSession = sessions.reduce((longest, current) => {
      return current.duration_min > longest.duration_min ? current : longest
    })
    
    return {
      duration_min: longestSession.duration_min,
      created_at: longestSession.created_at
    }
  },

  // Check if year is leap year
  isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
  }
}
