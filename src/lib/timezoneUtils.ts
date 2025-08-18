// Timezone utilities for the app

export interface TimezoneOption {
  value: string
  label: string
  offset: string
}

// Get user's current timezone
export function getUserCurrentTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch (error) {
    // Fallback to UTC if timezone detection fails
    return 'UTC'
  }
}

// Get all available timezones with city names and offsets
export function getAllTimezones(): TimezoneOption[] {
  const timezones: TimezoneOption[] = []
  
  try {
    // Get all timezone names
    const timezoneNames = Intl.supportedValuesOf('timeZone')
    
    timezoneNames.forEach(timezone => {
      try {
        // Get current offset for this timezone
        const date = new Date()
        const utc = date.getTime() + (date.getTimezoneOffset() * 60000)
        const targetTime = new Date(utc + (getTimezoneOffset(timezone) * 60000))
        const offset = getTimezoneOffset(timezone)
        
        // Format offset string
        const offsetHours = Math.floor(Math.abs(offset) / 60)
        const offsetMinutes = Math.abs(offset) % 60
        const offsetString = `${offset >= 0 ? '+' : '-'}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`
        
        // Create readable label
        const label = formatTimezoneLabel(timezone)
        
        timezones.push({
          value: timezone,
          label: `${label} (UTC${offsetString})`,
          offset: offsetString
        })
      } catch (error) {
        // Skip timezones that cause errors
        console.warn(`Error processing timezone ${timezone}:`, error)
      }
    })
    
    // Sort by offset (UTC first, then by offset)
    timezones.sort((a, b) => {
      if (a.value === 'UTC') return -1
      if (b.value === 'UTC') return 1
      return getTimezoneOffset(a.value) - getTimezoneOffset(b.value)
    })
    
  } catch (error) {
    console.error('Error getting timezones:', error)
    // Fallback to common timezones
    return getCommonTimezones()
  }
  
  return timezones
}

// Get timezone offset in minutes
function getTimezoneOffset(timezone: string): number {
  try {
    const date = new Date()
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000)
    const targetTime = new Date(utc + (new Date(date.toLocaleString('en-US', { timeZone: timezone })).getTime() - date.getTime()))
    return (targetTime.getTime() - date.getTime()) / 60000
  } catch (error) {
    return 0
  }
}

// Format timezone label to be more readable
function formatTimezoneLabel(timezone: string): string {
  // Convert timezone string to readable format
  return timezone
    .replace(/_/g, ' ')
    .split('/')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' / ')
}

// Fallback common timezones if the main function fails
function getCommonTimezones(): TimezoneOption[] {
  return [
    { value: 'UTC', label: 'UTC (UTC+00:00)', offset: '+00:00' },
    { value: 'America/New_York', label: 'New York (UTC-05:00)', offset: '-05:00' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (UTC-08:00)', offset: '-08:00' },
    { value: 'Europe/London', label: 'London (UTC+00:00)', offset: '+00:00' },
    { value: 'Europe/Paris', label: 'Paris (UTC+01:00)', offset: '+01:00' },
    { value: 'Asia/Tokyo', label: 'Tokyo (UTC+09:00)', offset: '+09:00' },
    { value: 'Asia/Shanghai', label: 'Shanghai (UTC+08:00)', offset: '+08:00' },
    { value: 'Australia/Sydney', label: 'Sydney (UTC+10:00)', offset: '+10:00' }
  ]
}

// Convert UTC date to user's selected timezone
export function convertToUserTimezone(date: string | Date, userTimezone: string): Date {
  try {
    const utcDate = new Date(date)
    const userDate = new Date(utcDate.toLocaleString('en-US', { timeZone: userTimezone }))
    return userDate
  } catch (error) {
    console.error('Error converting timezone:', error)
    return new Date(date)
  }
}

// Get timezone display name
export function getTimezoneDisplayName(timezone: string): string {
  try {
    const date = new Date()
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'long'
    })
    return formatter.formatToParts(date).find(part => part.type === 'timeZoneName')?.value || timezone
  } catch (error) {
    return timezone
  }
}
