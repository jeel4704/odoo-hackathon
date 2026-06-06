import React from 'react'
import { useTheme } from '../context/ThemeContext'
import { Sun, Moon, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { dark, toggle } = useTheme()
  const { user } = useAuth()

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b dark:border-slate-700 bg-white dark:bg-slate-800">
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center bg-gray-100 dark:bg-slate-700 rounded px-3 py-1 gap-2">
          <Search size={16} />
          <input placeholder="Search..." className="bg-transparent outline-none text-sm" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={toggle} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700">
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="flex items-center gap-3">
          <div className="text-sm">
            <div className="font-semibold text-slate-800 dark:text-slate-200">{user?.name || 'Admin'}</div>
            <div className="text-xs text-slate-500 capitalize">{user?.role || 'procurement'}</div>
          </div>
        </div>
      </div>
    </header>
  )
}
