import React, { useState, useEffect } from 'react'
import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import Loader from '../../components/Loader'
import { Download, Mail, CheckSquare, Search, FileText } from 'lucide-react'

export default function Invoices() {
  const { user } = useAuth()
  const toast = useToast()

  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  // Filtering states
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      const params = {}
      if (search) params.search = search
      if (statusFilter) params.status = statusFilter

      const res = await api.get('/invoices', { params })
      setInvoices(res.data)
    } catch (err) {
      toast.push({
        title: 'Error Loading Invoices',
        message: err.response?.data || 'Failed to fetch invoices.'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvoices()
  }, [search, statusFilter])

  const handleDownloadPDF = async (invoiceId, invoiceNumber) => {
    try {
      toast.push({ title: 'Preparing PDF', message: 'Rendering document on server...' })
      const res = await api.get(`/invoices/${invoiceId}/download`, { responseType: 'blob' })
      const blob = new Blob([res.data], { type: 'application/pdf' })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = `${invoiceNumber}.pdf`
      link.click()
      toast.push({
        title: 'Download Successful',
        message: `Saved ${invoiceNumber}.pdf to your local device.`
      })
    } catch (err) {
      toast.push({
        title: 'Download Failed',
        message: 'Could not fetch compiled PDF invoice file.'
      })
    }
  }

  const handleEmailInvoice = async (invoiceId, invoiceNumber) => {
    try {
      toast.push({ title: 'Sending Email', message: 'Uploading attachment and contacting mail server...' })
      await api.post(`/invoices/${invoiceId}/email`)
      toast.push({
        title: 'Email Sent',
        message: `Successfully emailed invoice ${invoiceNumber} PDF copy to the supplier.`
      })
    } catch (err) {
      toast.push({
        title: 'Email Failed',
        message: err.response?.data || 'SMTP dispatch failure.'
      })
    }
  }

  const handleMarkPaid = async (invoiceId) => {
    if (!window.confirm('Are you sure you want to mark this invoice as PAID?')) return
    try {
      await api.put(`/invoices/${invoiceId}/status`, { status: 'Paid' })
      toast.push({
        title: 'Payment Confirmed',
        message: 'Invoice status has been updated to PAID.'
      })
      fetchInvoices()
    } catch (err) {
      toast.push({
        title: 'Status Update Failed',
        message: err.response?.data || 'Failed to update invoice status.'
      })
    }
  }

  const columns = [
    { key: 'invoice_number', title: 'Invoice Number' },
    { key: 'po_number', title: 'PO Reference' },
    ...(user?.role !== 'vendor' ? [{ key: 'vendor_name', title: 'Vendor' }] : []),
    { key: 'subtotal', title: 'Subtotal (₹)', render: (r) => `₹ ${Number(r.subtotal).toFixed(2)}` },
    { key: 'gst_amount', title: 'GST 18% (₹)', render: (r) => `₹ ${Number(r.gst_amount).toFixed(2)}` },
    { key: 'total_amount', title: 'Total (₹)', render: (r) => `₹ ${Number(r.total_amount).toFixed(2)}` },
    { key: 'status', title: 'Status', render: (r) => <StatusBadge status={r.status} /> }
  ]

  const isStaff = user?.role === 'admin' || user?.role === 'procurement' || user?.role === 'manager'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Tax Invoices</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {user?.role === 'vendor' ? 'View your generated invoices, check payment status, and download tax copies.' : 'Audit generated tax invoices, track vendor payouts, and dispatch email receipts.'}
          </p>
        </div>
      </div>

      {/* Filter panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        {/* Search */}
        <div className="relative col-span-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Search by invoice number, PO ref, vendor name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all text-slate-800 dark:text-slate-100"
          />
        </div>

        {/* Status */}
        <div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all text-slate-600 dark:text-slate-300"
          >
            <option value="">All Statuses</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Invoices List */}
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm overflow-hidden">
          <DataTable
            columns={columns}
            data={invoices}
            actions={(r) => (
              <div className="flex gap-2">
                {/* Download PDF action */}
                <button
                  onClick={() => handleDownloadPDF(r.id, r.invoice_number)}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 hover:text-emerald-600 transition"
                  title="Download PDF Invoice"
                >
                  <Download size={16} />
                </button>

                {/* Email dispatch (staff only) */}
                {isStaff && (
                  <button
                    onClick={() => handleEmailInvoice(r.id, r.invoice_number)}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 hover:text-indigo-650 transition"
                    title="Dispatch PDF to Vendor via Email"
                  >
                    <Mail size={16} />
                  </button>
                )}

                {/* Pay invoice trigger (staff only) */}
                {isStaff && r.status === 'Unpaid' && (
                  <button
                    onClick={() => handleMarkPaid(r.id)}
                    className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-lg text-slate-500 hover:text-emerald-600 transition"
                    title="Mark Invoice as Paid"
                  >
                    <CheckSquare size={16} />
                  </button>
                )}
              </div>
            )}
          />
        </div>
      )}
    </div>
  )
}
