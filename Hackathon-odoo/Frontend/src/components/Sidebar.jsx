import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, ChevronLeft, Home, Users, FileText, File, ClipboardList, DollarSign, Bell, Settings, LogOut } from 'lucide-react'

const groups = [
  { title: 'Main', items: [{ to: '/', label: 'Dashboard', icon: Home }] },
  {
    title: 'Procurement',
    items: [
      { to: '/vendors', label: 'Vendors', icon: Users },
      { to: '/rfqs', label: 'RFQs', icon: FileText },
      { to: '/quotations', label: 'Quotations', icon: File },
      { to: '/approvals', label: 'Approvals', icon: ClipboardList },
      { to: '/pos', label: 'Purchase Orders', icon: DollarSign },
      { to: '/invoices', label: 'Invoices', icon: File }
    ]
  },
  { title: 'Others', items: [{ to: '/reports', label: 'Reports', icon: FileText }, { to: '/notifications', label: 'Notifications', icon: Bell }, { to: '/settings', label: 'Settings', icon: Settings }] }
]

export default function Sidebar() {
  const [open, setOpen] = useState(true)

  return (
    <aside className={`bg-white dark:bg-slate-800 border-r dark:border-slate-700 ${open ? 'w-64' : 'w-20'} transition-all duration-200`}>
      <div className="h-16 flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold">VB</div>
          {open && <div className="text-lg font-semibold">VendorBridge</div>}
        </div>
        <button onClick={() => setOpen((s) => !s)} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700">
          {open ? <ChevronLeft size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <nav className="p-4">
        {groups.map((g) => (
          <div key={g.title} className="mb-4">
            {open && <div className="text-xs text-slate-500 uppercase mb-2">{g.title}</div>}
            <div className="flex flex-col gap-1">
              {g.items.map((it) => {
                const Icon = it.icon
                return (
                  <NavLink key={it.to} to={it.to} className={({ isActive }) => `flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700 ${isActive ? 'bg-gray-100 dark:bg-slate-700' : ''}`}>
                    <Icon size={18} />
                    {open && <span>{it.label}</span>}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}

        <div className="mt-6 border-t pt-4">
          <NavLink to="/auth/login" className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700 text-red-600 dark:text-red-400">
            <LogOut size={18} />
            <span>Logout</span>
          </NavLink>
        </div>
      </nav>
    </aside>
  )
}
