import React, { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { motion } from 'framer-motion'

const ThemeToggle = () => {
  const { theme, currentTheme, toggleTheme, setSpecificTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const themes = [
    { id: 'light', name: 'Light', icon: '☀️' },
    { id: 'dark', name: 'Dark', icon: '🌙' },
    { id: 'system', name: 'System', icon: '💻' }
  ]

  const getCurrentThemeIcon = () => {
    if (theme === 'system') {
      return currentTheme === 'dark' ? '🌙' : '☀️'
    }
    return theme === 'dark' ? '🌙' : '☀️'
  }

  const getCurrentThemeName = () => {
    if (theme === 'system') {
      return `System (${currentTheme})`
    }
    return theme.charAt(0).toUpperCase() + theme.slice(1)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        title="Toggle theme"
      >
        <span className="text-lg">{getCurrentThemeIcon()}</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {getCurrentThemeName()}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
        >
          <div className="py-1">
            {themes.map((themeOption) => (
              <button
                key={themeOption.id}
                onClick={() => {
                  setSpecificTheme(themeOption.id)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  theme === themeOption.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="text-lg">{themeOption.icon}</span>
                <span className="text-sm font-medium">{themeOption.name}</span>
                {theme === themeOption.id && (
                  <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default ThemeToggle 