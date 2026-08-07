import React, { useState } from 'react';
import { Megaphone, X, Bell } from 'lucide-react';

interface CustomizationNoticeBannerProps {
  storeName: string;
  noticeText: string;
}

export const CustomizationNoticeBanner: React.FC<CustomizationNoticeBannerProps> = ({
  storeName,
  noticeText,
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !noticeText) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-cyan-950/90 border-b border-emerald-500/40 py-2.5 px-4 sm:px-6 lg:px-8 text-white relative shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/40 shrink-0">
            <Megaphone className="w-4 h-4 animate-bounce" />
          </div>
          <div className="flex flex-wrap items-center gap-2 overflow-hidden">
            <span className="font-extrabold text-emerald-300 uppercase tracking-wide text-[11px] shrink-0 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
              📢 STORE ANNOUNCEMENT
            </span>
            <p className="text-slate-200 text-xs sm:text-sm font-medium">
              {noticeText}
            </p>
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
          title="Dismiss notice"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
