'use client'

import { useState, useEffect } from 'react'

export default function TimerBox() {
  const [minutes, setMinutes] = useState(60)
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60)
  const [running, setRunning] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState('Coding')

  const skillOptions = ['Coding', 'Learning English', 'Reading']

  const handleStart = () => {
    setSecondsLeft(minutes * 60)
    setRunning(true)
  }
  const handleStop = () => {
    setRunning(false)
  }

  useEffect(() => {
    if (!running) return
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === 0) {
          clearInterval(interval)
          setRunning(false)
          return prev
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [running])

  const format = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  return (
    <div className="w-[330px] bg-[#1D1D4E] rounded-xl p-6 text-center space-y-4">
      <div className="w-60 h-60 mx-auto rounded-full border-2 border-gray-300 flex flex-col items-center justify-center">
        <div className="text-5xl font-semibold">{format(secondsLeft)}</div>
        
      </div>

      <select
        value={selectedSkill}
        onChange={(e) => setSelectedSkill(e.target.value)}
        className="w-full border rounded-lg p-2 text-sm bg-[#26265e] text-white"
        disabled={running}
      >
        {skillOptions.map((sk) => (
          <option key={sk} value={sk}>
            {sk}
          </option>
        ))}
      </select>

      <div className="flex gap-2">
        {[
          { label: '30m', val: 30 },
          { label: '1h', val: 60 },
          { label: '2h', val: 120 },
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
          className="w-full bg-[#5046E5] text-white py-3 rounded-lg text-sm font-semibold"
        >
          ▶ Start Timer
        </button>
      ) : (
        <button
          onClick={handleStop}
          className="w-full bg-red-500 text-white py-3 rounded-lg text-sm font-semibold"
        >
          ⏹ Stop Timer
        </button>
      )}
    </div>
  )
}
