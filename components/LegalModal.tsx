import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';
import type { AppTheme } from '../App';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
  theme?: AppTheme;
}

const LegalModal: React.FC<LegalModalProps> = ({ type, onClose, theme = 'orange' }) => {
  if (!type) return null;

  const isLight = theme === 'light';
  const isOrange = theme === 'orange';

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`relative w-full max-w-2xl max-h-[85vh] rounded-2xl flex flex-col p-6 sm:p-8 shadow-2xl border ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900'
            : isOrange
              ? 'bg-stone-950 border-amber-500/25 text-white'
              : 'bg-zinc-950 border-white/10 text-white'
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-5 right-5 p-2 rounded-full transition-colors ${
            isLight 
              ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100' 
              : 'text-white/50 hover:text-white hover:bg-white/10'
          }`}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-white/10">
          {type === 'privacy' ? (
            <ShieldCheck size={20} className="text-[#db5319]" />
          ) : (
            <FileText size={20} className="text-[#db5319]" />
          )}
          <h2 className="text-xl sm:text-2xl font-black italic uppercase tracking-tight">
            {type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
          </h2>
        </div>

        <div className={`flex-1 overflow-y-auto pr-2 space-y-4 text-xs sm:text-sm leading-relaxed ${
          isLight ? 'text-slate-600' : 'text-white/80'
        }`}>
          {type === 'privacy' ? (
            <>
              <p className="font-semibold text-[#db5319]">
                Matrics Advanced Dynamics Technologies Private Limited · Effective Date: September 2026
              </p>
              <div>
                <h3 className={`font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>1. Commitment to Enterprise Privacy</h3>
                <p>
                  Matrics Advanced Dynamics Technologies Private Limited (&quot;Matrics&quot;, &quot;we&quot;, &quot;our&quot;) is committed to protecting the proprietary commercial data, order records, and identities of manufacturers, distributors, transporters, and retailers participating in the Matrics transaction corridor.
                </p>
              </div>
              <div>
                <h3 className={`font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>2. Commercial Ledger & Data Processing</h3>
                <p>
                  Transaction events recorded across the Matrics layer (orders, invoices, dispatch confirmations, and delivery proofs) are cryptographically validated to maintain tamper-proof commercial state. Personal identifiers are never sold, rented, or distributed to third-party ad networks.
                </p>
              </div>
              <div>
                <h3 className={`font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>3. Financial Partner Integrations</h3>
                <p>
                  When merchants opt into embedded trade finance or invoice discounting through authorized partner banks and NBFCs, data sharing occurs strictly under RBI-compliant consent frameworks.
                </p>
              </div>
              <div>
                <h3 className={`font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>4. Contact & Regulatory Enquiries</h3>
                <p>
                  For questions regarding data governance, write to our Data Protection Officer at{' '}
                  <span className="font-mono text-[#db5319]">contact@matricstarang.com</span>, or by mail at Level 4, Magneto Offizo, Labhandi, G.E. Road, Raipur, Chhattisgarh 492001, India.
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="font-semibold text-[#db5319]">
                Matrics Advanced Dynamics Technologies Private Limited · Commercial Terms
              </p>
              <div>
                <h3 className={`font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>1. Pilot Corridor Protocol Terms</h3>
                <p>
                  Participation in the Matrics Chhattisgarh Commercial Corridor Pilot is governed by these Terms. Authorized merchants, distributors, and logistics providers agree to execute trade entries through genuine commercial transactions.
                </p>
              </div>
              <div>
                <h3 className={`font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>2. Illustrative Information & Pilot Scope</h3>
                <p>
                  Information displayed as &quot;ILLUSTRATIVE&quot;, &quot;DEMO DATA&quot;, or &quot;SAMPLE EVENT STREAM&quot; does not represent audited production financial figures or public investment solicitations. No security, equity token, or speculative financial instrument is offered through this website.
                </p>
              </div>
              <div>
                <h3 className={`font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>3. Intellectual Property</h3>
                <p>
                  All proprietary protocols, software architectures, UI components, and the Matrics transaction mesh specifications are the exclusive intellectual property of Matrics Advanced Dynamics Technologies Private Limited.
                </p>
              </div>
              <div>
                <h3 className={`font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>4. Governing Law & Jurisdiction</h3>
                <p>
                  These terms are governed by the laws of India. Any disputes arising hereunder shall be subject to the exclusive jurisdiction of the competent courts in Raipur, Chhattisgarh.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="pt-4 mt-2 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest ${
              isOrange 
                ? 'bg-[#db5319] text-white hover:bg-[#c24610]'
                : isLight
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'bg-white text-black hover:bg-slate-200'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
