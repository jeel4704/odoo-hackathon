import React from 'react'

export default function Pagination({ page = 1, total = 1, onChange = () => {} }) {
  return (
    <div className="flex items-center gap-2 justify-end p-3">
      <button onClick={() => onChange(page - 1)} disabled={page <= 1} className="px-3 py-1 bg-gray-100 dark:bg-slate-700 rounded">Prev</button>
      <div className="px-3 py-1">{page} / {total}</div>
      <button onClick={() => onChange(page + 1)} disabled={page >= total} className="px-3 py-1 bg-gray-100 dark:bg-slate-700 rounded">Next</button>
    </div>
  )
}
