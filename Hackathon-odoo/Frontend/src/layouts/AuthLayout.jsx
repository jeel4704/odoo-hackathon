import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { ShieldCheck, CheckCircle2, TrendingUp, Layers, Users, Zap } from 'lucide-react'

const SLIDES = [
  {
    icon: Layers,
    title: 'Smart Procurement Workflows',
    description: 'Automate RFQs, purchase orders, and multi-level approval hierarchies in one integrated dashboard.'
  },
  {
    icon: Users,
    title: 'Seamless Vendor Cooperation',
    description: 'Establish direct portal channels to communicate, request quotes, and onboard vendors efficiently.'
  },
  {
    icon: TrendingUp,
    title: 'Insightful Spend Analytics',
    description: 'Unlock 3-way invoice matching and real-time spending insights to control operations budget.'
  }
]

export default function AuthLayout() {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen w-full flex bg-slate-950 text-white font-sans overflow-hidden">
      {/* Left panel: Premium Branding (Desktop & Large Tablets) */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative flex-col justify-between p-16 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950 border-r border-white/5">
        {/* Background Glowing Mesh Blobs */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-teal-500/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '3s' }} />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="h-6 w-6 text-slate-950 stroke-[2.5]" />
          </div>
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent">
            vendorBridge
          </span>
        </div>

        {/* Mid illustration & Carousel */}
        <div className="relative z-10 my-auto max-w-lg">
          {/* Glassmorphic Widget Preview */}
          <div className="mb-12 glass-card rounded-2xl p-6 relative overflow-hidden border border-white/10 glow-emerald animate-float">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">Live Activity</span>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-200 truncate">RFQ #2804 - Approved</div>
                  <div className="text-[10px] text-slate-400">Acme Corp • $24,500.00</div>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-medium">AutoMatch</span>
              </div>

              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-200 truncate">PO #1049 - Generated</div>
                  <div className="text-[10px] text-slate-400">Logistics Hub • 4 items</div>
                </div>
                <span className="text-[10px] bg-teal-500/20 text-teal-400 px-2 py-0.5 rounded-full font-medium">Pending</span>
              </div>
            </div>

            {/* Simulated graph elements */}
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-400">
                <span>Vendor Compliance</span>
                <span className="text-emerald-400 font-semibold">99.8%</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span>Cycle Time</span>
                <span className="text-emerald-400 font-semibold">-2.4 hrs</span>
              </div>
            </div>
          </div>

          {/* Value Prop Carousel Text */}
          <div className="min-h-[140px] flex flex-col justify-between">
            {SLIDES.map((slide, idx) => {
              const Icon = slide.icon
              if (idx !== activeSlide) return null
              return (
                <div key={idx} className="transition-all duration-700 ease-out transform translate-y-0 opacity-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium tracking-wide text-emerald-400">Key Feature</span>
                  </div>
                  <h2 className="text-2xl font-bold leading-tight text-white mb-2">
                    {slide.title}
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {slide.description}
                  </p>
                </div>
              )
            })}

            {/* Carousel Indicators */}
            <div className="flex gap-2 mt-6">
              {SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeSlide ? 'w-6 bg-emerald-400' : 'w-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="relative z-10 text-slate-500 text-xs flex items-center justify-between">
          <span>© 2026 vendorBridge. All rights reserved.</span>
          <span className="flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition cursor-help">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Secure Enterprise Gateway
          </span>
        </div>
      </div>

      {/* Right panel: Centered Responsive Card Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative overflow-y-auto no-scrollbar bg-slate-950">
        {/* Glow circles for mobile backgrounds */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/5 rounded-full blur-[80px] lg:hidden" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-teal-500/5 rounded-full blur-[80px] lg:hidden" />

        <div className="w-full max-w-md relative z-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

