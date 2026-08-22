import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Quote, MapPin, ShieldCheck, Flame, ShoppingBag, Zap, ChevronRight } from 'lucide-react';
import { useStore } from '../StoreContext';

const QUOTES = [
  'Biscuit bhi sweet lagta hai, jab sahi daam pe milta hai.',
  'Kyunki achha maal waste hone ke liye nahi bana.',
  'Fresh items, heavy discounts, zero guilt.',
  'Thoda discount, bada recovery — neighbourhood wins!'
];

export const HeroSection: React.FC = () => {
  const { deals, setSelectedCategory } = useStore();
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const previewDeals = deals.slice(0, 3);

  const handleBrowseDeals = (cat: string = 'All Deals') => {
    setSelectedCategory(cat);
    const el = document.getElementById('deals');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-gray-200/60 bg-gradient-to-b from-white via-orange-50/20 to-white">
      {/* Background Gradient Mesh Glow */}
      <div 
        className="pointer-events-none absolute inset-0 -z-10 gradient-mesh opacity-70" 
        aria-hidden="true"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12">
        
        {/* Left Column - Hero Pitch & Quotes */}
        <div className="lg:col-span-7 flex flex-col items-start gap-6">
          
          {/* Intelligence Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-white px-4 py-1.5 text-xs font-bold text-slate-800 shadow-xs backdrop-blur-md">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-orange-600"></span>
            </span>
            <Sparkles className="size-3.5 text-orange-600 animate-pulse" />
            <span>Hyperlocal Clearance Network</span>
            <span className="text-[10px] text-white bg-orange-600 px-2 py-0.5 rounded-full font-black uppercase">Live BLR</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Save Money. <br />
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
              Save Inventory.
            </span>
          </h1>

          {/* Subtitles & Hindi tagline */}
          <div className="space-y-2 max-w-xl">
            <p className="text-lg leading-relaxed text-slate-700">
              Discover deeply discounted, verified fresh food items from neighborhood bakeries, dairies, and marts before they go to landfill.
            </p>
            <p className="text-sm font-semibold italic text-orange-700">
              “Kyunki achha maal waste hone ke liye nahi bana.”
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button 
              onClick={() => handleBrowseDeals('All Deals')}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white px-6 py-3.5 text-sm font-bold shadow-xl shadow-orange-600/25 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="size-4" />
              <span>Browse {deals.length} Live Deals</span>
              <ArrowRight className="size-4" />
            </button>

            <a 
              href="#merchant-portal"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white hover:bg-orange-50 text-slate-800 px-5 py-3.5 text-sm font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-xs"
            >
              <span>For Store Merchants</span>
              <ChevronRight className="size-4 text-orange-600" />
            </a>
          </div>

          {/* Quotation Ticker */}
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-xs">
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <Quote className="size-4 shrink-0 text-orange-600" />
              <div className="relative h-5 min-w-0 flex-1 overflow-hidden">
                <p 
                  key={quoteIndex}
                  className="truncate font-semibold italic text-slate-900 transition-all duration-500 animate-in fade-in slide-in-from-bottom-2 text-xs sm:text-sm"
                >
                  {QUOTES[quoteIndex]}
                </p>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-2 w-full max-w-lg">
            <div className="bg-white rounded-2xl p-3 border border-gray-200/80 shadow-xs">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg Markdown</p>
              <p className="font-display text-2xl font-extrabold text-slate-950">42% OFF</p>
            </div>
            <div className="bg-white rounded-2xl p-3 border border-gray-200/80 shadow-xs">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Partner Stores</p>
              <p className="font-display text-2xl font-extrabold text-slate-950">120+ Active</p>
            </div>
            <div className="bg-white rounded-2xl p-3 border border-gray-200/80 shadow-xs">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Food Rescued</p>
              <p className="font-display text-2xl font-extrabold text-orange-600">4.8 Tons</p>
            </div>
          </div>

        </div>

        {/* Right Column - Live Discounts Card Mockup */}
        <div className="lg:col-span-5 relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative rounded-3xl border border-gray-200 bg-white p-5 shadow-2xl shadow-orange-950/5">
            
            {/* Top Widget Bar */}
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-950">
                <Flame className="size-4 text-orange-600 fill-orange-500" />
                Featured Neighborhood Drops
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-0.5 text-[11px] font-extrabold text-orange-800 border border-orange-200">
                <span className="size-1.5 rounded-full bg-orange-600 animate-pulse"></span>
                Live in 2 km
              </span>
            </div>

            {/* List of live surplus items */}
            <ul className="mt-3.5 space-y-3">
              {previewDeals.map((deal) => (
                <li 
                  key={deal.id} 
                  onClick={() => handleBrowseDeals(deal.category)}
                  className="group flex items-center gap-3.5 rounded-2xl border border-gray-100 bg-[#fdfdfd] p-3 hover:border-orange-300 hover:bg-orange-50/40 transition-all cursor-pointer shadow-xs"
                >
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-orange-50 border border-orange-100">
                    <img 
                      src={deal.imageUrl} 
                      alt={deal.title} 
                      className="size-full object-cover group-hover:scale-105 transition-transform" 
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs sm:text-sm font-bold text-slate-950 group-hover:text-orange-700 transition-colors">
                      {deal.title}
                    </p>
                    <p className="truncate text-[11px] text-slate-500 font-medium">
                      {deal.merchantName} • {deal.distance || '0.8 km'}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {deal.quantity} units left • Expiring in {deal.expiryHours || 24}h
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="shrink-0 rounded-full bg-orange-600 px-2 py-0.5 text-[11px] font-bold text-white shadow-xs">
                      {deal.discountPercentage}% OFF
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[10px] text-gray-400 line-through">₹{deal.originalPrice}</span>
                      <span className="text-sm font-black text-slate-950">₹{deal.discountedPrice}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Bottom mini metric pill */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium flex items-center gap-1">
                <ShieldCheck className="size-3.5 text-orange-600" />
                Zero prepayment needed
              </span>
              <button 
                onClick={() => handleBrowseDeals('All Deals')}
                className="font-bold text-orange-600 hover:text-orange-800 text-xs flex items-center gap-1 cursor-pointer"
              >
                View all deals →
              </button>
            </div>

          </div>

          {/* Floating background live badge */}
          <div className="absolute -bottom-4 -left-4 hidden rounded-2xl border border-gray-200 bg-white px-4 py-2.5 shadow-xl sm:flex items-center gap-2.5 z-20">
            <span className="size-2.5 rounded-full bg-orange-500 animate-ping"></span>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold">Active Shoppers</p>
              <p className="font-display text-xs font-extrabold text-slate-950">214 online in your area</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};


