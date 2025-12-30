'use client'

import { useState, useMemo } from 'react'
import AppNavbar from '@/components/AppNavbar'
import { useHabits, useHabitCompletions, useCreateHabit, useUpdateHabit, useDeleteHabit, useToggleHabitCompletion } from '@/lib/hooks'
import {
  calculateDailyStats,
  calculateMonthlyStats,
  groupDaysIntoWeeks,
  getMonthName,
  getDayAbbreviation,
  getDayNumber,
  type DayStats,
} from '@/lib/habitTrackerUtils'
import HabitProgressChart from '@/components/HabitProgressChart'

export default function HabitsPage() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1)
  const [isAddingHabit, setIsAddingHabit] = useState(false)
  const [newHabitName, setNewHabitName] = useState('')
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null)
  const [editingHabitName, setEditingHabitName] = useState('')
  const [togglingCompletion, setTogglingCompletion] = useState<{ habitId: string; date: string } | null>(null)

  // Fetch data
  const { data: habits = [], isLoading: habitsLoading } = useHabits()
  const { data: completions = [], isLoading: completionsLoading } = useHabitCompletions(currentYear, currentMonth)
  
  // Mutations
  const createHabit = useCreateHabit()
  const updateHabit = useUpdateHabit()
  const deleteHabit = useDeleteHabit()
  const toggleCompletion = useToggleHabitCompletion()

  // Calculate stats
  const dayStats = useMemo(() => {
    return calculateDailyStats(habits, completions, currentYear, currentMonth)
  }, [habits, completions, currentYear, currentMonth])

  const monthStats = useMemo(() => {
    return calculateMonthlyStats(habits, completions, currentYear, currentMonth)
  }, [habits, completions, currentYear, currentMonth])

  const weeks = useMemo(() => {
    return groupDaysIntoWeeks(dayStats)
  }, [dayStats])

  const activeHabits = useMemo(() => {
    return habits.filter(h => h.is_active)
  }, [habits])

  // Navigation
  const goToPreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const goToCurrentMonth = () => {
    const now = new Date()
    setCurrentYear(now.getFullYear())
    setCurrentMonth(now.getMonth() + 1)
  }

  // Habit management
  const handleAddHabit = async () => {
    if (!newHabitName.trim()) return
    
    try {
      await createHabit.mutateAsync(newHabitName.trim())
      setNewHabitName('')
      setIsAddingHabit(false)
    } catch (error) {
      console.error('Error adding habit:', error)
    }
  }

  const handleStartEdit = (habitId: string, currentName: string) => {
    setEditingHabitId(habitId)
    setEditingHabitName(currentName)
  }

  const handleSaveEdit = async () => {
    if (!editingHabitId || !editingHabitName.trim()) return
    
    try {
      await updateHabit.mutateAsync({
        habitId: editingHabitId,
        updates: { name: editingHabitName.trim() },
      })
      setEditingHabitId(null)
      setEditingHabitName('')
    } catch (error) {
      console.error('Error updating habit:', error)
    }
  }

  const handleCancelEdit = () => {
    setEditingHabitId(null)
    setEditingHabitName('')
  }

  const handleDeleteHabit = async (habitId: string) => {
    if (!confirm('Are you sure you want to delete this habit?')) return
    
    try {
      await deleteHabit.mutateAsync(habitId)
    } catch (error) {
      console.error('Error deleting habit:', error)
    }
  }

  const handleToggleActive = async (habitId: string, isActive: boolean) => {
    try {
      await updateHabit.mutateAsync({
        habitId,
        updates: { is_active: !isActive },
      })
    } catch (error) {
      console.error('Error toggling habit:', error)
    }
  }

  // Toggle completion
  const handleToggleCompletion = async (habitId: string, date: string) => {
    setTogglingCompletion({ habitId, date })
    try {
      await toggleCompletion.mutateAsync({ habitId, date })
    } catch (error) {
      console.error('Error toggling completion:', error)
    } finally {
      setTogglingCompletion(null)
    }
  }

  // Check if a habit is completed on a specific date
  const isHabitCompleted = (habitId: string, date: string): boolean => {
    const completion = completions.find(c => c.habit_id === habitId && c.date === date)
    return completion?.completed ?? false
  }

  const isLoading = habitsLoading || completionsLoading

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#191847]">
        <AppNavbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-white text-lg">Loading Habit Tracker...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#191847]">
      <AppNavbar />
      
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Sticky Summary Bar */}
        <div className="sticky top-0 z-10 bg-[#191847] pb-4 mb-6 border-b border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Month Navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={goToPreviousMonth}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Previous month"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {getMonthName(currentMonth)} {currentYear}
                </h1>
                {!(currentYear === new Date().getFullYear() && currentMonth === new Date().getMonth() + 1) && (
                  <button
                    onClick={goToCurrentMonth}
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    (Today)
                  </button>
                )}
              </div>
              
              <button
                onClick={goToNextMonth}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Next month"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Stats Summary */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm">
              <div className="text-gray-300">
                <span className="text-gray-400">Habits: </span>
                <span className="font-semibold text-white">{monthStats.totalHabits}</span>
              </div>
              <div className="text-gray-300">
                <span className="text-gray-400">Completed: </span>
                <span className="font-semibold text-white">{monthStats.completedHabits}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Progress:</span>
                <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-300"
                    style={{ width: `${Math.min(monthStats.monthlyProgress, 100)}%` }}
                  />
                </div>
                <span className="text-white font-semibold w-12 text-right">
                  {monthStats.monthlyProgress.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          {/* Left Sidebar - Habit List */}
          <div className="space-y-4">
            <div className="bg-[#1e1e1e] border border-gray-700 rounded-xl p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-white">My Habits</h2>
                <button
                  onClick={() => setIsAddingHabit(true)}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                  title="Add habit"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              {/* Add Habit Form */}
              {isAddingHabit && (
                <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                  <input
                    type="text"
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !createHabit.isPending) handleAddHabit()
                      if (e.key === 'Escape') {
                        setIsAddingHabit(false)
                        setNewHabitName('')
                      }
                    }}
                    placeholder="Habit name..."
                    disabled={createHabit.isPending}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddHabit}
                      disabled={createHabit.isPending}
                      className="flex-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-700 disabled:opacity-70 text-white text-sm rounded transition-colors flex items-center justify-center gap-2"
                    >
                      {createHabit.isPending ? (
                        <>
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Adding...</span>
                        </>
                      ) : (
                        'Add'
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingHabit(false)
                        setNewHabitName('')
                      }}
                      disabled={createHabit.isPending}
                      className="flex-1 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white text-sm rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Habit List */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {habits.length === 0 && !isAddingHabit && (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    No habits yet. Add your first habit!
                  </div>
                )}
                
                {habits.map((habit) => (
                  <div
                    key={habit.id}
                    className="flex items-center gap-2 p-2 bg-gray-800 rounded hover:bg-gray-750 transition-colors group"
                  >
                    {editingHabitId === habit.id ? (
                      <>
                        <input
                          type="text"
                          value={editingHabitName}
                          onChange={(e) => setEditingHabitName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !updateHabit.isPending) handleSaveEdit()
                            if (e.key === 'Escape') handleCancelEdit()
                          }}
                          disabled={updateHabit.isPending}
                          className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          autoFocus
                        />
                        <button
                          onClick={handleSaveEdit}
                          disabled={updateHabit.isPending}
                          className="p-1 text-green-400 hover:text-green-300 disabled:opacity-50"
                          title="Save"
                        >
                          {updateHabit.isPending ? (
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1 text-gray-400 hover:text-gray-300"
                          title="Cancel"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </>
                    ) : (
                      <>
                        <span className={`flex-1 text-sm ${habit.is_active ? 'text-gray-200' : 'text-gray-500 line-through'}`}>
                          {habit.name}
                        </span>
                        <button
                          onClick={() => handleStartEdit(habit.id, habit.name)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-white transition-opacity"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleToggleActive(habit.id, habit.is_active)}
                          disabled={updateHabit.isPending}
                          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-yellow-400 disabled:opacity-50 transition-opacity"
                          title={habit.is_active ? "Deactivate" : "Activate"}
                        >
                          {updateHabit.isPending ? (
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : habit.is_active ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteHabit(habit.id)}
                          disabled={deleteHabit.isPending}
                          className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300 disabled:opacity-50 transition-opacity"
                          title="Delete"
                        >
                          {deleteHabit.isPending ? (
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </>
                )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Habit Grid */}
          <div className="space-y-6">
            {/* Weekly Grid */}
            <div className="bg-[#1e1e1e] border border-gray-700 rounded-xl p-4 sm:p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left text-sm font-semibold text-gray-400 pb-3 pr-4">Habit</th>
                      {weeks.map((week, weekIndex) => (
                        <th key={weekIndex} className="text-center text-xs font-semibold text-gray-400 pb-3 px-1">
                          Week {weekIndex + 1}
                        </th>
                      ))}
                    </tr>
                    <tr>
                      <th className="text-left text-xs text-gray-500 pb-2 pr-4"></th>
                      {weeks.map((week, weekIndex) => (
                        <th key={weekIndex} className="text-center text-xs text-gray-500 pb-2 px-1">
                          <div className="flex gap-0.5">
                            {week.map((day) => (
                              <div key={day.date} className="w-6 text-center">
                                {getDayAbbreviation(day.dayOfWeek)}
                              </div>
                            ))}
                          </div>
                        </th>
                      ))}
                    </tr>
                    <tr>
                      <th className="text-left text-xs text-gray-500 pb-2 pr-4"></th>
                      {weeks.map((week, weekIndex) => (
                        <th key={weekIndex} className="text-center text-xs text-gray-500 pb-2 px-1">
                          <div className="flex gap-0.5">
                            {week.map((day) => (
                              <div key={day.date} className="w-6 text-center">
                                {getDayNumber(day.date)}
                              </div>
                            ))}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activeHabits.map((habit) => (
                      <tr key={habit.id} className="border-t border-gray-700">
                        <td className="py-2 pr-4 text-sm text-gray-200">{habit.name}</td>
                        {weeks.map((week, weekIndex) => (
                          <td key={weekIndex} className="py-2 px-1">
                            <div className="flex gap-0.5 justify-center">
                              {week.map((day) => {
                                const isCompleted = isHabitCompleted(habit.id, day.date)
                                const isToggling = togglingCompletion?.habitId === habit.id && togglingCompletion?.date === day.date
                                return (
                                  <button
                                    key={day.date}
                                    onClick={() => handleToggleCompletion(habit.id, day.date)}
                                    disabled={isToggling || toggleCompletion.isPending}
                                    className={`w-6 h-6 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                                      isToggling
                                        ? 'bg-gray-700 border-gray-500 cursor-wait'
                                        : isCompleted
                                        ? 'bg-green-500 border-green-400 hover:bg-green-600'
                                        : 'bg-gray-800 border-gray-600 hover:border-gray-500'
                                    }`}
                                    title={`${day.date} - ${isCompleted ? 'Completed' : 'Not completed'}`}
                                  >
                                    {isToggling && (
                                      <svg className="animate-spin h-3 w-3 text-gray-300" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                    )}
                                  </button>
                                )
                              })}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Progress Stats Row */}
              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="grid grid-cols-[auto_1fr] gap-4 text-xs">
                  <div className="text-gray-400 font-semibold">Progress:</div>
                  <div className="flex gap-0.5">
                    {dayStats.map((day) => (
                      <div key={day.date} className="flex-1 text-center text-gray-300">
                        {day.progress.toFixed(0)}%
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-gray-400 font-semibold">Done:</div>
                  <div className="flex gap-0.5">
                    {dayStats.map((day) => (
                      <div key={day.date} className="flex-1 text-center text-green-400">
                        {day.done}
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-gray-400 font-semibold">Not Done:</div>
                  <div className="flex gap-0.5">
                    {dayStats.map((day) => (
                      <div key={day.date} className="flex-1 text-center text-red-400">
                        {day.notDone}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Chart */}
            <div className="bg-[#1e1e1e] border border-gray-700 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Progress Chart</h3>
              <HabitProgressChart dayStats={dayStats} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

