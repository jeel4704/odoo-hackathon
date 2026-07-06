import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Briefcase, ArrowLeft, Loader2, KeyRound } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import api from '../../services/api'

export default function Register() {
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [emailToVerify, setEmailToVerify] = useState('')
  const [registrationDetails, setRegistrationDetails] = useState(null)
  const [countdown, setCountdown] = useState(0)
  
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { register: registerOtp, handleSubmit: handleSubmitOtp, formState: { errors: errorsOtp }, reset: resetOtp } = useForm()
  
  const toast = useToast()
  const nav = useNavigate()

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const onSubmitDetails = async (v) => {
    setIsLoading(true)
    try {
      // Initiate register request on backend
      const res = await api.post('/register', {
        name: v.name,
        email: v.email,
        password: v.password,
        role: v.role
      })

      if (res.data?.otpSent) {
        setOtpSent(true)
        setEmailToVerify(v.email)
        setRegistrationDetails(v)
        setCountdown(60)
        toast.push({
          title: 'Verification Code Sent',
          message: 'Please check your email address for your 6-digit OTP code.'
        })
      }
    } catch (err) {
      console.warn('Backend register request failed. Handling fallback...', err)
      
      // If the backend is active and returned a real error, display it
      if (err.response) {
        const errorData = err.response.data;
        const msg = (typeof errorData === 'object' ? (errorData.error || errorData.message) : errorData) || 'Could not initiate registration.';
        toast.push({
          title: 'Registration Failed',
          message: msg
        })
        setIsLoading(false)
        return
      }

      // Offline fallback for demo mode when backend server is down
      await new Promise((resolve) => setTimeout(resolve, 800))
      
      setOtpSent(true)
      setEmailToVerify(v.email)
      setRegistrationDetails(v)
      setCountdown(60)
      
      toast.push({
        title: 'Demo OTP Code Sent',
        message: 'Mock verification code is "123456" (Fallback Mode).'
      })
      console.log(`\n======================================================`);
      console.log(`[MOCK EMAIL DISPATCH] OTP: 123456 sent to ${v.email}`);
      console.log(`======================================================\n`);
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmitOtp = async (v) => {
    setIsVerifying(true)
    try {
      // Verify OTP on backend
      await api.post('/register-verify', {
        email: emailToVerify,
        otp: v.otp
      })

      toast.push({
        title: 'Email Verified',
        message: 'Your account is now active. Please sign in!'
      })
      nav('/auth/login')
    } catch (err) {
      console.warn('Backend OTP verification failed. Handling fallback...', err)
      
      // If backend responded with a validation error, enforce it (do not fall back to mock)
      if (err.response) {
        toast.push({
          title: 'Verification Failed',
          message: err.response.data || 'Invalid verification code. Please try again.'
        })
        setIsVerifying(false)
        return
      }

      // Offline fallback for demo mode when backend server is not running
      await new Promise((resolve) => setTimeout(resolve, 600))
      
      if (v.otp === '123456') {
        toast.push({
          title: 'Demo Verified',
          message: 'Account verified successfully in offline sandbox. Please sign in!'
        })
        nav('/auth/login')
      } else {
        toast.push({
          title: 'Verification Failed',
          message: 'Invalid offline verification code. Please check console.'
        })
      }
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendOTP = async () => {
    setCountdown(60)
    try {
      await api.post('/register', registrationDetails)
      toast.push({
        title: 'Verification Code Resent',
        message: 'A new 6-digit OTP has been sent to your email.'
      })
    } catch (err) {
      console.warn('Resend failed. Triggering mock resend...', err)
      toast.push({
        title: 'Demo OTP Resent',
        message: 'Mock code "123456" has been dispatched.'
      })
      console.log(`\n======================================================`);
      console.log(`[MOCK EMAIL DISPATCH] OTP: 123456 sent to ${emailToVerify}`);
      console.log(`======================================================\n`);
    }
  }

  if (otpSent) {
    return (
      <div className="glass-card rounded-3xl p-8 border border-white/10 glow-emerald max-w-md w-full">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setOtpSent(false)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 uppercase tracking-wider mb-4 transition duration-150"
          >
            <ArrowLeft className="w-4 h-4" />
            Edit Info
          </button>
          
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            Verify Email
          </h2>
          <p className="text-slate-400 mt-2 text-sm">
            We have sent a verification code to <span className="text-emerald-400 font-semibold">{emailToVerify}</span>. Please enter the code below.
          </p>
        </div>

        <form onSubmit={handleSubmitOtp(onSubmitOtp)} className="space-y-5">
          {/* OTP Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Verification Code
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <KeyRound className="h-5 w-5" />
              </div>
              <input
                {...registerOtp('otp', {
                  required: 'Verification code is required',
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: 'Please enter a 6-digit numeric code'
                  }
                })}
                type="text"
                maxLength={6}
                placeholder="000000"
                className={`w-full bg-slate-900/40 border ${
                  errorsOtp.otp
                    ? 'border-red-500 focus:ring-red-500/20'
                    : 'border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20'
                } rounded-xl pl-11 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition-all duration-200 text-lg tracking-[0.25em] font-mono`}
              />
            </div>
            {errorsOtp.otp && (
              <p className="text-xs text-red-400 font-medium mt-1">
                {errorsOtp.otp.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-75 disabled:pointer-events-none"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Verifying code...
                </>
              ) : (
                'Confirm Account Activation'
              )}
            </button>

            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-xs text-slate-500">
                  Resend code in <span className="text-slate-300 font-semibold">{countdown}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition duration-150"
                >
                  Resend Verification Code
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    )
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
          Create Account
        </h2>
        <p className="text-slate-400 mt-2 text-sm">
          Register a new organization or portal account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmitDetails)} className="space-y-4">
        {/* Name Input */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
              <User className="h-4 w-4" />
            </div>
            <input
              {...register('name')}
              type="text"
              placeholder="John Doe"
              className="w-full bg-slate-900/40 border border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl pl-11 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition-all duration-200"
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
              <Mail className="h-4 w-4" />
            </div>
            <input
              {...register('email')}
              type="email"
              placeholder="name@company.com"
              className="w-full bg-slate-900/40 border border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl pl-11 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition-all duration-200"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
              <Lock className="h-4 w-4" />
            </div>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="w-full bg-slate-900/40 border border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl pl-11 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition-all duration-200"
            />
          </div>
        </div>

        {/* Role Select Input */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Account Role
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
              <Briefcase className="h-4 w-4" />
            </div>
            <select
              {...register('role')}
              className="w-full bg-slate-900/40 border border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl pl-11 pr-4 py-2.5 text-slate-300 focus:outline-none focus:ring-4 transition-all duration-200 cursor-pointer appearance-none animate-none"
            >
              <option value="admin" className="bg-slate-900 text-slate-300">System Administrator</option>
              <option value="procurement" className="bg-slate-900 text-slate-300">Procurement Officer</option>
              <option value="vendor" className="bg-slate-900 text-slate-300">Vendor / Supplier</option>
              <option value="manager" className="bg-slate-900 text-slate-300">Approving Manager</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-75 disabled:pointer-events-none mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Registering account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>
    </div>
  )
}
