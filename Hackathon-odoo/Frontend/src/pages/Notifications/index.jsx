import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import { useToast } from '../../context/ToastContext'
import Loader from '../../components/Loader'
import { Bell, Check, Eye } from 'lucide-react'

export default function Notifications() {
  const toast = useToast()

  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const res = await api.get('/notifications')
      setNotifications(res.data)
    } catch (err) {
      toast.push({
        title: 'Error Fetching Notifications',
        message: err.response?.data || 'Failed to retrieve notifications feed.'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`)
      // Refresh list
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: 1 } : n))
    } catch (err) {
      console.error('Failed to mark read:', err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Notifications & Alerts</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Keep track of RFQ invitations, quotation reviews, contract statuses, and invoice generation alerts.
        </p>
      </div>

      {/* List Feed */}
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-750">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div 
                key={n.id} 
                className={`p-4 flex justify-between items-start gap-4 transition-all ${
                  n.is_read ? 'opacity-85' : 'bg-emerald-500/[0.02] dark:bg-emerald-500/[0.01]'
                }`}
              >
                <div className="flex gap-3.5 items-start">
                  <div className={`p-2.5 rounded-xl mt-0.5 shrink-0 ${
                    n.is_read ? 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                  }`}>
                    <Bell size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm ${n.is_read ? 'text-slate-700 dark:text-slate-300 font-medium' : 'text-slate-900 dark:text-slate-100 font-bold'}`}>
                        {n.title}
                      </h4>
                      {!n.is_read && (
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-2">
                      {new Date(n.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                {!n.is_read && (
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    className="flex items-center gap-1 text-xs px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-lg transition shrink-0"
                  >
                    <Check size={12} />
                    Mark Read
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-750 text-slate-400 rounded-2xl">
                <Bell size={24} />
              </div>
              <p>You have no notifications in your feed.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
