import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Minus,
  Check,
  Star,
  Sparkles,
  Info,
  Filter,
  Search,
  Tag,
  Flame,
  Leaf
} from 'lucide-react';
import { GroceryProduct, GroceryCategory, CartItem } from '../types';

interface GrocerySectionProps {
  products: GroceryProduct[];
  searchQuery: string;
  onAddToCart: (item: CartItem) => void;
  onOpenAiAssistant: () => void;
  isOwnerMode?: boolean;
  onQuickEditProduct?: (product: GroceryProduct) => void;
}

const CATEGORIES: { key: GroceryCategory; label: string; icon: string }[] = [
  { key: 'all', label: 'All Groceries', icon: '🛒' },
  { key: 'fruits-veg', label: 'Fresh Produce', icon: '🍎' },
  { key: 'dairy-bakery', label: 'Dairy & Bakery', icon: '🥛' },
  { key: 'staples', label: 'Grains & Cooking', icon: '🌾' },
  { key: 'beverages-snacks', label: 'Snacks & Drinks', icon: '☕' },
  { key: 'personal-household', label: 'Household Essentials', icon: '🧹' }
];

export const GrocerySection: React.FC<GrocerySectionProps> = ({
  products,
  searchQuery,
  onAddToCart,
  onOpenAiAssistant,
  isOwnerMode,
  onQuickEditProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<GroceryCategory>('all');
  const [selectedProductDetails, setSelectedProductDetails] = useState<GroceryProduct | null>(null);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const filteredProducts = products.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddProduct = (product: GroceryProduct) => {
    onAddToCart({
      cartItemId: `g-${product.id}-${Date.now()}`,
      itemType: 'grocery',
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      unitOrSummary: product.unit,
      image: product.image,
    });

    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShoppingBag className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Fresh Grocery Superstore
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Handpicked farm-fresh veggies, dairy, artisan bakery items & daily household staples.
          </p>
        </div>

        {/* AI Recipe Assistant Shortcut */}
        <button
          onClick={onOpenAiAssistant}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600/30 via-teal-600/30 to-indigo-600/30 hover:from-emerald-600/40 hover:to-indigo-600/40 text-emerald-300 border border-emerald-500/30 text-xs font-semibold shadow-md transition-all"
        >
          <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '4s' }} />
          <span>Ask AI Chef for Custom Grocery Bundle</span>
        </button>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.key
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-bold scale-105'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/40 rounded-2xl border border-slate-800">
          <ShoppingBag className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No grocery products found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search query or selecting a different category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product) => {
            const isAdded = addedIds[product.id];
            return (
              <div
                key={product.id}
                className="group relative bg-slate-800/60 hover:bg-slate-800 rounded-2xl border border-slate-700/60 overflow-hidden shadow-lg hover:shadow-2xl hover:border-slate-600 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Product Image & Badges */}
                <div className="relative aspect-video w-full bg-slate-950 overflow-hidden cursor-pointer" onClick={() => setSelectedProductDetails(product)}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {product.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 shadow-md">
                        {product.badge}
                      </span>
                    )}
                    {product.isOrganic && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-lime-500 text-slate-950 flex items-center gap-1 shadow-md">
                        <Leaf className="w-3 h-3" /> Organic
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="absolute bottom-2 right-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                      product.stock > 10
                        ? 'bg-slate-900/80 text-emerald-400 border border-emerald-500/30'
                        : product.stock > 0
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="capitalize">{product.category.replace('-', ' ')}</span>
                      <div className="flex items-center gap-1 text-amber-400 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{product.rating}</span>
                      </div>
                    </div>

                    <h3
                      onClick={() => setSelectedProductDetails(product)}
                      className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors cursor-pointer line-clamp-1"
                    >
                      {product.name}
                    </h3>

                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Price & Add to Cart */}
                  <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-extrabold text-white">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-slate-500 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">per {product.unit}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleAddProduct(product)}
                        disabled={product.stock <= 0}
                        className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : product.stock > 0
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProductDetails && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="relative aspect-video w-full bg-slate-950">
              <img
                src={selectedProductDetails.image}
                alt={selectedProductDetails.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedProductDetails(null)}
                className="absolute top-3 right-3 bg-slate-900/80 text-white p-1.5 rounded-full hover:bg-slate-800"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="capitalize">{selectedProductDetails.category.replace('-', ' ')}</span>
                <span className="text-amber-400 font-semibold flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400" /> {selectedProductDetails.rating} / 5.0
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">{selectedProductDetails.name}</h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                {selectedProductDetails.description}
              </p>

              <div className="mt-4 p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Unit Price</div>
                  <div className="text-xl font-black text-emerald-400">
                    ${selectedProductDetails.price.toFixed(2)} <span className="text-xs font-normal text-slate-400">/ {selectedProductDetails.unit}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Inventory</div>
                  <div className="text-xs font-semibold text-white">
                    {selectedProductDetails.stock} units available
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedProductDetails(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-700"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleAddProduct(selectedProductDetails);
                    setSelectedProductDetails(null);
                  }}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-emerald-500/20"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
