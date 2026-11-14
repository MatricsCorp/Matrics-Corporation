import React, { useEffect, useRef, useState } from 'react';
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
  MapPin,
  ChevronRight,
  Database
} from 'lucide-react';
import type { AppTheme } from '../App';
import './how-it-works.css';

// Place an element in the shared 10 s flow animation (see how-it-works.css).
const at = (seconds: number) => ({ '--hiw-delay': `${seconds}s` }) as React.CSSProperties;
const NODE_STEP = 1.2; // seconds each participant stays lit
const EVENT_START = 5.8; // ledger steps start once the last participant's light reaches the ledger
const EVENT_STEP = 0.5; // seconds each ledger step stays lit
const LEDGER_SYNC = EVENT_START + 6 * EVENT_STEP; // closing pulse of the ledger
const STAGE_STEP = 2.5; // the 4 commerce-cycle stages take turns over the same 10 s loop

// Rail under the four participant columns (grid gap 16px): each run carries
// that participant's light from its column centre to the middle, where the
// stem drops into the ledger. Runs right of centre are mirrored.
const COL = '(100% - 48px)';
const RAIL_RUNS = [
  { landAt: `calc(${COL} / 8)`, left: `calc(${COL} / 8)`, width: `calc(50% - ${COL} / 8)`, towardsLeft: false },
  { landAt: `calc(3 * ${COL} / 8 + 16px)`, left: `calc(3 * ${COL} / 8 + 16px)`, width: `calc(50% - 3 * ${COL} / 8 - 16px)`, towardsLeft: false },
  { landAt: `calc(5 * ${COL} / 8 + 32px)`, left: '50%', width: `calc(5 * ${COL} / 8 + 32px - 50%)`, towardsLeft: true },
  { landAt: `calc(7 * ${COL} / 8 + 48px)`, left: '50%', width: `calc(7 * ${COL} / 8 + 48px - 50%)`, towardsLeft: true },
];

