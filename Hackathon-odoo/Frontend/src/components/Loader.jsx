import React from 'react'

export default function Loader() {
  return (
    <div className="animate-pulse p-4">
      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded mb-2 w-3/4" />
      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded mb-2 w-1/2" />
      <div className="h-40 bg-gray-200 dark:bg-slate-700 rounded" />
    </div>
  )
}
