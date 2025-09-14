'use client'

import { useState, useEffect, useCallback } from 'react'
import { Skill } from '@/lib/skillsService'
import { useSkills, useCreateSession } from '@/lib/hooks'

interface TimerBoxProps {
  onSessionCompleted?: () => void
}

export default function TimerBox({ onSessionCompleted }: TimerBoxProps) {
  const [minutes, setMinutes] = useState(60)
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60)
  const [running, setRunning] = useState(false)
  const [showFlipMode, setShowFlipMode] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState('')
  const [sessionStart, setSessionStart] = useState<Date | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [note, setNote] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isPageVisible, setIsPageVisible] = useState(true)
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now())

  // Use React Query hooks
  const { data: skills = [], isLoading: isLoadingSkills } = useSkills()
  const createSessionMutation = useCreateSession()

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Handle page visibility changes to keep timer running in background
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden)
      if (!document.hidden) {
        setLastUpdateTime(Date.now())
      }
    }

    const handleFocus = () => {
      setIsPageVisible(true)
      setLastUpdateTime(Date.now())
    }

    const handleBlur = () => {
      setIsPageVisible(false)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  // Function to play completion sound
  const playCompletionSound = () => {
    try {
      // Create a simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      // Create a pleasant completion sound (two ascending tones)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1)
      oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.2)
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (error) {
      console.log('Could not play sound:', error)
    }
  }

  // Function to show notification when timer finishes
  const showTimerFinishedNotification = useCallback(() => {
    // Play sound notification
    playCompletionSound()
    
    // Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      const skillName = skills.find(s => s.id === selectedSkill)?.name || 'your goal'
      new Notification('Focus Session Complete! 🎯', {
        body: `Your ${minutes === 0 ? 'long session' : `${minutes}-minute session`} for ${skillName} is finished. Time to log your progress!`,
        icon: '/favicon.ico',
        tag: 'timer-finished',
        requireInteraction: true
      })
    }
  }, [skills, selectedSkill, minutes])

  // Set selected skill when skills are loaded
  useEffect(() => {
    if (skills.length > 0 && !selectedSkill) {
      setSelectedSkill(skills[0].id)
    }
  }, [skills, selectedSkill])

  const handleStart = () => {
    if (!selectedSkill) return
    setSessionStart(new Date())
    // For Long deep work (value 0), start from 00:00, otherwise use the selected duration
    setSecondsLeft(minutes === 0 ? 0 : minutes * 60)
    setRunning(true)
    setShowFlipMode(true)
  }

  // Update timer display when duration changes
  useEffect(() => {
    if (!running) {
      setSecondsLeft(minutes === 0 ? 0 : minutes * 60)
    }
  }, [minutes, running])

  // ESC key to exit flip mode (removed - now using cancel button)

  const handleStop = () => {
    setRunning(false)
    setShowPrompt(true)
    showTimerFinishedNotification()
  }

  const handleSave = async () => {
    if (!selectedSkill || !sessionStart) return
    
    try {
      setIsSaving(true)
      const duration = Math.floor((new Date().getTime() - sessionStart.getTime()) / (1000 * 60))
      
      await createSessionMutation.mutateAsync({
        skillId: selectedSkill,
        duration,
        note
      })
      
      setShowPrompt(false)
      setNote('')
      setSessionStart(null)
      
      // Notify parent component that a session was completed
      if (onSessionCompleted) {
        onSessionCompleted()
      }
    } catch (error) {
      console.error('Error saving session:', error)
      // You could add a toast notification here
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    if (!running) return

    const updateTimer = () => {
      const now = Date.now()
      const timeDiff = Math.floor((now - lastUpdateTime) / 1000)
      
      if (timeDiff > 0) {
        setLastUpdateTime(now)
        setSecondsLeft((prev) => {
          // For Long deep work (value 0), count up from 00:00
          if (minutes === 0) {
            return prev + timeDiff
          }
          
          // For regular timers, count down
          const newValue = prev - timeDiff
          if (newValue <= 0) {
            setRunning(false)
            setShowPrompt(true)
            showTimerFinishedNotification()
            return 0
          }
          return newValue
        })
      }
    }

    // Update immediately when page becomes visible
    if (isPageVisible) {
      updateTimer()
    }

    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [running, minutes, showTimerFinishedNotification, isPageVisible, lastUpdateTime])

  const format = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  return (
    <>
      <div className="w-full lg:w-[330px] bg-[#1D1D4E] rounded-xl p-4 sm:p-6 text-center space-y-3 sm:space-y-4">
        <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-60 lg:h-60 mx-auto rounded-full border-2 border-gray-300 flex flex-col items-center justify-center">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-semibold">{format(secondsLeft)}</div>
        </div>

        {isLoadingSkills ? (
          <div className="w-full border rounded-lg p-2 text-sm bg-[#26265e] text-gray-400 text-center">
            Loading goals...
          </div>
        ) : skills.length === 0 ? (
          <div className="w-full border rounded-lg p-2 text-sm bg-[#26265e] text-gray-400 text-center">
            No goals available
          </div>
        ) : (
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="w-full border rounded-lg p-2 text-sm bg-[#26265e] text-white"
            disabled={running}
          >
            {skills.map((skill) => (
              <option key={skill.id} value={skill.id}>
                {skill.name}
              </option>
            ))}
          </select>
        )}

        <div className="flex gap-2">
          {[
            { label: '30m', val: 30 },
            { label: '1h', val: 60 },
            { label: '2h', val: 120 },
            { label: 'Long', val: 0 }, // Long deep work - starts from 00:00
          ].map((p) => (
            <button
              key={p.val}
              onClick={() => !running && setMinutes(p.val)}
              className={`flex-1 rounded-lg py-1.5 sm:py-2 text-xs sm:text-sm ${
                minutes === p.val
                  ? 'bg-[#5046E5] text-white'
                  : 'bg-[#26265e] text-gray-300'
              }`}
              disabled={running}
            >
              {p.label}
            </button>
          ))}
        </div>

        {!running ? (
          <button
            onClick={handleStart}
            className="w-full bg-[#5046E5] text-white py-2.5 sm:py-3 rounded-lg text-sm font-semibold disabled:opacity-50"
            disabled={!selectedSkill || skills.length === 0}
          >
            {minutes === 0 ? '▶ Start Long Session' : '▶ Start Timer'}
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="w-full bg-red-500 text-white py-2.5 sm:py-3 rounded-lg text-sm font-semibold"
          >
            {minutes === 0 ? '⏹ End Long Session' : '⏹ Stop Timer'}
          </button>
        )}

      </div>

      {/* Flip Mode Overlay - Full Screen */}
      {showFlipMode && running && (
        <div 
          className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center"
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh',
            zIndex: 9999
          }}
        >
          {/* Flip Clock Display */}
          <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-8 lg:space-x-12 mb-12 sm:mb-16 md:mb-20">
            {/* Hours */}
            <div className="relative">
              <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-3 sm:p-6 md:p-12 lg:p-16 shadow-2xl border-2 border-gray-700">
                <div className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl xl:text-[12rem] font-bold text-white font-mono tracking-wider">
                  {minutes === 0 
                    ? Math.floor(secondsLeft / 3600).toString().padStart(2, '0')
                    : Math.floor(secondsLeft / 3600).toString().padStart(2, '0')
                  }
                </div>
              </div>
            </div>
            
            {/* First Colon */}
            <div className="flex flex-col space-y-2 sm:space-y-4 md:space-y-6">
              <div className="w-2 h-2 sm:w-4 sm:h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 bg-white rounded-full shadow-lg"></div>
              <div className="w-2 h-2 sm:w-4 sm:h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 bg-white rounded-full shadow-lg"></div>
            </div>
            
            {/* Minutes */}
            <div className="relative">
              <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-3 sm:p-6 md:p-12 lg:p-16 shadow-2xl border-2 border-gray-700">
                <div className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl xl:text-[12rem] font-bold text-white font-mono tracking-wider">
                  {Math.floor((secondsLeft % 3600) / 60).toString().padStart(2, '0')}
                </div>
              </div>
            </div>
            
            {/* Second Colon */}
            <div className="flex flex-col space-y-2 sm:space-y-4 md:space-y-6">
              <div className="w-2 h-2 sm:w-4 sm:h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 bg-white rounded-full shadow-lg"></div>
              <div className="w-2 h-2 sm:w-4 sm:h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 bg-white rounded-full shadow-lg"></div>
            </div>
            
            {/* Seconds */}
            <div className="relative">
              <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-3 sm:p-6 md:p-12 lg:p-16 shadow-2xl border-2 border-gray-700">
                <div className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl xl:text-[12rem] font-bold text-white font-mono tracking-wider">
                  {(secondsLeft % 60).toString().padStart(2, '0')}
                </div>
              </div>
            </div>
          </div>

          {/* Session Info */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl mb-1 sm:mb-2">
              {minutes === 0 ? 'Long Deep Work Session' : `${minutes}-minute Focus Session`}
            </div>
            <div className="text-gray-500 text-xs sm:text-sm md:text-base">
              {skills.find(s => s.id === selectedSkill)?.name || 'Focus Session'}
            </div>
          </div>

          {/* Cancel Button */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowFlipMode(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Popup */}
      {showPrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 p-4 z-[10000]">
          <div className="bg-[#1D1D4E] rounded-xl p-4 sm:p-6 w-full max-w-sm sm:w-[400px] border border-gray-600 shadow-2xl">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">
              {minutes === 0 ? 'Long Session' : 'Session'} Completed for <span className="font-bold text-purple-300">{skills.find(s => s.id === selectedSkill)?.name || 'Unknown Skill'}</span>
            </h2>
            <label className="text-sm text-gray-300 block mb-2">What did you accomplish?</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Describe your progress..."
              className="w-full h-24 sm:h-32 mt-2 p-3 rounded-lg bg-[#26265e] text-white resize-none text-sm border border-gray-600 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              autoFocus
            />
            <button
              onClick={handleSave}
              className="mt-3 sm:mt-4 w-full bg-[#5046E5] text-white py-2 rounded-lg disabled:opacity-50 text-sm hover:bg-[#4338CA] transition-colors"
              disabled={!note.trim() || isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Session'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