interface HowItWorksProps {
  theme?: AppTheme;
  onOpenEarlyAccess: () => void;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ theme = 'orange', onOpenEarlyAccess }) => {
  const isLight = theme === 'light';
  const isOrange = theme === 'orange';

  // On phones each stage shows its title and summary; the full paragraph opens on "Read more".
  const [openStages, setOpenStages] = useState<boolean[]>([false, false, false, false]);
  const toggleStage = (i: number) => setOpenStages((prev) => prev.map((v, k) => (k === i ? !v : v)));

  // Pause the animations while the section is off screen.
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => {
      el.classList.toggle('hiw-paused', !entry.isIntersecting);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

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

  // Bottom feeds; `lit` = when they light up (during Dispatch/Delivery and Payment/Reconciled)
  const feeds = [
    {
      icon: Truck,
      title: 'Transporters & Logistics Providers',
      sub: 'Regional fleets, tempo drivers, and dispatch hubs',
      points: [
        'Dispatch manifest & corridor custody logging',
        'Tamper-proof electronic Proof of Delivery (e-POD)',
        'Route milestone telemetry & dynamic transit alerts',
      ],
      feeds: 'Feeds Dispatch & Delivery Milestones',
      lit: EVENT_START + 2 * EVENT_STEP,
    },
    {
      icon: Landmark,
      title: 'Banks & Payment Partners',
      sub: 'UPI switches, NBFC lenders, and settlement escrows',
      points: [
        'Instant UPI / BBPS merchant settlement rails',
        'In-flow working capital lines underwritten by order velocity',
        'Automated dual-party ledger balancing upon receipt',
      ],
      feeds: 'Feeds Payment & Reconciliation Rails',
      lit: EVENT_START + 4 * EVENT_STEP,
    },
  ];

  // Colours for the open (panel-free) diagram. On the orange theme the
  // accents switch to white, as in the hero, because #db5319 would vanish
  // against the orange page; light and dark themes keep the orange accent.
  const accentText = isOrange ? 'text-white' : 'text-[#db5319]';
  const accentBg = isOrange ? 'bg-white' : 'bg-[#db5319]';
  const ringColour = isOrange ? 'border-white/50' : 'border-[#db5319]/50';
  const lineColour = isOrange ? 'bg-white/35' : 'bg-[#db5319]/35';
  const dividerColour = isLight ? 'border-slate-300/70' : isOrange ? 'border-white/25' : 'border-white/10';
  const strongText = isLight ? 'text-slate-900' : 'text-white';
  const softText = isLight ? 'text-slate-500' : isOrange ? 'text-white/85' : 'text-white/60';
  const faintText = isLight ? 'text-slate-400' : isOrange ? 'text-white/70' : 'text-white/40';
  const bodyText = isLight ? 'text-slate-600' : isOrange ? 'text-white/90' : 'text-white/70';
  const flowColours = (isOrange
    ? { '--hiw-accent': '#ffffff', '--hiw-glow': 'rgba(255, 244, 230, 0.9)', '--hiw-fill': '#ffffff', '--hiw-on': '#db5319', '--hiw-rest': '#ffffff', '--hiw-rest-bg': 'rgba(255, 255, 255, 0.08)' }
    : { '--hiw-accent': '#db5319', '--hiw-glow': 'rgba(219, 83, 25, 0.75)', '--hiw-fill': '#db5319', '--hiw-on': '#ffffff', '--hiw-rest': '#db5319', '--hiw-rest-bg': 'rgba(219, 83, 25, 0.1)' }
  ) as React.CSSProperties;

  const steps = [
    {
      num: '01',
      icon: FileText,
      title: 'Unified Order & Invoicing',
      summary: 'Single source of commercial truth across retail and wholesale tiers.',
      detail: 'Kirana stores place demand requests directly through verified digital channels to regional wholesalers and manufacturers. The Matrics transaction layer instantly creates a tamper-proof digital order and automated GST invoice, eliminating price ambiguity, verbal disputes, and missed allocations.',
    },
    {
      num: '02',
      icon: Truck,
      title: 'Real-Time Physical Tracking & Custody',
      summary: 'Autonomous logistics mesh coordinating regional transport fleets.',
      detail: 'Local tempo operators, logistics providers, and transport fleets receive digital load manifests. Every vehicle milestone is tracked along the corridor, culminating in an authenticated electronic Proof of Delivery (e-POD) signed at the merchant counter upon physical unloading.',
    },
    {
      num: '03',
      icon: RefreshCw,
      title: 'Automated Reconciled Settlements',
      summary: 'Zero dispute, sub-second payment clearance through banking partners.',
      detail: 'Physical delivery confirmation automatically unlocks payment clearance over UPI, BBPS, and core banking rails. Matrics reconciles accounts in real time on both sides, closing the gap between delivery and cash realization that traditionally traps working capital for 30–60 days.',
    },
    {
      num: '04',
      icon: TrendingUp,
      title: 'Data-Backed Working Capital Expansion',
      summary: 'Cashflow-driven credit lines without collateral paperwork.',
      detail: 'Continuous verified transaction velocity generates an objective credit score for kiranas and distributors. Regulated banking and NBFC partners extend instant, revolving credit lines underwritten against proven commercial throughput rather than physical collateral.',
    },
  ];

  return (
    <section ref={sectionRef} id="how-it-works" className="relative w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-16 pointer-events-auto" style={flowColours}>
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
        {/* INTERACTIVE DIAGRAM — drawn straight on the page background (no panels)  */}
        {/* ========================================================================= */}
        <div className="relative space-y-8">

          {/* Top Row: The Core Trade Chain */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className={`text-[9px] font-mono uppercase tracking-[0.25em] font-bold ${accentText}`}>
                Top Stream · Physical & Commercial Participants
              </div>
              <div className={`text-[9px] font-mono ${faintText}`}>
                Each Participant Writes Into The Central Ledger ↓
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-4 md:gap-x-4">
              {participants.map((p, idx) => (
                <div key={idx} className="relative flex flex-col items-center text-center px-1">
                  {/* Light line + arrow to the next participant */}
                  {idx < participants.length - 1 && (
                    <span aria-hidden className="pointer-events-none absolute top-7 left-[calc(50%+36px)] w-[calc(100%-56px)] h-px hidden md:block">
                      <span className={`absolute inset-0 ${lineColour}`} />
                      <span className="absolute -inset-y-px inset-x-0 overflow-hidden">
                        <span className="hiw-anim hiw-sweep absolute inset-y-0 left-0 w-1/2 rounded-full" style={at(idx * NODE_STEP)} />
                      </span>
                      <span className={`hiw-anim hiw-chevron absolute -right-2 -top-[6px] ${accentText}`} style={at(idx * NODE_STEP)}>
                        <ChevronRight size={12} strokeWidth={3} />
                      </span>
                    </span>
                  )}

                  {/* Symbol */}
                  <div className={`hiw-anim hiw-icon w-14 h-14 rounded-full border flex items-center justify-center ${ringColour}`} style={at(idx * NODE_STEP)}>
                    <p.icon size={22} />
                  </div>

                  <span className={`mt-3 text-[9px] font-mono font-bold ${accentText}`}>0{idx + 1}</span>
                  <div className={`text-xs sm:text-sm font-black uppercase tracking-tight ${strongText}`}>
                    {p.label}
                  </div>
                  <div className={`text-[10px] font-medium mt-0.5 ${softText}`}>
                    {p.sub}
                  </div>
                  <div className={`text-[10px] mt-1.5 leading-snug hidden sm:block ${faintText}`}>
                    {p.desc}
                  </div>

                  <div className={`hiw-anim hiw-arrow mt-3 flex items-center justify-center ${accentText}`} style={at(idx * NODE_STEP)}>
                    <ArrowDown size={12} className="animate-bounce" />
                  </div>

                  {/* Light dropping into the transaction layer */}
                  <span aria-hidden className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 w-[2px] h-8 overflow-hidden hidden md:block">
                    <span className={`absolute inset-y-0 left-1/2 w-px -translate-x-1/2 ${lineColour}`} />
                    <span className="hiw-anim hiw-drop relative block w-full h-3 rounded-full" style={at(idx * NODE_STEP + 0.2)} />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Central Ledger Hub: The Matrics Transaction Layer */}
          <div className="relative flex flex-col items-center">
            {/* Rail joining the four participants, each run carrying its light to the centre (tablet/desktop) */}
            <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px hidden md:block">
              <span className={`absolute top-0 h-px left-[calc((100%-48px)/8)] right-[calc((100%-48px)/8)] ${lineColour}`} />
              {RAIL_RUNS.map((run, i) => (
                <span key={i} className="absolute -top-px h-[3px] overflow-hidden" style={{ left: run.left, width: run.width, transform: run.towardsLeft ? 'scaleX(-1)' : undefined }}>
                  <span className="hiw-anim hiw-run absolute inset-y-0 left-0 w-1/2 rounded-full" style={at(i * NODE_STEP + 1.0)} />
                </span>
              ))}
              {RAIL_RUNS.map((run, i) => (
                <span key={`land-${i}`} className="hiw-anim hiw-seg absolute -top-[3px] w-2 h-2 -ml-1 rounded-full" style={{ ...at(i * NODE_STEP + 0.95), left: run.landAt }} />
              ))}
            </span>

            {/* Stem from the rail down into the ledger */}
            <span aria-hidden className="pointer-events-none relative w-px h-10 hidden md:block">
              <span className={`absolute inset-0 ${lineColour}`} />
              <span className="absolute -inset-x-px inset-y-0 overflow-hidden">
                {participants.map((_, i) => (
                  <span key={i} className="hiw-anim hiw-stem absolute inset-x-0 top-0 h-4 rounded-full" style={at(i * NODE_STEP + 1.45)} />
                ))}
              </span>
            </span>

            {/* Ledger symbol */}
            <div className="relative">
              <div className={`hiw-anim hiw-icon w-16 h-16 rounded-full border-2 flex items-center justify-center ${ringColour}`} style={at(LEDGER_SYNC)}>
                <Database size={26} />
              </div>
              {participants.map((_, i) => (
                <span key={i} aria-hidden className="hiw-anim hiw-tick pointer-events-none absolute inset-0 rounded-full" style={at(i * NODE_STEP + 1.85)} />
              ))}
              <span aria-hidden className="hiw-anim hiw-halo pointer-events-none absolute inset-0 rounded-full" style={at(LEDGER_SYNC)} />
            </div>

            {/* Title */}
            <div className={`mt-4 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 ${strongText}`}>
              <div className={`w-2.5 h-2.5 rounded-full animate-ping ${accentBg}`} />
              <span className="text-sm sm:text-base font-black uppercase tracking-wider">
                Matrics Transaction Layer
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                isLight ? 'bg-white text-slate-700' : 'bg-black/40 text-amber-200'
              }`}>
                UNIFIED COMMERCIAL BAND
              </span>
            </div>
            <div className={`mt-1.5 text-[10px] font-mono font-semibold tracking-wider ${accentText}`}>
              SYNCHRONIZED EVENT LINEAGE
            </div>

            {/* Event timeline: top-to-bottom on phones, left-to-right on large screens */}
            <div className="relative w-full max-w-[260px] mx-auto lg:max-w-none mt-8 grid grid-cols-1 lg:grid-cols-6 gap-y-5 lg:gap-x-3">
              {transactionEvents.map((ev, i) => {
                const last = i === transactionEvents.length - 1;
                const when = EVENT_START + i * EVENT_STEP;
                return (
                  <div key={i} className="relative flex lg:flex-col items-start lg:items-center gap-3 lg:gap-0 text-left lg:text-center">
                    {/* Line to the next step, with its light */}
                    {!last && (
                      <span aria-hidden className="pointer-events-none absolute left-[5px] top-[6px] w-px h-[calc(100%+20px)] lg:left-1/2 lg:top-[5px] lg:h-px lg:w-[calc(100%+12px)]">
                        <span className={`absolute inset-0 ${lineColour}`} />
                        <span className="absolute -inset-x-px inset-y-0 overflow-hidden lg:hidden">
                          <span className="hiw-anim hiw-vsweep-fast absolute inset-x-0 top-0 h-1/2 rounded-full" style={at(when)} />
                        </span>
                        <span className="absolute inset-x-0 -inset-y-px overflow-hidden hidden lg:block">
                          <span className="hiw-anim hiw-sweep-fast absolute inset-y-0 left-0 w-1/2 rounded-full" style={at(when)} />
                        </span>
                      </span>
                    )}

                    <span aria-hidden className={`hiw-anim hiw-dot relative z-[1] mt-[1px] lg:mt-0 w-[11px] h-[11px] shrink-0 rounded-full border-2 ${ringColour}`} style={at(when)} />

                    <div className="lg:mt-3">
                      <div className={`text-[9px] font-mono font-bold ${accentText}`}>
                        STEP {ev.step}
                      </div>
                      <div className={`hiw-anim hiw-text text-xs font-black uppercase tracking-tight mt-0.5 ${strongText}`} style={at(when)}>
                        {ev.name}
                      </div>
                      <div className={`text-[9px] mt-1 ${softText}`}>
                        {ev.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Row: Transporters + Banks and Payment Partners Feeding from Below */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className={`text-[9px] font-mono uppercase tracking-[0.25em] font-bold ${accentText}`}>
                Bottom Feed · Logistics & Financial Rail Inputs
              </div>
              <div className={`text-[9px] font-mono ${faintText}`}>
                Feeding The Band From Below ↑
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
              {feeds.map((f, i) => (
                <div key={i} className="flex flex-col justify-between">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`hiw-anim hiw-icon w-11 h-11 shrink-0 rounded-full border flex items-center justify-center ${ringColour}`} style={at(f.lit)}>
                      <f.icon size={18} />
                    </div>
                    <div>
                      <div className={`text-sm font-black uppercase tracking-tight ${strongText}`}>
                        {f.title}
                      </div>
                      <div className={`text-[10px] ${softText}`}>
                        {f.sub}
                      </div>
                    </div>
                  </div>

                  <div className={`text-xs space-y-1.5 pt-2 border-t ${dividerColour} ${bodyText}`}>
                    {f.points.map((pt) => (
                      <div key={pt} className="flex items-center space-x-2">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${accentBg}`} />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>

                  <div className={`hiw-anim hiw-arrow mt-3 pt-2 flex items-center justify-center ${accentText}`} style={at(f.lit)}>
                    <ArrowUp size={12} className="animate-bounce" />
                    <span className="text-[9px] font-mono font-bold ml-1 uppercase">{f.feeds}</span>
                  </div>
                </div>
              ))}
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

          {/* Stage rail 01 → 04: each marker lights with its card, and the light runs on to the next */}
          <div className="relative grid grid-cols-4 max-w-md mx-auto">
            {steps.map((s, idx) => (
              <div key={idx} className="relative flex justify-center">
                {idx < steps.length - 1 && (
                  <span aria-hidden className="pointer-events-none absolute left-1/2 top-[14px] h-px w-full">
                    <span className={`absolute inset-0 ${lineColour}`} />
                    <span className="absolute inset-x-0 -inset-y-px overflow-hidden">
                      <span className="hiw-anim hiw-stage-sweep absolute inset-y-0 left-0 w-1/2 rounded-full" style={at(idx * STAGE_STEP)} />
                    </span>
                  </span>
                )}
                <span className={`hiw-anim hiw-stage-ring relative z-[1] w-7 h-7 rounded-full border flex items-center justify-center text-[9px] font-mono font-bold ${ringColour}`} style={at(idx * STAGE_STEP)}>
                  {s.num}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className={`relative p-6 sm:p-8 rounded-xl border flex flex-col justify-between transition-all duration-300 group ${
                  isLight
                    ? 'bg-white border-slate-200/90 hover:border-[#db5319]/40 shadow-md hover:shadow-lg'
                    : isOrange
                      ? 'bg-stone-950/70 border-white/10 hover:border-[#db5319]/60 shadow-xl'
                      : 'bg-zinc-950/70 border-white/10 hover:border-[#db5319]/60 shadow-xl'
                }`}
              >
                <span aria-hidden className="hiw-anim hiw-stage-glow pointer-events-none absolute inset-0 rounded-xl" style={at(idx * STAGE_STEP)} />
                <div>
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <span className="hiw-anim hiw-stage-icon w-10 h-10 shrink-0 rounded-full border border-[#db5319]/40 flex items-center justify-center" style={at(idx * STAGE_STEP)}>
                        <s.icon size={18} />
                      </span>
                      <span className="text-3xl sm:text-4xl font-black italic font-mono text-[#db5319]">
                        {s.num}.
                      </span>
                    </div>
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

                  <p id={`stage-detail-${idx}`} className={`${openStages[idx] ? 'block' : 'hidden'} md:block text-xs sm:text-sm leading-relaxed ${
                    isLight ? 'text-slate-600' : 'text-white/75'
                  }`}>
                    {s.detail}
                  </p>
                  <button
                    type="button"
                    onClick={() => toggleStage(idx)}
                    aria-expanded={openStages[idx]}
                    aria-controls={`stage-detail-${idx}`}
                    className="md:hidden mt-2 text-[10px] font-black uppercase tracking-widest text-[#db5319]"
                  >
                    {openStages[idx] ? 'Show less ↑' : 'Read more ↓'}
                  </button>
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
