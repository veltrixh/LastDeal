import React, { useState } from 'react';
import { useStore } from '../StoreContext';
import { Sparkles, Plus, Check, QrCode, Store, Clock, ArrowUpRight, TrendingUp, AlertCircle, CheckCircle2, Eye, Zap, Tag } from 'lucide-react';
import { AiPredictionResult } from '../types';

const CATEGORY_IMAGES: Record<string, string> = {
  'Bakery': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
  'Dairy': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
  'Beverages': 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&auto=format&fit=crop&q=80',
  'Snacks': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80',
  'Fresh Produce': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80'
};

const SAMPLE_PRESETS = [
  {
    title: 'Fresh Sourdough Bread Loaf (Evening Batch)',
    category: 'Bakery',
    originalPrice: '60',
    discountedPrice: '35',
    quantity: '12',
    expiryHours: '24',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80'
  },
  {
    title: 'Organic Cow Milk Carton (1 Litre)',
    category: 'Dairy',
    originalPrice: '75',
    discountedPrice: '45',
    quantity: '20',
    expiryHours: '20',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80'
  },
  {
    title: 'Artisan Choco Chunk Cookies (Pack of 6)',
    category: 'Snacks',
    originalPrice: '140',
    discountedPrice: '79',
    quantity: '15',
    expiryHours: '48',
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80'
  },
  {
    title: 'Cold Pressed Valencia Orange Juice (500ml)',
    category: 'Beverages',
    originalPrice: '120',
    discountedPrice: '69',
    quantity: '10',
    expiryHours: '24',
    imageUrl: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&auto=format&fit=crop&q=80'
  }
];

