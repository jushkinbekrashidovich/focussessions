import { useQuery } from '@tanstack/react-query'
import { supabase } from '../supabaseClient'

interface FocusScoreData {
  concentrationPowerScore: number
  changeFromLastWeek: number
  longestSessionMinutes: number
  consistencyDays: number
  completionRate: number
}

const calculateConcentrationPowerScore = (sessions: { duration_min: number | null; created_at: string }[]) => {
  if (!sessions || sessions.length === 0) {
    return {
      concentrationPowerScore: 0,
      longestSessionMinutes: 0,
      consistencyDays: 0,
      completionRate: 0
    }
  }

  // 1. Longest Session Score (0-100)
  const longestSessionMinutes = Math.max(...sessions.map(s => s.duration_min || 0))
  const longestSessionScore = longestSessionMinutes < 10 
    ? 0 
    : Math.min((longestSessionMinutes / 90) * 100, 100)

  // 2. Consistency Score (0-100)
  const uniqueDays = new Set(sessions.map(s => new Date(s.created_at).toDateString())).size
  const consistencyScore = (uniqueDays / 7) * 100

  // 3. Completion Rate Score (0-100)
  // Assume common timer values: 30min, 60min, 120min
  const commonDurations = [30, 60, 120]
  let totalCompletionRate = 0
  let validSessions = 0

  sessions.forEach(session => {
    const actualDuration = session.duration_min || 0
    if (actualDuration > 0) {
      // Find closest intended duration
      const intendedDuration = commonDurations.reduce((prev, curr) => 
        Math.abs(curr - actualDuration) < Math.abs(prev - actualDuration) ? curr : prev
      )
      
      const completionRate = Math.min((actualDuration / intendedDuration) * 100, 100)
      totalCompletionRate += completionRate
      validSessions++
    }
  })

  const completionScore = validSessions > 0 ? totalCompletionRate / validSessions : 0

  // 4. Final Score - Weighted Average
  const concentrationPowerScore = Math.round(
    (longestSessionScore * 0.4) + 
    (consistencyScore * 0.3) + 
    (completionScore * 0.3)
  )

  return {
    concentrationPowerScore: Math.min(concentrationPowerScore, 100),
    longestSessionMinutes,
    consistencyDays: uniqueDays,
    completionRate: Math.round(completionScore)
  }
}

const fetchFocusScore = async (): Promise<FocusScoreData> => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const userId = user.id

  // Get sessions from last 7 days
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  
  const { data: currentWeekSessions, error: currentError } = await supabase
    .from('sessions')
    .select('duration_min, created_at')
    .eq('user_id', userId)
    .gte('created_at', sevenDaysAgo.toISOString())
    .order('created_at', { ascending: false })

  if (currentError) {
    throw new Error('Error fetching current week sessions')
  }

  // Get sessions from previous 7 days
  const fourteenDaysAgo = new Date()
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)
  
  const { data: previousWeekSessions, error: previousError } = await supabase
    .from('sessions')
    .select('duration_min, created_at')
    .eq('user_id', userId)
    .gte('created_at', fourteenDaysAgo.toISOString())
    .lt('created_at', sevenDaysAgo.toISOString())
    .order('created_at', { ascending: false })

  if (previousError) {
    throw new Error('Error fetching previous week sessions')
  }

  // Calculate current week score
  const currentScore = calculateConcentrationPowerScore(currentWeekSessions || [])
  
  // Calculate previous week score
  const previousScore = calculateConcentrationPowerScore(previousWeekSessions || [])
  
  // Calculate change
  const change = currentScore.concentrationPowerScore - previousScore.concentrationPowerScore

  return {
    ...currentScore,
    changeFromLastWeek: change
  }
}

export function useFocusScore() {
  return useQuery({
    queryKey: ['focusScore'],
    queryFn: fetchFocusScore,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}
