import React, { useState, useEffect } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import api from '../../services/api'
import { useToast } from '../../context/ToastContext'
import Loader from '../../components/Loader'
import { BarChart3, LineChart as LineIcon, PieChart as PieIcon, TrendingUp, DollarSign } from 'lucide-react'

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6']

export default function Reports() {
  const toast = useToast()
  
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchReports = async () => {
    try {
      setLoading(true)
      const res = await api.get('/reports/summary')
      setData(res.data)
    } catch (err) {
      toast.push({
        title: 'Error Loading Reports',
        message: err.response?.data || 'Failed to fetch analytics summaries.'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  if (loading || !data) {
    return <Loader />
  }

  const { monthlyTrends, categorySpend, performance } = data

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Reports & Spend Analytics</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Overview of category spending distribution, monthly purchasing trends, and vendor bidding success metrics.
        </p>
      </div>

      {/* Grid Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Spending by Vendor Category (Pie Chart) */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-emerald-500" />
            Spending by Category
          </h3>
          <div className="h-[280px] flex items-center justify-center">
            {categorySpend.length > 0 && categorySpend[0].name !== 'No Data' ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categorySpend}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categorySpend.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹ ${Number(value).toFixed(2)}`} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-slate-400">No spend records available to compile chart.</p>
            )}
          </div>
        </div>

        {/* Monthly Purchasing Trends (Line Chart) */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
            <LineIcon className="w-5 h-5 text-indigo-500" />
            Monthly Procurement Trends
          </h3>
          <div className="h-[280px]">
            {monthlyTrends.length > 0 && monthlyTrends[0].month !== 'No Data' ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrends}>
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip formatter={(value) => `₹ ${Number(value).toFixed(2)}`} />
                  <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-slate-400 text-center py-20">No monthly trends records found.</p>
            )}
          </div>
        </div>

        {/* Vendor Performance Analytics (Bids vs Wins) */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm lg:col-span-2">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-500" />
            Vendor Bid Success Ratio (Bids vs Wins)
          </h3>
          <div className="h-[300px]">
            {performance.length > 0 && performance[0].name !== 'No Data' ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performance}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bids" name="Quotations Submitted" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="wins" name="Purchase Orders Awarded" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-slate-400 text-center py-24">No vendor bidding records found.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
