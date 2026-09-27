import React from 'react';
import { Mail, MapPin, Building, ShieldCheck } from 'lucide-react';
import type { AppTheme } from '../App';

interface FooterProps {
  theme?: AppTheme;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenEarlyAccess: () => void;
}

const Footer: React.FC<FooterProps> = ({ 
  theme = 'orange', 
  onOpenPrivacy, 
  onOpenTerms,
  onOpenEarlyAccess
}) => {
  const isLight = theme === 'light';
  const isOrange = theme === 'orange';

  return (
    <footer className={`w-full py-8 px-6 lg:px-16 mt-auto shrink-0 z-40 border-t pointer-events-auto transition-colors duration-500 ${
      isLight 
        ? 'bg-slate-50/90 border-slate-200 text-slate-700' 
        : isOrange
          ? 'bg-stone-950/85 border-white/10 text-white/90 backdrop-blur-xl'
          : 'bg-[#050302]/90 border-white/10 text-white/80 backdrop-blur-xl'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-col space-y-6">
        {/* Top Row: Corridor Status Badge & Direct Contact */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className={`text-[10px] font-mono font-black uppercase tracking-[0.3em] ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                PILOT CORRIDOR · RAIPUR, CHHATTISGARH
              </span>
            </div>
            <p className={`text-xs mt-1 font-medium ${isLight ? 'text-slate-500' : 'text-white/60'}`}>
              Central India High-Velocity Commercial Corridor · Unified Kirana & Wholesale Settlement
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <button
              onClick={onOpenEarlyAccess}
              className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                isOrange
                  ? 'bg-white text-[#d85104] hover:bg-white/90 shadow-md'
                  : isLight
                    ? 'bg-[#db5319] text-white hover:bg-[#c24610]'
                    : 'bg-white text-black hover:bg-slate-200'
              }`}
            >
              Get Early Access
            </button>
            <a
              href="mailto:contact@matricstarang.com"
              className={`flex items-center space-x-1.5 transition-colors font-mono ${
                isLight ? 'hover:text-[#db5319]' : 'hover:text-[#db5319]'
              }`}
            >
              <Mail size={13} className="text-[#db5319]" />
              <span>contact@matricstarang.com</span>
            </a>
          </div>
        </div>

        {/* Middle Row: Legal Entity & Registered Office */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
          <div className="md:col-span-6 space-y-2">
            <div className="flex items-center space-x-2">
              <Building size={14} className="text-[#db5319] shrink-0" />
              <span className={`font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Matrics Advanced Dynamics Technologies Private Limited
              </span>
            </div>
            <div className={`flex items-start space-x-2 leading-relaxed ${isLight ? 'text-slate-500' : 'text-white/60'}`}>
              <MapPin size={14} className="text-[#db5319] shrink-0 mt-0.5" />
              <span>
                Registered Office: Level 4, Magneto Offizo, Labhandi, G.E. Road, Raipur, Chhattisgarh 492001, India
              </span>
            </div>
          </div>

          <div className="md:col-span-6 flex flex-col md:items-end justify-between space-y-3">
            <div className="flex flex-wrap items-center gap-4 text-[11px] font-medium">
              <button 
                onClick={onOpenPrivacy}
                className={`transition-colors underline underline-offset-4 ${
                  isLight ? 'hover:text-slate-900 text-slate-500' : 'hover:text-white text-white/60'
                }`}
              >
                Privacy Policy
              </button>
              <span className="opacity-30">·</span>
              <button 
                onClick={onOpenTerms}
                className={`transition-colors underline underline-offset-4 ${
                  isLight ? 'hover:text-slate-900 text-slate-500' : 'hover:text-white text-white/60'
                }`}
              >
                Terms of Service
              </button>
              <span className="opacity-30">·</span>
              <span className="text-[10px] font-mono text-[#db5319]">
                CIN: U72900CT2026PTC015892 (Provisional)
              </span>
            </div>
            <div className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-white/40'}`}>
              © {new Date().getFullYear()} Matrics Advanced Dynamics Technologies Pvt. Ltd. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
