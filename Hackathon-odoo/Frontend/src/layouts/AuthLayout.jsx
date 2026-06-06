import React from 'react'
import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-white">
      <div className="w-full max-w-md p-8 glass rounded-lg shadow-lg">
        <Outlet />
      </div>
    </div>
  )
}
