import React, { useState } from 'react';
import { Sparkles, Utensils, FileText, ShoppingBag, Plus, Check, ArrowRight, Loader2, Lightbulb } from 'lucide-react';
import { GroceryProduct, CartItem } from '../types';

interface AiAssistantSectionProps {
  products: GroceryProduct[];
  onAddToCart: (item: CartItem) => void;
  onNavigateCyber: () => void;
}

export const AiAssistantSection: React.FC<AiAssistantSectionProps> = ({
  products,
  onAddToCart,
  onNavigateCyber,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'recipe' | 'document'>('recipe');

  // Recipe AI State
  const [recipeQuery, setRecipeQuery] = useState('Healthy avocado & egg breakfast for 2');
  const [isRecipeLoading, setIsRecipeLoading] = useState(false);
  const [recipeResult, setRecipeResult] = useState<any | null>({
    mealTitle: 'Organic Avocado & Protein Egg Toast Bundle',
    description: 'A nutritious, energizing breakfast kit rich in healthy omega fats and protein.',
    suggestedProductIds: ['g-1', 'g-2', 'g-3', 'g-9'],
    cookingTips: [
      'Toast the whole wheat bread until golden crisp.',
      'Squeeze fresh citrus juice over avocados to prevent browning.'
    ]
  });

  // Document AI State
  const [docDescription, setDocDescription] = useState('50 page university research thesis with color graphs and hardcover requirement');
  const [isDocLoading, setIsDocLoading] = useState(false);
  const [docResult, setDocResult] = useState<any | null>({
    summary: 'Recommended Hardcover Color Thesis Print Config',
    recommendedPages: 50,
    paperSize: 'A4',
    printType: 'color',
    sides: 'double',
    binding: 'hardcover',
    lamination: false,
    advice: 'Double-sided color printing on 100gsm paper keeps your thesis compact while preserving high resolution chart colors.'
  });

  const [addedKit, setAddedKit] = useState(false);

  // Handle Recipe API call
  const handleGenerateRecipe = async () => {
    if (!recipeQuery.trim()) return;
    setIsRecipeLoading(true);
    setAddedKit(false);

    try {
      const res = await fetch('/api/ai/recipe-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: recipeQuery }),
      });
      const data = await res.json();
      setRecipeResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRecipeLoading(false);
    }
  };

  // Handle Document Print API call
  const handleAnalyzeDocument = async () => {
    if (!docDescription.trim()) return;
    setIsDocLoading(true);

    try {
      const res = await fetch('/api/ai/doc-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentDescription: docDescription, taskType: 'print' }),
      });
      const data = await res.json();
      setDocResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDocLoading(false);
    }
  };

  // Add all suggested items in recipe bundle to cart
  const handleAddBundleToCart = () => {
    if (!recipeResult || !recipeResult.suggestedProductIds) return;

    const matchedProducts = products.filter((p) =>
      recipeResult.suggestedProductIds.includes(p.id)
    );

    matchedProducts.forEach((product) => {
      onAddToCart({
        cartItemId: `bundle-${product.id}-${Date.now()}`,
        itemType: 'grocery',
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        unitOrSummary: product.unit,
        image: product.image,
      });
    });

    setAddedKit(true);
    setTimeout(() => setAddedKit(false), 2000);
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 p-6 sm:p-8 rounded-3xl border border-indigo-500/30 mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Sparkles className="w-5 h-5 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Gemini AI Smart Shopping & Print Advisor
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Let artificial intelligence curate custom grocery meal kits or determine the exact print settings & cost for complex documents.
            </p>
          </div>

          <div className="flex bg-slate-900/90 p-1 rounded-2xl border border-slate-700/80 text-xs font-semibold">
            <button
              onClick={() => setActiveSubTab('recipe')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeSubTab === 'recipe'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>AI Grocery Chef</span>
            </button>
            <button
              onClick={() => setActiveSubTab('document')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeSubTab === 'document'
                  ? 'bg-indigo-600 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>AI Document Specialist</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: AI GROCERY CHEF */}
      {activeSubTab === 'recipe' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Query Box */}
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Utensils className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Ask AI Chef What to Cook</h3>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Describe a recipe, diet preference, or craving. The AI will curate matching fresh items from our store catalog.
              </p>

              <textarea
                rows={4}
                value={recipeQuery}
                onChange={(e) => setRecipeQuery(e.target.value)}
                placeholder="e.g. Italian pasta dinner for 4 with fresh veggies and garlic bread..."
                className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-700 text-xs focus:outline-none focus:border-emerald-400"
              />

              <div className="mt-3 flex flex-wrap gap-1.5">
                <button
                  onClick={() => setRecipeQuery('Fresh fruit smoothie bowl bundle with bananas & milk')}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700"
                >
                  🍌 Smoothie Bowl
                </button>
                <button
                  onClick={() => setRecipeQuery('Quick healthy egg and whole grain breakfast')}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700"
                >
                  🍳 Protein Toast
                </button>
                <button
                  onClick={() => setRecipeQuery('Organic salad kit with fresh tomatoes & olive oil')}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700"
                >
                  🥗 Fresh Salad
                </button>
              </div>
            </div>

            <button
              onClick={handleGenerateRecipe}
              disabled={isRecipeLoading}
              className="mt-6 w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              {isRecipeLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Curating Grocery Bundle...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Meal Bundle</span>
                </>
              )}
            </button>
          </div>

          {/* AI Result Meal Kit Panel */}
          <div className="lg:col-span-2 bg-[#1E293B] border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            {recipeResult ? (
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                      AI CURATED MEAL KIT
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1">{recipeResult.mealTitle}</h3>
                  </div>
                  <button
                    onClick={handleAddBundleToCart}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                      addedKit
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                    }`}
                  >
                    {addedKit ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                    <span>{addedKit ? 'Bundle Added to Basket' : 'Add Meal Kit to Basket'}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {recipeResult.description}
                </p>

                {/* Suggested Products Grid */}
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Included Store Ingredients:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {products
                    .filter((p) => recipeResult.suggestedProductIds?.includes(p.id))
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-2.5 bg-slate-900 rounded-xl border border-slate-800"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-bold text-white truncate">{item.name}</h5>
                          <span className="text-[10px] text-slate-400">per {item.unit}</span>
                          <div className="text-xs font-mono font-bold text-emerald-400">
                            ${item.price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Chef Tips */}
                {recipeResult.cookingTips && (
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
                    <div className="flex items-center gap-1.5 text-amber-300 font-bold mb-1">
                      <Lightbulb className="w-4 h-4 text-amber-400" />
                      <span>AI Chef Tips:</span>
                    </div>
                    <ul className="list-disc list-inside text-slate-300 space-y-1 pl-1">
                      {recipeResult.cookingTips.map((tip: string, idx: number) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                Enter your desired recipe above and click "Generate Meal Bundle"
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: AI DOCUMENT SPECIALIST */}
      {activeSubTab === 'document' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Analyze Document Print Needs</h3>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Type what you need printed (e.g. Legal contracts, Thesis reports, Passport photos, Pamphlets).
              </p>

              <textarea
                rows={4}
                value={docDescription}
                onChange={(e) => setDocDescription(e.target.value)}
                placeholder="e.g. 25 double-sided color brochures for business presentation..."
                className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-700 text-xs focus:outline-none focus:border-indigo-400"
              />
            </div>

            <button
              onClick={handleAnalyzeDocument}
              disabled={isDocLoading}
              className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              {isDocLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing Requirements...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Get Printing Recommendation</span>
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-2 bg-[#1E293B] border border-slate-700 rounded-2xl p-6 shadow-xl">
            {docResult ? (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-700">
                  <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">
                    AI SPECIALIST RECOMMENDATION
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">{docResult.summary}</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Paper Size</div>
                    <div className="text-sm font-bold text-white mt-1">{docResult.paperSize}</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Print Mode</div>
                    <div className="text-sm font-bold text-cyan-400 mt-1 uppercase">{docResult.printType}</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Sides</div>
                    <div className="text-sm font-bold text-white mt-1 capitalize">{docResult.sides}</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Binding</div>
                    <div className="text-sm font-bold text-indigo-400 mt-1 capitalize">{docResult.binding}</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="text-xs text-indigo-300 font-semibold mb-1">Specialist Advice:</div>
                  <p className="text-xs text-slate-300 leading-relaxed">{docResult.advice}</p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={onNavigateCyber}
                    className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                  >
                    <span>Proceed to Cyber Configurator</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                Enter your document description above for AI analysis
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
