import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const { register, handleSubmit } = useForm()
  const nav = useNavigate()

  const onSubmit = (v) => {
    // demo: redirect to login
    nav('/auth/login')
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Create account</h2>
      <p className="text-sm text-slate-300 mb-6">Register a new VendorBridge account</p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input {...register('name')} placeholder="Full name" className="p-3 rounded bg-white/5" />
        <input {...register('email')} placeholder="Email" className="p-3 rounded bg-white/5" />
        <input {...register('password')} type="password" placeholder="Password" className="p-3 rounded bg-white/5" />
        <select {...register('role')} className="p-3 rounded bg-white/5">
          <option value="procurement">Procurement</option>
          <option value="approver">Approver</option>
        </select>
        <button className="mt-2 bg-indigo-600 text-white p-3 rounded">Register</button>
      </form>
    </div>
  )
}
