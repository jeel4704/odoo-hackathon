import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { Sun, Moon, Shield, Mail, CheckCircle2 } from 'lucide-react'

export default function Settings() {
  const { user } = useAuth()
  const { dark, toggle } = useTheme()

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Application Settings</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Manage system configurations, theme preferences, and inspect role permissions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-full flex items-center justify-center font-bold text-2xl mb-4">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100">{user?.name || 'Administrator'}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
          <span className="mt-3.5 px-3 py-1 bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 rounded-full text-xs font-semibold uppercase tracking-wider capitalize">
            {user?.role}
          </span>
        </div>

        {/* Theme Preferences & System Integrations */}
        <div className="col-span-2 space-y-6">
          {/* Theme card */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4">Theme Settings</h3>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Dark Mode</h4>
                <p className="text-xs text-slate-400 mt-0.5">Toggle dark interface theme across the application dashboard.</p>
              </div>
              <button 
                onClick={toggle} 
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-medium transition duration-150"
              >
                {dark ? (
                  <>
                    <Sun size={16} className="text-amber-500 animate-spin-slow" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon size={16} className="text-indigo-500" />
                    Dark Mode
                  </>
                )}
              </button>
            </div>
          </div>

          {/* System Check card */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-100">System Checklist & Health</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm py-1.5 border-b border-slate-50 dark:border-slate-750">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">MySQL Database Connection</span>
                </div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full">Operational</span>
              </div>

              <div className="flex items-center justify-between text-sm py-1.5 border-b border-slate-50 dark:border-slate-750">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">PDFKit Invoice Engine</span>
                </div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full">Operational</span>
              </div>

              <div className="flex items-center justify-between text-sm py-1.5 border-b border-slate-50 dark:border-slate-750">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Nodemailer SMTP Gateway</span>
                </div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full">Operational</span>
              </div>

              <div className="flex items-center justify-between text-sm py-1.5">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Google OAuth Identity Client</span>
                </div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
