import React, { useState, useEffect } from 'react'
import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import Loader from '../../components/Loader'
import { Plus, Eye, X, Send, Award, Calendar, CheckCircle, CheckCircle2, Edit, Trash } from 'lucide-react';

export default function RFQs() {
  const { user } = useAuth()
  const toast = useToast()

  const [rfqs, setRfqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [vendors, setVendors] = useState([])

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedRfq, setSelectedRfq] = useState(null)
  const [editRfq, setEditRfq] = useState(null)
  const [comparisonQuotes, setComparisonQuotes] = useState([])
  const [loadingDetails, setLoadingDetails] = useState(false)

  // RFQ Submission state (for Vendors)
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [quoteFormData, setQuoteFormData] = useState({
    pricing: '',
    delivery_timeline: '',
    notes: ''
  })

  // RFQ Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quantity: 1,
    deadline: '',
    vendorIds: []
  })

  const fetchRFQs = async () => {
    try {
      setLoading(true)
      const res = await api.get('/rfqs')
      setRfqs(res.data)
    } catch (err) {
      toast.push({
        title: 'Error Loading RFQs',
        message: err.response?.data || 'Failed to fetch RFQs.'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRFQ = async (id) => {
    if (!window.confirm('Are you sure you want to delete this RFQ?')) return
    try {
      await api.delete(`/rfqs/${id}`)
      toast.push({ title: 'RFQ Deleted', message: `RFQ ID ${id} removed.` })
      fetchRFQs()
    } catch (err) {
      toast.push({ title: 'Delete Failed', message: err.response?.data || 'Could not delete RFQ.' })
    }
  }

  const handleEditRFQ = (rfq) => {
    setEditRfq(rfq)
    setFormData({
      title: rfq.title,
      description: rfq.description || '',
      quantity: rfq.quantity,
      deadline: rfq.deadline ? new Date(rfq.deadline).toISOString().slice(0,16) : '',
      vendorIds: rfq.vendorIds || []
    })
    setShowEditModal(true)
  }

  const handleUpdateRFQ = async (e) => {
    e.preventDefault()
    try {
      await api.put(`/rfqs/${editRfq.id}`, formData)
      toast.push({ title: 'RFQ Updated', message: `RFQ ID ${editRfq.id} updated.` })
      setShowEditModal(false)
      setEditRfq(null)
      fetchRFQs()
    } catch (err) {
      toast.push({ title: 'Update Failed', message: err.response?.data || 'Could not update RFQ.' })
    }
  }

  const fetchVendors = async () => {
    if (user?.role === 'vendor') return
    try {
      const res = await api.get('/vendors')
      setVendors(res.data)
    } catch (err) {
      console.error('Failed to load vendors', err)
    }
  }

  useEffect(() => {
    fetchRFQs()
    fetchVendors()
  }, [user])

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleVendorCheckboxChange = (vendorId) => {
    const ids = [...formData.vendorIds]
    if (ids.includes(vendorId)) {
      setFormData({ ...formData, vendorIds: ids.filter(id => id !== vendorId) })
    } else {
      setFormData({ ...formData, vendorIds: [...ids, vendorId] })
    }
  }

  const handleCreateRFQ = async (e) => {
    e.preventDefault()
    try {
      await api.post('/rfqs', formData)
      toast.push({
        title: 'RFQ Created',
        message: `Successfully created RFQ "${formData.title}" and notified assigned vendors.`
      })
      setShowCreateModal(false)
      setFormData({ title: '', description: '', quantity: 1, deadline: '', vendorIds: [] })
      fetchRFQs()
    } catch (err) {
      toast.push({
        title: 'Failed to Create RFQ',
        message: err.response?.data || 'Ensure dates and quantities are valid.'
      })
    }
  }

  const handleViewDetails = async (rfq) => {
    try {
      setLoadingDetails(true)
      setSelectedRfq(rfq)
      setShowDetailModal(true)

      // Fetch quotations/comparison for this RFQ (only available to staff)
      if (user?.role !== 'vendor') {
        const res = await api.get(`/quotations/rfq/${rfq.id}/compare`)
        setComparisonQuotes(res.data)
      }
    } catch (err) {
      console.error(err)
      toast.push({
        title: 'Details Load Error',
        message: 'Could not fetch submitted quotation comparison for this RFQ.'
      })
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleOpenQuoteModal = () => {
    setQuoteFormData({ pricing: '', delivery_timeline: '', notes: '' })
    setShowQuoteModal(true)
  }

  const handleSubmitQuotation = async (e) => {
    e.preventDefault()
    try {
      await api.post('/quotations', {
        rfq_id: selectedRfq.id,
        ...quoteFormData
      })
      toast.push({
        title: 'Quotation Submitted',
        message: 'Your pricing proposal was registered successfully.'
      })
      setShowQuoteModal(false)
      setShowDetailModal(false)
      fetchRFQs()
    } catch (err) {
      toast.push({
        title: 'Quotation Failed',
        message: err.response?.data || 'Failed to submit quote.'
      })
    }
  }

  const handleRecommendQuote = async (quoteId) => {
    try {
      // Prompt Manager Review: updates quote status to 'Submitted'
      await api.post('/approvals', {
        quotation_id: quoteId,
        status: 'Submitted',
        remarks: 'Recommended by procurement officer.'
      })
      toast.push({
        title: 'Submitted to Manager',
        message: 'Successfully submitted quotation to manager for final approval workflow.'
      })
      // Refresh comparison
      const res = await api.get(`/quotations/rfq/${selectedRfq.id}/compare`)
      setComparisonQuotes(res.data)
    } catch (err) {
      toast.push({
        title: 'Submission Failed',
        message: err.response?.data || 'Failed to submit quotation to manager.'
      })
    }
  }

  const handleCreatePO = async (quoteId) => {
    try {
      await api.post('/pos', { quotation_id: quoteId })
      toast.push({
        title: 'Purchase Order Issued',
        message: 'Contract PO has been generated and sent to the vendor successfully.'
      })
      // Refresh comparison
      const res = await api.get(`/quotations/rfq/${selectedRfq.id}/compare`)
      setComparisonQuotes(res.data)
    } catch (err) {
      toast.push({
        title: 'PO Generation Failed',
        message: err.response?.data || 'Failed to issue Purchase Order.'
      })
    }
  }

  const columns = [
    { key: 'id', title: 'RFQ ID' },
    { key: 'title', title: 'Title' },
    { key: 'quantity', title: 'Quantity' },
    { key: 'deadline', title: 'Deadline', render: (r) => new Date(r.deadline).toLocaleString() },
    { key: 'status', title: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'actions', title: 'Actions', render: (r) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleViewDetails(r)} className="text-indigo-600 hover:underline" title="Details"><Eye size={16} /></button>
          {(user?.role === 'admin' || user?.role === 'procurement' || user?.role === 'manager') && (
            <>
              <button onClick={() => handleEditRFQ(r)} className="text-emerald-600 hover:underline" title="Edit"><Edit size={16} /></button>
              <button onClick={() => handleDeleteRFQ(r.id)} className="text-red-600 hover:underline" title="Delete"><Trash size={16} /></button>
            </>
          )}
        </div>
      )
    }
  ]

  // Find lowest price to highlight in comparison table
  const lowestPrice = comparisonQuotes.length > 0 ? Math.min(...comparisonQuotes.map(q => Number(q.pricing))) : null

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Requests for Quotations (RFQs)</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {user?.role === 'vendor' ? 'Browse invitations and submit competitive bids.' : 'Issue RFQs, assign vendors, and review quotation pricing.'}
          </p>
        </div>
        {user?.role !== 'vendor' && (
          <button 
            onClick={() => setShowCreateModal(true)} 
            className="flex items-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-md shadow-indigo-500/10 transition duration-150"
          >
            <Plus size={18} />
            Create RFQ
          </button>
        )}
      </div>

      {/* RFQs List */}
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm overflow-hidden">
          <DataTable 
            columns={columns} 
            data={rfqs} 
            actions={(r) => (
              <button 
                onClick={() => handleViewDetails(r)}
                className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:underline font-medium"
              >
                <Eye size={16} />
                Details
              </button>
            )}
          />
        </div>
      )}

      {/* Create RFQ Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl w-full max-w-xl relative shadow-2xl animate-text-fade max-h-[85vh] overflow-y-auto text-slate-900 dark:text-slate-100">
            <button 
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold mb-1">Create Request For Quotation</h3>
            <p className="text-xs text-slate-400 mb-6">Select item quantity, set deadline, and invite registered vendors.</p>

            <form onSubmit={handleCreateRFQ} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">RFQ Title</label>
                <input 
                  type="text" 
                  name="title" 
                  required
                  placeholder="e.g. 500x Office Laptops Procurement"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Item Description / Details</label>
                <textarea 
                  name="description" 
                  rows="3"
                  placeholder="Enter specifications, standards, delivery locations..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Required Quantity</label>
                  <input 
                    type="number" 
                    name="quantity" 
                    required 
                    min="1"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Submission Deadline</label>
                  <input 
                    type="datetime-local" 
                    name="deadline" 
                    required
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition text-slate-600 dark:text-slate-300"
                  />
                </div>
              </div>

              {/* Assign Vendors */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-2">Assign Invited Vendors</label>
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-3 max-h-[160px] overflow-y-auto space-y-2.5">
                  {vendors.length > 0 ? (
                    vendors.map(v => (
                      <label key={v.id} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={formData.vendorIds.includes(v.id)}
                          onChange={() => handleVendorCheckboxChange(v.id)}
                          className="rounded text-indigo-600 focus:ring-indigo-500/20 w-4 h-4"
                        />
                        <div>
                          <span className="font-semibold">{v.name}</span>
                          <span className="text-[10px] text-slate-400 block">{v.category} • GST: {v.gst_number}</span>
                        </div>
                      </label>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 text-center">No active vendors found to invite. Add some first!</p>
                  )}
                </div>
              </div>

              <button 
                type="submit"
                disabled={formData.vendorIds.length === 0}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition shadow-md shadow-indigo-500/10 disabled:opacity-50 mt-4"
              >
                Publish RFQ & Send Invitations
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit RFQ Modal */}
{showEditModal && editRfq && (
  <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl w-full max-w-xl relative shadow-2xl animate-text-fade max-h-[85vh] overflow-y-auto text-slate-900 dark:text-slate-100">
      <button
        onClick={() => { setShowEditModal(false); setEditRfq(null); }}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
      >
        <X size={20} />
      </button>
      <h3 className="text-xl font-bold mb-1">Edit Request For Quotation</h3>
      <p className="text-xs text-slate-400 mb-6">Update the details and save changes.</p>
      <form onSubmit={handleUpdateRFQ} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">RFQ Title</label>
          <input type="text" name="title" required placeholder="RFQ title" value={formData.title} onChange={handleInputChange}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Item Description / Details</label>
          <textarea name="description" rows="3" placeholder="Enter specifications..." value={formData.description} onChange={handleInputChange}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Required Quantity</label>
            <input type="number" name="quantity" required min="1" value={formData.quantity} onChange={handleInputChange}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Submission Deadline</label>
            <input type="datetime-local" name="deadline" required value={formData.deadline} onChange={handleInputChange}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition text-slate-600 dark:text-slate-300" />
          </div>
        </div>
        {/* Assign Vendors */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase block mb-2">Assign Invited Vendors</label>
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-3 max-h-[160px] overflow-y-auto space-y-2.5">
            {vendors.length > 0 ? (
              vendors.map(v => (
                <label key={v.id} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input type="checkbox" checked={formData.vendorIds.includes(v.id)} onChange={() => handleVendorCheckboxChange(v.id)}
                    className="rounded text-indigo-600 focus:ring-indigo-500/20 w-4 h-4" />
                  <div>
                    <span className="font-semibold">{v.name}</span>
                    <span className="text-[10px] text-slate-400 block">{v.category} • GST: {v.gst_number}</span>
                  </div>
                </label>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center">No active vendors found to invite. Add some first!</p>
            )}
          </div>
        </div>
        <button type="submit" disabled={formData.vendorIds.length === 0}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition shadow-md shadow-indigo-500/10 disabled:opacity-50 mt-4">
          Update RFQ
        </button>
      </form>
    </div>
  </div>
)}
{/* RFQ Detail & Comparison Modal */}
      {showDetailModal && selectedRfq && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl w-full max-w-4xl relative shadow-2xl animate-text-fade max-h-[90vh] overflow-y-auto text-slate-900 dark:text-slate-100">
            <button 
              onClick={() => setShowDetailModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            >
              <X size={20} />
            </button>

            {/* Header info */}
            <div className="mb-6">
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider block mb-1">RFQ Detail Panel</span>
              <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{selectedRfq.title}</h3>
              <p className="text-sm text-slate-500 mt-2">{selectedRfq.description || 'No description provided.'}</p>
            </div>

            {/* Detail Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Quantity</span>
                <p className="text-sm font-bold">{selectedRfq.quantity} units</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Deadline</span>
                <p className="text-sm font-bold flex items-center gap-1">
                  <Calendar size={14} className="text-indigo-500" />
                  {new Date(selectedRfq.deadline).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">RFQ Status</span>
                <div className="mt-0.5"><StatusBadge status={selectedRfq.status} /></div>
              </div>
            </div>

            {/* Vendor/Quotation Views based on role */}
            {user?.role === 'vendor' ? (
              // Vendor View - Submission Option
              <div>
                {selectedRfq.status === 'Open' ? (
                  <div className="text-center py-6">
                    <p className="text-sm text-slate-500 mb-4">You have been invited to quote for this RFQ. Submit your best offer before the deadline.</p>
                    <button 
                      onClick={handleOpenQuoteModal}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-500/10 transition"
                    >
                      Submit Quotation
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4 bg-slate-50 dark:bg-slate-800/20 rounded-xl text-slate-400 text-sm">
                    This RFQ is currently {selectedRfq.status} and is closed to new proposals.
                  </div>
                )}
              </div>
            ) : (
              // Staff View - Quotations Comparison
              <div>
                <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-500" />
                  Quotations Side-by-Side Comparison
                </h4>
                
                {loadingDetails ? (
                  <Loader />
                ) : comparisonQuotes.length > 0 ? (
                  <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                    <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
                      <thead className="bg-slate-50 dark:bg-slate-800/80">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs text-slate-500 uppercase font-semibold">Vendor</th>
                          <th className="px-4 py-3 text-left text-xs text-slate-500 uppercase font-semibold">Category</th>
                          <th className="px-4 py-3 text-right text-xs text-slate-500 uppercase font-semibold">Price (Unit)</th>
                          <th className="px-4 py-3 text-right text-xs text-slate-500 uppercase font-semibold">Delivery (Days)</th>
                          <th className="px-4 py-3 text-left text-xs text-slate-500 uppercase font-semibold">Notes</th>
                          <th className="px-4 py-3 text-center text-xs text-slate-500 uppercase font-semibold">Status</th>
                          {(user?.role === 'procurement' || user?.role === 'admin') && <th className="px-4 py-3 text-center text-xs text-slate-500 uppercase font-semibold">Action</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900/60">
                        {comparisonQuotes.map((q) => {
                          const isLowest = Number(q.pricing) === lowestPrice
                          return (
                            <tr key={q.id} className={isLowest ? 'bg-emerald-50/40 dark:bg-emerald-950/10' : ''}>
                              <td className="px-4 py-3.5 text-sm font-semibold">
                                <div className="flex items-center gap-1.5">
                                  {q.vendor_name}
                                  {isLowest && <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.5 rounded-full font-extrabold uppercase dark:bg-emerald-900/40 dark:text-emerald-400">Lowest</span>}
                                </div>
                              </td>
                              <td className="px-4 py-3.5 text-sm text-slate-500">{q.vendor_category}</td>
                              <td className="px-4 py-3.5 text-sm font-mono font-bold text-right text-slate-800 dark:text-slate-200">₹{Number(q.pricing).toFixed(2)}</td>
                              <td className="px-4 py-3.5 text-sm text-right font-medium">{q.delivery_timeline} days</td>
                              <td className="px-4 py-3.5 text-xs text-slate-500 max-w-[200px] truncate" title={q.notes}>{q.notes || '-'}</td>
                              <td className="px-4 py-3.5 text-center text-xs"><StatusBadge status={q.status} /></td>
                              {(user?.role === 'procurement' || user?.role === 'admin') && (
                                <td className="px-4 py-3.5 text-center">
                                  {q.status === 'Submitted' ? (
                                    <button 
                                      onClick={() => handleRecommendQuote(q.id)}
                                      className="flex items-center gap-1 mx-auto text-xs px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
                                    >
                                      <Send size={12} />
                                      Send to Manager
                                    </button>
                                  ) : q.status === 'Approved' ? (
                                    <button 
                                      onClick={() => handleCreatePO(q.id)}
                                      className="flex items-center gap-1 mx-auto text-xs px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition"
                                    >
                                      <CheckCircle2 size={12} />
                                      Issue PO Contract
                                    </button>
                                  ) : q.status === 'Ordered' ? (
                                    <span className="text-xs font-semibold text-teal-650 dark:text-teal-400 flex items-center gap-0.5 justify-center">
                                      <CheckCircle2 size={14} className="text-teal-500" /> PO Issued
                                    </span>
                                  ) : (
                                    <span className="text-xs text-slate-400 font-medium">{q.status}</span>
                                  )}
                                </td>
                              )}
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 py-6 text-center bg-slate-50 dark:bg-slate-800/10 rounded-2xl">No quotations submitted by vendors yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Submit Quotation Modal (Nested for Vendor popup) */}
      {showQuoteModal && selectedRfq && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl w-full max-w-md relative shadow-2xl text-slate-900 dark:text-slate-100">
            <button 
              onClick={() => setShowQuoteModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold mb-1">Submit Proposal Quote</h3>
            <p className="text-xs text-slate-400 mb-6">Quote for: <span className="font-semibold text-emerald-500">{selectedRfq.title}</span></p>

            <form onSubmit={handleSubmitQuotation} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Proposed Unit Pricing (₹)</label>
                <input 
                  type="number" 
                  required 
                  step="0.01" 
                  min="0.01"
                  placeholder="0.00"
                  value={quoteFormData.pricing}
                  onChange={(e) => setQuoteFormData({ ...quoteFormData, pricing: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Delivery Timeline (Days)</label>
                <input 
                  type="number" 
                  required 
                  min="1"
                  placeholder="e.g. 7"
                  value={quoteFormData.delivery_timeline}
                  onChange={(e) => setQuoteFormData({ ...quoteFormData, delivery_timeline: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Special Notes / Remarks</label>
                <textarea 
                  rows="3"
                  placeholder="Add warranties, delivery terms, packaging specs..."
                  value={quoteFormData.notes}
                  onChange={(e) => setQuoteFormData({ ...quoteFormData, notes: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 transition"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold shadow-md shadow-emerald-500/10 transition mt-4"
              >
                Submit Quotation Proposal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