export const MerchantDashboard: React.FC = () => {
  const { deals, reservations, addDeal, markPickedUp, predictAiPrice, user, setSelectedCategory, setHighlightDealId } = useStore();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('Bakery');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [quantity, setQuantity] = useState('5');
  const [expiryHours, setExpiryHours] = useState('24');
  const [imageUrl, setImageUrl] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [aiPrediction, setAiPrediction] = useState<AiPredictionResult | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [lastCreatedDealTitle, setLastCreatedDealTitle] = useState<string | null>(null);

  const [pickupTab, setPickupTab] = useState<'pending' | 'history'>('pending');

  const pendingPickups = reservations.filter(r => r.status === 'reserved');
  const completedPickups = reservations.filter(r => r.status === 'picked_up');

  // Load a quick sample preset
  const handleApplyPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setTitle(preset.title);
    setCategory(preset.category);
    setOriginalPrice(preset.originalPrice);
    setDiscountedPrice(preset.discountedPrice);
    setQuantity(preset.quantity);
    setExpiryHours(preset.expiryHours);
    setImageUrl(preset.imageUrl);
    setFormError(null);
  };

  // Quick discount percentage shortcuts
  const handleQuickDiscount = (pct: number) => {
    if (!originalPrice || isNaN(Number(originalPrice))) {
      setFormError('Please enter the regular price first to calculate discount.');
      return;
    }
    const orig = Number(originalPrice);
    const calculated = Math.round(orig * (1 - pct / 100));
    setDiscountedPrice(calculated.toString());
    setFormError(null);
  };

  // AI Pricing calculation
  const handleCalculateAi = async () => {
    if (!originalPrice || isNaN(Number(originalPrice))) {
      setFormError('Please enter a regular price first.');
      return;
    }
    setFormError(null);
    setIsPredicting(true);
    try {
      const pred = await predictAiPrice({
        originalPrice: Number(originalPrice),
        expiryHours: Number(expiryHours) || 24,
        category,
        quantity: Number(quantity) || 5
      });
      setAiPrediction(pred);
      setDiscountedPrice(pred.recommendedPrice.toString());
    } catch (err) {
      console.error(err);
    } finally {
      setIsPredicting(false);
    }
  };

  const handleApplyAi = () => {
    if (aiPrediction) {
      setDiscountedPrice(aiPrediction.recommendedPrice.toString());
    }
  };

  const handleOriginalPriceChange = (val: string) => {
    setOriginalPrice(val);
    setFormError(null);
    if (val && !isNaN(Number(val)) && (!discountedPrice || Number(discountedPrice) >= Number(val))) {
      const suggested = Math.round(Number(val) * 0.6);
      setDiscountedPrice(suggested.toString());
    }
  };

  const handlePublishDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError('Please enter a product title.');
      return;
    }
    if (!originalPrice || isNaN(Number(originalPrice)) || Number(originalPrice) <= 0) {
      setFormError('Please enter a valid regular price.');
      return;
    }
    if (!discountedPrice || isNaN(Number(discountedPrice)) || Number(discountedPrice) <= 0) {
      setFormError('Please enter a valid discounted price.');
      return;
    }
    if (Number(discountedPrice) >= Number(originalPrice)) {
      setFormError('Discounted deal price must be less than regular price.');
      return;
    }
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) < 1) {
      setFormError('Please enter a valid quantity in stock (at least 1).');
      return;
    }

    setIsPublishing(true);
    try {
      const exp = Number(expiryHours) || 24;
      const created = await addDeal({
        merchantId: 'm1',
        merchantName: user?.name || 'Corner Bakehouse & Supermart',
        title: title.trim(),
        subtitle: subtitle.trim() || `${category} Surplus Deal`,
        description: 'Fresh surplus item listed directly from store inventory at optimal markdown.',
        category,
        originalPrice: Number(originalPrice),
        discountedPrice: Number(discountedPrice),
        discountPercentage: Math.round(((Number(originalPrice) - Number(discountedPrice)) / Number(originalPrice)) * 100),
        quantity: Number(quantity),
        unit: 'item',
        expiryHours: exp,
        expiryTime: new Date(Date.now() + exp * 60 * 60 * 1000).toISOString(),
        latitude: 12.9352,
        longitude: 77.6245,
        imageUrl: imageUrl.trim() || CATEGORY_IMAGES[category] || CATEGORY_IMAGES['Bakery'],
        storeAddress: '5th Block, Koramangala, Bengaluru',
        wasteRisk: exp <= 24 ? 'urgent' : 'attention',
        tagline: 'Daam kam. Value full.'
      });

      setLastCreatedDealTitle(created.title);

      // Reset form
      setTitle('');
      setSubtitle('');
      setOriginalPrice('');
      setDiscountedPrice('');
      setImageUrl('');
      setAiPrediction(null);
    } catch (err) {
      console.error(err);
      setFormError('Failed to publish deal. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const scrollToCustomerDeals = () => {
    setSelectedCategory('All Deals');
    const dealsEl = document.getElementById('deals');
    if (dealsEl) {
      dealsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="merchant-portal" className="border-t border-gray-200/80 bg-gradient-to-b from-[#FAFAFA] to-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-50 px-3.5 py-1 text-xs font-bold text-orange-800 shadow-xs">
              <Store className="size-3.5 text-orange-600" />
              LastDeal Merchant Partner Portal
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Turn Surplus Stock into Instant Cash
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              List surplus items in under 30 seconds. Automatically appears in the live Customer Deals Feed.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="bg-white rounded-2xl border border-gray-200 px-4 py-2.5 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-gray-400">Total Active Deals</p>
              <p className="font-display text-lg font-bold text-slate-950">{deals.length}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 px-4 py-2.5 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-gray-400">Pending Pickups</p>
              <p className="font-display text-lg font-bold text-orange-600">{pendingPickups.length}</p>
            </div>
          </div>
        </div>

        {/* Success Alert Banner when product is added */}
        {lastCreatedDealTitle && (
          <div className="mb-8 rounded-2xl border border-orange-300 bg-orange-50 p-4 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-orange-600 text-white shadow-xs">
                <CheckCircle2 className="size-6" />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-950">
                  🎉 &ldquo;{lastCreatedDealTitle}&rdquo; is now Live!
                </p>
                <p className="text-xs text-orange-900/80">
                  It has been broadcast to local customers and is instantly visible in the deals feed.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={scrollToCustomerDeals}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Eye className="size-4" />
              View in Customer Feed ↑
            </button>
          </div>
        )}

        {/* 2-Column Merchant Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Deal Creator Form with AI Engine */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xl shadow-orange-950/5">
              
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <span className="size-8 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold">
                    <Plus className="size-5" />
                  </span>
                  <h3 className="font-display text-lg font-bold text-slate-950">Add Surplus Product</h3>
                </div>
                <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                  Instant Neighborhood Sync
                </span>
              </div>

              {/* Quick Fill Preset Buttons */}
              <div className="mt-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                  ⚡ 1-Click Quick Demo Presets:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="text-[11px] bg-orange-50/70 hover:bg-orange-100 text-slate-800 font-semibold px-2.5 py-1 rounded-lg border border-orange-200/50 transition-colors cursor-pointer"
                    >
                      {preset.category === 'Bakery' ? '🥐 ' : preset.category === 'Dairy' ? '🥛 ' : preset.category === 'Snacks' ? '🍪 ' : '🧃 '}
                      {preset.title.split(' ')[0]} {preset.title.split(' ')[1]}
                    </button>
                  ))}
                </div>
              </div>

              {formError && (
                <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0 text-red-500" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handlePublishDeal} className="mt-5 space-y-4">
                
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sourdough Loaf (Evening Batch)"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value); setFormError(null); }}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => {
                        const newCat = e.target.value;
                        setCategory(newCat);
                        if (!imageUrl || Object.values(CATEGORY_IMAGES).includes(imageUrl)) {
                          setImageUrl(CATEGORY_IMAGES[newCat] || '');
                        }
                      }}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-orange-600 focus:outline-none bg-white font-medium text-slate-800"
                    >
                      <option value="Bakery">Bakery</option>
                      <option value="Dairy">Dairy</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Snacks">Snacks</option>
                      <option value="Fresh Produce">Fresh Produce</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      Quantity in Stock *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="5"
                      value={quantity}
                      onChange={(e) => { setQuantity(e.target.value); setFormError(null); }}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      Regular MRP Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="100"
                      value={originalPrice}
                      onChange={(e) => handleOriginalPriceChange(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold focus:border-orange-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      Expiry Window (Hours)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="24"
                      value={expiryHours}
                      onChange={(e) => setExpiryHours(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Quick Discount Presets & AI Button */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Quick Markdown Options:
                    </span>
                    <button
                      type="button"
                      onClick={handleCalculateAi}
                      disabled={isPredicting}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-900 px-2.5 py-1 text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      <Sparkles className="size-3 text-orange-600" />
                      {isPredicting ? 'Calculating...' : '✨ AI Smart Price'}
                    </button>
                  </div>

                  <div className="flex gap-2">
                    {[30, 40, 50, 65].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => handleQuickDiscount(pct)}
                        className="flex-1 py-1.5 rounded-lg bg-gray-50 hover:bg-orange-50 hover:border-orange-300 border border-gray-200 text-[11px] font-bold text-slate-700 transition-all cursor-pointer text-center"
                      >
                        {pct}% OFF
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Recommendation Widget */}
                {aiPrediction && (
                  <div className="rounded-2xl border border-orange-200 bg-orange-50/70 p-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-800">
                        AI Recommended Markdown
                      </span>
                      <span className="text-xs font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md">
                        {aiPrediction.discountPercentage}% OFF
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-display text-2xl font-bold text-slate-950">
                          ₹{aiPrediction.recommendedPrice}
                        </p>
                        <p className="text-[11px] text-slate-600">
                          Est. Total Recovery: ₹{aiPrediction.potentialRecovery}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyAi}
                        className="rounded-xl bg-orange-600 hover:bg-orange-700 text-white px-3.5 py-1.5 text-xs font-bold shadow-xs cursor-pointer"
                      >
                        Applied ✓
                      </button>
                    </div>

                    <p className="text-[11px] text-orange-900/80 italic mt-2">
                      {aiPrediction.reasoning}
                    </p>
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Surplus Deal Price (₹) *
                    </label>
                    {originalPrice && discountedPrice && Number(discountedPrice) < Number(originalPrice) && (
                      <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded">
                        {Math.round(((Number(originalPrice) - Number(discountedPrice)) / Number(originalPrice)) * 100)}% Discount
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 50"
                    value={discountedPrice}
                    onChange={(e) => { setDiscountedPrice(e.target.value); setFormError(null); }}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-orange-800 focus:border-orange-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                    Product Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2 text-xs text-gray-600 focus:border-orange-600 focus:outline-none"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    * If left blank, a high-quality {category} image will be automatically attached.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isPublishing}
                  className="w-full rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 text-sm shadow-md shadow-orange-600/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus className="size-4" />
                  <span>{isPublishing ? 'Publishing to Neighborhood...' : 'Publish Surplus Deal Live 🚀'}</span>
                </button>

              </form>

            </div>
          </div>

          {/* Right: Customer Pickups Queue & Active Listings */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Customer Pickups & Reservation History Box */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl shadow-orange-950/5 flex flex-col">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <QrCode className="size-5 text-orange-600" />
                  <h3 className="font-display text-base font-bold text-slate-950">Customer Pickup Passes</h3>
                </div>
                
                {/* Tab Switcher */}
                <div className="flex bg-gray-100 p-0.5 rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setPickupTab('pending')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      pickupTab === 'pending'
                        ? 'bg-white text-orange-900 shadow-xs font-bold'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    Pending ({pendingPickups.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPickupTab('history')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      pickupTab === 'history'
                        ? 'bg-white text-orange-900 shadow-xs font-bold'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    Claimed ({completedPickups.length})
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-3 max-h-[300px] overflow-y-auto no-scrollbar">
                {pickupTab === 'pending' ? (
                  <>
                    {pendingPickups.map((res) => (
                      <div 
                        key={res.id}
                        className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 bg-[#fdfdfd] hover:border-orange-200 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                            QR
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-950">{res.dealTitle || 'Surplus Item'}</p>
                            <p className="text-[10px] text-gray-500 font-medium">
                              {res.customerName} • Qty: {res.quantity} • Total: ₹{res.totalAmount}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => markPickedUp(res.id)}
                          title="Verify and Mark Picked Up"
                          className="inline-flex items-center gap-1 bg-white hover:bg-orange-600 hover:text-white text-orange-700 border border-orange-300 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs"
                        >
                          <Check className="size-3.5" />
                          Claimed
                        </button>
                      </div>
                    ))}

                    {pendingPickups.length === 0 && (
                      <div className="py-8 text-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-2xl">
                        No pending customer pickups at this moment.
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {completedPickups.map((res) => (
                      <div 
                        key={res.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/70 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="size-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">
                            ✓
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{res.dealTitle || 'Surplus Item'}</p>
                            <p className="text-[10px] text-gray-500">{res.customerName} • {res.quantity} units • ₹{res.totalAmount}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded">
                          Collected
                        </span>
                      </div>
                    ))}

                    {completedPickups.length === 0 && (
                      <div className="py-8 text-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-2xl">
                        No completed pickups recorded yet.
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Active Store Inventory Box */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl shadow-orange-950/5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-display text-base font-bold text-slate-950">Active Store Listings</h3>
                <span className="text-xs text-gray-500 font-medium">{deals.length} active deals live</span>
              </div>

              <div className="mt-4 space-y-2.5 max-h-[300px] overflow-y-auto no-scrollbar">
                {deals.map(deal => (
                  <div key={deal.id} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 hover:bg-orange-50/40 transition-colors text-xs border border-gray-100">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={deal.imageUrl} alt="" className="size-9 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-950 truncate max-w-[200px]">{deal.title}</p>
                        <p className="text-[10px] text-gray-500">{deal.quantity} units in stock • ₹{deal.discountedPrice} (was ₹{deal.originalPrice})</p>
                      </div>
                    </div>
                    <span className="font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md text-[10px] shrink-0">
                      {deal.discountPercentage}% OFF
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};


