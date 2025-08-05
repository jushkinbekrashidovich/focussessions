'use client'

import { useState, useEffect } from 'react'

type Props = {
  defaultMinutes?: number
  onSessionFinished: (start: Date, end: Date) => void
}

export default function Timer({ defaultMinutes = 30, onSessionFinished }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(defaultMinutes * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)

  // countdown effect
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === 1) {
          clearInterval(interval)
          setIsRunning(false)
          const end = new Date()
          if (startTime) {
            onSessionFinished(startTime, end)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, startTime, onSessionFinished])

  const startTimer = () => {
    setStartTime(new Date())
    setSecondsLeft(defaultMinutes * 60)
    setIsRunning(true)
  }

  const format = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  return (
    <div>
      <div className="text-5xl font-bold text-center">{format(secondsLeft)}</div>
      <button
        disabled={isRunning}
        onClick={startTimer}
        className="mt-4 w-full bg-indigo-600 py-2 rounded disabled:opacity-50"
      >
        Start Timer
      </button>
    </div>
  )
}
