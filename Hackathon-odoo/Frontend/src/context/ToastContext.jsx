import React, { createContext, useContext, useState } from 'react'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const push = (t) => {
    const id = Date.now().toString()
    setToasts((s) => [...s, { id, ...t }])
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), 4000)
  }

  return (
    <ToastContext.Provider value={{ toasts, push }}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="px-4 py-2 bg-white/90 dark:bg-slate-800/90 rounded shadow">
            <div className="font-semibold">{t.title}</div>
            <div className="text-sm">{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
