'use client'

import React, { useState, useEffect, useRef } from 'react'
import { TimezoneOption, getAllTimezones, getUserCurrentTimezone } from '@/lib/timezoneUtils'

interface TimezoneSelectorProps {
  selectedTimezone: string
  onTimezoneChange: (timezone: string) => void
}

export default function TimezoneSelector({ selectedTimezone, onTimezoneChange }: TimezoneSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [timezones, setTimezones] = useState<TimezoneOption[]>([])
  const [filteredTimezones, setFilteredTimezones] = useState<TimezoneOption[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load timezones on mount
    const allTimezones = getAllTimezones()
    setTimezones(allTimezones)
    setFilteredTimezones(allTimezones)
  }, [])

  useEffect(() => {
    // Filter timezones based on search term
    if (searchTerm.trim() === '') {
      setFilteredTimezones(timezones)
    } else {
      const filtered = timezones.filter(tz => 
        tz.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tz.value.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredTimezones(filtered)
    }
  }, [searchTerm, timezones])

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleTimezoneSelect = (timezone: string) => {
    onTimezoneChange(timezone)
    setIsOpen(false)
    setSearchTerm('')
  }

  const getCurrentTimezoneLabel = () => {
    const current = timezones.find(tz => tz.value === selectedTimezone)
    return current ? current.label : 'Select timezone'
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Timezone Display Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-600 transition-colors"
      >
        <span className="truncate">{getCurrentTimezoneLabel()}</span>
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg z-50 max-h-60 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-700">
            <input
              type="text"
              placeholder="Search timezones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded-md text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>

          {/* Timezone List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredTimezones.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-400 text-center">
                No timezones found
              </div>
            ) : (
              filteredTimezones.map((timezone) => (
                <button
                  key={timezone.value}
                  onClick={() => handleTimezoneSelect(timezone.value)}
                  className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-700 transition-colors ${
                    selectedTimezone === timezone.value 
                      ? 'bg-blue-900 text-blue-300' 
                      : 'text-gray-300'
                  }`}
                >
                  {timezone.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
