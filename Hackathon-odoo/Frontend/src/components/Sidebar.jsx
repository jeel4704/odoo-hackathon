import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Menu, ChevronLeft, Home, Users, FileText, File, ClipboardList, DollarSign, Bell, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const groups = [
  { title: 'Main', items: [{ to: '/app', label: 'Dashboard', icon: Home }] },
  {
    title: 'Procurement',
    items: [
      { to: '/app/vendors', label: 'Vendors', icon: Users },
      { to: '/app/rfqs', label: 'RFQs', icon: FileText },
      { to: '/app/quotations', label: 'Quotations', icon: File },
      { to: '/app/approvals', label: 'Approvals', icon: ClipboardList },
      { to: '/app/pos', label: 'Purchase Orders', icon: DollarSign },
      { to: '/app/invoices', label: 'Invoices', icon: File }
    ]
  },
  { 
    title: 'Others', 
    items: [
      { to: '/app/reports', label: 'Reports', icon: FileText }, 
      { to: '/app/notifications', label: 'Notifications', icon: Bell }, 
      { to: '/app/settings', label: 'Settings', icon: Settings }
    ] 
  }
]

export default function Sidebar() {
  const [open, setOpen] = useState(true)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  console.log("Sidebar Auth User:", user);

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  // Filter sidebar items based on Role-Based Access Control
  const filteredGroups = groups.map(group => {
    const items = group.items.filter(item => {
      if (user?.role === 'vendor') {
        // Vendors are restricted from viewing Vendors, Approvals, and Reports
        if (item.to === '/vendors' || item.to === '/approvals' || item.to === '/reports') {
          return false;
        }
      }
      if (user?.role === 'manager') {
        // Managers do not manage Vendor list directly
        if (item.to === '/vendors') return false;
      }
      return true;
    });
    return { ...group, items };
  }).filter(group => group.items.length > 0);

  return (
    <aside className={`bg-white dark:bg-slate-800 border-r dark:border-slate-700 ${open ? 'w-64' : 'w-20'} transition-all duration-200 flex flex-col h-screen`}>
      <div className="h-16 flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-white font-bold shrink-0">VB</div>
          {open && <div className="text-lg font-semibold truncate bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">VendorBridge</div>}
        </div>
        <button onClick={() => setOpen((s) => !s)} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
          {open ? <ChevronLeft size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <nav className="p-4 flex-1 overflow-y-auto">
        {filteredGroups.map((g) => (
          <div key={g.title} className="mb-4">
            {open && <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2 px-2">{g.title}</div>}
            <div className="flex flex-col gap-1">
              {g.items.map((it) => {
                const Icon = it.icon
                return (
                  <NavLink 
                    key={it.to} 
                    to={it.to} 
                    className={({ isActive }) => `flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-150 ${isActive ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-medium' : ''}`}
                  >
                    <Icon size={18} />
                    {open && <span className="text-sm">{it.label}</span>}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}

        <div className="mt-6 border-t dark:border-slate-700 pt-4">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/10 text-red-600 dark:text-red-400 hover:text-red-700 transition-all duration-150 w-full text-left"
          >
            <LogOut size={18} />
            {open && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </nav>
    </aside>
  )
}
