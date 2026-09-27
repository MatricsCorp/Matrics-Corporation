import React, { useState } from 'react';
import { 
  Building, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle, 
  Layers, 
  TrendingUp, 
  Landmark, 
  BarChart2, 
  Mail, 
  Briefcase, 
  Lock 
} from 'lucide-react';
import type { AppTheme } from '../App';

interface InvestorsViewProps {
  theme?: AppTheme;
}

const InvestorsView: React.FC<InvestorsViewProps> = ({ theme = 'orange' }) => {
  const isLight = theme === 'light';
  const isOrange = theme === 'orange';

  const [formData, setFormData] = useState({
    name: '',
    organisation: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const pillars = [
    {
      title: 'Massive Domestic Commerce Base',
      desc: "India's $800B+ retail and wholesale supply chain runs overwhelmingly on offline paper challans, fragmented tempo trucking, and manual ledger reconciliation. Matrics establishes the core digital transaction backbone for this volume.",
      metric: '$800B+ Market TAM',
      metricNote: 'ILLUSTRATIVE MARKET SIZE',
    },
    {
      title: 'Deep Structural Corridor Moat',
      desc: 'By synchronizing the four critical commercial participants — manufacturers, wholesalers, kirana store owners, and local transporters — Matrics creates dense, self-reinforcing network effects across contiguous industrial corridors.',
      metric: '4-Way Synchrony',
      metricNote: 'PARTICIPANT NETWORK LOCK',
    },
    {
      title: 'Cashflow-Driven Unit Economics',
      desc: 'Sustainable commercial software monetization through automated transaction verification micro-fees, embedded trade finance syndication spreads with banking partners, and logistics route coordination efficiency.',
      metric: 'Corridor Saturation',
      metricNote: 'HIGH-DENSITY MARGINS',
    },
    {
      title: 'Pragmatic Infrastructure vs Speculation',
      desc: 'Zero speculative tokenomics, zero inflated vanity growth. Engineered strictly as production B2B enterprise software and cryptographic ledger infrastructure for real Bharat commerce.',
      metric: '100% Real Trade',
      metricNote: 'VERIFIABLE COMMERCE UTILITY',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.organisation.trim()) {
      setError('Please provide your name, organisation, and official email.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <div className="relative w-full space-y-16 py-8 lg:py-12 pointer-events-auto">
      
      {/* Header / Intro */}
      <section className="px-4 sm:px-8 lg:px-16 text-center max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-center space-x-2 text-[10px] font-mono uppercase tracking-[0.3em] text-[#db5319] font-black">
          <Landmark size={14} className="text-[#db5319]" />
          <span>Institutional & Strategic Capital</span>
        </div>

        <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-black italic uppercase tracking-tighter leading-[0.95] ${
          isLight ? 'text-slate-900' : 'text-white'
        }`}>
          Investor Enquiries
        </h1>

        <p className={`text-lg sm:text-2xl font-bold uppercase tracking-tight max-w-3xl mx-auto ${
          isLight ? 'text-slate-700' : isOrange ? 'text-white/90' : 'text-white/80'
        }`}>
          Building the verifiable transaction layer and logistics nervous system for Indian domestic commerce.
        </p>

        <p className={`text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed ${
          isLight ? 'text-slate-500' : 'text-white/70'
        }`}>
          Matrics Corporation is partnering with institutional venture funds, family offices, and strategic trade finance leaders to expand our central commercial corridors.
        </p>
      </section>

      {/* Strategic Value Pillars */}
      <section className="px-4 sm:px-8 lg:px-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className={`p-6 sm:p-8 rounded-xl border flex flex-col justify-between transition-all ${
                isLight
                  ? 'bg-white border-slate-200/90 shadow-md'
                  : isOrange
                    ? 'bg-stone-950/75 border-white/15 text-white shadow-xl'
                    : 'bg-zinc-950/80 border-white/10 text-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                  <span className="text-[10px] font-mono text-[#db5319] font-bold uppercase">
                    Core Thesis 0{idx + 1}
                  </span>
                  <span className="text-[9px] font-mono opacity-50">
                    {p.metricNote}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight mb-2">
                  {p.title}
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-white/75'}`}>
                  {p.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-base sm:text-lg font-black italic text-[#db5319]">
                  {p.metric}
                </span>
                <span className="text-[10px] font-mono opacity-40 uppercase">
                  Structural Moat
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Corridor Unit Economics Summary */}
      <section className="px-4 sm:px-8 lg:px-16 max-w-6xl mx-auto">
        <div className={`p-6 sm:p-8 rounded-xl border ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/10 text-white'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#db5319] font-bold">
                Operating Architecture
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight mt-0.5">
                The Corridor Density Playbook
              </h3>
            </div>
            <div className="text-[10px] font-mono px-3 py-1 rounded bg-[#db5319]/10 text-[#db5319] border border-[#db5319]/20 self-start">
              ILLUSTRATIVE ARCHITECTURE
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono uppercase font-bold opacity-60">1. Spatial Density First</div>
              <p className={isLight ? 'text-slate-600' : 'text-white/70'}>
                We do not disperse capital across 50 disconnected cities. We saturate single 60km trading corridors (e.g. Raipur–Durg), capturing the complete distributor-to-retail supply loop.
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono uppercase font-bold opacity-60">2. Low Acquisition Friction</div>
              <p className={isLight ? 'text-slate-600' : 'text-white/70'}>
                Wholesalers bring their existing 50–200 kirana stores into the Matrics layer to resolve their own payment collection delays, generating organic merchant acquisition.
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono uppercase font-bold opacity-60">3. Non-Dilutive Capital Velocity</div>
              <p className={isLight ? 'text-slate-600' : 'text-white/70'}>
                Working capital lines are funded balance-sheet-offloaded by licensed banking and NBFC partners under automated escrow structures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section className="px-4 sm:px-8 lg:px-16 max-w-4xl mx-auto pb-12">
        <div className={`p-8 sm:p-10 rounded-2xl border transition-all shadow-2xl relative ${
          isLight
            ? 'bg-white border-slate-200'
            : isOrange
              ? 'bg-stone-950/85 border-amber-500/30 text-white'
              : 'bg-zinc-950 border-white/15 text-white'
        }`}>
          <div className="text-center space-y-2 mb-6">
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#db5319] font-black">
              Direct Inbound Channel
            </div>
            <h2 className="text-2xl sm:text-4xl font-black italic uppercase tracking-tight">
              Submit Investor Enquiry
            </h2>
            <p className={`text-xs sm:text-sm max-w-lg mx-auto ${isLight ? 'text-slate-500' : 'text-white/70'}`}>
              Connect directly with our founding leadership and commercial development team. We respond to accredited investor inquiries within one business day.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-8 space-y-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6">
              <CheckCircle size={36} className="mx-auto text-emerald-400" />
              <h3 className="text-xl font-black uppercase">Enquiry Dispatched</h3>
              <p className="text-xs max-w-sm mx-auto opacity-80 leading-relaxed">
                Thank you, <span className="font-bold">{formData.name}</span> of <span className="font-bold">{formData.organisation}</span>. Our investor relations desk will follow up at <span className="font-mono">{formData.email}</span> with our corridor overview memorandum.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-3 px-6 py-2 rounded-lg text-xs font-black uppercase tracking-wider bg-white text-black"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-[10px] uppercase font-bold tracking-widest mb-1.5 ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Singhania"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-lg text-xs font-medium outline-none transition-all border ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#db5319]'
                        : 'bg-white/5 border-white/15 text-white focus:border-[#db5319]'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-[10px] uppercase font-bold tracking-widest mb-1.5 ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
                    Organisation / Fund / Firm *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Peak Horizon Ventures"
                    value={formData.organisation}
                    onChange={(e) => setFormData({ ...formData, organisation: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-lg text-xs font-medium outline-none transition-all border ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#db5319]'
                        : 'bg-white/5 border-white/15 text-white focus:border-[#db5319]'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-[10px] uppercase font-bold tracking-widest mb-1.5 ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
                    Institutional Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="vikram@fund.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-lg text-xs font-medium outline-none transition-all border ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#db5319]'
                        : 'bg-white/5 border-white/15 text-white focus:border-[#db5319]'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-[10px] uppercase font-bold tracking-widest mb-1.5 ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98200 12345"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-lg text-xs font-mono font-medium outline-none transition-all border ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#db5319]'
                        : 'bg-white/5 border-white/15 text-white focus:border-[#db5319]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-[10px] uppercase font-bold tracking-widest mb-1.5 ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
                  Message / Investment Thesis Focus
                </label>
                <textarea
                  rows={4}
                  placeholder="Outline your fund's investment mandate, strategic synergies, or information requested regarding the Chhattisgarh pilot corridor..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-lg text-xs font-medium outline-none transition-all border resize-none ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#db5319]'
                      : 'bg-white/5 border-white/15 text-white focus:border-[#db5319]'
                  }`}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className={`w-full py-3.5 rounded-lg text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-2 shadow-lg ${
                    isOrange
                      ? 'bg-white text-[#d85104] hover:bg-white/95'
                      : isLight
                        ? 'bg-[#db5319] text-white hover:bg-[#c24610]'
                        : 'bg-white text-black hover:bg-slate-100'
                  }`}
                >
                  <span>Transmit Investor Enquiry</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              <div className="text-center pt-2">
                <span className="text-[10px] font-mono opacity-50">
                  CONFIDENTIAL INQUIRY · DIRECT ACCESS TO FOUNDING LEADERSHIP
                </span>
              </div>
            </form>
          )}
        </div>
      </section>

    </div>
  );
};

export default InvestorsView;
