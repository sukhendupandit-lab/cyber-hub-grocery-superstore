import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  X,
  Edit3,
  Plus,
  Trash2,
  Save,
  ShoppingBag,
  Printer,
  DollarSign,
  Package,
  RefreshCw,
  Check,
  Store,
  Lock,
  Key,
  Unlock,
  Tag,
  AlertCircle,
  Gift,
  Sparkles,
  Star
} from 'lucide-react';
import { GroceryProduct, CyberService, Order, PrintVarietyRate, PromoOffer } from '../types';
import { DEFAULT_PRINT_RATES, PROMO_OFFERS } from '../data/mockData';

interface MerchantAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeName: string;
  onUpdateStoreName: (newName: string, newTagline?: string, newNotice?: string) => void;
  products: GroceryProduct[];
  services: CyberService[];
  promos?: PromoOffer[];
  onUpdateProduct: (product: GroceryProduct) => void;
  onAddProduct: (newProduct: Partial<GroceryProduct>) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateService: (service: CyberService) => void;
  onUpdatePromos?: (promos: PromoOffer[]) => void;
}

export const MerchantAdminModal: React.FC<MerchantAdminModalProps> = ({
  isOpen,
  onClose,
  storeName,
  onUpdateStoreName,
  products,
  services,
  promos,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  onUpdateService,
  onUpdatePromos,
}) => {
  // Protective Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<'store-name' | 'print-rates' | 'promos' | 'products' | 'services' | 'add-item' | 'orders' | 'security'>('store-name');

  // Promos State
  const [promosList, setPromosList] = useState<PromoOffer[]>(promos || PROMO_OFFERS);
  const [isAddingPromo, setIsAddingPromo] = useState(false);
  const [editingPromoId, setEditingPromoId] = useState<string | null>(null);
  const [editPromoForm, setEditPromoForm] = useState<PromoOffer | null>(null);
  const [newPromoForm, setNewPromoForm] = useState({
    title: '',
    code: '',
    description: '',
    badge: 'Special Offer',
    color: 'from-emerald-600 to-teal-700',
  });

  // Store Name & Notice Form State
  const [editingStoreName, setEditingStoreName] = useState(storeName);
  const [editingTagline, setEditingTagline] = useState('Cyber Hub for Online Work, Fast Printing & Fresh Groceries');
  const [editingNotice, setEditingNotice] = useState('Store Open • Cyber Hub Online Work & Counter Pickup Active');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Password Change State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdChangeSuccess, setPwdChangeSuccess] = useState('');
  const [pwdChangeError, setPwdChangeError] = useState('');

  // Print Variety Rates State
  const [printRates, setPrintRates] = useState<PrintVarietyRate[]>(DEFAULT_PRINT_RATES);
  const [editingRateId, setEditingRateId] = useState<string | null>(null);
  const [editRateForm, setEditRateForm] = useState<PrintVarietyRate | null>(null);

  // Add Item Form State
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'fruits-veg',
    price: 3.99,
    originalPrice: 4.99,
    unit: '1 kg',
    stock: 50,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
    description: 'Fresh top quality store inventory.',
    badge: 'Owner Choice',
  });

  // Incoming Orders State
  const [liveOrders, setLiveOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Edit Product State
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editProductForm, setEditProductForm] = useState<GroceryProduct | null>(null);

  // Edit Service State
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editServiceForm, setEditServiceForm] = useState<CyberService | null>(null);

  useEffect(() => {
    setEditingStoreName(storeName);
  }, [storeName]);

  useEffect(() => {
    if (promos) {
      setPromosList(promos);
    }
  }, [promos]);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchPrintRates();
      fetchPromos();
    }
  }, [isOpen, isAuthenticated]);

  const fetchPromos = async () => {
    try {
      const res = await fetch('/api/promos');
      const data = await res.json();
      if (data.promos) {
        setPromosList(data.promos);
        if (onUpdatePromos) onUpdatePromos(data.promos);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddPromoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/promos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPromoForm),
      });
      const data = await res.json();
      if (data.promos) {
        setPromosList(data.promos);
        if (onUpdatePromos) onUpdatePromos(data.promos);
        setIsAddingPromo(false);
        setNewPromoForm({
          title: '',
          code: '',
          description: '',
          badge: 'Special Offer',
          color: 'from-emerald-600 to-teal-700',
        });
      }
    } catch (err) {
      alert('Error creating special offer');
    }
  };

  const handleSavePromo = async (updatedPromo: PromoOffer) => {
    try {
      const res = await fetch(`/api/promos/${updatedPromo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPromo),
      });
      const data = await res.json();
      if (data.promos) {
        setPromosList(data.promos);
        if (onUpdatePromos) onUpdatePromos(data.promos);
        setEditingPromoId(null);
      }
    } catch (err) {
      alert('Error updating promo offer');
    }
  };

  const handleDeletePromo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this special offer?')) return;
    try {
      const res = await fetch(`/api/promos/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.promos) {
        setPromosList(data.promos);
        if (onUpdatePromos) onUpdatePromos(data.promos);
      }
    } catch (err) {
      alert('Error deleting promo offer');
    }
  };

  useEffect(() => {
    if (activeTab === 'orders' && isOpen && isAuthenticated) {
      fetchOrders();
    }
  }, [activeTab, isOpen, isAuthenticated]);

  const fetchPrintRates = async () => {
    try {
      const res = await fetch('/api/print-rates');
      const data = await res.json();
      if (data.printRates) {
        setPrintRates(data.printRates);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.orders) {
        setLiveOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setIsVerifying(true);

    try {
      const res = await fetch('/api/owner/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();

      if (res.ok && data.authenticated) {
        setIsAuthenticated(true);
        setPasswordInput('');
      } else {
        setPasswordError(data.error || 'Incorrect owner password. Default is 1234');
      }
    } catch (err) {
      setPasswordError('Server connection error. Try password: 1234');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdChangeError('');
    setPwdChangeSuccess('');

    if (newPassword !== confirmPassword) {
      setPwdChangeError('New passwords do not match.');
      return;
    }

    try {
      const res = await fetch('/api/owner/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setPwdChangeSuccess('Password changed successfully! Keep your new PIN safe.');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPwdChangeError(data.error || 'Failed to change password.');
      }
    } catch (err) {
      setPwdChangeError('Network error changing password.');
    }
  };

  const handleSavePrintRate = async (rate: PrintVarietyRate) => {
    try {
      const res = await fetch(`/api/print-rates/${rate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rate),
      });
      const data = await res.json();
      if (data.printRates) {
        setPrintRates(data.printRates);
      }
      setEditingRateId(null);
      setEditRateForm(null);
    } catch (err) {
      alert('Error saving print rate');
    }
  };

  const handleDeletePrintRate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this print variety option?')) return;
    try {
      const res = await fetch(`/api/print-rates/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.printRates) {
        setPrintRates(data.printRates);
      }
    } catch (err) {
      alert('Error deleting print rate');
    }
  };

  const handleDeleteCyberService = async (id: string) => {
    if (!confirm('Are you sure you want to remove this cyber service?')) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.services) {
        // Trigger page refresh or callback if needed
        window.location.reload();
      }
    } catch (err) {
      alert('Error deleting service');
    }
  };

  if (!isOpen) return null;

  const handleSaveStoreName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStoreName.trim()) return;

    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeName: editingStoreName,
          storeTagline: editingTagline,
          notice: editingNotice,
        }),
      });

      onUpdateStoreName(editingStoreName, editingTagline, editingNotice);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      console.error(err);
      alert('Error updating store settings');
    }
  };

  const handleStartEditProduct = (prod: GroceryProduct) => {
    setEditingProductId(prod.id);
    setEditProductForm({ ...prod });
  };

  const handleSaveEditedProduct = () => {
    if (!editProductForm) return;
    onUpdateProduct(editProductForm);
    setEditingProductId(null);
    setEditProductForm(null);
  };

  const handleStartEditService = (serv: CyberService) => {
    setEditingServiceId(serv.id);
    setEditServiceForm({ ...serv });
  };

  const handleSaveEditedService = () => {
    if (!editServiceForm) return;
    onUpdateService(editServiceForm);
    setEditingServiceId(null);
    setEditServiceForm(null);
  };

  const handleCreateNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;
    onAddProduct(newItem as any);
    setNewItem({
      name: '',
      category: 'fruits-veg',
      price: 3.99,
      originalPrice: 4.99,
      unit: '1 kg',
      stock: 50,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
      description: 'Fresh top quality store inventory.',
      badge: 'Owner Choice',
    });
    setActiveTab('products');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#1E293B] border border-amber-500/40 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-lg font-bold">Store Owner Control Panel</h2>
              <p className="text-xs text-slate-400">
                Protected Management Portal • Full access to edit name, rates, products & security
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                title="Lock Portal"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock Portal</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* IF NOT AUTHENTICATED: SHOW PROTECTIVE PASSWORD SCREEN */}
        {!isAuthenticated ? (
          <div className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/10">
              <Lock className="w-8 h-8" />
            </div>

            <div className="max-w-md space-y-2">
              <h3 className="text-xl font-bold text-white">Owner Authorization Required</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                This management website is password protected to prevent unauthorized edits to store prices, varieties, and order logs.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="w-full max-w-sm space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-xs font-mono font-bold text-slate-400 uppercase">
                  Owner Secret Password / PIN
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter owner password (Default: 1234)"
                    className="w-full bg-slate-900 text-amber-300 font-mono font-bold text-base pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {passwordError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2 text-left">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Unlock className="w-4 h-4" />
                <span>{isVerifying ? 'Verifying PIN...' : 'Unlock Owner Portal'}</span>
              </button>

              <div className="text-[11px] text-slate-400 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                🔑 Default Owner PIN: <span className="font-mono font-bold text-amber-300">1234</span> (You can change it inside once logged in).
              </div>
            </form>
          </div>
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="flex bg-slate-900/60 p-2 border-b border-slate-800 gap-2 overflow-x-auto text-xs font-semibold">
              <button
                onClick={() => setActiveTab('store-name')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all shrink-0 ${
                  activeTab === 'store-name'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Branding & Notice</span>
              </button>

              <button
                onClick={() => setActiveTab('print-rates')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all shrink-0 ${
                  activeTab === 'print-rates'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tag className="w-4 h-4" />
                <span>Print Variety Prices ({printRates.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('promos')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all shrink-0 ${
                  activeTab === 'promos'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Gift className="w-4 h-4" />
                <span>Special Offers ({promosList.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all shrink-0 ${
                  activeTab === 'products'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Grocery Items ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all shrink-0 ${
                  activeTab === 'services'
                    ? 'bg-indigo-500 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Printer className="w-4 h-4" />
                <span>Cyber Services ({services.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('add-item')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all shrink-0 ${
                  activeTab === 'add-item'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all shrink-0 ${
                  activeTab === 'orders'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Pickup Orders</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all shrink-0 ${
                  activeTab === 'security'
                    ? 'bg-rose-500 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Key className="w-4 h-4" />
                <span>Security & Password</span>
              </button>
            </div>

            {/* Modal Content Area */}
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              {/* TAB 1: CHANGE STORE NAME & ANNOUNCEMENT NOTICE ANYTIME */}
              {activeTab === 'store-name' && (
                <div className="space-y-4 max-w-xl">
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
                    <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                      <Edit3 className="w-4 h-4" />
                      <span>Customize Store Name & Announcement Notice Anytime</span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      You can rename your web store and update the live notice banner whenever you want. Changes take effect immediately!
                    </p>
                  </div>

                  <form onSubmit={handleSaveStoreName} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                        Store Brand Name
                      </label>
                      <input
                        type="text"
                        required
                        value={editingStoreName}
                        onChange={(e) => setEditingStoreName(e.target.value)}
                        placeholder="e.g. CYBER HUB"
                        className="w-full bg-slate-900 text-white font-bold text-base px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                        Store Tagline / Subtitle
                      </label>
                      <input
                        type="text"
                        value={editingTagline}
                        onChange={(e) => setEditingTagline(e.target.value)}
                        placeholder="e.g. Cyber Hub for Online Work, Fast Printing & Fresh Groceries"
                        className="w-full bg-slate-900 text-slate-200 text-xs px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                        Homepage Announcement Notice Banner
                      </label>
                      <input
                        type="text"
                        value={editingNotice}
                        onChange={(e) => setEditingNotice(e.target.value)}
                        placeholder="e.g. Notice: Special discount on bulk A4 color prints today!"
                        className="w-full bg-slate-900 text-emerald-300 text-xs px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-400 font-medium"
                      />
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save & Update Web Settings</span>
                      </button>
                      {savedSuccess && (
                        <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-4 h-4" /> Settings Updated!
                        </span>
                      )}
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: PRINT VARIETIES & RATES EDITOR */}
              {activeTab === 'print-rates' && (
                <div className="space-y-4">
                  <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        <span>Edit Print Variety Rates & Paper Prices</span>
                      </h3>
                      <p className="text-xs text-slate-300 mt-1">
                        Modify prices for A4, A3, Legal, Glossy photo, double-sided duplex discounts, and spiral binding anytime.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {printRates.map((rate) => {
                      const isEditing = editingRateId === rate.id;
                      return (
                        <div
                          key={rate.id}
                          className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs"
                        >
                          {isEditing && editRateForm ? (
                            <div className="space-y-3">
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                  <label className="text-[10px] text-slate-400 uppercase">Variety Name</label>
                                  <input
                                    type="text"
                                    value={editRateForm.varietyName}
                                    onChange={(e) => setEditRateForm({ ...editRateForm, varietyName: e.target.value })}
                                    className="w-full bg-slate-800 text-white p-2 rounded-lg border border-slate-700"
                                  />
                                </div>

                                <div>
                                  <label className="text-[10px] text-slate-400 uppercase">Paper Format</label>
                                  <select
                                    value={editRateForm.paperSize}
                                    onChange={(e) => setEditRateForm({ ...editRateForm, paperSize: e.target.value as any })}
                                    className="w-full bg-slate-800 text-white p-2 rounded-lg border border-slate-700"
                                  >
                                    <option value="A4">A4</option>
                                    <option value="A3">A3</option>
                                    <option value="Legal">Legal</option>
                                    <option value="Glossy Photo (4x6)">Glossy Photo (4x6)</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="text-[10px] text-slate-400 uppercase">Price Per Page ($)</label>
                                  <input
                                    type="number"
                                    step="0.05"
                                    value={editRateForm.pricePerPage}
                                    onChange={(e) => setEditRateForm({ ...editRateForm, pricePerPage: parseFloat(e.target.value) || 0 })}
                                    className="w-full bg-slate-800 text-cyan-300 font-mono font-bold p-2 rounded-lg border border-slate-700"
                                  />
                                </div>

                                <div>
                                  <label className="text-[10px] text-slate-400 uppercase">GSM Paper Quality</label>
                                  <input
                                    type="text"
                                    value={editRateForm.gsmQuality}
                                    onChange={(e) => setEditRateForm({ ...editRateForm, gsmQuality: e.target.value })}
                                    className="w-full bg-slate-800 text-white p-2 rounded-lg border border-slate-700"
                                  />
                                </div>

                                <div>
                                  <label className="text-[10px] text-slate-400 uppercase">Binding Cost ($)</label>
                                  <input
                                    type="number"
                                    step="0.25"
                                    value={editRateForm.bindingPrice}
                                    onChange={(e) => setEditRateForm({ ...editRateForm, bindingPrice: parseFloat(e.target.value) || 0 })}
                                    className="w-full bg-slate-800 text-white p-2 rounded-lg border border-slate-700"
                                  />
                                </div>

                                <div>
                                  <label className="text-[10px] text-slate-400 uppercase">Lamination Cost / Pg ($)</label>
                                  <input
                                    type="number"
                                    step="0.10"
                                    value={editRateForm.laminationPricePerPage}
                                    onChange={(e) => setEditRateForm({ ...editRateForm, laminationPricePerPage: parseFloat(e.target.value) || 0 })}
                                    className="w-full bg-slate-800 text-white p-2 rounded-lg border border-slate-700"
                                  />
                                </div>
                              </div>

                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => setEditingRateId(null)}
                                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSavePrintRate(editRateForm)}
                                  className="px-4 py-1.5 bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs"
                                >
                                  Save Variety Price
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-white text-xs">{rate.varietyName}</h4>
                                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                    {rate.paperSize}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">{rate.gsmQuality}</span>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-0.5">{rate.description}</p>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="text-right font-mono font-bold text-cyan-300 text-sm">
                                  ${rate.pricePerPage.toFixed(2)} <span className="text-[10px] text-slate-400 font-normal">/pg</span>
                                </div>
                                <button
                                  onClick={() => {
                                    setEditingRateId(rate.id);
                                    setEditRateForm({ ...rate });
                                  }}
                                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-semibold border border-slate-700 flex items-center gap-1"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Edit Rate</span>
                                </button>
                                <button
                                  onClick={() => handleDeletePrintRate(rate.id)}
                                  className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/30 transition-all"
                                  title="Delete Variety Rate"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB: SPECIAL OFFERS & PROMO CODES */}
              {activeTab === 'promos' && (
                <div className="space-y-4">
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                        <Gift className="w-4 h-4" />
                        <span>Customise Special Offers & Promo Codes</span>
                      </h3>
                      <p className="text-xs text-slate-300 mt-1">
                        Create, edit, or delete promotional discount codes and special offer banners shown to customers.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsAddingPromo(!isAddingPromo)}
                      className="px-3.5 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isAddingPromo ? 'Cancel' : 'Add New Offer'}</span>
                    </button>
                  </div>

                  {/* Form to Add New Special Offer */}
                  {isAddingPromo && (
                    <form onSubmit={handleAddPromoSubmit} className="bg-slate-900 border border-amber-500/40 rounded-2xl p-4 space-y-3 text-xs">
                      <h4 className="font-bold text-amber-300">Create New Special Offer Banner</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-slate-400 uppercase font-mono">Offer Title</label>
                          <input
                            type="text"
                            required
                            value={newPromoForm.title}
                            onChange={(e) => setNewPromoForm({ ...newPromoForm, title: e.target.value })}
                            placeholder="e.g. Weekend Grocery & Print Super Combo"
                            className="w-full bg-slate-800 text-white p-2 rounded-lg border border-slate-700"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 uppercase font-mono">Promo Code</label>
                          <input
                            type="text"
                            required
                            value={newPromoForm.code}
                            onChange={(e) => setNewPromoForm({ ...newPromoForm, code: e.target.value.toUpperCase() })}
                            placeholder="e.g. SUPER20"
                            className="w-full bg-slate-800 text-amber-300 font-mono font-bold p-2 rounded-lg border border-slate-700"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 uppercase font-mono">Badge Tag</label>
                          <input
                            type="text"
                            value={newPromoForm.badge}
                            onChange={(e) => setNewPromoForm({ ...newPromoForm, badge: e.target.value })}
                            placeholder="e.g. 20% OFF or Limited Deal"
                            className="w-full bg-slate-800 text-white p-2 rounded-lg border border-slate-700"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 uppercase font-mono">Banner Gradient Theme</label>
                          <select
                            value={newPromoForm.color}
                            onChange={(e) => setNewPromoForm({ ...newPromoForm, color: e.target.value })}
                            className="w-full bg-slate-800 text-white p-2 rounded-lg border border-slate-700"
                          >
                            <option value="from-emerald-600 to-teal-700">Emerald Green</option>
                            <option value="from-blue-600 to-indigo-700">Ocean Blue</option>
                            <option value="from-amber-500 to-orange-600">Warm Amber/Orange</option>
                            <option value="from-purple-600 to-pink-600">Royal Purple/Pink</option>
                            <option value="from-rose-600 to-red-600">Crimson Red</option>
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-[10px] text-slate-400 uppercase font-mono">Description / Offer Details</label>
                          <textarea
                            rows={2}
                            required
                            value={newPromoForm.description}
                            onChange={(e) => setNewPromoForm({ ...newPromoForm, description: e.target.value })}
                            placeholder="Describe what customer gets (e.g. Get 5 FREE B&W A4 prints on grocery order over $20)."
                            className="w-full bg-slate-800 text-white p-2 rounded-lg border border-slate-700"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider"
                      >
                        Publish Special Offer
                      </button>
                    </form>
                  )}

                  {/* Promo Offers List */}
                  <div className="space-y-3">
                    {promosList.length === 0 ? (
                      <div className="text-center py-6 text-slate-500 text-xs">
                        No active special offers. Click "Add New Offer" to create one!
                      </div>
                    ) : (
                      promosList.map((offer) => {
                        const isEditing = editingPromoId === offer.id;
                        return (
                          <div key={offer.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
                            {isEditing && editPromoForm ? (
                              <div className="space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-[10px] text-slate-400 uppercase font-mono">Offer Title</label>
                                    <input
                                      type="text"
                                      value={editPromoForm.title}
                                      onChange={(e) => setEditPromoForm({ ...editPromoForm, title: e.target.value })}
                                      className="w-full bg-slate-800 text-white p-2 rounded-lg border border-slate-700"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] text-slate-400 uppercase font-mono">Promo Code</label>
                                    <input
                                      type="text"
                                      value={editPromoForm.code}
                                      onChange={(e) => setEditPromoForm({ ...editPromoForm, code: e.target.value.toUpperCase() })}
                                      className="w-full bg-slate-800 text-amber-300 font-mono font-bold p-2 rounded-lg border border-slate-700"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] text-slate-400 uppercase font-mono">Badge Tag</label>
                                    <input
                                      type="text"
                                      value={editPromoForm.badge}
                                      onChange={(e) => setEditPromoForm({ ...editPromoForm, badge: e.target.value })}
                                      className="w-full bg-slate-800 text-white p-2 rounded-lg border border-slate-700"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] text-slate-400 uppercase font-mono">Banner Theme</label>
                                    <select
                                      value={editPromoForm.color}
                                      onChange={(e) => setEditPromoForm({ ...editPromoForm, color: e.target.value })}
                                      className="w-full bg-slate-800 text-white p-2 rounded-lg border border-slate-700"
                                    >
                                      <option value="from-emerald-600 to-teal-700">Emerald Green</option>
                                      <option value="from-blue-600 to-indigo-700">Ocean Blue</option>
                                      <option value="from-amber-500 to-orange-600">Warm Amber/Orange</option>
                                      <option value="from-purple-600 to-pink-600">Royal Purple/Pink</option>
                                      <option value="from-rose-600 to-red-600">Crimson Red</option>
                                    </select>
                                  </div>
                                  <div className="sm:col-span-2">
                                    <label className="text-[10px] text-slate-400 uppercase font-mono">Description</label>
                                    <textarea
                                      rows={2}
                                      value={editPromoForm.description}
                                      onChange={(e) => setEditPromoForm({ ...editPromoForm, description: e.target.value })}
                                      className="w-full bg-slate-800 text-white p-2 rounded-lg border border-slate-700"
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => setEditingPromoId(null)}
                                    className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleSavePromo(editPromoForm)}
                                    className="px-4 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
                                  >
                                    Save Changes
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between gap-4">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                                      {offer.badge}
                                    </span>
                                    <span className="text-xs font-mono font-bold text-amber-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                                      CODE: {offer.code}
                                    </span>
                                  </div>
                                  <h4 className="font-bold text-white text-sm mt-1">{offer.title}</h4>
                                  <p className="text-xs text-slate-300 mt-0.5">{offer.description}</p>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    onClick={() => {
                                      setEditingPromoId(offer.id);
                                      setEditPromoForm({ ...offer });
                                    }}
                                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs font-semibold border border-slate-700 flex items-center gap-1"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    onClick={() => handleDeletePromo(offer.id)}
                                    className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/30 transition-all"
                                    title="Delete Special Offer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

          {/* TAB 7: SECURITY & PASSWORD SETTINGS */}
          {activeTab === 'security' && (
            <div className="space-y-4 max-w-md">
              <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl">
                <h3 className="text-sm font-bold text-rose-300 flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  <span>Change Owner Protective Password</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Protect your store website management portal. No one can open or edit the store settings without your secret password.
                </p>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-slate-900 text-white font-mono p-2.5 rounded-xl border border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                    New Secret Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 3 chars)"
                    className="w-full bg-slate-900 text-rose-300 font-mono font-bold p-2.5 rounded-xl border border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full bg-slate-900 text-rose-300 font-mono font-bold p-2.5 rounded-xl border border-slate-700"
                  />
                </div>

                {pwdChangeError && (
                  <div className="p-2.5 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-xs">
                    {pwdChangeError}
                  </div>
                )}

                {pwdChangeSuccess && (
                  <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> {pwdChangeSuccess}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Update Owner Password</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: EDIT PRODUCTS & PRICES */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Directly adjust product prices, stock, and descriptions below.</span>
                <span className="text-amber-400 font-semibold">{products.length} Products Available</span>
              </div>

              <div className="space-y-3">
                {products.map((product) => {
                  const isEditing = editingProductId === product.id;
                  return (
                    <div
                      key={product.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4"
                    >
                      {isEditing && editProductForm ? (
                        <div className="w-full space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                              <label className="text-[10px] text-slate-400 uppercase">Product Name</label>
                              <input
                                type="text"
                                value={editProductForm.name}
                                onChange={(e) => setEditProductForm({ ...editProductForm, name: e.target.value })}
                                className="w-full bg-slate-800 text-white p-2 rounded-lg border border-slate-700"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400 uppercase">Price ($)</label>
                              <input
                                type="number"
                                step="0.01"
                                value={editProductForm.price}
                                onChange={(e) => setEditProductForm({ ...editProductForm, price: parseFloat(e.target.value) || 0 })}
                                className="w-full bg-slate-800 text-emerald-400 font-mono font-bold p-2 rounded-lg border border-slate-700"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400 uppercase">Stock Count</label>
                              <input
                                type="number"
                                value={editProductForm.stock}
                                onChange={(e) => setEditProductForm({ ...editProductForm, stock: parseInt(e.target.value) || 0 })}
                                className="w-full bg-slate-800 text-white p-2 rounded-lg border border-slate-700"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400 uppercase">Unit Text</label>
                              <input
                                type="text"
                                value={editProductForm.unit}
                                onChange={(e) => setEditProductForm({ ...editProductForm, unit: e.target.value })}
                                className="w-full bg-slate-800 text-white p-2 rounded-lg border border-slate-700"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-amber-400 uppercase font-bold flex items-center gap-1">
                                <Star className="w-3 h-3 fill-amber-400" /> Owner Star Rating (1.0 - 5.0)
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                min="1.0"
                                max="5.0"
                                value={editProductForm.rating || 5.0}
                                onChange={(e) => setEditProductForm({ ...editProductForm, rating: parseFloat(e.target.value) || 5.0 })}
                                className="w-full bg-slate-800 text-amber-300 font-mono font-bold p-2 rounded-lg border border-slate-700"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400 uppercase">Badge Tag (Optional)</label>
                              <input
                                type="text"
                                value={editProductForm.badge || ''}
                                onChange={(e) => setEditProductForm({ ...editProductForm, badge: e.target.value })}
                                placeholder="e.g. Best Seller / Organic"
                                className="w-full bg-slate-800 text-white p-2 rounded-lg border border-slate-700"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="text-[10px] text-slate-400 uppercase">Description</label>
                              <textarea
                                rows={2}
                                value={editProductForm.description || ''}
                                onChange={(e) => setEditProductForm({ ...editProductForm, description: e.target.value })}
                                className="w-full bg-slate-800 text-slate-200 p-2 rounded-lg border border-slate-700"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setEditingProductId(null)}
                              className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSaveEditedProduct}
                              className="px-4 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs"
                            >
                              Save Product
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-xl bg-slate-800"
                            />
                            <div>
                              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                                <span>{product.name}</span>
                                <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                                  <Star className="w-3 h-3 fill-amber-400" /> {product.rating}
                                </span>
                              </h4>
                              <span className="text-[10px] text-slate-400 capitalize">{product.category.replace('-', ' ')} • {product.unit}</span>
                              <div className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
                                ${product.price.toFixed(2)} <span className="text-[10px] text-slate-500 font-normal">({product.stock} in stock)</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStartEditProduct(product)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs font-semibold border border-amber-500/30 flex items-center gap-1"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit Details & Rating</span>
                            </button>
                            <button
                              onClick={() => onDeleteProduct(product.id)}
                              className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/30"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: CYBER SERVICES & ONLINE WORK RATES */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Manage pricing, rates, and details for Cyber Hub printing, online work, & workstations.</span>
                <span className="text-indigo-400 font-semibold">{services.length} Services Configured</span>
              </div>

              <div className="space-y-3">
                {services.map((service) => {
                  const isEditing = editingServiceId === service.id;
                  return (
                    <div
                      key={service.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4"
                    >
                      {isEditing && editServiceForm ? (
                        <div className="w-full space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="sm:col-span-2">
                              <label className="text-[10px] text-slate-400 uppercase">Service Title</label>
                              <input
                                type="text"
                                value={editServiceForm.title}
                                onChange={(e) => setEditServiceForm({ ...editServiceForm, title: e.target.value })}
                                className="w-full bg-slate-800 text-white p-2 rounded-lg border border-slate-700"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400 uppercase">Starting Price ($)</label>
                              <input
                                type="number"
                                step="0.01"
                                value={editServiceForm.startingPrice}
                                onChange={(e) => setEditServiceForm({ ...editServiceForm, startingPrice: parseFloat(e.target.value) || 0 })}
                                className="w-full bg-slate-800 text-cyan-400 font-mono font-bold p-2 rounded-lg border border-slate-700"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400 uppercase">Unit Text</label>
                              <input
                                type="text"
                                value={editServiceForm.unitText}
                                onChange={(e) => setEditServiceForm({ ...editServiceForm, unitText: e.target.value })}
                                className="w-full bg-slate-800 text-white p-2 rounded-lg border border-slate-700"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="text-[10px] text-slate-400 uppercase">Description</label>
                              <textarea
                                rows={2}
                                value={editServiceForm.description}
                                onChange={(e) => setEditServiceForm({ ...editServiceForm, description: e.target.value })}
                                className="w-full bg-slate-800 text-slate-200 p-2 rounded-lg border border-slate-700 text-xs"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setEditingServiceId(null)}
                              className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSaveEditedService}
                              className="px-4 py-1.5 bg-indigo-500 text-white font-bold rounded-lg text-xs"
                            >
                              Save Service Rate
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <img
                              src={service.image}
                              alt={service.title}
                              className="w-12 h-12 object-cover rounded-xl bg-slate-800"
                            />
                            <div>
                              <h4 className="text-xs font-bold text-white">{service.title}</h4>
                              <p className="text-[10px] text-slate-400 max-w-sm line-clamp-1">{service.description}</p>
                              <div className="text-xs font-mono font-bold text-cyan-400 mt-0.5">
                                ${service.startingPrice.toFixed(2)} <span className="text-[10px] text-slate-400 font-normal">/ {service.unitText}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStartEditService(service)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs font-semibold border border-amber-500/30 flex items-center gap-1"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit Service Rate</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {activeTab === 'add-item' && (
            <form onSubmit={handleCreateNewProduct} className="space-y-4 max-w-xl text-xs">
              <h3 className="text-sm font-bold text-white">Add New Product to Store Catalog</h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-400 uppercase font-mono mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="e.g. Fresh Red Strawberries"
                    className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-700 focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-mono mb-1">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                    className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-700"
                  >
                    <option value="fruits-veg">Fresh Produce</option>
                    <option value="dairy-bakery">Dairy & Bakery</option>
                    <option value="staples">Grains & Cooking</option>
                    <option value="beverages-snacks">Snacks & Drinks</option>
                    <option value="personal-household">Household</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-mono mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 text-emerald-400 font-mono font-bold p-2.5 rounded-xl border border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-mono mb-1">Unit Text</label>
                  <input
                    type="text"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    placeholder="1 kg / 500g / pack"
                    className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-mono mb-1">Stock Units</label>
                  <input
                    type="number"
                    value={newItem.stock}
                    onChange={(e) => setNewItem({ ...newItem, stock: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-amber-400 font-bold uppercase font-mono mb-1 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> Owner Star Rating
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    value={newItem.rating}
                    onChange={(e) => setNewItem({ ...newItem, rating: parseFloat(e.target.value) || 5.0 })}
                    className="w-full bg-slate-900 text-amber-300 font-mono font-bold p-2.5 rounded-xl border border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-mono mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={newItem.badge}
                    onChange={(e) => setNewItem({ ...newItem, badge: e.target.value })}
                    placeholder="e.g. Owner Choice or Organic"
                    className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-700"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-slate-400 uppercase font-mono mb-1">Description / Details</label>
                  <textarea
                    rows={2}
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Describe product freshness, quality or origin..."
                    className="w-full bg-slate-900 text-slate-200 p-2.5 rounded-xl border border-slate-700"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-slate-400 uppercase font-mono mb-1">Image URL</label>
                  <input
                    type="url"
                    value={newItem.image}
                    onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                    className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-700 text-slate-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Item to Store</span>
              </button>
            </form>
          )}

          {/* TAB 4: LIVE CUSTOMER ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Live Customer Pickup Tokens & Orders</h3>
                <button
                  onClick={fetchOrders}
                  className="px-3 py-1.5 bg-slate-800 text-cyan-400 rounded-lg text-xs flex items-center gap-1 border border-slate-700"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>
              </div>

              {ordersLoading ? (
                <div className="text-center py-8 text-slate-400 text-xs">Loading orders...</div>
              ) : liveOrders.length === 0 ? (
                <div className="text-center py-8 bg-slate-900 rounded-2xl border border-slate-800 text-slate-500 text-xs">
                  No orders placed yet. Add items to basket and complete checkout to simulate live orders!
                </div>
              ) : (
                <div className="space-y-3">
                  {liveOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div>
                          <span className="text-[10px] text-slate-400 font-mono">TOKEN</span>
                          <div className="text-lg font-mono font-bold text-amber-300">{ord.tokenNumber}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-mono">TOTAL</span>
                          <div className="text-base font-mono font-bold text-cyan-400">${ord.total.toFixed(2)}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-slate-300">
                        <div><span className="text-slate-500">Customer:</span> {ord.customerName} ({ord.customerPhone})</div>
                        <div><span className="text-slate-500">Mode:</span> {ord.fulfillmentType}</div>
                      </div>

                      <div className="text-[11px] text-slate-400 bg-slate-950 p-2 rounded-lg">
                        Items ({ord.items.length}): {ord.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </>
    )}
  </div>
</div>
  );
};
