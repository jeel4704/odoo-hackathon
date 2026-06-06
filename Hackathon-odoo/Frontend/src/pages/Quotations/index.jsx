import React, { useState, useEffect } from 'react'
import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import Loader from '../../components/Loader'
import { Edit2, X, FileCheck, ArrowUpDown } from 'lucide-react'

export default function Quotations() {
  const { user } = useAuth()
  const toast = useToast()

  const [quotations, setQuotations] = useState([])
  const [loading, setLoading] = useState(true)

  // Edit Quotation modal state (for vendors)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState(null)
  const [formData, setFormData] = useState({
    pricing: '',
    delivery_timeline: '',
    notes: ''
  })

  // Filter state
  const [statusFilter, setStatusFilter] = useState('')

  const fetchQuotations = async () => {
    try {
      setLoading(true)
      const params = {}
      if (statusFilter) params.status = statusFilter
      
      const res = await api.get('/quotations', { params })
      setQuotations(res.data)
    } catch (err) {
      toast.push({
        title: 'Error Loading Quotations',
        message: err.response?.data || 'Failed to retrieve quotation records.'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuotations()
  }, [statusFilter])

  const handleOpenEditModal = (quote) => {
    setSelectedQuote(quote)
    setFormData({
      pricing: quote.pricing,
      delivery_timeline: quote.delivery_timeline,
      notes: quote.notes || ''
    })
    setShowEditModal(true)
  }

  const handleUpdateQuotation = async (e) => {
    e.preventDefault()
    try {
      await api.post('/quotations', {
        rfq_id: selectedQuote.rfq_id,
        pricing: formData.pricing,
        delivery_timeline: formData.delivery_timeline,
        notes: formData.notes
      })
      toast.push({
        title: 'Quotation Updated',
        message: 'Your bid quotation has been revised successfully.'
      })
      setShowEditModal(false)
      fetchQuotations()
    } catch (err) {
      toast.push({
        title: 'Update Failed',
        message: err.response?.data || 'Failed to modify quotation.'
      })
    }
  }

  const columns = [
    { key: 'id', title: 'Quote ID' },
    { key: 'rfq_title', title: 'RFQ' },
    ...(user?.role !== 'vendor' ? [{ key: 'vendor_name', title: 'Vendor' }] : []),
    { key: 'pricing', title: 'Unit Bid Price (₹)', render: (r) => `₹ ${Number(r.pricing).toFixed(2)}` },
    { key: 'delivery_timeline', title: 'Delivery (Days)', render: (r) => `${r.delivery_timeline} days` },
    { key: 'notes', title: 'Remarks / Notes', render: (r) => r.notes || '-' },
    { key: 'status', title: 'Status', render: (r) => <StatusBadge status={r.status} /> }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Submitted Quotations</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {user?.role === 'vendor' ? 'Track your active bid quotations and edit proposed terms.' : 'View all vendor bids and responses.'}
          </p>
        </div>

        {/* Filter dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-slate-700 dark:text-slate-200"
        >
          <option value="">All Statuses</option>
          <option value="Submitted">Submitted</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Table grid */}
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm overflow-hidden">
          <DataTable
            columns={columns}
            data={quotations}
            actions={(r) => {
              const editable = user?.role === 'vendor' && r.status === 'Submitted'
              return (
                <div className="flex gap-2">
                  {editable ? (
                    <button
                      onClick={() => handleOpenEditModal(r)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-550 hover:bg-emerald-600 dark:bg-emerald-600/10 dark:hover:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 dark:border-emerald-500/20 rounded-lg text-xs font-semibold transition"
                    >
                      <Edit2 size={12} />
                      Edit Bid
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400">Locked</span>
                  )}
                </div>
              )
            }}
          />
        </div>
      )}

      {/* Edit Quotation Modal */}
      {showEditModal && selectedQuote && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl w-full max-w-md relative shadow-2xl text-slate-900 dark:text-slate-100">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold mb-1">Revise Quotation Proposal</h3>
            <p className="text-xs text-slate-400 mb-6">Modify terms for RFQ: <span className="font-semibold text-emerald-500">{selectedQuote.rfq_title}</span></p>

            <form onSubmit={handleUpdateQuotation} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Proposed Unit Price (₹)</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0.01"
                  value={formData.pricing}
                  onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Delivery Timeline (Days)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.delivery_timeline}
                  onChange={(e) => setFormData({ ...formData, delivery_timeline: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Special Notes / Remarks</label>
                <textarea
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold shadow-md shadow-emerald-500/10 transition mt-4"
              >
                Submit Revisions
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
