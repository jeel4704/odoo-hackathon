import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, ArrowLeft, Loader2 } from 'lucide-react'
import { useToast } from '../../context/ToastContext'

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()
  const toast = useToast()
  const nav = useNavigate()

  const onSubmit = async (v) => {
    setIsLoading(true)
    // Simulate reset request
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)

    toast.push({
      title: 'Reset Link Sent',
      message: `A password recovery email has been sent to ${v.email}`
    })
    
    // Redirect to login after successful submit
    nav('/auth/login')
  }

  return (
    <div className="glass-card rounded-3xl p-8 border border-white/10 glow-emerald max-w-md w-full">
      <div className="mb-6">
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 uppercase tracking-wider mb-4 transition duration-150"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Link>
        
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
          Forgot Password
        </h2>
        <p className="text-slate-400 mt-2 text-sm">
          Enter your registered email address and we'll send you instructions to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
              <Mail className="h-5 w-5" />
            </div>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address'
                }
              })}
              type="email"
              placeholder="name@company.com"
              className={`w-full bg-slate-900/40 border ${
                errors.email
                  ? 'border-red-500 focus:ring-red-500/20'
                  : 'border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20'
              } rounded-xl pl-11 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition-all duration-200`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-400 font-medium mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-75 disabled:pointer-events-none"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Sending reset instructions...
            </>
          ) : (
            'Send Reset Link'
          )}
        </button>
      </form>
    </div>
  )
}
