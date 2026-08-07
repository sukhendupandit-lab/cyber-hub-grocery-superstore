import React, { useState, useEffect } from 'react';
import {
  Printer,
  Monitor,
  Camera,
  FileText,
  HardDrive,
  Upload,
  Check,
  Plus,
  Zap,
  Clock,
  Shield,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  Tag
} from 'lucide-react';
import { CyberService, CyberServiceCategory, CartItem, PrintJobConfig, WorkstationBookingConfig, PrintVarietyRate } from '../types';
import { DEFAULT_PRINT_RATES } from '../data/mockData';

interface CyberSectionProps {
  services: CyberService[];
  onAddToCart: (item: CartItem) => void;
  onOpenAiDocAssistant: () => void;
  isOwnerMode?: boolean;
  onQuickEditService?: (service: CyberService) => void;
}

export const CyberSection: React.FC<CyberSectionProps> = ({
  services,
  onAddToCart,
  onOpenAiDocAssistant,
  isOwnerMode,
  onQuickEditService,
}) => {
  const [activeCategory, setActiveCategory] = useState<CyberServiceCategory>('all');
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [showVarietyRatesTable, setShowVarietyRatesTable] = useState(true);
  const [printRates, setPrintRates] = useState<PrintVarietyRate[]>(DEFAULT_PRINT_RATES);

  useEffect(() => {
    fetch('/api/print-rates')
      .then((res) => res.json())
      .then((data) => {
        if (data.printRates && data.printRates.length > 0) {
          setPrintRates(data.printRates);
        }
      })
      .catch((err) => console.log('Loaded local default print rates', err));
  }, []);

  // Interactive Print Calculator State
  const [printConfig, setPrintConfig] = useState<PrintJobConfig>({
    paperSize: 'A4',
    printType: 'bw',
    sides: 'double',
    pages: 10,
    copies: 1,
    binding: 'none',
    lamination: false,
    uploadedFileName: 'Sample_Document.pdf',
    estimatedCost: 0.85,
  });

  // Interactive PC Slot Booking State
  const [bookingConfig, setBookingConfig] = useState<WorkstationBookingConfig>({
    stationType: 'standard-pc',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '14:00 - 15:00',
    durationMinutes: 60,
    addOns: ['High-Res Scanner Access'],
    estimatedCost: 3.00,
  });

  // Calculate live print cost client-side instantly
  const calculatePrintCost = (cfg: PrintJobConfig): number => {
    const matchedRate = printRates.find(r => r.paperSize === cfg.paperSize && r.printType === cfg.printType)
      || printRates.find(r => r.paperSize === cfg.paperSize)
      || printRates[0];

    let baseRate = matchedRate ? matchedRate.pricePerPage : 0.10;
    let multiplier = cfg.sides === 'double' ? (matchedRate?.duplexMultiplier || 0.85) : 1.0;
    let subtotal = cfg.pages * baseRate * multiplier * cfg.copies;

    let bindingCost = 0;
    if (cfg.binding === 'staple') bindingCost = 0.25 * cfg.copies;
    if (cfg.binding === 'spiral') bindingCost = 2.00 * cfg.copies;
    if (cfg.binding === 'hardcover') bindingCost = 5.00 * cfg.copies;

    let laminationCost = cfg.lamination ? 0.75 * cfg.pages * cfg.copies : 0;

    return Math.round((subtotal + bindingCost + laminationCost) * 100) / 100;
  };

  const handlePrintConfigChange = (updates: Partial<PrintJobConfig>) => {
    const updated = { ...printConfig, ...updates };
    updated.estimatedCost = calculatePrintCost(updated);
    setPrintConfig(updated);
  };

  const handleAddPrintToCart = () => {
    const totalCost = printConfig.estimatedCost;
    const summary = `${printConfig.paperSize} • ${printConfig.printType.toUpperCase()} • ${printConfig.sides} • ${printConfig.pages} pgs (${printConfig.copies} copy)`;

    onAddToCart({
      cartItemId: `print-${Date.now()}`,
      itemType: 'print-job',
      id: 'print-custom-job',
      name: `Print Job: ${printConfig.uploadedFileName || 'Document'}`,
      price: totalCost,
      quantity: 1,
      unitOrSummary: summary,
      printConfig: printConfig,
    });

    setAddedIds((prev) => ({ ...prev, 'custom-print': true }));
    setTimeout(() => setAddedIds((prev) => ({ ...prev, 'custom-print': false })), 1500);
  };

  const handleAddBookingToCart = () => {
    onAddToCart({
      cartItemId: `pc-${Date.now()}`,
      itemType: 'pc-booking',
      id: 'pc-workstation-slot',
      name: `PC Slot: ${bookingConfig.stationType.replace('-', ' ').toUpperCase()}`,
      price: bookingConfig.estimatedCost,
      quantity: 1,
      unitOrSummary: `${bookingConfig.date} @ ${bookingConfig.timeSlot} (${bookingConfig.durationMinutes} mins)`,
      bookingConfig: bookingConfig,
    });

    setAddedIds((prev) => ({ ...prev, 'custom-pc': true }));
    setTimeout(() => setAddedIds((prev) => ({ ...prev, 'custom-pc': false })), 1500);
  };

  const handleAddServiceToCart = (service: CyberService) => {
    onAddToCart({
      cartItemId: `cs-${service.id}-${Date.now()}`,
      itemType: 'cyber-service',
      id: service.id,
      name: service.title,
      price: service.startingPrice,
      quantity: 1,
      unitOrSummary: service.unitText,
      image: service.image,
    });

    setAddedIds((prev) => ({ ...prev, [service.id]: true }));
    setTimeout(() => setAddedIds((prev) => ({ ...prev, [service.id]: false })), 1200);
  };

  const filteredServices = services.filter((s) => {
    if (activeCategory === 'all') return true;
    return s.category === activeCategory;
  });

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Printer className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Cyber Hub & Instant Printing Center
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Fast laser printing, spiral binding, PC workstation slots, passport photo studio, & online work services.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowVarietyRatesTable(!showVarietyRatesTable)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-semibold"
          >
            <Tag className="w-4 h-4 text-cyan-400" />
            <span>{showVarietyRatesTable ? 'Hide Rates Table' : 'View Print Variety Prices'}</span>
            {showVarietyRatesTable ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenAiDocAssistant}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold shadow-md transition-all"
          >
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>AI Print Specialist</span>
          </button>
        </div>
      </div>

      {/* PRINT VARIETIES & PRICE BREAKDOWN TABLE */}
      {showVarietyRatesTable && (
        <div className="mb-8 bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                Official Print Variety Pricing Rate Card
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Transparent per-page & variety pricing (Editable by Owner)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {printRates.map((rate) => (
              <div
                key={rate.id}
                className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 flex flex-col justify-between hover:border-cyan-500/50 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-white truncate">{rate.varietyName}</span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {rate.paperSize}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-2">{rate.description}</p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">{rate.gsmQuality || 'Standard GSM'}</span>
                  <div className="text-xs font-mono font-bold text-cyan-300">
                    {rate.pricePerPage > 0 ? (
                      <>${rate.pricePerPage.toFixed(2)} <span className="text-[9px] text-slate-400 font-normal">/pg</span></>
                    ) : rate.bindingPrice > 0 ? (
                      <>${rate.bindingPrice.toFixed(2)} <span className="text-[9px] text-slate-400 font-normal">/book</span></>
                    ) : (
                      <>${rate.laminationPricePerPage.toFixed(2)} <span className="text-[9px] text-slate-400 font-normal">/pg</span></>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Quick Configurator Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 1. Instant Document Printing Studio */}
        <div className="bg-[#1E293B] border border-cyan-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                Instant PDF & Document Printing
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              1200 DPI LASER
            </span>
          </div>

          <div className="space-y-4 text-xs">
            {/* File Upload Simulation */}
            <div className="p-3 bg-slate-900/80 rounded-xl border border-dashed border-cyan-500/40 text-center">
              <div className="flex items-center justify-center gap-2 text-slate-300 font-medium">
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>Uploaded File:</span>
                <input
                  type="text"
                  value={printConfig.uploadedFileName}
                  onChange={(e) => handlePrintConfigChange({ uploadedFileName: e.target.value })}
                  className="bg-slate-800 text-cyan-300 text-xs px-2 py-1 rounded border border-slate-700 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            {/* Config Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 text-[10px] uppercase font-mono mb-1">
                  Paper Size
                </label>
                <select
                  value={printConfig.paperSize}
                  onChange={(e) => handlePrintConfigChange({ paperSize: e.target.value as any })}
                  className="w-full bg-slate-900 text-white rounded-lg px-2.5 py-1.5 border border-slate-700 focus:border-cyan-400"
                >
                  <option value="A4">A4 Standard</option>
                  <option value="A3">A3 Large</option>
                  <option value="Legal">Legal Document</option>
                  <option value="Glossy Photo (4x6)">Glossy Photo (4x6)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] uppercase font-mono mb-1">
                  Print Mode
                </label>
                <select
                  value={printConfig.printType}
                  onChange={(e) => handlePrintConfigChange({ printType: e.target.value as any })}
                  className="w-full bg-slate-900 text-white rounded-lg px-2.5 py-1.5 border border-slate-700 focus:border-cyan-400"
                >
                  <option value="bw">Black & White ($0.10/pg)</option>
                  <option value="color">Full Color ($0.40/pg)</option>
                  <option value="hd-photo">HD Photo Studio ($0.90/pg)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] uppercase font-mono mb-1">
                  Sides
                </label>
                <select
                  value={printConfig.sides}
                  onChange={(e) => handlePrintConfigChange({ sides: e.target.value as any })}
                  className="w-full bg-slate-900 text-white rounded-lg px-2.5 py-1.5 border border-slate-700 focus:border-cyan-400"
                >
                  <option value="double">Double-Sided (15% OFF)</option>
                  <option value="single">Single-Sided</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] uppercase font-mono mb-1">
                  Total Pages
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={printConfig.pages}
                  onChange={(e) => handlePrintConfigChange({ pages: Math.max(1, parseInt(e.target.value) || 1) })}
                  className="w-full bg-slate-900 text-white rounded-lg px-2.5 py-1.5 border border-slate-700 focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] uppercase font-mono mb-1">
                  Copies
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={printConfig.copies}
                  onChange={(e) => handlePrintConfigChange({ copies: Math.max(1, parseInt(e.target.value) || 1) })}
                  className="w-full bg-slate-900 text-white rounded-lg px-2.5 py-1.5 border border-slate-700 focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] uppercase font-mono mb-1">
                  Binding
                </label>
                <select
                  value={printConfig.binding}
                  onChange={(e) => handlePrintConfigChange({ binding: e.target.value as any })}
                  className="w-full bg-slate-900 text-white rounded-lg px-2.5 py-1.5 border border-slate-700 focus:border-cyan-400"
                >
                  <option value="none">No Binding</option>
                  <option value="staple">Corner Staple (+$0.25)</option>
                  <option value="spiral">Spiral Ring Binding (+$2.00)</option>
                  <option value="hardcover">Hardcover Thermal (+$5.00)</option>
                </select>
              </div>
            </div>

            {/* Lamination Checkbox */}
            <div className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-xl border border-slate-700">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={printConfig.lamination}
                  onChange={(e) => handlePrintConfigChange({ lamination: e.target.checked })}
                  className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400"
                />
                <span>Heavy Duty 125 Micron Lamination (+$0.75/pg)</span>
              </label>
            </div>
          </div>

          {/* Pricing & Add Button */}
          <div className="mt-5 pt-3 border-t border-slate-700 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Total Calculated Cost</div>
              <div className="text-xl font-mono font-extrabold text-cyan-400">
                ${printConfig.estimatedCost.toFixed(2)}
              </div>
            </div>

            <button
              onClick={handleAddPrintToCart}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all ${
                addedIds['custom-print']
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
              }`}
            >
              {addedIds['custom-print'] ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Basket</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add Print Job</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2. PC Workstation Slot Reserve Studio */}
        <div className="bg-[#1E293B] border border-indigo-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                Book PC Station & High-Speed Slot
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              1Gbps DEDICATED
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 text-[10px] uppercase font-mono mb-1">
                  Workstation Type
                </label>
                <select
                  value={bookingConfig.stationType}
                  onChange={(e) => {
                    const st = e.target.value as any;
                    let cost = 3.00;
                    if (st === 'heavy-work-gaming') cost = 5.00;
                    if (st === 'scanner-doc-station') cost = 3.50;
                    setBookingConfig({ ...bookingConfig, stationType: st, estimatedCost: cost });
                  }}
                  className="w-full bg-slate-900 text-white rounded-lg px-2.5 py-1.5 border border-slate-700 focus:border-indigo-400"
                >
                  <option value="standard-pc">Standard Office & Web ($3.00/hr)</option>
                  <option value="heavy-work-gaming">Heavy Design & Adobe CC ($5.00/hr)</option>
                  <option value="scanner-doc-station">Scanner & High Speed Doc Desk ($3.50/hr)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] uppercase font-mono mb-1">
                  Booking Date
                </label>
                <input
                  type="date"
                  value={bookingConfig.date}
                  onChange={(e) => setBookingConfig({ ...bookingConfig, date: e.target.value })}
                  className="w-full bg-slate-900 text-white rounded-lg px-2.5 py-1.5 border border-slate-700 focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] uppercase font-mono mb-1">
                  Time Slot
                </label>
                <select
                  value={bookingConfig.timeSlot}
                  onChange={(e) => setBookingConfig({ ...bookingConfig, timeSlot: e.target.value })}
                  className="w-full bg-slate-900 text-white rounded-lg px-2.5 py-1.5 border border-slate-700 focus:border-indigo-400"
                >
                  <option value="10:00 - 11:00">10:00 AM - 11:00 AM</option>
                  <option value="11:30 - 12:30">11:30 AM - 12:30 PM</option>
                  <option value="14:00 - 15:00">02:00 PM - 03:00 PM</option>
                  <option value="16:00 - 17:00">04:00 PM - 05:00 PM</option>
                  <option value="18:00 - 19:00">06:00 PM - 07:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] uppercase font-mono mb-1">
                  Duration
                </label>
                <select
                  value={bookingConfig.durationMinutes}
                  onChange={(e) => {
                    const dur = parseInt(e.target.value);
                    const basePerHour = bookingConfig.stationType === 'heavy-work-gaming' ? 5.0 : 3.0;
                    setBookingConfig({ ...bookingConfig, durationMinutes: dur, estimatedCost: (dur / 60) * basePerHour });
                  }}
                  className="w-full bg-slate-900 text-white rounded-lg px-2.5 py-1.5 border border-slate-700 focus:border-indigo-400"
                >
                  <option value={30}>30 Minutes</option>
                  <option value={60}>1 Hour</option>
                  <option value={120}>2 Hours</option>
                  <option value={180}>3 Hours</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700 space-y-1">
              <div className="text-[10px] text-indigo-300 font-mono uppercase">Included Equipment & Software:</div>
              <p className="text-slate-300 leading-relaxed">
                • Ultra-fast 1Gbps Fiber • Laser Printer Connectivity • High-Res Scanner • Microsoft Office & Adobe Reader installed.
              </p>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-700 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Workstation Reservation</div>
              <div className="text-xl font-mono font-extrabold text-indigo-400">
                ${bookingConfig.estimatedCost.toFixed(2)}
              </div>
            </div>

            <button
              onClick={handleAddBookingToCart}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all ${
                addedIds['custom-pc']
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
              }`}
            >
              {addedIds['custom-pc'] ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Slot Booked</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Book Workstation</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Cyber Services List */}
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
        All Cyber Cafe & Tech Hardware Services
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((service) => {
          const isAdded = addedIds[service.id];
          return (
            <div
              key={service.id}
              className="bg-[#1E293B] border border-slate-700 hover:border-cyan-500/50 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all duration-300 group"
            >
              <div>
                <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-4 bg-slate-900">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {service.popularBadge && (
                    <span className="absolute top-2 left-2 text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-cyan-500 text-slate-950 shadow-md">
                      {service.popularBadge}
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors">
                  {service.title}
                </h4>

                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {service.description}
                </p>

                <ul className="mt-3 space-y-1">
                  {service.features.map((feat, idx) => (
                    <li key={idx} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Starting From</span>
                  <div className="text-base font-mono font-bold text-cyan-400">
                    ${service.startingPrice.toFixed(2)}{' '}
                    <span className="text-[10px] text-slate-400 font-normal">/ {service.unitText}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isOwnerMode && onQuickEditService && (
                    <button
                      onClick={() => onQuickEditService(service)}
                      className="px-2.5 py-1.5 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs rounded-lg border border-amber-500/30"
                    >
                      Edit Rate
                    </button>
                  )}

                  <button
                    onClick={() => handleAddServiceToCart(service)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                      isAdded
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    }`}
                  >
                    {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{isAdded ? 'Added' : 'Select'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
