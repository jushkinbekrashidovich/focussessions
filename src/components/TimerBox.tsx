'use client'

import { useState, useEffect } from 'react'
import { skillsService, sessionsService, Skill } from '@/lib/skillsService'

interface TimerBoxProps {
  onSessionCompleted?: () => void
}

export default function TimerBox({ onSessionCompleted }: TimerBoxProps) {
  const [minutes, setMinutes] = useState(60)
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60)
  const [running, setRunning] = useState(false)
  const [showFlipMode, setShowFlipMode] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState('')
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoadingSkills, setIsLoadingSkills] = useState(true)

  const [sessionStart, setSessionStart] = useState<Date | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [note, setNote] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Fetch skills on component mount
  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      setIsLoadingSkills(true)
      const userSkills = await skillsService.getUserSkills()
      setSkills(userSkills)
      if (userSkills.length > 0) {
        setSelectedSkill(userSkills[0].id)
      }
    } catch (error) {
      console.error('Error fetching skills:', error)
    } finally {
      setIsLoadingSkills(false)
    }
  }

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

  // ESC key to exit flip mode
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showFlipMode) {
        setShowFlipMode(false)
      }
    }

    if (showFlipMode) {
      document.addEventListener('keydown', handleEscKey)
      return () => document.removeEventListener('keydown', handleEscKey)
    }
  }, [showFlipMode])

  const handleStop = () => {
    setRunning(false)
    setShowPrompt(true)
  }

  const handleSave = async () => {
    if (!selectedSkill || !sessionStart) return
    
    try {
      setIsSaving(true)
      await sessionsService.createSession(
        selectedSkill,
        sessionStart.toISOString(),
        new Date().toISOString(),
        note
      )
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
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        // For Long deep work (value 0), count up from 00:00
        if (minutes === 0) {
          return prev + 1
        }
        
        // For regular timers, count down
        if (prev === 0) {
          clearInterval(interval)
          setRunning(false)
          setShowPrompt(true)
          return prev
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [running, minutes])

  const format = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  return (
    <>
      <div className="w-[330px] bg-[#1D1D4E] rounded-xl p-6 text-center space-y-4">
        <div className="w-60 h-60 mx-auto rounded-full border-2 border-gray-300 flex flex-col items-center justify-center">
          <div className="text-5xl font-semibold">{format(secondsLeft)}</div>
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
              className={`flex-1 rounded-lg py-2 text-sm ${
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
            className="w-full bg-[#5046E5] text-white py-3 rounded-lg text-sm font-semibold disabled:opacity-50"
            disabled={!selectedSkill || skills.length === 0}
          >
            {minutes === 0 ? '▶ Start Long Session' : '▶ Start Timer'}
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="w-full bg-red-500 text-white py-3 rounded-lg text-sm font-semibold"
          >
            {minutes === 0 ? '⏹ End Long Session' : '⏹ Stop Timer'}
          </button>
        )}

      </div>

      {/* Flip Mode Overlay */}
      {showFlipMode && running && (
        <div className="fixed inset-0 bg-[#1a1a1a] z-50 flex flex-col items-center justify-center">
          {/* Flip Clock Display */}
          <div className="flex items-center space-x-4 mb-12">
            {/* Hours */}
            <div className="bg-[#2a2a2a] rounded-lg p-6 shadow-lg">
              <div className="text-8xl font-bold text-white font-mono">
                {minutes === 0 
                  ? Math.floor(secondsLeft / 3600).toString().padStart(2, '0')
                  : Math.floor(secondsLeft / 3600).toString().padStart(2, '0')
                }
              </div>
            </div>
            
            {/* First Colon */}
            <div className="flex flex-col space-y-2">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            </div>
            
            {/* Minutes */}
            <div className="bg-[#2a2a2a] rounded-lg p-6 shadow-lg">
              <div className="text-8xl font-bold text-white font-mono">
                {Math.floor((secondsLeft % 3600) / 60).toString().padStart(2, '0')}
              </div>
            </div>
            
            {/* Second Colon */}
            <div className="flex flex-col space-y-2">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            </div>
            
            {/* Seconds */}
            <div className="bg-[#2a2a2a] rounded-lg p-6 shadow-lg">
              <div className="text-8xl font-bold text-white font-mono">
                {(secondsLeft % 60).toString().padStart(2, '0')}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-gray-400 text-lg mb-8">
            Press ESC to quit flip mode
          </div>

          {/* Control Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => setShowFlipMode(false)}
              className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleStop}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Stop Session
            </button>
          </div>
        </div>
      )}

      {/* Popup */}
      {showPrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-[#1D1D4E] rounded-xl p-6 w-[400px]">
            <h2 className="text-lg font-semibold mb-4">
              {minutes === 0 ? 'Long Session' : 'Session'} Completed for <span className="font-bold">{skills.find(s => s.id === selectedSkill)?.name || 'Unknown Skill'}</span>
            </h2>
            <label className="text-sm">What did you accomplish?</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Describe your progress..."
              className="w-full h-32 mt-2 p-3 rounded-lg bg-[#26265e] text-white resize-none"
            />
            <button
              onClick={handleSave}
              className="mt-4 w-full bg-[#5046E5] text-white py-2 rounded-lg disabled:opacity-50"
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
