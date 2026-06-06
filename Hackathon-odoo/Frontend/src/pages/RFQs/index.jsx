import React from 'react'
import DataTable from '../../components/DataTable'
import { rfqs } from '../../utils/dummyData'
import StatusBadge from '../../components/StatusBadge'

export default function RFQs() {
  const columns = [
    { key: 'id', title: 'RFQ ID' },
    { key: 'title', title: 'Title' },
    { key: 'date', title: 'Date' },
    { key: 'status', title: 'Status', render: (r) => <StatusBadge status={r.status} /> }
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">RFQs</h2>
        <button className="py-2 px-3 bg-indigo-600 text-white rounded">Create RFQ</button>
      </div>

      <DataTable columns={columns} data={rfqs} actions={(r) => (
        <div className="flex gap-2">
          <button className="text-sm text-indigo-600">View</button>
        </div>
      )} />
    </div>
  )
}
