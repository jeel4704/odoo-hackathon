import React from 'react'

export default function DashboardCard({ title, value, icon }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">{title}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
        <div className="bg-indigo-50 text-indigo-600 p-3 rounded">{icon}</div>
      </div>
    </div>
  )
}
