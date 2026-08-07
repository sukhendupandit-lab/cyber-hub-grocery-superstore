import React from 'react';
import { Cpu, ShoppingBag, ArrowRight, Zap, ShieldCheck, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  storeName: string;
  storeTagline: string;
  onNavigateGrocery: () => void;
  onNavigateCyber: () => void;
  onOpenAiAssistant: () => void;
  onOpenMerchantAdmin?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  storeName,
  storeTagline,
  onNavigateGrocery,
  onNavigateCyber,
  onOpenAiAssistant,
  onOpenMerchantAdmin,
}) => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      {/* Split Hero Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cyber Hub for Online Work Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/60 rounded-2xl border border-cyan-500/30 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group shadow-xl">
          <div className="absolute -right-12 -bottom-12 w-56 h-56 bg-cyan-400/10 rounded-full blur-3xl group-hover:bg-cyan-400/20 transition-all duration-500" />
          
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-mono uppercase tracking-widest border border-cyan-500/30">
                CYBER HUB FOR ONLINE WORK
              </span>
              <span className="text-[10px] text-slate-400 font-mono">1Gbps FIBER • PRINT & FORMS</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              DIGITAL ONLINE WORK & INSTANT PRINTING
            </h2>

            <p className="text-slate-400 text-xs sm:text-sm max-w-md leading-relaxed mb-6">
              Assisted online form submission (Govt. schemes, job applications, utility bills), fast document printing, passport photo studio, & high-speed PC workstations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateCyber}
              className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all active:scale-95"
            >
              <Cpu className="w-4 h-4" />
              <span>Explore Online Work & Print</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {onOpenMerchantAdmin && (
              <button
                onClick={onOpenMerchantAdmin}
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Owner Portal</span>
              </button>
            )}
          </div>
        </div>

        {/* Grocery & Fresh Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/60 rounded-2xl border border-emerald-500/30 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group shadow-xl">
          <div className="absolute -right-12 -bottom-12 w-56 h-56 bg-emerald-400/10 rounded-full blur-3xl group-hover:bg-emerald-400/20 transition-all duration-500" />

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono uppercase tracking-widest border border-emerald-500/30">
                FRESH GROCERY SUPERSTORE
              </span>
              <span className="text-[10px] text-slate-400 font-mono">FARM FRESH • EXPRESS 30 MIN</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              ORGANIC PRODUCE & DAILY PANTRY
            </h2>

            <p className="text-slate-400 text-xs sm:text-sm max-w-md leading-relaxed mb-6">
              Farm-fresh fruits, organic vegetables, daily dairy, artisan breads, and pantry staples delivered straight to your door.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateGrocery}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shop Fresh Grocery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenAiAssistant}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Recipe Assistant</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
