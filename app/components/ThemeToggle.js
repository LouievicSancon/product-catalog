'use client'

import { useState, useEffect } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)
  const [isAuto, setIsAuto] = useState(true) // Tracks if we are in Scheduled or Manual mode
  const [currentTimeStr, setCurrentTimeStr] = useState('')

  // Helper to determine theme based on GMT+8 hours and minutes
  const calculateTheme = (hours, minutes) => {
    const totalMinutes = hours * 60 + minutes
    // 6:01 AM UTC = 361 minutes
    // 5:00 PM UTC = 1020 minutes
    // Light Mode: 6:01 AM UTC to 5:00 PM UTC (361 to 1020 minutes)
    // Dark Mode: All other times (5:01 PM UTC to 6:00 AM UTC)
    return totalMinutes < 361 || totalMinutes > 1020
  }

  // Gets the exact current GMT+8 time using the browser's built-in Intl API
  const getGMT8Time = () => {
    try {
      const gmt8String = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Singapore', // Strict GMT+8 Standard
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(new Date())

      const [hoursStr, minutesStr] = gmt8String.split(':')
      return {
        hours: parseInt(hoursStr, 10),
        minutes: parseInt(minutesStr, 10),
        timeString: gmt8String
      }
    } catch (e) {
      // Mathematical fallback: convert system UTC clock and manually shift +8 hours
      const now = new Date()
      const utcHours = now.getUTCHours()
      const utcMinutes = now.getUTCMinutes()
      const gmt8Hours = (utcHours + 8) % 24
      const formattedTime = `${String(gmt8Hours).padStart(2, '0')}:${String(utcMinutes).padStart(2, '0')}`
      return {
        hours: gmt8Hours,
        minutes: utcMinutes,
        timeString: formattedTime
      }
    }
  }

  const applyTheme = (shouldBeDark) => {
    setDark(shouldBeDark)
    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  useEffect(() => {
    const timeData = getGMT8Time()
    setCurrentTimeStr(timeData.timeString)

    const savedTheme = localStorage.getItem('theme')

    if (savedTheme) {
      setIsAuto(false)
      applyTheme(savedTheme === 'dark')
    } else {
      setIsAuto(true)
      applyTheme(calculateTheme(timeData.hours, timeData.minutes))
    }
  }, [])

  const toggleTheme = () => {
    const newDark = !dark
    setIsAuto(false) // Switches instantly to manual override mode
    applyTheme(newDark)
    localStorage.setItem('theme', newDark ? 'dark' : 'light')
  }

  const resetToAuto = () => {
    localStorage.removeItem('theme')
    setIsAuto(true)
    const timeData = getGMT8Time()
    applyTheme(calculateTheme(timeData.hours, timeData.minutes))
  }

  return (
    <div className="flex flex-col items-end gap-1 select-none">
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-lg bg-orange-100 dark:bg-gray-700 text-orange-800 dark:text-yellow-300 font-semibold hover:bg-orange-200 dark:hover:bg-gray-600 transition-colors cursor-pointer text-sm shadow-sm"
        >
          {dark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>

        {!isAuto && (
          <button
            onClick={resetToAuto}
            className="px-2.5 py-1 bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30 text-[10px] font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer animate-fadeIn"
            title="Clear manual override and return to scheduled GMT+8 timing"
          >
            Reset to Auto
          </button>
        )}
      </div>
      
      {/* Informative timing metadata status */}
      <span className="text-[10px] font-medium text-white/80 dark:text-gray-400 tracking-wide">
        {isAuto ? `Scheduled Mode (GMT+8: ${currentTimeStr} UTC)` : 'Manual Override Active'}
      </span>
    </div>
  )
}