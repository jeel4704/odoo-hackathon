import React, { useState } from 'react'
import DataTable from '../../components/DataTable'
import { vendors } from '../../utils/dummyData'
import StatusBadge from '../../components/StatusBadge'

export default function Vendors() {
  const [data] = useState(vendors)

  const columns = [
    { key: 'name', title: 'Vendor Name' },
    { key: 'category', title: 'Category' },
    { key: 'gst', title: 'GST Number' },
    { key: 'contact', title: 'Contact Person' },
    { key: 'email', title: 'Email' },
    { key: 'phone', title: 'Phone' },
    { key: 'status', title: 'Status', render: (r) => <StatusBadge status={r.status} /> }
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Vendors</h2>
        <div className="flex items-center gap-2">
          <button className="py-2 px-3 bg-indigo-600 text-white rounded">Add Vendor</button>
        </div>
      </div>

      <DataTable columns={columns} data={data} actions={(r) => (
        <div className="flex gap-2">
          <button className="text-sm text-indigo-600">View</button>
          <button className="text-sm text-yellow-600">Edit</button>
          <button className="text-sm text-red-600">Delete</button>
        </div>
      )} />
    </div>
  )
}
