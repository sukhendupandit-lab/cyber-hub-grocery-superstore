import React, { useState } from 'react';
import { Tag, Check, ArrowRight, Gift } from 'lucide-react';
import { PROMO_OFFERS } from '../data/mockData';
import { PromoOffer } from '../types';

interface PromoBannerProps {
  promos?: PromoOffer[];
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ promos }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const displayPromos = promos && promos.length > 0 ? promos : PROMO_OFFERS;

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  if (!displayPromos || displayPromos.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800/80 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
              Neighborhood Special Offers & Combo Deals
            </h2>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Single-click code copy • Express Store Counter Pickup
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {displayPromos.map((offer, idx) => {
            const bgGradients = [
              'bg-gradient-to-r from-emerald-600 to-teal-700',
              'bg-gradient-to-r from-blue-600 to-indigo-700',
              'bg-gradient-to-r from-amber-500 to-orange-600',
              'bg-gradient-to-r from-purple-600 to-pink-600',
              'bg-gradient-to-r from-rose-600 to-red-600',
            ];
            const gradientClass = offer.color ? `bg-gradient-to-r ${offer.color}` : bgGradients[idx % bgGradients.length];

            return (
              <div
                key={offer.id}
                className={`relative overflow-hidden rounded-2xl p-0.5 shadow-md hover:shadow-xl transition-all duration-300 group ${gradientClass}`}
              >
                <div className="bg-slate-900/90 backdrop-blur-sm rounded-[14px] p-4 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white tracking-wider uppercase border border-white/10">
                        {offer.badge}
                      </span>
                      <button
                        onClick={() => handleCopyCode(offer.code)}
                        className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-all"
                      >
                        {copiedCode === offer.code ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Tag className="w-3.5 h-3.5" />
                            <span>{offer.code}</span>
                          </>
                        )}
                      </button>
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-200 transition-colors">
                      {offer.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {offer.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Valid on Store Orders</span>
                    <span className="text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      Apply in Cart <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
