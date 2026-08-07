import React, { useState } from 'react';
import { Sparkles, ShoppingBag, Printer, ArrowRight, Loader2, Check, ChefHat, FileText, Lightbulb } from 'lucide-react';
import { GroceryProduct, CartItem } from '../types';

interface AiAssistantProps {
  products: GroceryProduct[];
  onAddToCart: (item: CartItem) => void;
  onOpenPrintConfiguratorWithValues?: (config: any) => void;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({
  products,
  onAddToCart,
}) => {
  const [activeTab, setActiveTab] = useState<'recipe' | 'document'>('recipe');

  // Recipe AI State
  const [recipePrompt, setRecipePrompt] = useState('');
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [recipeResult, setRecipeResult] = useState<{
    mealTitle: string;
    description: string;
    suggestedProductIds: string[];
    cookingTips: string[];
  } | null>(null);

  // Document Print AI State
  const [docPrompt, setDocPrompt] = useState('');
  const [docLoading, setDocLoading] = useState(false);
  const [docResult, setDocResult] = useState<{
    summary: string;
    recommendedPages: number;
    paperSize: string;
    printType: string;
    sides: string;
    binding: string;
    lamination: boolean;
    advice: string;
  } | null>(null);

  const [addedAllBundle, setAddedAllBundle] = useState(false);

  // Suggested Prompts
  const recipeSuggestions = [
    'Quick healthy breakfast kit under $10',
    'Fresh fruit smoothie & high protein snack',
    'Italian dinner kit: Pasta, olive oil & veggies',
    'Low-carb fresh salad with apples & cashews'
  ];

  const docSuggestions = [
    '50 page college thesis with color diagrams & binding',
    '8 copies of passport photo + identity documents',
    '20 page corporate project report with hardcover',
    'Single page flyer printing on A3 glossy paper'
  ];

  // Call AI Recipe API
  const handleGenerateRecipe = async (promptToUse?: string) => {
    const text = promptToUse || recipePrompt;
    if (!text.trim()) return;

    setRecipeLoading(true);
    try {
      const res = await fetch('/api/ai/recipe-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text }),
      });
      const data = await res.json();
      setRecipeResult(data);
    } catch (err) {
      console.error('AI Recipe Error:', err);
    } finally {
      setRecipeLoading(false);
    }
  };

