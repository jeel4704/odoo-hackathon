import React, { useState, useEffect } from 'react'
import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import Loader from '../../components/Loader'
import { Plus, Search, Edit2, Trash2, X, Filter } from 'lucide-react'

const CATEGORIES = ['Electronics', 'IT Services', 'Logistics', 'Raw Materials', 'Office Supplies']
const STATUSES = ['Active', 'Suspended', 'Pending']

export default function Vendors() {
  const { user } = useAuth()
  const toast = useToast()
  
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Search & Filter state
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')

  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedVendorId, setSelectedVendorId] = useState(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    category: 'Electronics',
    gst_number: '',
    contact_person: '',
    phone: '',
    status: 'Active'
  })

  const fetchVendors = async () => {
    try {
      setLoading(true)
      const params = {}
      if (search) params.search = search
      if (category) params.category = category
      if (status) params.status = status

      const res = await api.get('/vendors', { params })
      setVendors(res.data)
    } catch (err) {
      toast.push({
        title: 'Error Fetching Vendors',
        message: err.response?.data || 'Failed to retrieve vendor registry.'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVendors()
  }, [search, category, status])

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      category: 'Electronics',
      gst_number: '',
      contact_person: '',
      phone: '',
      status: 'Active'
    })
    setIsEditing(false)
    setShowModal(true)
  }

  const handleOpenEditModal = (vendor) => {
    setFormData({
      name: vendor.name,
      email: vendor.email,
      password: '', // Leave blank unless they want to create/update
      category: vendor.category,
      gst_number: vendor.gst_number,
      contact_person: vendor.contact_person,
      phone: vendor.phone,
      status: vendor.status
    })
    setSelectedVendorId(vendor.id)
    setIsEditing(true)
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (isEditing) {
        await api.put(`/vendors/${selectedVendorId}`, formData)
        toast.push({ title: 'Vendor Updated', message: `Successfully updated vendor "${formData.name}".` })
      } else {
        await api.post('/vendors', formData)
        toast.push({ title: 'Vendor Added', message: `Successfully onboarded vendor "${formData.name}".` })
      }
      setShowModal(false)
      fetchVendors()
    } catch (err) {
      toast.push({
        title: 'Error Saving Vendor',
        message: err.response?.data || 'Failed to register vendor profile.'
      })
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete vendor "${name}"? This will also remove their user credentials.`)) return
    try {
      await api.delete(`/vendors/${id}`)
      toast.push({ title: 'Vendor Deleted', message: `Successfully removed vendor "${name}".` })
      fetchVendors()
    } catch (err) {
      toast.push({
        title: 'Error Deleting Vendor',
        message: err.response?.data || 'Failed to delete vendor record.'
      })
    }
  }

  const columns = [
    { key: 'name', title: 'Vendor Name' },
    { key: 'category', title: 'Category' },
    { key: 'gst_number', title: 'GST Number' },
    { key: 'contact_person', title: 'Contact Person' },
    { key: 'email', title: 'Email' },
    { key: 'phone', title: 'Phone' },
    { key: 'status', title: 'Status', render: (r) => <StatusBadge status={r.status} /> }
  ]

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Vendors Registry</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Onboard, manage, and track vendor categories and GST compliance.</p>
        </div>
        <button 
          onClick={handleOpenAddModal} 
          className="flex items-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-md shadow-emerald-500/10 transition duration-150"
        >
          <Plus size={18} />
          Add Vendor
        </button>
      </div>

      {/* Filters bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm">
        {/* Search */}
        <div className="relative col-span-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Search by name, contact, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
          />
        </div>

        {/* Category */}
        <div className="relative">
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all text-slate-600 dark:text-slate-300"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {/* Status */}
        <div className="relative">
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all text-slate-600 dark:text-slate-300"
          >
            <option value="">All Statuses</option>
            {STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
          </select>
        </div>
      </div>

      {/* Table Data */}
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm overflow-hidden">
          <DataTable 
            columns={columns} 
            data={vendors} 
            actions={(r) => (
              <div className="flex gap-2">
                <button 
                  onClick={() => handleOpenEditModal(r)} 
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 hover:text-indigo-600 transition"
                  title="Edit Vendor"
                >
                  <Edit2 size={16} />
                </button>
                {user?.role === 'admin' && (
                  <button 
                    onClick={() => handleDelete(r.id, r.name)} 
                    className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/10 rounded-lg text-slate-500 hover:text-red-600 transition"
                    title="Delete Vendor"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            )} 
          />
        </div>
      )}

      {/* Add / Edit Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl w-full max-w-lg relative shadow-2xl animate-text-fade text-slate-900 dark:text-slate-100">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold mb-1">{isEditing ? 'Modify Vendor Profile' : 'Onboard New Vendor'}</h3>
            <p className="text-xs text-slate-400 mb-6">{isEditing ? 'Update vendor details and GST metadata.' : 'Onboard vendor to assigned RFQs. Auto-generates a user login.'}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Vendor Name */}
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Company / Vendor Name</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 transition"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Email (Login Username)</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 transition"
                  />
                </div>

                {/* Password (only active for new user onboarding) */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Password</label>
                  <input 
                    type="password" 
                    name="password"
                    placeholder={isEditing ? '••••••••' : 'Vendor@123'}
                    disabled={isEditing}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 transition disabled:opacity-50"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500 transition text-slate-700 dark:text-slate-200"
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                {/* GSTIN */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">GSTIN Number</label>
                  <input 
                    type="text" 
                    name="gst_number"
                    required
                    placeholder="22AAAAA0000A1Z5"
                    value={formData.gst_number}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 transition"
                  />
                </div>

                {/* Contact Person */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Contact Person</label>
                  <input 
                    type="text" 
                    name="contact_person"
                    required
                    value={formData.contact_person}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 transition"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 transition"
                  />
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Status</label>
                  <select 
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500 transition text-slate-700 dark:text-slate-200"
                  >
                    {STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold shadow-md shadow-emerald-500/10 transition active:scale-[0.99]"
              >
                {isEditing ? 'Save Changes' : 'Onboard Vendor'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
