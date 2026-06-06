import React from 'react'

export default function DataTable({ columns = [], data = [], actions }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded shadow overflow-auto">
      <table className="min-w-full divide-y">
        <thead className="bg-gray-50 dark:bg-slate-700">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-2 text-left text-xs text-slate-500">{c.title}</th>
            ))}
            {actions && <th className="px-4 py-2 text-xs text-slate-500">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y">
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-3 text-sm">{c.render ? c.render(row) : row[c.key]}</td>
              ))}
              {actions && <td className="px-4 py-3">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
