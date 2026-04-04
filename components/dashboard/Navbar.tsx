'use client'

import Link from 'next/link'
import { useAppStore } from '@/store/appStore'
import { Moon, Sun, AlertTriangle, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const { isDarkMode, toggleDarkMode, emergencyMode, setEmergencyMode, backendHealthy } = useAppStore()
  const [currentTime, setCurrentTime] = useState<string>('')

  useEffect(() => {
    const htmlElement = document.documentElement
    if (isDarkMode) {
      htmlElement.classList.add('dark')
    } else {
      htmlElement.classList.remove('dark')
    }
  }, [isDarkMode])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer">
            <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold gradient-text hidden sm:inline">PharmaSight</span>
          </div>
        </Link>

        {/* Center - Status/Ticker */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-center">
          {/* Live Data Ticker */}
          <div className="hidden md:flex flex-col items-center justify-center">
            <span className="text-[10px] uppercase tracking-wider text-muted font-semibold">Live Data Sync</span>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded border border-accent-blue/20">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse"></span>
              {currentTime || 'Loading...'}
            </div>
          </div>

          {!backendHealthy && (
            <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full bg-status-red/10 border border-status-red/20 text-status-red text-xs sm:text-sm font-semibold">
              <AlertTriangle className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0" />
              <span className="hidden sm:inline">Backend Offline</span>
            </div>
          )}
          {emergencyMode && (
            <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full bg-status-amber/10 border border-status-amber/20 text-status-amber text-xs sm:text-sm font-semibold">
              <AlertTriangle className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0" />
              <span className="hidden sm:inline">Demo Mode</span>
            </div>
          )}
        </div>

        {/* Right - Controls */}
        <div className="flex items-center gap-1 sm:gap-4">
          {/* Emergency Button */}
          <button
            onClick={() => setEmergencyMode(!emergencyMode)}
            className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex-shrink-0 ${
              emergencyMode
                ? 'bg-status-amber/10 border border-status-amber/30 text-status-amber hover:bg-status-amber/20'
                : 'bg-primary-500/10 border border-primary-500/30 text-primary-500 hover:bg-primary-500/20'
            }`}
            title={emergencyMode ? 'Disable Demo Mode' : 'Enable Demo Mode'}
          >
            <span className="hidden sm:inline">{emergencyMode ? '🎬' : '🚨'} Demo</span>
            <span className="sm:hidden">{emergencyMode ? '🎬' : '🚨'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-1.5 sm:p-2 rounded-lg bg-primary-500/10 border border-primary-500/20 hover:bg-primary-500/20 transition-all flex-shrink-0"
            title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {isDarkMode ? (
              <Sun className="w-4 sm:w-5 h-4 sm:h-5 text-accent-amber" />
            ) : (
              <Moon className="w-4 sm:w-5 h-4 sm:h-5 text-accent-purple" />
            )}
          </button>

          {/* Back Button */}
          <Link href="/">
            <button className="px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-primary-500/20 text-foreground hover:bg-primary-500/10 transition-all text-xs sm:text-sm font-semibold flex-shrink-0">
              Back
            </button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
