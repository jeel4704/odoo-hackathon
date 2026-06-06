import React, { useEffect, useState } from 'react'
import DashboardCard from '../../components/DashboardCard'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import Loader from '../../components/Loader'
import { FileText, Users, ClipboardList, DollarSign, Activity, Calendar } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [activities, setActivities] = useState([])
  const [recentRfqs, setRecentRfqs] = useState([])

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true)
        
        // Fetch report summary
        const summaryRes = await api.get('/reports/summary')
        setData(summaryRes.data)

        // Fetch recent activities (only for admin, manager, procurement)
        if (user?.role !== 'vendor') {
          const activitiesRes = await api.get('/activities')
          setActivities(activitiesRes.data.slice(0, 5))
        }

        // Fetch recent RFQs
        const rfqsRes = await api.get('/rfqs')
        setRecentRfqs(rfqsRes.data.slice(0, 5))

      } catch (err) {
        console.error('Failed to load dashboard data:', err)
        toast.push({
          title: 'Load Error',
          message: 'Could not connect to database or fetch dashboard metrics.'
        })
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [user, toast])

  if (loading) {
    return <Loader />
  }

  const stats = data?.stats || { totalVendors: 0, activeRFQs: 0, pendingApprovals: 0, totalPOs: 0 }
  const trends = data?.monthlyTrends || []

  // Custom Quick Actions based on Role
  const renderQuickActions = () => {
    if (user?.role === 'vendor') {
      return (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">Welcome to your vendor panel. You can manage your quotations and invoices from here.</p>
          <a href="/quotations" className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-center font-medium shadow-md shadow-emerald-500/10 transition duration-150">Submit Quotations</a>
          <a href="/invoices" className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-center font-medium transition duration-150">View My Invoices</a>
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-3">
        <a href="/vendors" className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-center font-medium shadow-md shadow-emerald-500/10 transition duration-150">Add/Manage Vendors</a>
        <a href="/rfqs" className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-center font-medium shadow-md shadow-indigo-500/10 transition duration-150">Create Request for Quote (RFQ)</a>
        <a href="/pos" className="p-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-center font-medium shadow-md shadow-teal-500/10 transition duration-150">View Purchase Orders</a>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-xl shadow-emerald-500/5">
        <h2 className="text-2xl font-bold">Welcome back, {user?.name}!</h2>
        <p className="text-emerald-100 mt-1">Manage, audit, and trace your procurement supply chain instantly.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Total Vendors" 
          value={stats.totalVendors} 
          icon={<Users className="w-5 h-5 text-emerald-500" />}
        />
        <DashboardCard 
          title="Active RFQs" 
          value={stats.activeRFQs} 
          icon={<FileText className="w-5 h-5 text-indigo-500" />}
        />
        <DashboardCard 
          title="Pending Approvals" 
          value={stats.pendingApprovals} 
          icon={<ClipboardList className="w-5 h-5 text-amber-500" />}
        />
        <DashboardCard 
          title="Purchase Orders" 
          value={stats.totalPOs} 
          icon={<DollarSign className="w-5 h-5 text-teal-500" />}
        />
      </div>

      {/* Main Charts & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <div className="col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            Monthly Procurement Trends
          </h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                    border: 'none', 
                    borderRadius: '8px', 
                    color: '#fff' 
                  }} 
                />
                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4">Quick Actions</h3>
            {renderQuickActions()}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-400">
            Current role: <span className="font-semibold text-emerald-500 capitalize">{user?.role}</span>
          </div>
        </div>
      </div>

      {/* Secondary Grid (Recent Activity Logs & RFQs) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent RFQs */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4">Recent Requests for Quote (RFQs)</h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {recentRfqs.length > 0 ? (
              recentRfqs.map((rfq) => (
                <div key={rfq.id} className="py-3 flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{rfq.title}</h4>
                    <p className="text-xs text-slate-400">Deadline: {new Date(rfq.deadline).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                    rfq.status === 'Open' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' :
                    rfq.status === 'Completed' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400' :
                    'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {rfq.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="py-4 text-sm text-slate-400 text-center">No recent RFQs found.</p>
            )}
          </div>
        </div>

        {/* Recent Activity Audit Logs (only visible to staff) */}
        {user?.role !== 'vendor' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              Recent Audit Log
            </h3>
            <div className="space-y-3">
              {activities.length > 0 ? (
                activities.map((act) => (
                  <div key={act.id} className="flex gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{act.action}</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{act.details}</p>
                      <span className="text-[10px] text-slate-400">{new Date(act.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-4 text-sm text-slate-400 text-center">No recent activity logs.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
