import React, { useState, useEffect } from 'react'
import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import Loader from '../../components/Loader'
import { Eye, CheckCircle2, ChevronRight, FileText, X } from 'lucide-react'

export default function PurchaseOrders() {
  const { user } = useAuth()
  const toast = useToast()

  const [pos, setPos] = useState([])
  const [loading, setLoading] = useState(true)

  // Details Modal state
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedPo, setSelectedPo] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  const fetchPOs = async () => {
    try {
      setLoading(true)
      const res = await api.get('/pos')
      setPos(res.data)
    } catch (err) {
      toast.push({
        title: 'Error Loading POs',
        message: err.response?.data || 'Failed to retrieve Purchase Orders.'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPOs()
  }, [])

  const handleViewDetails = async (poId) => {
    try {
      setLoadingDetails(true)
      setShowDetailModal(true)
      const res = await api.get(`/pos/${poId}`)
      setSelectedPo(res.data)
    } catch (err) {
      toast.push({
        title: 'Load Error',
        message: 'Could not fetch detailed Purchase Order specifications.'
      })
      setShowDetailModal(false)
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleUpdateStatus = async (poId, status) => {
    if (!window.confirm(`Are you sure you want to set PO status to "${status}"?`)) return
    try {
      await api.put(`/pos/${poId}/status`, { status })
      toast.push({
        title: 'PO Status Updated',
        message: `Successfully set PO status to "${status}".`
      })
      fetchPOs()
      if (selectedPo && selectedPo.id === poId) {
        handleViewDetails(poId)
      }
    } catch (err) {
      toast.push({
        title: 'Update Failed',
        message: err.response?.data || 'Failed to update Purchase Order status.'
      })
    }
  }

  const handleGenerateInvoice = async (poId) => {
    try {
      const res = await api.post('/invoices', { po_id: poId })
      toast.push({
        title: 'Invoice Generated',
        message: `Invoice ${res.data.invoice_number} has been generated, PDF compiled, and emailed to vendor.`
      })
      fetchPOs()
      setShowDetailModal(false)
    } catch (err) {
      toast.push({
        title: 'Invoice Failed',
        message: err.response?.data || 'Failed to generate invoice for this PO.'
      })
    }
  }

  const columns = [
    { key: 'po_number', title: 'PO Number' },
    { key: 'rfq_title', title: 'RFQ Title' },
    ...(user?.role !== 'vendor' ? [{ key: 'vendor_name', title: 'Vendor' }] : []),
    { key: 'total_amount', title: 'Total Value (₹)', render: (r) => `₹ ${Number(r.total_amount).toFixed(2)}` },
    { key: 'status', title: 'Status', render: (r) => <StatusBadge status={r.status} /> }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Purchase Orders (POs)</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Track official contracts issued to vendors. Accept POs and generate tax invoices.
        </p>
      </div>

      {/* Grid Table */}
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm overflow-hidden">
          <DataTable
            columns={columns}
            data={pos}
            actions={(r) => (
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewDetails(r.id)}
                  className="flex items-center gap-1 text-sm text-indigo-650 hover:text-indigo-700 dark:text-indigo-400 hover:underline font-semibold"
                >
                  <Eye size={16} />
                  View
                </button>
              </div>
            )}
          />
        </div>
      )}

      {/* PO Details Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl w-full max-w-2xl relative shadow-2xl animate-text-fade max-h-[90vh] overflow-y-auto text-slate-900 dark:text-slate-100">
            <button
              onClick={() => setShowDetailModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            >
              <X size={20} />
            </button>

            {loadingDetails || !selectedPo ? (
              <Loader />
            ) : (
              <div className="space-y-6">
                {/* Header title */}
                <div>
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider block mb-1">Contract Specification</span>
                  <h3 className="text-2xl font-extrabold">{selectedPo.po_number}</h3>
                  <div className="mt-1"><StatusBadge status={selectedPo.status} /></div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-850">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Supplier (Vendor)</span>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{selectedPo.vendor_name}</p>
                    <p className="text-xs text-slate-500 mt-1">{selectedPo.vendor_contact} • {selectedPo.vendor_email}</p>
                    <p className="text-xs text-slate-400">GST: {selectedPo.vendor_gst}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Line Item details</span>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{selectedPo.rfq_title}</p>
                    <p className="text-xs text-slate-500 mt-1">{selectedPo.rfq_quantity} units @ ₹{Number(selectedPo.unit_pricing).toFixed(2)} each</p>
                  </div>
                </div>

                {/* Amount calculations */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">Grand Contract Value</span>
                    <p className="text-2xl font-black text-slate-800 dark:text-slate-200">₹ {Number(selectedPo.total_amount).toFixed(2)}</p>
                  </div>

                  {/* Context actions */}
                  <div className="flex gap-2">
                    {/* Vendor specific acceptance controls */}
                    {user?.role === 'vendor' && selectedPo.status === 'Sent' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedPo.id, 'Accepted')}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-500/10 transition"
                      >
                        <CheckCircle2 size={16} />
                        Accept PO Contract
                      </button>
                    )}

                    {/* Vendor completion trigger */}
                    {user?.role === 'vendor' && selectedPo.status === 'Accepted' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedPo.id, 'Completed')}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-500/10 transition"
                      >
                        Mark Completed
                      </button>
                    )}

                    {/* Invoice generation triggers */}
                    {(selectedPo.status === 'Accepted' || selectedPo.status === 'Completed') && (
                      <button
                        onClick={() => handleGenerateInvoice(selectedPo.id)}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-750 text-white rounded-xl font-bold shadow-md shadow-emerald-500/15 transition animate-pulse"
                      >
                        <FileText size={16} />
                        Generate Invoice
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
