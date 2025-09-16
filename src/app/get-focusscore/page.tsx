"use client"

import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function GetFocusScorePage() {
  const router = useRouter()
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0)
  const [longestSessionMin, setLongestSessionMin] = useState<number | ''>('')
  const [consistentDays, setConsistentDays] = useState<number | ''>('')
  const [completionRate, setCompletionRate] = useState<number | ''>('')

  const canNext = () => {
    if (step === 0) return typeof longestSessionMin === 'number' && longestSessionMin > 0
    if (step === 1) return typeof consistentDays === 'number' && consistentDays >= 0 && consistentDays <= 7
    if (step === 2) return typeof completionRate === 'number' && completionRate >= 0 && completionRate <= 100
    return true
  }

  const computeScore = () => {
    const s = typeof longestSessionMin === 'number' ? longestSessionMin : 0
    const d = typeof consistentDays === 'number' ? consistentDays : 0
    const c = typeof completionRate === 'number' ? completionRate : 0

    const normSession = Math.min(s, 120) / 120 // cap at 2h
    const normConsistency = Math.min(d, 7) / 7
    const normCompletion = Math.min(c, 100) / 100

    const weighted = normSession * 0.4 + normConsistency * 0.3 + normCompletion * 0.3
    return Math.round(weighted * 100)
  }

  const score = step === 3 ? computeScore() : null

  return (
    <>
      <Head>
        <title>Get Your Focus Score - FocusDot</title>
        <meta name="description" content="Answer three quick questions to get your Focus Score and a personalized tip." />
      </Head>
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          <div className="rounded-3xl border border-gray-800 bg-[#0e0e12] p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-[#a78bfa] via-[#8ab4ff] to-[#60a5fa] bg-clip-text text-transparent">
              {step === 3 ? 'Your Focus Score' : 'Find your Focus Score in 15 seconds'}
            </h1>

            {/* Steps */}
            {step === 0 && (
              <div className="space-y-4">
                <label className="block text-gray-300">What is your longest focus session (mins)?</label>
                <input
                  type="number"
                  min={1}
                  max={240}
                  value={longestSessionMin}
                  onChange={(e) => setLongestSessionMin(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full rounded-xl bg-black border border-gray-800 px-4 py-3 outline-none focus:border-gray-600"
                />
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <label className="block text-gray-300">How many days a week do you deep work?</label>
                <input
                  type="number"
                  min={0}
                  max={7}
                  value={consistentDays}
                  onChange={(e) => setConsistentDays(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full rounded-xl bg-black border border-gray-800 px-4 py-3 outline-none focus:border-gray-600"
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <label className="block text-gray-300">What % of planned sessions do you complete?</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={completionRate}
                  onChange={(e) => setCompletionRate(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full rounded-xl bg-black border border-gray-800 px-4 py-3 outline-none focus:border-gray-600"
                />
              </div>
            )}

            {step < 3 && (
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep((prev) => (prev === 0 ? 0 : ((prev - 1) as 0 | 1 | 2 | 3)))}
                  className="px-5 py-2 rounded-xl border border-gray-800 text-gray-300 hover:bg-[#121218]"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep((prev) => ((prev + 1) as 0 | 1 | 2 | 3))}
                  disabled={!canNext()}
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-[#6d5cf6] to-[#a78bfa] hover:from-[#5b4cf0] hover:to-[#947cf7] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {step === 2 ? 'See my score' : 'Next'}
                </button>
              </div>
            )}

            {step === 3 && score !== null && (
              <div className="mt-4">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-[#0b0b12] border-2 border-[#2a2a3a] flex items-center justify-center shadow-inner">
                    <div className="text-center">
                      <div className="text-4xl sm:text-5xl font-extrabold text-white">{score}</div>
                      <div className="text-gray-400 text-sm mt-1">Focus Score</div>
                    </div>
                  </div>
                </div>
                <p className="text-center text-gray-300 mb-6">{score < 60 ? `Your Focus Score is ${score}/100 🙁. But you can push it higher with FocusDot` : `You scored ${score}/100 🚀. Great consistency — now keep building your progress with FocusDot`}</p>
                <div className="flex justify-center">
                  <button
                    onClick={() => router.push('/login')}
                    className="bg-gradient-to-r from-[#6d5cf6] to-[#a78bfa] hover:from-[#5b4cf0] hover:to-[#947cf7] text-white font-semibold px-7 py-3 rounded-full shadow-xl shadow-purple-800/40"
                  >
                    Boost your focus score for free
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