  // Call AI Document API
  const handleGenerateDocAdvice = async (promptToUse?: string) => {
    const text = promptToUse || docPrompt;
    if (!text.trim()) return;

    setDocLoading(true);
    try {
      const res = await fetch('/api/ai/doc-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentDescription: text }),
      });
      const data = await res.json();
      setDocResult(data);
    } catch (err) {
      console.error('AI Doc Error:', err);
    } finally {
      setDocLoading(false);
    }
  };

  // Add all bundle items to cart
  const handleAddFullBundleToCart = () => {
    if (!recipeResult) return;
    const itemsToAdd = products.filter((p) => recipeResult.suggestedProductIds.includes(p.id));

    itemsToAdd.forEach((product) => {
      onAddToCart({
        cartItemId: `ai-g-${product.id}-${Date.now()}`,
        itemType: 'grocery',
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        unitOrSummary: product.unit,
        image: product.image,
      });
    });

    setAddedAllBundle(true);
    setTimeout(() => setAddedAllBundle(false), 2000);
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl mb-8">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold mb-3">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>Powered by Gemini 3.6 Flash</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Smart Cyber & Grocery AI Advisor
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
              Describe what you want to cook or what document you need to print. Our AI will curate exact products, optimize paper costs, and create instant 1-click order bundles.
            </p>
          </div>

          <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-indigo-500/30 shrink-0 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('recipe')}
              className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'recipe'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ChefHat className="w-4 h-4" />
              <span>AI Grocery Chef</span>
            </button>
            <button
              onClick={() => setActiveTab('document')}
              className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'document'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>AI Print Optimizer</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: AI GROCERY & RECIPE CHEF */}
      {activeTab === 'recipe' && (
        <div className="space-y-6">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6">
            <label className="block text-sm font-bold text-white mb-2">
              What meal or dish are you planning to make today?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={recipePrompt}
                onChange={(e) => setRecipePrompt(e.target.value)}
                placeholder="e.g. Quick healthy breakfast with eggs, fresh fruits and milk..."
                className="flex-1 bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateRecipe()}
              />
              <button
                onClick={() => handleGenerateRecipe()}
                disabled={recipeLoading || !recipePrompt.trim()}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-2 transition-all"
              >
                {recipeLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Curating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Build Grocery Bundle</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Prompts */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold">Try asking:</span>
              {recipeSuggestions.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setRecipePrompt(sug);
                    handleGenerateRecipe(sug);
                  }}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/60 transition-colors"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* AI Result Card */}
          {recipeResult && (
            <div className="bg-slate-800/90 border border-emerald-500/30 rounded-2xl p-6 space-y-6 shadow-xl animate-in fade-in">
              <div className="flex items-start justify-between border-b border-slate-700 pb-4">
                <div>
                  <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                    AI Curated Recipe Kit
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">{recipeResult.mealTitle}</h3>
                  <p className="text-xs text-slate-300 mt-1">{recipeResult.description}</p>
                </div>

                <button
                  onClick={handleAddFullBundleToCart}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
                    addedAllBundle
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  }`}
                >
                  {addedAllBundle ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added Bundle to Basket!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add All Ingredients to Basket</span>
                    </>
                  )}
                </button>
              </div>

              {/* Matched Products */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Matching Ingredients from Store Catalog:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {products
                    .filter((p) => recipeResult.suggestedProductIds.includes(p.id))
                    .map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-900 p-3 rounded-xl border border-slate-700/60 flex items-center gap-3"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-950"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-bold text-white truncate">{item.name}</h5>
                          <div className="text-xs font-semibold text-emerald-400">
                            ${item.price.toFixed(2)} / {item.unit}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Cooking Tips */}
              {recipeResult.cookingTips?.length > 0 && (
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/60">
                  <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mb-2">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    Chef's Prep Tips:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                    {recipeResult.cookingTips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AI PRINT OPTIMIZER */}
      {activeTab === 'document' && (
        <div className="space-y-6">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6">
            <label className="block text-sm font-bold text-white mb-2">
              Describe your document and printing requirement:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={docPrompt}
                onChange={(e) => setDocPrompt(e.target.value)}
                placeholder="e.g. I need to print a 30 page college project with graphs and spiral binding..."
                className="flex-1 bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateDocAdvice()}
              />
              <button
                onClick={() => handleGenerateDocAdvice()}
                disabled={docLoading || !docPrompt.trim()}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-indigo-600/25 disabled:opacity-50 flex items-center gap-2 transition-all"
              >
                {docLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Get Cost Advice</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold">Try asking:</span>
              {docSuggestions.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDocPrompt(sug);
                    handleGenerateDocAdvice(sug);
                  }}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/60 transition-colors"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* AI Result Card */}
          {docResult && (
            <div className="bg-slate-800/90 border border-indigo-500/30 rounded-2xl p-6 space-y-4 shadow-xl animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <span className="text-xs font-bold text-indigo-300">
                  AI Recommended Print Configuration
                </span>
                <span className="text-xs font-bold text-emerald-400">
                  Paper Cost Optimized
                </span>
              </div>

              <h4 className="text-base font-bold text-white">{docResult.summary}</h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-700">
                  <div className="text-slate-400">Paper Size</div>
                  <div className="font-bold text-white mt-0.5">{docResult.paperSize}</div>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-700">
                  <div className="text-slate-400">Color Mode</div>
                  <div className="font-bold text-white capitalize mt-0.5">{docResult.printType}</div>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-700">
                  <div className="text-slate-400">Sides</div>
                  <div className="font-bold text-emerald-400 mt-0.5">{docResult.sides}</div>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-700">
                  <div className="text-slate-400">Binding</div>
                  <div className="font-bold text-white capitalize mt-0.5">{docResult.binding}</div>
                </div>
              </div>

              <div className="p-3 bg-indigo-950/50 border border-indigo-500/30 rounded-xl text-xs text-indigo-200">
                <span className="font-bold">Expert Tip: </span>
                {docResult.advice}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
