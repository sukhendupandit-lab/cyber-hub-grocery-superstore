import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PromoBanner } from './components/PromoBanner';
import { CustomizationNoticeBanner } from './components/CustomizationNoticeBanner';
import { GrocerySection } from './components/GrocerySection';
import { CyberSection } from './components/CyberSection';
import { AiAssistantSection } from './components/AiAssistantSection';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { StoreInfoModal } from './components/StoreInfoModal';
import { MerchantAdminModal } from './components/MerchantAdminModal';
import { CartItem, GroceryProduct, CyberService, Order, PromoOffer } from './types';
import { GROCERY_PRODUCTS, CYBER_SERVICES, PROMO_OFFERS } from './data/mockData';

export default function App() {
  // Store Settings & Branding State
  const [storeName, setStoreName] = useState('CYBER HUB');
  const [storeTagline, setStoreTagline] = useState('Cyber Hub for Online Work, Fast Printing & Fresh Groceries');
  const [storeNotice, setStoreNotice] = useState('Store Open • Cyber Hub Online Work, High-Speed Printing & Fresh Grocery Orders Active!');

  // Navigation & Search State
  const [activeTab, setActiveTab] = useState<'all' | 'grocery' | 'cyber' | 'ai-assistant'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Store Catalog Data
  const [products, setProducts] = useState<GroceryProduct[]>(GROCERY_PRODUCTS);
  const [services, setServices] = useState<CyberService[]>(CYBER_SERVICES);
  const [promos, setPromos] = useState<PromoOffer[]>(PROMO_OFFERS);

  // Cart & Orders State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  // Modals Visibility
  const [cartOpen, setCartOpen] = useState(false);
  const [orderTrackerOpen, setOrderTrackerOpen] = useState(false);
  const [storeInfoOpen, setStoreInfoOpen] = useState(false);
  const [merchantAdminOpen, setMerchantAdminOpen] = useState(false);

  // Fetch initial store metadata & catalog from backend
  useEffect(() => {
    const loadStoreData = async () => {
      try {
        const [settingsRes, productsRes, servicesRes, promosRes] = await Promise.all([
          fetch('/api/settings'),
          fetch('/api/products'),
          fetch('/api/services'),
          fetch('/api/promos'),
        ]);

        if (settingsRes.ok) {
          const sData = await settingsRes.json();
          if (sData.settings?.storeName) setStoreName(sData.settings.storeName);
          if (sData.settings?.storeTagline) setStoreTagline(sData.settings.storeTagline);
          if (sData.settings?.notice) setStoreNotice(sData.settings.notice);
        }

        if (productsRes.ok) {
          const pData = await productsRes.json();
          if (pData.products?.length > 0) setProducts(pData.products);
        }

        if (servicesRes.ok) {
          const cData = await servicesRes.json();
          if (cData.services?.length > 0) setServices(cData.services);
        }

        if (promosRes.ok) {
          const prData = await promosRes.json();
          if (prData.promos?.length >= 0) setPromos(prData.promos);
        }
      } catch (err) {
        console.log('Backend sync notice: Running with fast in-memory client state');
      }
    };

    loadStoreData();
  }, []);

  // Update browser document title when storeName changes
  useEffect(() => {
    document.title = `${storeName} | Fresh Grocery & Cyber Cafe Superstore`;
  }, [storeName]);

  // Cart Handlers
  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.cartItemId === item.cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += item.quantity;
        return updated;
      }
      return [...prev, item];
    });
  };

  const handleUpdateCartQuantity = (cartItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Merchant Admin Handlers (Edit Store Name, Products, Prices, Services)
  const handleUpdateStoreName = (newName: string, newTagline?: string, newNotice?: string) => {
    setStoreName(newName);
    if (newTagline) setStoreTagline(newTagline);
    if (newNotice !== undefined) setStoreNotice(newNotice);
  };

  const handleUpdateProduct = async (updatedProduct: GroceryProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );

    try {
      await fetch(`/api/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });
    } catch (err) {
      console.error('API update product error:', err);
    }
  };

  const handleAddProduct = async (newProdData: Partial<GroceryProduct>) => {
    const newProduct: GroceryProduct = {
      id: `g-custom-${Date.now()}`,
      name: newProdData.name || 'New Product',
      category: (newProdData.category as any) || 'staples',
      price: Number(newProdData.price) || 2.99,
      unit: newProdData.unit || '1 unit',
      stock: Number(newProdData.stock) || 50,
      rating: newProdData.rating !== undefined ? Number(newProdData.rating) : 5.0,
      image: newProdData.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
      description: newProdData.description || 'Quality store item',
      badge: newProdData.badge,
    };

    setProducts((prev) => [newProduct, ...prev]);

    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
    } catch (err) {
      console.error('API add product error:', err);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    try {
      await fetch(`/api/products/${productId}`, { method: 'DELETE' });
    } catch (err) {
      console.error('API delete product error:', err);
    }
  };

  const handleUpdateService = async (updatedService: CyberService) => {
    setServices((prev) =>
      prev.map((s) => (s.id === updatedService.id ? updatedService : s))
    );

    try {
      await fetch(`/api/services/${updatedService.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedService),
      });
    } catch (err) {
      console.error('API update service error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 font-sans flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950">
      <div>
        {/* Main Header */}
        <Header
          storeName={storeName}
          storeTagline={storeTagline}
          cartItems={cartItems}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenCart={() => setCartOpen(true)}
          onOpenOrderTracker={() => setOrderTrackerOpen(true)}
          onOpenStoreInfo={() => setStoreInfoOpen(true)}
          onOpenMerchantAdmin={() => setMerchantAdminOpen(true)}
        />

        {/* Customization Notice Banner */}
        <CustomizationNoticeBanner
          storeName={storeName}
          noticeText={storeNotice}
        />

        {/* Promo Bar */}
        <PromoBanner promos={promos} />

        {/* Dynamic Views */}
        {activeTab === 'all' && (
          <main className="space-y-4">
            <HeroSection
              storeName={storeName}
              storeTagline={storeTagline}
              onNavigateGrocery={() => setActiveTab('grocery')}
              onNavigateCyber={() => setActiveTab('cyber')}
              onOpenAiAssistant={() => setActiveTab('ai-assistant')}
              onOpenMerchantAdmin={() => setMerchantAdminOpen(true)}
            />

            <GrocerySection
              products={products}
              searchQuery={searchQuery}
              onAddToCart={handleAddToCart}
              onOpenAiAssistant={() => setActiveTab('ai-assistant')}
              isOwnerMode={true}
              onQuickEditProduct={handleUpdateProduct}
            />

            <CyberSection
              services={services}
              onAddToCart={handleAddToCart}
              onOpenAiDocAssistant={() => setActiveTab('ai-assistant')}
              isOwnerMode={true}
              onQuickEditService={handleUpdateService}
            />
          </main>
        )}

        {activeTab === 'grocery' && (
          <main>
            <GrocerySection
              products={products}
              searchQuery={searchQuery}
              onAddToCart={handleAddToCart}
              onOpenAiAssistant={() => setActiveTab('ai-assistant')}
              isOwnerMode={true}
              onQuickEditProduct={handleUpdateProduct}
            />
          </main>
        )}

        {activeTab === 'cyber' && (
          <main>
            <CyberSection
              services={services}
              onAddToCart={handleAddToCart}
              onOpenAiDocAssistant={() => setActiveTab('ai-assistant')}
              isOwnerMode={true}
              onQuickEditService={handleUpdateService}
            />
          </main>
        )}

        {activeTab === 'ai-assistant' && (
          <main>
            <AiAssistantSection
              products={products}
              onAddToCart={handleAddToCart}
              onNavigateCyber={() => setActiveTab('cyber')}
            />
          </main>
        )}
      </div>

      {/* Professional Polish Footer Bar */}
      <footer className="mt-12 px-6 py-4 bg-[#1E293B] border-t border-slate-800 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>
                Store Status: <span className="text-slate-200 font-bold uppercase">FULLY STOCKED & ONLINE</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span>
                Delivery Dispatch: <span className="text-slate-200 font-mono">EXPRESS 30 MIN</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => setStoreInfoOpen(true)} className="hover:text-cyan-400 transition-colors">
              LOCATION & HOURS
            </button>
            <span>•</span>
            <button onClick={() => setOrderTrackerOpen(true)} className="hover:text-cyan-400 transition-colors">
              TRACK TOKEN
            </button>
            <span>•</span>
            <button onClick={() => setMerchantAdminOpen(true)} className="hover:text-amber-300 transition-colors text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
              OWNER ADMIN PORTAL
            </button>
            <span>•</span>
            <span className="text-slate-500 font-mono">© 2026 {storeName.toUpperCase()} EXPRESS</span>
          </div>
        </div>
      </footer>

      {/* Modals & Slide-over Drawers */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onOrderCreated={(order) => setRecentOrders((prev) => [order, ...prev])}
        storeName={storeName}
      />

      <OrderTrackerModal
        isOpen={orderTrackerOpen}
        onClose={() => setOrderTrackerOpen(false)}
      />

      <StoreInfoModal
        isOpen={storeInfoOpen}
        onClose={() => setStoreInfoOpen(false)}
        storeName={storeName}
        storeTagline={storeTagline}
      />

      <MerchantAdminModal
        isOpen={merchantAdminOpen}
        onClose={() => setMerchantAdminOpen(false)}
        storeName={storeName}
        onUpdateStoreName={handleUpdateStoreName}
        products={products}
        services={services}
        promos={promos}
        onUpdateProduct={handleUpdateProduct}
        onAddProduct={handleAddProduct}
        onDeleteProduct={handleDeleteProduct}
        onUpdateService={handleUpdateService}
        onUpdatePromos={(newPromos) => setPromos(newPromos)}
      />
    </div>
  );
}
