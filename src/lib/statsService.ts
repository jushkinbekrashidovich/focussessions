import { sessionsService, Session } from './skillsService'

export interface DeepWorkStats {
  monthlyHours: number
  monthlyMinutes: number
  totalMonthlyMinutes: number
  streak: number
  missedDaysThisYear: number
  totalDaysThisYear: number
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
      
      // Calculate missed days this year
      const missedDaysThisYear = this.calculateMissedDaysThisYear(sessions, currentYear)
      const totalDaysThisYear = this.isLeapYear(currentYear) ? 366 : 365
      
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
        missedDaysThisYear,
        totalDaysThisYear,
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
        missedDaysThisYear: 0,
        totalDaysThisYear: 365,
        currentMonthProgress: 0,
        currentMonthTotalDays: 30,
        currentMonthPassedDays: 0
      }
    }
  },

  // Calculate consecutive days streak
  calculateStreak(sessions: Session[]): number {
    if (sessions.length === 0) return 0
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const sessionDates = new Set(
      sessions.map(session => {
        const date = new Date(session.created_at)
        date.setHours(0, 0, 0, 0)
        return date.getTime()
      })
    )
    
    let streak = 0
    let currentDate = new Date(today)
    
    while (sessionDates.has(currentDate.getTime())) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    }
    
    return streak
  },

  // Calculate missed days this year
  calculateMissedDaysThisYear(sessions: Session[], year: number): number {
    const startOfYear = new Date(year, 0, 1)
    const endOfYear = new Date(year, 11, 31)
    const today = new Date()
    
    // Only count up to today if we're in the current year
    const endDate = year === today.getFullYear() ? today : endOfYear
    
    const sessionDates = new Set(
      sessions
        .filter(session => {
          const sessionDate = new Date(session.created_at)
          return sessionDate.getFullYear() === year
        })
        .map(session => {
          const date = new Date(session.created_at)
          date.setHours(0, 0, 0, 0)
          return date.getTime()
        })
    )
    
    let missedDays = 0
    const currentDate = new Date(startOfYear)
    
    while (currentDate <= endDate) {
      if (!sessionDates.has(currentDate.getTime())) {
        missedDays++
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return missedDays
  },

  // Check if year is leap year
  isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
  }
}
