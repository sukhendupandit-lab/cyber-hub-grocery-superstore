import React, { useState } from 'react';
import {
  ShoppingBag,
  Printer,
  Monitor,
  Search,
  Sparkles,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  User,
  SlidersHorizontal,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { CartItem } from '../types';

interface HeaderProps {
  storeName?: string;
  storeTagline?: string;
  cartItems: CartItem[];
  activeTab: 'all' | 'grocery' | 'cyber' | 'ai-assistant';
  setActiveTab: (tab: 'all' | 'grocery' | 'cyber' | 'ai-assistant') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenCart: () => void;
  onOpenOrderTracker: () => void;
  onOpenStoreInfo: () => void;
  onOpenMerchantAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  storeName = 'CYBER HUB',
  storeTagline = 'Cyber Hub for Online Work & Fresh Groceries',
  cartItems,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenCart,
  onOpenOrderTracker,
  onOpenStoreInfo,
  onOpenMerchantAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md text-white border-b border-slate-800 shadow-xl">
      {/* Top Bar Announcement */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-2 text-white">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 bg-emerald-800/60 px-2 py-0.5 rounded-full text-[11px] font-semibold border border-emerald-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Store Open
            </span>
            <span className="hidden sm:inline text-emerald-100">
              Cyber Hub for Online Work & Fresh Grocery Store • Open 7:00 AM – 10:00 PM
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={onOpenStoreInfo}
              className="hover:underline flex items-center gap-1 text-emerald-100 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Location & Contact</span>
            </button>
            <span className="text-emerald-400/50 hidden sm:inline">•</span>
            <button
              onClick={onOpenOrderTracker}
              className="hover:underline flex items-center gap-1 text-emerald-100 transition-colors"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Track Order</span>
            </button>
            <span className="text-emerald-400/50 hidden sm:inline">•</span>
            <button
              onClick={onOpenMerchantAdmin}
              className="px-2.5 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold border border-amber-500/30 transition-all flex items-center gap-1 shadow-sm text-xs"
              title="Store Owner Admin Access"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Owner Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('all')}>
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-emerald-400">
                <div className="flex items-center -space-x-1">
                  <Printer className="w-5 h-5 text-cyan-400" />
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent uppercase">
                  {storeName}
                </h1>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/30">
                  CYBER HUB
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block truncate max-w-xs">
                {storeTagline}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search groceries, printing, PC slots, USB cables..."
              className="w-full bg-slate-800/80 text-white placeholder-slate-400 text-sm pl-10 pr-4 py-2 rounded-xl border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* AI Assistant Button */}
            <button
              onClick={() => setActiveTab('ai-assistant')}
              className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'ai-assistant'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-400'
                  : 'bg-slate-800/80 text-indigo-300 hover:bg-slate-800 border border-indigo-500/30'
              }`}
            >
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>Smart AI Assistant</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-3.5 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-900 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-[10px] text-emerald-100 font-normal leading-none">Your Basket</div>
                <div className="text-xs font-bold leading-tight">${cartSubtotal.toFixed(2)}</div>
              </div>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="mt-3 md:hidden relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search groceries, printing, PC slots..."
            className="w-full bg-slate-800 text-white placeholder-slate-400 text-sm pl-10 pr-4 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Category Navigation Bar */}
        <nav className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-800/80 overflow-x-auto no-scrollbar text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'all'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🏪 All Departments
          </button>

          <button
            onClick={() => setActiveTab('grocery')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'grocery'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
            <span>Grocery Superstore</span>
          </button>

          <button
            onClick={() => setActiveTab('cyber')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'cyber'
                ? 'bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30'
                : 'text-slate-400 hover:text-indigo-300'
            }`}
          >
            <Printer className="w-3.5 h-3.5 text-indigo-400" />
            <span>Cyber & Print Cafe</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-assistant')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'ai-assistant'
                ? 'bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30'
                : 'text-slate-400 hover:text-purple-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Recipe & Print Advisor</span>
          </button>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                onOpenStoreInfo();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2.5 bg-slate-800 rounded-lg text-slate-200"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Store Info</span>
            </button>
            <button
              onClick={() => {
                onOpenOrderTracker();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2.5 bg-slate-800 rounded-lg text-slate-200"
            >
              <Clock className="w-4 h-4 text-teal-400" />
              <span>Track Order</span>
            </button>
            <button
              onClick={() => {
                onOpenMerchantAdmin();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2.5 bg-amber-500/20 text-amber-300 font-bold rounded-lg border border-amber-500/40 col-span-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Owner Admin Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
