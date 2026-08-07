import React, { useState } from 'react';
import { X, Search, Clock, CheckCircle2, PackageCheck, Truck, ShieldCheck } from 'lucide-react';
import { Order } from '../types';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(searchQuery.trim().toUpperCase())}`);
      const data = await res.json();
      if (res.ok && data.order) {
        setOrder(data.order);
      } else {
        setError('No order found matching token or Order ID.');
      }
    } catch (err) {
      setError('Unable to fetch order status. Please check connectivity.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1E293B] border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold">Track Pickup Token or Order</h2>
        </div>

        <form onSubmit={handleTrack} className="flex gap-2 mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter Token (e.g. CM-8092) or Order ID"
            className="flex-1 bg-slate-900 border border-slate-700 text-white text-xs px-3.5 py-2.5 rounded-xl font-mono uppercase focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider shadow"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl mb-4">
            {error}
          </div>
        )}

        {order ? (
          <div className="space-y-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase">Token Number</span>
                <div className="text-xl font-mono font-black text-amber-300">{order.tokenNumber}</div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 uppercase">
                {order.status.replace('-', ' ')}
              </span>
            </div>

            {/* Status Timeline */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-3 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Order Received & Sent to Print/Pack Queue</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <PackageCheck className="w-4 h-4 text-cyan-400" />
                <span>Fresh Items & Prints Ready for Counter Pickup / Express Delivery</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Customer:</span>
                <span className="text-white font-medium">{order.customerName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Paid:</span>
                <span className="text-cyan-400 font-mono font-bold">${order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Created At:</span>
                <span className="text-slate-300">{new Date(order.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-slate-500 text-xs">
            Enter your token code printed on your receipt to view real-time status.
          </div>
        )}
      </div>
    </div>
  );
};
