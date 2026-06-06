import React, { useState, useEffect } from 'react'
import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import Loader from '../../components/Loader'
import { Check, X, ClipboardList, MessageSquare } from 'lucide-react'

export default function ApprovalWorkflow() {
  const { user } = useAuth()
  const toast = useToast()

  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)

  // Remarks modal state
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [selectedQuoteId, setSelectedQuoteId] = useState(null)
  const [remarks, setRemarks] = useState('')

  const fetchPendingApprovals = async () => {
    try {
      setLoading(true)
      const res = await api.get('/approvals/pending')
      setPending(res.data)
    } catch (err) {
      toast.push({
        title: 'Error Loading Approvals',
        message: err.response?.data || 'Failed to retrieve approval workflow queue.'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPendingApprovals()
  }, [])

  const handleApprove = async (quoteId) => {
    if (!window.confirm('Are you sure you want to APPROVE this quotation? This will automatically reject all other quotations for this RFQ and mark the RFQ as completed.')) return

    try {
      await api.post('/approvals', {
        quotation_id: quoteId,
        status: 'Approved',
        remarks: 'Approved by manager.'
      })
      toast.push({
        title: 'Quotation Approved',
        message: 'Successfully approved quotation. You can now generate a Purchase Order.'
      })
      fetchPendingApprovals()
    } catch (err) {
      toast.push({
        title: 'Approval Failed',
        message: err.response?.data || 'Failed to approve quotation.'
      })
    }
  }

  const handleOpenRejectModal = (quoteId) => {
    setSelectedQuoteId(quoteId)
    setRemarks('')
    setShowRejectModal(true)
  }

  const handleReject = async (e) => {
    e.preventDefault()
    if (!remarks) {
      toast.push({ title: 'Remarks Required', message: 'Please enter remarks explaining the rejection.' })
      return
    }

    try {
      await api.post('/approvals', {
        quotation_id: selectedQuoteId,
        status: 'Rejected',
        remarks: remarks
      })
      toast.push({
        title: 'Quotation Rejected',
        message: 'Rejection saved with remarks.'
      })
      setShowRejectModal(false)
      fetchPendingApprovals()
    } catch (err) {
      toast.push({
        title: 'Rejection Failed',
        message: err.response?.data || 'Failed to reject quotation.'
      })
    }
  }

  const columns = [
    { key: 'id', title: 'Quote ID' },
    { key: 'rfq_title', title: 'RFQ Title' },
    { key: 'vendor_name', title: 'Vendor' },
    { key: 'pricing', title: 'Unit Price (₹)', render: (r) => `₹ ${Number(r.pricing).toFixed(2)}` },
    { key: 'delivery_timeline', title: 'Delivery (Days)', render: (r) => `${r.delivery_timeline} days` },
    { key: 'notes', title: 'Vendor Remarks', render: (r) => r.notes || '-' },
    { key: 'status', title: 'Status', render: (r) => <StatusBadge status={r.status} /> }
  ]

  const isManager = user?.role === 'manager' || user?.role === 'admin'

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Approvals Queue</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Review and approve recommended vendor quotes. Approving a quote unlocks it for Purchase Order generation.
        </p>
      </div>

      {/* Grid List */}
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm overflow-hidden">
          <DataTable
            columns={columns}
            data={pending}
            actions={(r) => (
              <div className="flex gap-2">
                {isManager ? (
                  <>
                    <button
                      onClick={() => handleApprove(r.id)}
                      className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-lg transition"
                      title="Approve Quotation"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => handleOpenRejectModal(r.id)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:text-red-400 rounded-lg transition"
                      title="Reject Quotation"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-slate-400 font-medium">Read-only (Manager Only)</span>
                )}
              </div>
            )}
          />
        </div>
      )}

      {/* Reject Remarks Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl w-full max-w-sm relative shadow-2xl text-slate-900 dark:text-slate-100">
            <button
              onClick={() => setShowRejectModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
              <MessageSquare className="text-red-500" />
              Provide Rejection Remarks
            </h3>
            <p className="text-xs text-slate-400 mb-6">Explain the reason for rejecting this quotation. The vendor will receive an alert.</p>

            <form onSubmit={handleReject} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Remarks / Feedback</label>
                <textarea
                  rows="4"
                  required
                  placeholder="e.g. Budget constraints / Delivery timeline too long..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-500 transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold shadow-md shadow-red-500/10 transition mt-4"
              >
                Reject Quotation
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
