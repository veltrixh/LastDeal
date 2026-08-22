import React, { useState } from 'react';
import { useStore } from '../StoreContext';
import { Deal, Reservation } from '../types';
import { Clock, Store, MapPin, Search, CheckCircle, QrCode, X, ArrowRight, ShieldCheck, Ticket, Sparkles, CheckCircle2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const CATEGORIES = [
  'All Deals',
  'Dairy',
  'Bakery',
  'Beverages',
  'Snacks',
  'Fresh Produce',
  'My Reserved Passes'
];

export const CustomerApp: React.FC = () => {
  const { 
    deals, 
    reservations,
    reserveDeal, 
    user, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    highlightDealId
  } = useStore();

  const [activeReservation, setActiveReservation] = useState<Reservation | null>(null);
  const [selectedDealForModal, setSelectedDealForModal] = useState<Deal | null>(null);
  const [reserveQty, setReserveQty] = useState<number>(1);
  const [customerNameInput, setCustomerNameInput] = useState<string>(user?.name || '');
  const [isReserving, setIsReserving] = useState<boolean>(false);

  // Filter deals
  const filteredDeals = deals.filter(deal => {
    const matchesCategory = selectedCategory === 'All Deals' || 
      deal.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch = !searchQuery || 
      deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (deal.subtitle && deal.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch && deal.quantity > 0;
  });

  const getCategoryCount = (category: string) => {
    if (category === 'My Reserved Passes') return reservations.length;
    if (category === 'All Deals') return deals.filter(d => d.quantity > 0).length;
    return deals.filter(d => d.category?.toLowerCase() === category.toLowerCase() && d.quantity > 0).length;
  };

  const getReservationsForDeal = (dealId: string) => {
    return reservations.filter(r => r.dealId === dealId && r.status === 'reserved');
  };

  const handleOpenReserve = (deal: Deal) => {
    setSelectedDealForModal(deal);
    setReserveQty(1);
    setCustomerNameInput(user?.name || '');
  };

  const handleConfirmReservation = async () => {
    if (!selectedDealForModal) return;
    setIsReserving(true);
    try {
      const res = await reserveDeal(
        selectedDealForModal.id, 
        customerNameInput.trim() || user?.name || 'Local Food Hero', 
        reserveQty
      );
      setActiveReservation(res);
      setSelectedDealForModal(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsReserving(false);
    }
  };

  return (
    <section id="deals" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      
      {/* Title & Headline */}
      <div className="flex flex-col gap-6">
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-orange-500 animate-ping"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-800">
              Live Hyperlocal Surplus Feed ({deals.length} deals total • {reservations.length} reserved passes)
            </span>
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Aaj ki deals, kal ka wait kyun?
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            High quality products that need a good home. Freshness guaranteed at up to 70% off.
          </p>
        </div>

        {/* Active Reservations Notice Banner */}
        {reservations.length > 0 && selectedCategory !== 'My Reserved Passes' && (
          <div className="rounded-2xl border border-orange-200 bg-orange-50/80 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="size-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <Ticket className="size-5" />
              </span>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  You have {reservations.filter(r => r.status === 'reserved').length} Active Reserved Pickup Pass{reservations.filter(r => r.status === 'reserved').length !== 1 ? 'es' : ''}
                </p>
                <p className="text-[11px] text-slate-600">
                  Show your QR pass at the store counter to claim items and pay discounted price.
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedCategory('My Reserved Passes')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <span>View My Reserved Passes ({reservations.length})</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        )}

        {/* Filter bar: Search & Category Tabs */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          
          {/* Category Tabs */}
          <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 no-scrollbar">
            <div className="flex w-max gap-2" role="tablist">
              {CATEGORIES.map(category => {
                const isSelected = selectedCategory === category;
                const count = getCategoryCount(category);
                const isPassesTab = category === 'My Reserved Passes';

                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? isPassesTab 
                          ? 'border border-amber-600 bg-amber-600 text-white shadow-xs'
                          : 'border border-orange-600 bg-orange-600 text-white shadow-xs'
                        : isPassesTab
                          ? 'border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100'
                          : 'border border-gray-200 bg-white text-slate-700 hover:border-orange-500 hover:text-orange-950'
                    }`}
                  >
                    {isPassesTab && <Ticket className="size-3.5" />}
                    <span>{category}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-white/25 text-white' : isPassesTab ? 'bg-amber-200 text-amber-950' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Input */}
          {selectedCategory !== 'My Reserved Passes' && (
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products or stores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white py-2 pl-9 pr-4 text-xs font-medium focus:border-orange-500 focus:outline-none shadow-xs text-slate-900 placeholder-slate-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          )}

        </div>

        {/* 1. VIEW: My Reserved Passes Screen */}
        {selectedCategory === 'My Reserved Passes' ? (
          <div className="space-y-4 mt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-slate-950 flex items-center gap-2">
                <Ticket className="size-5 text-orange-600" />
                <span>My Reserved Products & Pickup Passes</span>
              </h3>
              <button
                onClick={() => setSelectedCategory('All Deals')}
                className="text-xs font-bold text-orange-600 hover:underline cursor-pointer"
              >
                ← Back to Browse Deals
              </button>
            </div>

            {reservations.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
                <Ticket className="size-10 text-orange-300 mx-auto mb-3" />
                <p className="text-base font-bold text-slate-950">No products reserved yet.</p>
                <p className="text-xs text-slate-500 mt-1">Browse available surplus deals and reserve them with zero prepayment!</p>
                <button 
                  onClick={() => setSelectedCategory('All Deals')}
                  className="mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Browse Deals Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reservations.map((res) => {
                  const matchingDeal = deals.find(d => d.id === res.dealId) || res.deal;
                  const isClaimed = res.status === 'picked_up';

                  return (
                    <div 
                      key={res.id} 
                      className="ticket-card rounded-3xl border border-gray-200 bg-white p-5 shadow-md flex flex-col justify-between gap-4 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-orange-50 border border-orange-100">
                          <img 
                            src={matchingDeal?.imageUrl || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80'} 
                            alt="" 
                            className="size-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                              isClaimed 
                                ? 'bg-gray-100 text-gray-700' 
                                : 'bg-orange-100 text-orange-800 animate-pulse'
                            }`}>
                              {isClaimed ? '✓ Picked Up' : '🟡 Ready for Pickup'}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {new Date(res.reservedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <h4 className="font-display font-bold text-sm text-slate-950 mt-1 truncate">
                            {res.dealTitle || matchingDeal?.title || 'Surplus Item'}
                          </h4>

                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Store className="size-3 text-orange-600 shrink-0" />
                            <span className="truncate">{res.merchantName || matchingDeal?.merchantName || 'Local Partner Store'}</span>
                          </p>

                          <div className="mt-2 flex items-center justify-between text-xs border-t border-gray-100 pt-2">
                            <span className="text-gray-500 font-medium">Quantity: <strong className="text-slate-900">{res.quantity}</strong></span>
                            <span className="text-orange-800 font-extrabold text-sm">₹{res.totalAmount} Due</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => setActiveReservation(res)}
                          className="flex-1 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <QrCode className="size-3.5" />
                          <span>Show QR Pickup Code</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* 2. VIEW: Standard Customer Deals Grid */
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-2">
            {filteredDeals.map((deal) => {
              const savings = deal.originalPrice - deal.discountedPrice;
              const isUrgent = deal.wasteRisk === 'urgent';
              const isNewlyAdded = deal.id === highlightDealId;
              const dealReservations = getReservationsForDeal(deal.id);
              const reservedQtyCount = dealReservations.reduce((acc, r) => acc + r.quantity, 0);

              return (
                <article 
                  key={deal.id}
                  className={`group flex flex-col overflow-hidden rounded-3xl border bg-white transition-all duration-300 hover:shadow-xl hover:border-orange-400 hover:-translate-y-1 relative ${
                    isNewlyAdded 
                      ? 'ring-2 ring-orange-500 shadow-xl border-orange-500 animate-in fade-in zoom-in-95' 
                      : 'border-gray-200/80'
                  }`}
                >
                  {/* Image & Badges */}
                  <div className="relative aspect-4/3 overflow-hidden bg-orange-50">
                    <img 
                      src={deal.imageUrl} 
                      alt={deal.title}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    
                    {/* Top-Left Discount Badge & Reserved Tag */}
                    <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                      <span className="inline-flex items-center rounded-full bg-orange-600 px-2.5 py-1 text-xs font-bold text-white shadow-md">
                        {deal.discountPercentage}% OFF
                      </span>
                      {isNewlyAdded && (
                        <span className="inline-flex items-center rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-extrabold text-white shadow-md animate-pulse">
                          ✨ JUST LISTED
                        </span>
                      )}
                      {reservedQtyCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/90 text-orange-200 px-2 py-0.5 text-[10px] font-bold shadow-md">
                          <Ticket className="size-2.5 text-orange-400" />
                          <span>{reservedQtyCount} In Passes</span>
                        </span>
                      )}
                    </div>

                    {/* Top-Right Expiry Pill */}
                    <div className="absolute right-3 top-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-md backdrop-blur-md ${
                        isUrgent 
                          ? 'bg-red-500/90 text-white' 
                          : 'bg-slate-900/80 text-white'
                      }`}>
                        <Clock className="size-3" />
                        {deal.expiryHours ? `${deal.expiryHours}h left` : 'Expiring soon'}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col gap-3.5 p-4 sm:p-5">
                    
                    <div className="space-y-0.5">
                      <h3 className="font-display text-base font-bold leading-tight text-slate-950 group-hover:text-orange-600 transition-colors">
                        {deal.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">{deal.subtitle || deal.category}</p>
                    </div>

                    {/* Price & Savings */}
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-2xl font-black text-slate-950">
                        ₹{deal.discountedPrice}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        ₹{deal.originalPrice}
                      </span>
                      <span className="ml-auto text-xs font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">
                        Save ₹{savings}
                      </span>
                    </div>

                    {/* Store & Distance */}
                    <div className="flex items-center justify-between text-xs text-slate-600 border-t border-gray-100 pt-2.5 font-medium">
                      <span className="inline-flex items-center gap-1.5 truncate max-w-[130px]">
                        <Store className="size-3.5 text-orange-600 shrink-0" />
                        <span className="truncate">{deal.merchantName}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 shrink-0 text-slate-800 font-bold">
                        <MapPin className="size-3 text-orange-600" />
                        {deal.distance || '0.8 km'}
                      </span>
                    </div>

                    {/* Catchy Hindi tagline */}
                    {deal.tagline && (
                      <p className="text-[11px] italic text-orange-800 font-medium">
                        “{deal.tagline}”
                      </p>
                    )}

                    {/* Stock & Reserve Action Button */}
                    <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                      <span className="text-xs font-bold text-slate-500">
                        {deal.quantity} left
                      </span>
                      <button
                        onClick={() => handleOpenReserve(deal)}
                        className="inline-flex items-center justify-center rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-4 py-2.5 shadow-sm transition-all hover:scale-102 active:scale-95 cursor-pointer"
                      >
                        Reserve Deal
                      </button>
                    </div>

                  </div>

                </article>
              );
            })}
          </div>
        )}

        {/* Empty Search Fallback */}
        {selectedCategory !== 'My Reserved Passes' && filteredDeals.length === 0 && (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-base font-bold text-slate-950">No deals found in this category right now.</p>
            <p className="text-xs text-slate-500 mt-1">Try switching categories or searching for a different item.</p>
            <button 
              onClick={() => { setSelectedCategory('All Deals'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* Reservation Dialog Modal */}
      {selectedDealForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-gray-100">
            
            <button 
              onClick={() => setSelectedDealForModal(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
            >
              <X className="size-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="size-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-700">
                <Store className="size-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-950">Hold & Reserve Surplus Item</h3>
                <p className="text-xs text-slate-500">{selectedDealForModal.merchantName} • Pay at pickup</p>
              </div>
            </div>

            <div className="bg-orange-50/70 rounded-2xl p-4 mb-4 border border-orange-200/60 flex items-center gap-4">
              <img 
                src={selectedDealForModal.imageUrl} 
                alt={selectedDealForModal.title}
                className="size-16 rounded-xl object-cover" 
              />
              <div className="flex-1">
                <h4 className="font-bold text-sm text-slate-950">{selectedDealForModal.title}</h4>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-extrabold text-orange-600">
                    ₹{selectedDealForModal.discountedPrice}
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    ₹{selectedDealForModal.originalPrice}
                  </span>
                  <span className="text-[10px] font-bold text-orange-800 bg-orange-200/70 px-1.5 py-0.5 rounded">
                    {selectedDealForModal.discountPercentage}% OFF
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  Your Name / Pickup Handle
                </label>
                <input 
                  type="text" 
                  value={customerNameInput}
                  onChange={(e) => setCustomerNameInput(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  Quantity ({selectedDealForModal.quantity} available)
                </label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5].filter(q => q <= selectedDealForModal.quantity).map(q => (
                    <button
                      key={q}
                      onClick={() => setReserveQty(q)}
                      className={`size-10 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                        reserveQty === q 
                          ? 'bg-orange-600 text-white shadow-md' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 p-3 text-xs text-gray-600 flex items-center justify-between">
                <span>Total Due at Store:</span>
                <span className="text-base font-extrabold text-slate-950">
                  ₹{selectedDealForModal.discountedPrice * reserveQty}
                </span>
              </div>

              <button
                onClick={handleConfirmReservation}
                disabled={isReserving}
                className="w-full rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 text-sm shadow-lg shadow-orange-600/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isReserving ? 'Confirming Reservation...' : 'Generate Instant Pickup Pass'}
                <ArrowRight className="size-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                <ShieldCheck className="size-3.5 text-orange-600" />
                <span>Zero pre-payment required. Pay merchant upon pickup.</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Reservation Ticket QR Code View */}
      {activeReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4 animate-in zoom-in-95">
          <div className="relative w-full max-w-sm rounded-[2rem] bg-white p-7 shadow-2xl border border-gray-100 text-center overflow-hidden">
            
            <button 
              onClick={() => setActiveReservation(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
            >
              <X className="size-5" />
            </button>

            {/* Cutout details on ticket sides */}
            <div className="absolute top-1/2 -left-4 size-7 rounded-full bg-slate-950/75"></div>
            <div className="absolute top-1/2 -right-4 size-7 rounded-full bg-slate-950/75"></div>

            <div className="mx-auto size-14 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mb-3">
              <CheckCircle className="size-8" />
            </div>

            <h3 className="font-display text-xl font-extrabold text-slate-950">Reservation Pass Active!</h3>
            <p className="text-xs text-slate-500 font-medium">Show this QR code at {activeReservation.merchantName || 'the store counter'}</p>

            <div className="my-5 border-t border-dashed border-gray-200"></div>

            {/* Generated QR Pass */}
            <div className="mx-auto inline-block p-4 rounded-2xl bg-white border-2 border-orange-200 shadow-sm">
              <QRCodeSVG 
                value={activeReservation.qrCodeData} 
                size={160} 
                fgColor="#EA580C"
              />
            </div>

            <div className="mt-4 space-y-1">
              <p className="font-bold text-sm text-slate-950">{activeReservation.dealTitle || 'Surplus Item'}</p>
              <p className="text-xs text-gray-500">Reserved for {activeReservation.customerName} • Qty: {activeReservation.quantity}</p>
              <p className="text-xl font-extrabold text-orange-600 mt-1">₹{activeReservation.totalAmount} Due at Store</p>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => {
                  setActiveReservation(null);
                  setSelectedCategory('My Reserved Passes');
                }}
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                View All Reserved Passes →
              </button>
              <button
                onClick={() => setActiveReservation(null)}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};


