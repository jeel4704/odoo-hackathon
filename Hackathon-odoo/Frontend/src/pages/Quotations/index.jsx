import React from 'react'
import DataTable from '../../components/DataTable'
import { quotations } from '../../utils/dummyData'

export default function Quotations() {
  const columns = [
    { key: 'vendor', title: 'Vendor' },
    { key: 'price', title: 'Price', render: (r) => `₹ ${r.price}` },
    { key: 'delivery', title: 'Delivery Days' },
    { key: 'remarks', title: 'Remarks' },
    { key: 'status', title: 'Status' }
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Quotations</h2>
      </div>
      <DataTable columns={columns} data={quotations} actions={(r) => <div className="text-sm">Compare</div>} />
    </div>
  )
}
