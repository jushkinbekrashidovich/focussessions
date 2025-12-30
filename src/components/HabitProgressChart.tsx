'use client'

import { useMemo } from 'react'
import type { DayStats } from '@/lib/habitTrackerUtils'

interface HabitProgressChartProps {
  dayStats: DayStats[]
}

export default function HabitProgressChart({ dayStats }: HabitProgressChartProps) {
  const chartData = useMemo(() => {
    if (dayStats.length === 0) return null

    const maxProgress = Math.max(...dayStats.map(d => d.progress), 100)
    const chartHeight = 200
    const chartWidth = Math.max(dayStats.length * 8, 600) // Minimum width, scale with days

    // Create SVG path for area chart
    const points = dayStats.map((day, index) => {
      const x = dayStats.length > 1 
        ? (index / (dayStats.length - 1)) * chartWidth 
        : chartWidth / 2
      const y = maxProgress > 0
        ? chartHeight - (day.progress / maxProgress) * chartHeight
        : chartHeight
      return { x, y, progress: day.progress }
    })

    // Create area path (closed path for filled area)
    const areaPath = points.reduce((path, point, index) => {
      if (index === 0) {
        return `M ${point.x} ${chartHeight} L ${point.x} ${point.y}`
      }
      return `${path} L ${point.x} ${point.y}`
    }, '') + ` L ${points[points.length - 1].x} ${chartHeight} Z`

    // Create line path (just the top line)
    const linePath = points.reduce((path, point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`
      }
      return `${path} L ${point.x} ${point.y}`
    }, '')

    return {
      areaPath,
      linePath,
      points,
      chartWidth,
      chartHeight,
      maxProgress,
    }
  }, [dayStats])

  if (!chartData || dayStats.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center text-gray-500 text-sm">
        No data to display
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg
        width={chartData.chartWidth}
        height={chartData.chartHeight + 40}
        className="w-full"
        viewBox={`0 0 ${chartData.chartWidth} ${chartData.chartHeight + 40}`}
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0, 25, 50, 75, 100].map((value) => {
          const y = chartData.chartHeight - (value / chartData.maxProgress) * chartData.chartHeight
          return (
            <g key={value}>
              <line
                x1={0}
                y1={y}
                x2={chartData.chartWidth}
                y2={y}
                stroke="#374151"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
              <text
                x={-5}
                y={y + 4}
                fill="#9ca3af"
                fontSize="10"
                textAnchor="end"
              >
                {value}%
              </text>
            </g>
          )
        })}

        {/* Area fill */}
        <path
          d={chartData.areaPath}
          fill="url(#progressGradient)"
          className="transition-all duration-300"
        />

        {/* Line */}
        <path
          d={chartData.linePath}
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300"
        />

        {/* Data points */}
        {chartData.points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#10b981"
              className="transition-all duration-300 hover:r-6"
            />
            {/* Tooltip on hover */}
            <title>
              Day {index + 1}: {point.progress.toFixed(0)}%
            </title>
          </g>
        ))}

        {/* X-axis labels (day numbers) */}
        {dayStats.map((day, index) => {
          const x = (index / (dayStats.length - 1 || 1)) * chartData.chartWidth
          const dayNumber = parseInt(day.date.split('-')[2], 10)
          return (
            <text
              key={day.date}
              x={x}
              y={chartData.chartHeight + 20}
              fill="#9ca3af"
              fontSize="10"
              textAnchor="middle"
            >
              {dayNumber}
            </text>
          )
        })}
      </svg>
    </div>
  )
}

