import React from 'react'
import { useForm } from 'react-hook-form'

export default function ForgotPassword() {
  const { register, handleSubmit } = useForm()

  const onSubmit = (v) => {
    alert('Password reset link sent to ' + v.email)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Forgot password</h2>
      <p className="text-sm text-slate-300 mb-6">Enter your email to receive reset instructions</p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input {...register('email')} placeholder="Email" className="p-3 rounded bg-white/5" />
        <button className="mt-2 bg-indigo-600 text-white p-3 rounded">Send reset link</button>
      </form>
    </div>
  )
}
