import React from 'react';
import { X, MapPin, Clock, Phone, Mail, ShieldCheck, Cpu, ShoppingBag } from 'lucide-react';

interface StoreInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeName: string;
  storeTagline: string;
}

export const StoreInfoModal: React.FC<StoreInfoModalProps> = ({
  isOpen,
  onClose,
  storeName,
  storeTagline,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1E293B] border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold">{storeName} Location & Information</h2>
        </div>
        <p className="text-xs text-slate-400 mb-6">{storeTagline}</p>

        <div className="space-y-4 text-xs">
          <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white">Store Address</div>
              <p className="text-slate-300 mt-0.5">Renjura, Dantan, Paschim Medinipur, India</p>
              <span className="text-[10px] text-slate-500">Convenient Parking & Wheelchair Accessible</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex items-start gap-3">
            <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white">Operating Hours</div>
              <p className="text-slate-300 mt-0.5">Monday – Sunday: 7:00 AM – 10:00 PM</p>
              <span className="text-[10px] text-emerald-400">Express 30-Min Delivery Active</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex items-start gap-3">
            <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white">Contact & WhatsApp Orders</div>
              <p className="text-slate-300 mt-0.5">+91 9083112601 / </p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex items-start gap-3">
            <Cpu className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white">Cyber Hardware Specs</div>
              <p className="text-slate-300 mt-0.5">
                • 1200 DPI Heavy-Duty Duplex Color Laser Printers • 1Gbps Dedicated Fiber Workstations • A3 Flatbed Scanners
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs uppercase"
        >
          Close
        </button>
      </div>
    </div>
  );
};
