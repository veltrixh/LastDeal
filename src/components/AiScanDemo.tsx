import React, { useState } from 'react';
import { Sparkles, Boxes, CalendarClock, TrendingUp, RefreshCw, Zap, IndianRupee, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useStore } from '../StoreContext';

export const AiScanDemo: React.FC = () => {
  const { predictAiPrice } = useStore();
  const [selectedHours, setSelectedHours] = useState<number>(24);
  const [units, setUnits] = useState<number>(35);
  const [origPrice, setOrigPrice] = useState<number>(100);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Dynamic calculated recommendations
  let discount = 35;
  if (selectedHours <= 12) discount = 55;
  else if (selectedHours <= 24) discount = 45;
  else if (selectedHours <= 48) discount = 35;
  else discount = 25;

  if (units >= 25) discount = Math.min(discount + 5, 75);

  const discountedPrice = Math.round(origPrice * (1 - discount / 100));
  const potentialRecovery = discountedPrice * units;
  const totalDumpLoss = origPrice * units;

  const riskLevel = selectedHours <= 12 ? 'Urgent Clearance (92% Risk)' : selectedHours <= 24 ? 'High Velocity (68% Risk)' : 'Moderate (35% Risk)';
  const riskColor = selectedHours <= 12 ? 'bg-red-500' : selectedHours <= 24 ? 'bg-amber-500' : 'bg-orange-500';

  const handleSimulate = async () => {
    setIsCalculating(true);
    await predictAiPrice({ originalPrice: origPrice, expiryHours: selectedHours, quantity: units });
    setTimeout(() => setIsCalculating(false), 200);
  };

  const handleApplyToMerchant = () => {
    const el = document.getElementById('merchant-portal');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="smart-deals" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      
      {/* Title block */}
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-50 px-3.5 py-1 text-xs font-bold text-orange-800 shadow-xs">
          <Sparkles className="size-3.5 text-orange-600" />
          LastDeal AI Pricing Engine
        </span>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Expiry paas hai? Deal khaas hai.
        </h2>
        <p className="mt-2 text-sm font-semibold italic text-orange-700">
          LastDeal calculates the mathematically optimal discount in real-time.
        </p>
        <p className="mt-3 text-sm sm:text-base text-slate-600">
          Every inventory item is scored on expiry velocity, localized demand elasticity, and foot traffic — ensuring zero dump waste and maximum merchant revenue recovery.
        </p>
      </div>

      {/* Interactive Scan Card */}
      <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl shadow-orange-950/5">
        
        {/* Card Header Bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-gray-100 bg-orange-50/50 px-6 py-4">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-900">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-orange-500 opacity-75"></span>
              <span className="relative inline-flex size-2.5 rounded-full bg-orange-600"></span>
            </span>
            Real-Time Markdown Simulator
          </div>
          <span className="text-xs font-bold text-orange-800 bg-orange-100/80 px-3 py-1 rounded-full border border-orange-200">
            Koramangala Store Hub • Aisle 4
          </span>
        </div>

        {/* Content Body */}
        <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
          
          {/* Left Sub-Card: Interactive Sliders & Product State */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-orange-50 border border-orange-100">
                <img 
                  src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&auto=format&fit=crop&q=80" 
                  alt="Organic Biscuits" 
                  className="size-full object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-slate-950 text-sm sm:text-base">Organic Honey Oat Cookies</p>
                <p className="text-xs text-slate-500 font-medium">Bakery & Snacks • Sealed 250g Pack</p>
              </div>
            </div>

            {/* Interactive Sliders */}
            <div className="space-y-3.5 rounded-2xl bg-gray-50/80 p-4 border border-gray-100">
              
              {/* Slider 1: Expiry Window */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                  <span>Expiry Window:</span>
                  <span className="text-orange-700 font-extrabold">{selectedHours} Hours left</span>
                </div>
                <input 
                  type="range" 
                  min="6" 
                  max="72" 
                  step="6"
                  value={selectedHours} 
                  onChange={(e) => {
                    setSelectedHours(Number(e.target.value));
                    handleSimulate();
                  }}
                  className="w-full accent-orange-600 cursor-pointer h-1.5 bg-gray-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                  <span>6h (Critical)</span>
                  <span>24h (Target)</span>
                  <span>72h (Early)</span>
                </div>
              </div>

              {/* Slider 2: Surplus Units */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                  <span>Surplus Quantity:</span>
                  <span className="text-orange-700 font-extrabold">{units} units in shelf</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="100" 
                  step="5"
                  value={units} 
                  onChange={(e) => {
                    setUnits(Number(e.target.value));
                    handleSimulate();
                  }}
                  className="w-full accent-orange-600 cursor-pointer h-1.5 bg-gray-200 rounded-lg"
                />
              </div>

              {/* Slider 3: Regular MRP Price */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                  <span>Original MRP:</span>
                  <span className="text-orange-700 font-extrabold">₹{origPrice}</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="500" 
                  step="10"
                  value={origPrice} 
                  onChange={(e) => {
                    setOrigPrice(Number(e.target.value));
                    handleSimulate();
                  }}
                  className="w-full accent-orange-600 cursor-pointer h-1.5 bg-gray-200 rounded-lg"
                />
              </div>

            </div>

            {/* Waste Risk Bar */}
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Clearance Urgency Score</span>
                <span className="font-bold text-slate-900">{riskLevel}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${riskColor}`} 
                  style={{ width: `${selectedHours <= 12 ? 90 : selectedHours <= 24 ? 65 : 30}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right Sub-Card: AI Recommendation Box */}
          <div className="relative flex flex-col justify-between gap-4 rounded-3xl border border-orange-500/25 bg-orange-50/40 p-6">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-orange-800 uppercase tracking-wider">
                <Zap className="size-4 text-orange-600" />
                Optimal AI Markdown Strategy
              </div>
              {isCalculating && (
                <RefreshCw className="size-3.5 text-orange-600 animate-spin" />
              )}
            </div>

            {/* Price Markdown Banner */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Recommended Markdown</p>
                <p className="font-display text-4xl font-extrabold text-orange-600">{discount}% OFF</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 font-medium">Deal Price</p>
                <p className="text-xs font-bold text-gray-400 line-through">₹{origPrice}</p>
                <p className="font-display text-2xl font-bold text-slate-950">₹{discountedPrice}</p>
              </div>
            </div>

            {/* Comparison of Recovery vs Waste */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-100 text-xs">
                <span className="text-slate-600 font-medium flex items-center gap-1.5">
                  <TrendingUp className="size-4 text-orange-600" />
                  Estimated Merchant Revenue:
                </span>
                <span className="font-display text-base font-extrabold text-orange-700">
                  ₹{potentialRecovery.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-red-50/70 border border-red-200/60 text-xs">
                <span className="text-red-700 font-medium flex items-center gap-1.5">
                  <ShieldAlert className="size-4 text-red-500" />
                  Loss if Dumped in Garbage:
                </span>
                <span className="font-display text-base font-extrabold text-red-600 line-through">
                  ₹{totalDumpLoss.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handleApplyToMerchant}
              className="w-full rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 text-xs shadow-md shadow-orange-600/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>List Item Live with AI Markdown</span>
              <ArrowRight className="size-3.5" />
            </button>

          </div>

        </div>

      </div>

    </section>
  );
};


