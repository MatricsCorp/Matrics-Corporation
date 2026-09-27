import React from 'react';
import { 
  Factory, 
  Building2, 
  Store, 
  Users, 
  Truck, 
  Landmark, 
  ArrowRight, 
  ArrowDown, 
  ArrowUp,
  CheckCircle2, 
  ShieldCheck, 
  Layers,
  FileText,
  CreditCard,
  RefreshCw,
  Box,
  TrendingUp,
  MapPin
} from 'lucide-react';
import type { AppTheme } from '../App';

interface HowItWorksProps {
  theme?: AppTheme;
  onOpenEarlyAccess: () => void;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ theme = 'orange', onOpenEarlyAccess }) => {
  const isLight = theme === 'light';
  const isOrange = theme === 'orange';

  const participants = [
    { label: 'Manufacturer', icon: Factory, sub: 'FMCG & Industrial Producers', desc: 'Direct catalogue sync & bulk allocation' },
    { label: 'Wholesaler', icon: Building2, sub: 'Regional Corridor Hubs', desc: 'Real-time inventory & line-item dispatch' },
    { label: 'Kirana Store', icon: Store, sub: 'Local Retail Counters', desc: 'Demand aggregation & doorstep replenishment' },
    { label: 'Consumer', icon: Users, sub: 'Household End Demand', desc: 'Consistent supply & transparent retail pricing' },
  ];

  const transactionEvents = [
    { name: 'Order', step: '01', desc: 'Digital PO generated' },
    { name: 'Invoice', step: '02', desc: 'GST e-bill validated' },
    { name: 'Dispatch', step: '03', desc: 'Custody manifest issued' },
    { name: 'Delivery', step: '04', desc: 'e-POD authenticated' },
    { name: 'Payment', step: '05', desc: 'Instant UPI/bank rail' },
    { name: 'Reconciled', step: '06', desc: 'Dual ledger balanced' },
  ];

  const steps = [
    {
      num: '01',
      title: 'Unified Order & Invoicing',
      summary: 'Single source of commercial truth across retail and wholesale tiers.',
      detail: 'Kirana stores place demand requests directly through verified digital channels to regional wholesalers and manufacturers. The Matrics transaction layer instantly creates a tamper-proof digital order and automated GST invoice, eliminating price ambiguity, verbal disputes, and missed allocations.',
    },
    {
      num: '02',
      title: 'Real-Time Physical Tracking & Custody',
      summary: 'Autonomous logistics mesh coordinating regional transport fleets.',
      detail: 'Local tempo operators, logistics providers, and transport fleets receive digital load manifests. Every vehicle milestone is tracked along the corridor, culminating in an authenticated electronic Proof of Delivery (e-POD) signed at the merchant counter upon physical unloading.',
    },
    {
      num: '03',
      title: 'Automated Reconciled Settlements',
      summary: 'Zero dispute, sub-second payment clearance through banking partners.',
      detail: 'Physical delivery confirmation automatically unlocks payment clearance over UPI, BBPS, and core banking rails. Matrics reconciles accounts in real time on both sides, closing the gap between delivery and cash realization that traditionally traps working capital for 30–60 days.',
    },
    {
      num: '04',
      title: 'Data-Backed Working Capital Expansion',
      summary: 'Cashflow-driven credit lines without collateral paperwork.',
      detail: 'Continuous verified transaction velocity generates an objective credit score for kiranas and distributors. Regulated banking and NBFC partners extend instant, revolving credit lines underwritten against proven commercial throughput rather than physical collateral.',
    },
  ];

  return (
    <section id="how-it-works" className="relative w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-16 pointer-events-auto">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="text-[10px] sm:text-xs font-mono font-black uppercase tracking-[0.4em] text-[#db5319]">
            Architecture & Flow
          </div>
          <h2 className={`text-3xl sm:text-5xl font-black italic uppercase tracking-tighter leading-none ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            How Matrics Works
          </h2>
          <p className={`text-sm sm:text-base leading-relaxed ${
            isLight ? 'text-slate-600' : isOrange ? 'text-white/85' : 'text-white/70'
          }`}>
            A unified commercial protocol replacing fragmented paper challans, phone calls, and delayed credit cycles with one synchronized ledger for India&apos;s trade.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE DIAGRAM */}
        {/* ========================================================================= */}
        <div className={`p-6 sm:p-10 rounded-2xl border transition-all duration-300 shadow-2xl relative overflow-hidden ${
          isLight
            ? 'bg-white/95 border-slate-200/90 shadow-slate-200/60'
            : isOrange
              ? 'bg-stone-950/80 backdrop-blur-xl border-white/15 shadow-2xl text-white'
              : 'bg-zinc-950/80 backdrop-blur-xl border-white/10 text-white'
        }`}>
          {/* Subtle grid backdrop */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.03]" 
            style={{ backgroundImage: 'radial-gradient(#db5319 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          />

          <div className="relative z-10 space-y-8">
            
            {/* Top Row: The Core Trade Chain */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#db5319] font-bold">
                  Top Stream · Physical & Commercial Participants
                </div>
                <div className={`text-[9px] font-mono ${isLight ? 'text-slate-400' : 'text-white/40'}`}>
                  Each Participant Writes Into The Central Ledger ↓
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {participants.map((p, idx) => (
                  <div 
                    key={idx}
                    className={`p-4 rounded-xl border flex flex-col justify-between transition-all group ${
                      isLight 
                        ? 'bg-slate-50/80 border-slate-200/80 hover:bg-white hover:border-[#db5319]/40' 
                        : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-[#db5319]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 rounded-lg bg-[#db5319]/10 text-[#db5319]">
                        <p.icon size={16} />
                      </div>
                      <span className="text-[9px] font-mono text-[#db5319] font-bold">0{idx + 1}</span>
                    </div>
                    <div>
                      <div className={`text-xs sm:text-sm font-black uppercase tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {p.label}
                      </div>
                      <div className={`text-[10px] font-medium mt-0.5 ${isLight ? 'text-slate-500' : 'text-white/60'}`}>
                        {p.sub}
                      </div>
                      <div className={`text-[10px] mt-1.5 leading-snug hidden sm:block ${isLight ? 'text-slate-400' : 'text-white/40'}`}>
                        {p.desc}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-dashed border-white/10 flex items-center justify-center text-[#db5319]">
                      <ArrowDown size={12} className="animate-bounce" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Central Band: The Matrics Transaction Layer */}
            <div className={`relative p-5 sm:p-7 rounded-xl border-2 transition-all ${
              isLight
                ? 'bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border-[#db5319]/30 text-slate-900 shadow-inner'
                : 'bg-gradient-to-r from-[#db5319]/15 via-[#db5319]/25 to-[#db5319]/15 border-[#db5319]/60 text-white shadow-[0_0_40px_rgba(219,83,25,0.15)]'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#db5319]/30">
                <div className="flex items-center space-x-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#db5319] animate-ping" />
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wider">
                    Matrics Transaction Layer
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                    isLight ? 'bg-white text-slate-700' : 'bg-black/40 text-amber-200'
                  }`}>
                    UNIFIED COMMERCIAL BAND
                  </span>
                </div>
                <div className="text-[10px] font-mono font-semibold text-[#db5319]">
                  SYNCHRONIZED EVENT LINEAGE
                </div>
              </div>

              {/* Event Chain */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
                {transactionEvents.map((ev, i) => (
                  <div 
                    key={i}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      isLight
                        ? 'bg-white/95 border-orange-200/80 shadow-sm'
                        : 'bg-black/50 border-white/10 hover:border-[#db5319]'
                    }`}
                  >
                    <div className="text-[9px] font-mono text-[#db5319] font-bold">
                      STEP {ev.step}
                    </div>
                    <div className={`text-xs font-black uppercase tracking-tight mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {ev.name}
                    </div>
                    <div className={`text-[9px] mt-1 ${isLight ? 'text-slate-500' : 'text-white/60'}`}>
                      {ev.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Row: Transporters + Banks and Payment Partners Feeding from Below */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#db5319] font-bold">
                  Bottom Feed · Logistics & Financial Rail Inputs
                </div>
                <div className={`text-[9px] font-mono ${isLight ? 'text-slate-400' : 'text-white/40'}`}>
                  Feeding The Band From Below ↑
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Transporters & Logistics */}
                <div className={`p-4 sm:p-5 rounded-xl border flex flex-col justify-between ${
                  isLight 
                    ? 'bg-slate-50/80 border-slate-200/80' 
                    : 'bg-white/[0.03] border-white/10'
                }`}>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2.5 rounded-lg bg-[#db5319]/10 text-[#db5319]">
                      <Truck size={18} />
                    </div>
                    <div>
                      <div className={`text-sm font-black uppercase tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        Transporters & Logistics Providers
                      </div>
                      <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-white/60'}`}>
                        Regional fleets, tempo drivers, and dispatch hubs
                      </div>
                    </div>
                  </div>

                  <div className={`text-xs space-y-1.5 pt-2 border-t border-white/10 ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
                    <div className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#db5319]" />
                      <span>Dispatch manifest & corridor custody logging</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#db5319]" />
                      <span>Tamper-proof electronic Proof of Delivery (e-POD)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#db5319]" />
                      <span>Route milestone telemetry & dynamic transit alerts</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 flex items-center justify-center text-[#db5319]">
                    <ArrowUp size={12} className="animate-bounce" />
                    <span className="text-[9px] font-mono font-bold ml-1 uppercase">Feeds Dispatch & Delivery Milestones</span>
                  </div>
                </div>

                {/* Banks & Payment Partners */}
                <div className={`p-4 sm:p-5 rounded-xl border flex flex-col justify-between ${
                  isLight 
                    ? 'bg-slate-50/80 border-slate-200/80' 
                    : 'bg-white/[0.03] border-white/10'
                }`}>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2.5 rounded-lg bg-[#db5319]/10 text-[#db5319]">
                      <Landmark size={18} />
                    </div>
                    <div>
                      <div className={`text-sm font-black uppercase tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        Banks & Payment Partners
                      </div>
                      <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-white/60'}`}>
                        UPI switches, NBFC lenders, and settlement escrows
                      </div>
                    </div>
                  </div>

                  <div className={`text-xs space-y-1.5 pt-2 border-t border-white/10 ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
                    <div className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#db5319]" />
                      <span>Instant UPI / BBPS merchant settlement rails</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#db5319]" />
                      <span>In-flow working capital lines underwritten by order velocity</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#db5319]" />
                      <span>Automated dual-party ledger balancing upon receipt</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 flex items-center justify-center text-[#db5319]">
                    <ArrowUp size={12} className="animate-bounce" />
                    <span className="text-[9px] font-mono font-bold ml-1 uppercase">Feeds Payment & Reconciliation Rails</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* THE FOUR NUMBERED STEPS */}
        {/* ========================================================================= */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className={`text-2xl sm:text-3xl font-black italic uppercase tracking-tight ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              The 4 Steps of the Matrics Commerce Cycle
            </h3>
            <p className={`text-xs sm:text-sm mt-1 max-w-xl mx-auto ${
              isLight ? 'text-slate-500' : 'text-white/60'
            }`}>
              How order, movement, verification, and liquidity occur seamlessly in four connected stages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className={`p-6 sm:p-8 rounded-xl border flex flex-col justify-between transition-all duration-300 group ${
                  isLight
                    ? 'bg-white border-slate-200/90 hover:border-[#db5319]/40 shadow-md hover:shadow-lg'
                    : isOrange
                      ? 'bg-stone-950/70 border-white/10 hover:border-[#db5319]/60 shadow-xl'
                      : 'bg-zinc-950/70 border-white/10 hover:border-[#db5319]/60 shadow-xl'
                }`}
              >
                <div>
                  <div className="flex items-baseline justify-between mb-4 pb-3 border-b border-white/10">
                    <span className="text-3xl sm:text-4xl font-black italic font-mono text-[#db5319]">
                      {s.num}.
                    </span>
                    <span className={`text-[10px] font-mono uppercase tracking-widest ${
                      isLight ? 'text-slate-400' : 'text-white/40'
                    }`}>
                      Stage {s.num} of 04
                    </span>
                  </div>

                  <h4 className={`text-lg sm:text-xl font-black uppercase tracking-tight mb-2 ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    {s.title}
                  </h4>

                  <div className="text-xs font-semibold text-[#db5319] mb-3">
                    {s.summary}
                  </div>

                  <p className={`text-xs sm:text-sm leading-relaxed ${
                    isLight ? 'text-slate-600' : 'text-white/75'
                  }`}>
                    {s.detail}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-[10px] font-mono">
                    <CheckCircle2 size={12} className="text-[#db5319]" />
                    <span className={isLight ? 'text-slate-500' : 'text-white/60'}>Cryptographically Validated</span>
                  </div>
                  <button
                    onClick={onOpenEarlyAccess}
                    className="text-[10px] font-black uppercase tracking-widest text-[#db5319] hover:underline"
                  >
                    Join Pilot →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
