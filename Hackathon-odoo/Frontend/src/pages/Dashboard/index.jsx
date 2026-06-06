import React from 'react'
import DashboardCard from '../../components/DashboardCard'
import { vendors, rfqs } from '../../utils/dummyData'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const cards = [
    { title: 'Total Vendors', value: vendors.length },
    { title: 'Active RFQs', value: rfqs.filter((r) => r.status === 'Open').length },
    { title: 'Pending Approvals', value: 3 },
    { title: 'Purchase Orders', value: 8 }
  ]

  const data = [
    { month: 'Jan', value: 4000 },
    { month: 'Feb', value: 3000 },
    { month: 'Mar', value: 5000 },
    { month: 'Apr', value: 2000 },
    { month: 'May', value: 3500 }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <DashboardCard key={c.title} title={c.title} value={c.value} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-2 bg-white dark:bg-slate-800 p-4 rounded shadow">
          <h3 className="font-semibold mb-4">Monthly Procurement Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data}><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#6366f1" /></BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded shadow">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="flex flex-col gap-2">
            <button className="p-3 bg-green-600 text-white rounded">Add Vendor</button>
            <button className="p-3 bg-indigo-600 text-white rounded">Create RFQ</button>
            <button className="p-3 bg-yellow-600 text-white rounded">Generate Invoice</button>
          </div>
        </div>
      </div>

    </div>
  )
}
