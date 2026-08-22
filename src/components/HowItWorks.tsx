import React from 'react';
import { Package, AlertTriangle, Sparkles, Percent, MapPin, TrendingUp, ArrowRight, CheckCircle2, XCircle, HeartHandshake } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      title: 'Surplus on Shelf',
      desc: 'Quality inventory unsold near expiry window',
      icon: Package,
      highlight: false,
    },
    {
      title: 'Expiry Velocity Check',
      desc: 'Store clock starts ticking towards total loss',
      icon: AlertTriangle,
      highlight: false,
    },
    {
      title: 'LastDeal AI Scoring',
      desc: 'Real-time algorithm calculates optimal discount',
      icon: Sparkles,
      highlight: true,
    },
    {
      title: 'Live Drop in Feed',
      desc: 'Surplus items broadcast to local shoppers instantly',
      icon: Percent,
      highlight: false,
    },
    {
      title: 'Local QR Pickup',
      desc: 'Neighbors reserve with zero prepay & collect in-store',
      icon: MapPin,
      highlight: false,
    },
  ];

  return (
    <section id="why" className="relative overflow-hidden border-y border-gray-200/80 bg-gradient-to-b from-[#FAFAFA] via-orange-50/20 to-[#FAFAFA] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-50 px-3.5 py-1 text-xs font-bold text-orange-800 shadow-xs">
            <HeartHandshake className="size-3.5 text-orange-600" />
            Circular Neighborhood Economy
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            What happens to unsold inventory?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            LastDeal turns surplus products that would end up in garbage into direct value — extra savings for families and recovered cash for local stores.
          </p>
        </div>

        {/* Process Flow Cards */}
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.title}
                className={`relative flex flex-col items-center gap-3 rounded-3xl border p-6 text-center transition-all hover:scale-105 duration-300 ${
                  step.highlight 
                    ? 'border-orange-500 bg-orange-600 text-white shadow-xl shadow-orange-600/25 ring-4 ring-orange-500/10' 
                    : 'border-gray-200 bg-white backdrop-blur-sm text-slate-900 shadow-xs'
                }`}
              >
                {/* Step number badge */}
                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  step.highlight ? 'bg-orange-700 text-orange-100' : 'bg-orange-50 text-orange-800'
                }`}>
                  Step 0{idx + 1}
                </span>

                {/* Icon box */}
                <div className={`flex size-13 items-center justify-center rounded-2xl ${
                  step.highlight ? 'bg-white/20 text-white' : 'bg-orange-50 text-orange-600 border border-orange-100'
                }`}>
                  <Icon className="size-6" />
                </div>

                {/* Step Title & Description */}
                <h3 className={`text-sm font-bold ${step.highlight ? 'text-white' : 'text-slate-950'}`}>
                  {step.title}
                </h3>
                <p className={`text-xs leading-relaxed ${step.highlight ? 'text-orange-100 font-normal' : 'text-slate-500 font-medium'}`}>
                  {step.desc}
                </p>

                {/* Arrow connector on desktop */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-10">
                    <span className="size-7 bg-white border border-orange-200 rounded-full flex items-center justify-center text-orange-600 shadow-sm">
                      <ArrowRight className="size-3.5" />
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Comparison Row: The Old Way vs The LastDeal Way */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="rounded-3xl border border-red-200 bg-red-50/50 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-700 mb-2">
                <XCircle className="size-4 text-red-500" />
                The Traditional Retail Way
              </div>
              <p className="font-display text-lg font-bold text-red-950">
                100% Loss & Landfill Dumping
              </p>
              <ul className="mt-3 space-y-2 text-xs text-red-900/70 font-medium">
                <li className="flex items-center gap-2">✕ Merchant loses 100% of procurement costs</li>
                <li className="flex items-center gap-2">✕ Unsold food generates methane emissions in dumps</li>
                <li className="flex items-center gap-2">✕ Shoppers miss out on high-quality discounted goods</li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-red-200 text-xs font-bold text-red-800">
              Outcome: ₹0 Recovered • Environmental Waste
            </div>
          </div>

          <div className="rounded-3xl border border-orange-300/60 bg-white p-6 flex flex-col justify-between shadow-md">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-800 mb-2">
                <CheckCircle2 className="size-4 text-orange-600" />
                The LastDeal Circular Model
              </div>
              <p className="font-display text-lg font-bold text-slate-950">
                Win-Win Clearance with Zero Dump Target
              </p>
              <ul className="mt-3 space-y-2 text-xs text-slate-600 font-medium">
                <li className="flex items-center gap-2">✓ Merchant recovers 55% - 75% of cash value</li>
                <li className="flex items-center gap-2">✓ Shoppers save up to 70% on fresh household essentials</li>
                <li className="flex items-center gap-2">✓ 100% of edible stock consumed — zero methane waste</li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-bold text-orange-800 flex items-center justify-between">
              <span>Outcome: Maximum Revenue • 0% Food Waste</span>
              <span className="text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md shadow-xs">Win-Win</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};


