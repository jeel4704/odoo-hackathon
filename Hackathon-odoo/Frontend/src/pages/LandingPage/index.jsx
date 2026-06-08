import React, { useState } from 'react';
import { 
  ArrowRight, 
  Shield, 
  Clock, 
  Settings, 
  Users, 
  FileText, 
  CheckCircle, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Menu, 
  X, 
  TrendingUp, 
  Database,
  Star,
  Activity,
  Layers,
  DollarSign,
  Briefcase,
  FileSpreadsheet
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('rfq'); // rfq, compare, approve
  const [faqOpen, setFaqOpen] = useState({});

  // Interactive Demo States
  const [rfqStatus, setRfqStatus] = useState('Draft'); // Draft, Published, Bids Received
  const [selectedBid, setSelectedBid] = useState(null);
  const [approvals, setApprovals] = useState([
    { role: 'Procurement Officer', approved: true, name: 'Alex Johnson' },
    { role: 'Finance Manager', approved: false, name: 'Sarah Lee' },
    { role: 'VP Operations', approved: false, name: 'Michael Chen' }
  ]);

  const toggleFaq = (index) => {
    setFaqOpen(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handlePublishRfq = () => {
    setRfqStatus('Publishing...');
    setTimeout(() => {
      setRfqStatus('Published');
    }, 1000);
  };

  const handleApproveStep = (index) => {
    setApprovals(prev => prev.map((app, i) => i === index ? { ...app, approved: true } : app));
  };

  const resetDemo = () => {
    setRfqStatus('Draft');
    setSelectedBid(null);
    setApprovals([
      { role: 'Procurement Officer', approved: true, name: 'Alex Johnson' },
      { role: 'Finance Manager', approved: false, name: 'Sarah Lee' },
      { role: 'VP Operations', approved: false, name: 'Michael Chen' }
    ]);
  };

  const faqs = [
    {
      q: "What is VendorBridge?",
      a: "VendorBridge is an advanced B2B procurement platform designed to bridge the gap between companies and vendors. It automates Requests for Quotes (RFQs), streamlines quotation reviews, manages purchase orders, and synchronizes supply chain events directly with ERP backends like Odoo."
    },
    {
      q: "Does it integrate with our existing ERP?",
      a: "Yes! VendorBridge is built to integrate natively with Odoo ERP. It syncs purchase orders, invoices, vendor details, and inventory states in real-time, reducing manual bookkeeping and system discrepancies."
    },
    {
      q: "How does the smart bidding system work?",
      a: "Procurement managers publish RFQs. Verified suppliers receive alerts, compile pricing and shipping schedules, and submit bids directly through their secure supplier portal. The system automatically highlights the best bid based on custom rules (pricing, delivery speed, and supplier rating)."
    },
    {
      q: "Is there an approval workflow for large expenditures?",
      a: "Absolutely. You can set multi-tier approval rules based on the purchase value. Once a quotation is accepted, it triggers approval notifications to managers, finance partners, and executives. Once approved, the Purchase Order is automatically raised."
    }
  ];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans relative overflow-x-hidden selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Background Ornaments / Glow Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full bg-teal-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

      {/* Navigation */}
      <header className="fixed top-0 left-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <Layers className="w-5.5 h-5.5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">VendorBridge</span>
              <span className="block text-[10px] text-emerald-500 font-semibold tracking-widest uppercase">Procurement OS</span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition duration-200">Features</a>
            <a href="#demo" className="text-sm font-medium text-slate-400 hover:text-white transition duration-200">Interactive Demo</a>
            <a href="#process" className="text-sm font-medium text-slate-400 hover:text-white transition duration-200">Our Process</a>
            <a href="#metrics" className="text-sm font-medium text-slate-400 hover:text-white transition duration-200">Impact</a>
            <a href="#faqs" className="text-sm font-medium text-slate-400 hover:text-white transition duration-200">FAQs</a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <a 
              href="/auth/login" 
              className="px-5 py-2 text-sm font-semibold text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900 rounded-xl transition duration-200"
            >
              Sign In
            </a>
            <a 
              href="/auth/register" 
              className="px-5 py-2.5 text-sm font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-98 transition duration-200"
            >
              Get Started
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-2 text-slate-400 hover:text-white transition duration-200"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-slate-950 border-b border-slate-900 py-6 px-6 flex flex-col gap-5 animate-fade-in shadow-2xl">
            <a 
              href="#features" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-medium text-slate-400 hover:text-white"
            >
              Features
            </a>
            <a 
              href="#demo" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-medium text-slate-400 hover:text-white"
            >
              Interactive Demo
            </a>
            <a 
              href="#process" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-medium text-slate-400 hover:text-white"
            >
              Our Process
            </a>
            <a 
              href="#metrics" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-medium text-slate-400 hover:text-white"
            >
              Impact
            </a>
            <a 
              href="#faqs" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-medium text-slate-400 hover:text-white"
            >
              FAQs
            </a>
            <hr className="border-slate-900 my-1" />
            <div className="flex flex-col gap-3">
              <a 
                href="/auth/login" 
                className="py-3 text-center text-slate-300 border border-slate-800 bg-slate-900/50 rounded-xl font-semibold"
              >
                Sign In
              </a>
              <a 
                href="/auth/register" 
                className="py-3 text-center text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl font-bold"
              >
                Get Started
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 md:pt-40 md:pb-32 flex flex-col items-center text-center max-w-5xl mx-auto relative z-10">
        
        {/* Banner Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-md mb-8 animate-float">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-300 tracking-wide">Introducing Version 1.0</span>
          <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-white">
          Bridging B2B Procurement 
          <span className="block mt-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-500 bg-clip-text text-transparent">
            & Suppliers Seamlessly
          </span>
        </h1>

        {/* Hero Description */}
        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl leading-relaxed">
          The all-in-one supply chain portal. Automate Request for Quotes, rank vendor responses, run hierarchical approval chains, and sync purchase orders directly to Odoo.
        </p>

        {/* Hero CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
          <a 
            href="/auth/register"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition duration-200 flex items-center justify-center gap-2"
          >
            Launch Supplier Portal
            <ArrowRight className="w-5 h-5 text-slate-950" />
          </a>
          <a 
            href="#demo"
            className="w-full sm:w-auto px-8 py-4 bg-slate-900/50 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 font-semibold rounded-xl backdrop-blur-md transform hover:-translate-y-0.5 transition duration-200 flex items-center justify-center gap-2"
          >
            Watch Interactive Demo
          </a>
        </div>

        {/* Floating Mini Mockups */}
        <div className="mt-16 w-full max-w-4xl relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-teal-600/10 to-indigo-500/10 rounded-2xl blur-xl group-hover:opacity-75 transition duration-500" />
          
          <div className="relative bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
            {/* Window controls */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/60 bg-slate-950/40">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                <span className="w-3 h-3 rounded-full bg-amber-500/70" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
              </div>
              <div className="text-xs text-slate-500 font-medium font-mono select-none">vendorbridge-portal // app</div>
              <div className="w-12" />
            </div>
            
            {/* Visualizer image or mock layout */}
            <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
              {/* Sidebar */}
              <div className="hidden md:flex flex-col gap-4 text-xs text-slate-400">
                <div className="p-2.5 bg-slate-800/50 text-emerald-400 rounded-lg font-bold flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Dashboard
                </div>
                <div className="p-2.5 hover:bg-slate-800/30 rounded-lg flex items-center gap-2">
                  <FileText className="w-4 h-4" /> RFQs & Bids
                </div>
                <div className="p-2.5 hover:bg-slate-800/30 rounded-lg flex items-center gap-2">
                  <Users className="w-4 h-4" /> Supplier List
                </div>
                <div className="p-2.5 hover:bg-slate-800/30 rounded-lg flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Purchase Orders
                </div>
                <div className="p-2.5 hover:bg-slate-800/30 rounded-lg flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Settings
                </div>
              </div>

              {/* Main Mock Content */}
              <div className="col-span-3 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800/60 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Procurement Summary</h3>
                    <p className="text-xs text-slate-500">Live operational overview of Odoo Integration</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-wide uppercase">Odoo Synced</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                    <span className="text-xs text-slate-400 block">Total Quotations</span>
                    <span className="text-xl font-bold text-white mt-1 block">42</span>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
                      <TrendingUp className="w-3 h-3" /> +12% this month
                    </span>
                  </div>
                  <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                    <span className="text-xs text-slate-400 block">Avg. Turnaround</span>
                    <span className="text-xl font-bold text-white mt-1 block">2.4 Days</span>
                    <span className="text-[10px] text-teal-400 flex items-center gap-1 mt-1 font-semibold">
                      <Clock className="w-3 h-3" /> -18h reduction
                    </span>
                  </div>
                  <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                    <span className="text-xs text-slate-400 block">Active Value</span>
                    <span className="text-xl font-bold text-white mt-1 block">$284,500</span>
                    <span className="text-[10px] text-indigo-400 flex items-center gap-1 mt-1 font-semibold">
                      <Layers className="w-3 h-3" /> 8 active RFQs
                    </span>
                  </div>
                </div>

                {/* Simulated table row list */}
                <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 space-y-3">
                  <span className="text-xs text-slate-400 font-bold block mb-1">Recent Procurement Event Stream</span>
                  
                  <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/40">
                    <div className="flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <div>
                        <span className="text-white font-semibold">RFQ #024 Bid Submitted</span>
                        <span className="text-slate-500 block text-[10px]">Supplier: Apex Logistics Corp</span>
                      </div>
                    </div>
                    <span className="text-slate-300 font-medium">$12,400.00</span>
                  </div>

                  <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/40">
                    <div className="flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <div>
                        <span className="text-white font-semibold">PO Raised on Odoo</span>
                        <span className="text-slate-500 block text-[10px]">Reference: PO_2026_9882</span>
                      </div>
                    </div>
                    <span className="text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-[9px]">Pending approval</span>
                  </div>

                  <div className="flex items-center justify-between text-xs py-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <div>
                        <span className="text-white font-semibold">Invoice Matched & Logged</span>
                        <span className="text-slate-500 block text-[10px]">Match score: 100% (Line-by-line validation)</span>
                      </div>
                    </div>
                    <span className="text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-[9px]">Completed</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Metrics Bar */}
      <section id="metrics" className="py-12 bg-slate-900/30 border-y border-slate-900 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <h4 className="text-3xl sm:text-4xl font-extrabold text-white">45%</h4>
            <p className="text-xs sm:text-sm text-emerald-400 font-semibold tracking-wider uppercase mt-1">Faster Procure-to-Pay</p>
          </div>
          <div>
            <h4 className="text-3xl sm:text-4xl font-extrabold text-white">$14.2M</h4>
            <p className="text-xs sm:text-sm text-teal-400 font-semibold tracking-wider uppercase mt-1">Volume Processed</p>
          </div>
          <div>
            <h4 className="text-3xl sm:text-4xl font-extrabold text-white">99.8%</h4>
            <p className="text-xs sm:text-sm text-indigo-400 font-semibold tracking-wider uppercase mt-1">SLA Accuracy Rate</p>
          </div>
          <div>
            <h4 className="text-3xl sm:text-4xl font-extrabold text-white">&lt; 15 min</h4>
            <p className="text-xs sm:text-sm text-emerald-400 font-semibold tracking-wider uppercase mt-1">Odoo Sync Interval</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Designed for Modern Procurement Teams
          </h2>
          <p className="mt-4 text-slate-400">
            Bid farewell to messy spreadsheets, slow emails, and duplicate data. Automate vendor communication while maintaining full control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Feature 1 */}
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/30 transition-all duration-300 group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 mb-6">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Structured RFQs</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Create Requests for Quote with granular line items, clear deadlines, and customized specifications. Notify matching vendors instantly.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-teal-500/30 transition-all duration-300 group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Supplier Portal</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Vendors access a clean interface to submit pricing, logistics notes, and delivery estimates, ensuring zero clerical errors in communications.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-indigo-500/30 transition-all duration-300 group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 mb-6">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Multi-Tier Approvals</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Route major expenditure items through customizable approval rings. Assign managers, CFOs, or directors with one-tap digital signoffs.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-indigo-500/30 transition-all duration-300 group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 mb-6">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Automatic Odoo Sync</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Synchronize approved supplier agreements as formal Purchase Orders and Invoices inside Odoo ERP in real-time. No manual entry needed.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/30 transition-all duration-300 group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 mb-6">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Smart Analytics</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Track vendor fulfillment metrics, shipping delays, pricing deviations, and supply chain bottlenecks directly on a visual dashboard.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-teal-500/30 transition-all duration-300 group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 mb-6">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">100% Audit Readiness</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Every action, bid change, workflow signoff, and PO update is timestamped and recorded in our immutable audit stream for fast compliance checking.
            </p>
          </div>

        </div>
      </section>

      {/* Interactive Demo Showcase */}
      <section id="demo" className="py-24 bg-slate-900/10 border-y border-slate-900 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Take the Wheel</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">Interactive Platform Sandbox</h2>
            <p className="mt-4 text-slate-400">
              Try out three core pillars of VendorBridge. Interact with the sandbox buttons below to simulate actual procurement workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Sandbox Sidebar Links */}
            <div className="lg:col-span-4 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
              <button 
                onClick={() => { setActiveTab('rfq'); resetDemo(); }}
                className={`w-full text-left p-5 rounded-xl border transition-all duration-200 shrink-0 lg:shrink flex items-start gap-4 ${
                  activeTab === 'rfq' 
                  ? 'bg-slate-900 border-emerald-500/30 shadow-md shadow-emerald-500/5' 
                  : 'bg-transparent border-slate-900 hover:bg-slate-900/40'
                }`}
              >
                <div className={`p-2.5 rounded-lg ${activeTab === 'rfq' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">1. Create & Publish RFQ</h4>
                  <p className="text-xs text-slate-400 mt-1 hidden sm:block">Draft detailed requests and notify matching vendors</p>
                </div>
              </button>

              <button 
                onClick={() => { setActiveTab('compare'); resetDemo(); }}
                className={`w-full text-left p-5 rounded-xl border transition-all duration-200 shrink-0 lg:shrink flex items-start gap-4 ${
                  activeTab === 'compare' 
                  ? 'bg-slate-900 border-teal-500/30 shadow-md shadow-teal-500/5' 
                  : 'bg-transparent border-slate-900 hover:bg-slate-900/40'
                }`}
              >
                <div className={`p-2.5 rounded-lg ${activeTab === 'compare' ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">2. Smart Quotation Review</h4>
                  <p className="text-xs text-slate-400 mt-1 hidden sm:block">Compare incoming pricing and auto-select the best bid</p>
                </div>
              </button>

              <button 
                onClick={() => { setActiveTab('approve'); resetDemo(); }}
                className={`w-full text-left p-5 rounded-xl border transition-all duration-200 shrink-0 lg:shrink flex items-start gap-4 ${
                  activeTab === 'approve' 
                  ? 'bg-slate-900 border-indigo-500/30 shadow-md shadow-indigo-500/5' 
                  : 'bg-transparent border-slate-900 hover:bg-slate-900/40'
                }`}
              >
                <div className={`p-2.5 rounded-lg ${activeTab === 'approve' ? 'bg-indigo-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">3. Approval Sign-Off</h4>
                  <p className="text-xs text-slate-400 mt-1 hidden sm:block">Multi-level signatures before pushing order to Odoo</p>
                </div>
              </button>
            </div>

            {/* Sandbox Console Area */}
            <div className="lg:col-span-8 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between backdrop-blur-md relative min-h-[380px]">
              
              <div className="absolute top-4 right-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase select-none">
                Interactive Console
              </div>

              {/* Tab 1: RFQ Console */}
              {activeTab === 'rfq' && (
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      Mock RFQ Composer
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Simulate drafting materials requests for your supply line.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-slate-500">RFQ Title</label>
                        <input 
                          type="text" 
                          readOnly 
                          value="Raw Aluminum Sheets - Batch C" 
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-300 font-semibold focus:outline-none" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-slate-500">Estimated Qty</label>
                        <input 
                          type="text" 
                          readOnly 
                          value="5,000 Units" 
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-300 font-semibold focus:outline-none" 
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-xl mt-6 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 block font-bold">RFQ Status</span>
                        <span className={`text-sm font-semibold mt-1 block ${
                          rfqStatus === 'Published' ? 'text-emerald-400' : 'text-amber-400'
                        }`}>{rfqStatus}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">ID: RFQ-2026-081</span>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                    <button 
                      onClick={resetDemo} 
                      className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                    >
                      Reset State
                    </button>
                    <button 
                      onClick={handlePublishRfq}
                      disabled={rfqStatus === 'Published' || rfqStatus === 'Publishing...'}
                      className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold rounded-lg text-xs tracking-wide transition duration-150"
                    >
                      {rfqStatus === 'Draft' && 'Publish RFQ to Suppliers'}
                      {rfqStatus === 'Publishing...' && 'Broadcasting...'}
                      {rfqStatus === 'Published' && 'Published & Sent ✅'}
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2: Compare Bids */}
              {activeTab === 'compare' && (
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                      Supplier Bid Evaluation
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Review quotations side-by-side. Our algorithm auto-grades based on rate, reliability, and shipping dates.</p>

                    <div className="space-y-3 mt-6">
                      
                      {/* Bid 1 */}
                      <div 
                        onClick={() => setSelectedBid('apex')}
                        className={`p-4 rounded-xl border cursor-pointer transition duration-150 flex items-center justify-between ${
                          selectedBid === 'apex' 
                          ? 'bg-teal-950/20 border-teal-500/50' 
                          : 'bg-slate-950/40 border-slate-800/60 hover:bg-slate-950/80'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-teal-400" />
                          <div>
                            <span className="text-xs font-bold text-white">Apex Logistics (Optimal Bid)</span>
                            <span className="text-[10px] text-slate-500 block">Deliver in 3 days • Rating 9.8/10</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-teal-400 block">$11,900.00</span>
                          <span className="text-[9px] text-emerald-400 font-semibold uppercase">Grade A+</span>
                        </div>
                      </div>

                      {/* Bid 2 */}
                      <div 
                        onClick={() => setSelectedBid('acme')}
                        className={`p-4 rounded-xl border cursor-pointer transition duration-150 flex items-center justify-between ${
                          selectedBid === 'acme' 
                          ? 'bg-teal-950/20 border-teal-500/50' 
                          : 'bg-slate-950/40 border-slate-800/60 hover:bg-slate-950/80'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-slate-500" />
                          <div>
                            <span className="text-xs font-bold text-white">Acme Supply Corp</span>
                            <span className="text-[10px] text-slate-500 block">Deliver in 7 days • Rating 8.9/10</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-300 block">$12,400.00</span>
                          <span className="text-[9px] text-slate-400 font-semibold uppercase">Grade B</span>
                        </div>
                      </div>

                      {/* Bid 3 */}
                      <div 
                        onClick={() => setSelectedBid('nexus')}
                        className={`p-4 rounded-xl border cursor-pointer transition duration-150 flex items-center justify-between ${
                          selectedBid === 'nexus' 
                          ? 'bg-teal-950/20 border-teal-500/50' 
                          : 'bg-slate-950/40 border-slate-800/60 hover:bg-slate-950/80'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-slate-500" />
                          <div>
                            <span className="text-xs font-bold text-white">Nexus Global Trading</span>
                            <span className="text-[10px] text-slate-500 block">Deliver in 1 day • Rating 7.2/10</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-300 block">$13,200.00</span>
                          <span className="text-[9px] text-slate-400 font-semibold uppercase">Grade B-</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                    <button 
                      onClick={resetDemo} 
                      className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                    >
                      Reset State
                    </button>
                    <button 
                      onClick={() => setSelectedBid('apex')}
                      disabled={selectedBid === 'apex'}
                      className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold rounded-lg text-xs tracking-wide transition duration-150"
                    >
                      {selectedBid === 'apex' ? 'Apex Selected 🎉' : 'Auto-Select Best Bid'}
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 3: Approvals */}
              {activeTab === 'approve' && (
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                      Hierarchical Approval Chain
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Large expenditures are routed to specific departments before syncing with Odoo.</p>

                    <div className="space-y-4 mt-6">
                      {approvals.map((app, index) => (
                        <div key={app.role} className="flex items-center justify-between p-3.5 bg-slate-950/60 border border-slate-800/60 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              app.approved ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <span className="text-xs font-bold text-white block">{app.role}</span>
                              <span className="text-[10px] text-slate-500 block">{app.name}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              app.approved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                            }`}>
                              {app.approved ? 'Approved' : 'Pending Review'}
                            </span>
                            {!app.approved && (
                              <button 
                                onClick={() => handleApproveStep(index)}
                                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded text-[10px] transition duration-150"
                              >
                                Approve
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                    <button 
                      onClick={resetDemo} 
                      className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                    >
                      Reset State
                    </button>
                    
                    <span className="text-[10px] text-slate-400 flex items-center gap-1.5">
                      {approvals.every(a => a.approved) ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Ready to sync to Odoo!
                        </span>
                      ) : (
                        <span>Requires {approvals.filter(a => !a.approved).length} signatures</span>
                      )}
                    </span>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* Procurement Process Workflow */}
      <section id="process" className="py-24 px-6 max-w-5xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">The Procurement Cycle, Automated</h2>
          <p className="mt-4 text-slate-400">
            From your initial requisition to final vendor payment, VendorBridge streamlines every touchpoint.
          </p>
        </div>

        <div className="relative">
          {/* Vertical connection line for mobile, horizontal for md */}
          <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-900 md:left-1/2 md:-ml-px md:w-0.5" />
          
          <div className="space-y-12 md:space-y-16">
            
            {/* Step 1 */}
            <div className="relative flex flex-col md:flex-row items-start md:items-center">
              <div className="absolute left-2.5 md:left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-emerald-500 border-4 border-slate-950 z-10" />
              <div className="ml-10 md:ml-0 md:w-1/2 md:pr-12 md:text-right">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Step 1</span>
                <h3 className="text-xl font-bold text-white mt-1">Publish Request (RFQ)</h3>
                <p className="text-sm text-slate-400 mt-2">
                  Draft raw material specs and quantities. Matching, pre-qualified vendors are automatically alerted.
                </p>
              </div>
              <div className="hidden md:block md:w-1/2" />
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col md:flex-row items-start md:items-center">
              <div className="absolute left-2.5 md:left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-teal-500 border-4 border-slate-950 z-10" />
              <div className="hidden md:block md:w-1/2" />
              <div className="ml-10 md:ml-0 md:w-1/2 md:pl-12">
                <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">Step 2</span>
                <h3 className="text-xl font-bold text-white mt-1">Receive & Compare Bids</h3>
                <p className="text-sm text-slate-400 mt-2">
                  Vendors bid pricing, terms, and delivery. Compare them in a clean, structured table with dynamic grades.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col md:flex-row items-start md:items-center">
              <div className="absolute left-2.5 md:left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-indigo-500 border-4 border-slate-950 z-10" />
              <div className="ml-10 md:ml-0 md:w-1/2 md:pr-12 md:text-right">
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Step 3</span>
                <h3 className="text-xl font-bold text-white mt-1">Multi-Level Approvals</h3>
                <p className="text-sm text-slate-400 mt-2">
                  High-value quotes automatically route to the department head or CFO for digital signoff, ensuring budget compliance.
                </p>
              </div>
              <div className="hidden md:block md:w-1/2" />
            </div>

            {/* Step 4 */}
            <div className="relative flex flex-col md:flex-row items-start md:items-center">
              <div className="absolute left-2.5 md:left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-emerald-500 border-4 border-slate-950 z-10" />
              <div className="hidden md:block md:w-1/2" />
              <div className="ml-10 md:ml-0 md:w-1/2 md:pl-12">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Step 4</span>
                <h3 className="text-xl font-bold text-white mt-1">Auto-Sync Odoo PO</h3>
                <p className="text-sm text-slate-400 mt-2">
                  Once approved, VendorBridge automatically instructs your Odoo ERP to create the corresponding Purchase Order and invoice schemas.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" className="py-24 px-6 max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="mt-4 text-slate-400">Everything you need to know about the platform.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-slate-900/40 border border-slate-900 rounded-xl overflow-hidden">
              <button 
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-5 text-left font-bold text-white text-sm sm:text-base hover:bg-slate-900/60 transition duration-150 focus:outline-none"
              >
                <span>{faq.q}</span>
                {faqOpen[idx] ? <ChevronUp className="w-5 h-5 text-emerald-400" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
              </button>
              
              {faqOpen[idx] && (
                <div className="p-5 pt-0 text-slate-400 text-xs sm:text-sm border-t border-slate-900/60 leading-relaxed bg-slate-950/20">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner Section */}
      <section className="py-20 px-6 max-w-5xl mx-auto relative z-10">
        <div className="relative rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-600/10 to-indigo-500/10 border border-slate-800 p-8 sm:p-16 text-center overflow-hidden">
          {/* Internal Glow Ball */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/5 blur-[80px] pointer-events-none" />

          <h2 className="text-3xl sm:text-4xl font-bold text-white">Transform Your Supply Chain Today</h2>
          <p className="mt-4 text-slate-300 max-w-2xl mx-auto text-sm sm:text-base">
            Get started with VendorBridge and sync supplier communications seamlessly with your Odoo ERP. Keep transactions clean, transparent, and verified.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="/auth/register"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-bold rounded-xl shadow-lg active:scale-98 transition duration-200"
            >
              Get Started for Free
            </a>
            <a 
              href="/auth/login"
              className="w-full sm:w-auto px-8 py-4 bg-slate-950/60 border border-slate-800 text-slate-300 hover:text-white rounded-xl hover:bg-slate-950 transition duration-200"
            >
              Supplier Login
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-12 px-6 relative z-10 text-xs sm:text-sm text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Layers className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            </div>
            <span className="font-bold text-white">VendorBridge</span>
          </div>

          <div className="flex flex-wrap gap-8 justify-center">
            <a href="#features" className="hover:text-white transition duration-150">Features</a>
            <a href="#demo" className="hover:text-white transition duration-150">Interactive Demo</a>
            <a href="#process" className="hover:text-white transition duration-150">Our Process</a>
            <a href="#metrics" className="hover:text-white transition duration-150">Impact</a>
          </div>

          <div>
            &copy; 2026 VendorBridge. Odoo Hackathon Project. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
