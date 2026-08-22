import React, { useState } from 'react';
import { MapPin, Store, User, LogOut, Sparkles, ChevronDown, Ticket } from 'lucide-react';
import { useStore } from '../StoreContext';
import { LastDealLogo } from './LastDealLogo';

interface HeaderProps {
  onOpenLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLogin }) => {
  const { user, logout, userLocation, setUserLocation, reservations, setSelectedCategory } = useStore();
  const [showLocationMenu, setShowLocationMenu] = useState(false);

  const locations = [
    { city: 'Koramangala, BLR', lat: 12.9352, lng: 77.6245 },
    { city: 'Indiranagar, BLR', lat: 12.9784, lng: 77.6408 },
    { city: 'HSR Layout, BLR', lat: 12.9121, lng: 77.6446 },
    { city: 'Bandra West, MUM', lat: 19.0596, lng: 72.8295 },
  ];

  const handleOpenPasses = () => {
    setSelectedCategory('My Reserved Passes');
    const dealsEl = document.getElementById('deals');
    if (dealsEl) {
      dealsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/90 backdrop-blur-md transition-all shadow-xs">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        
        {/* Brand Logo */}
        <a href="#hero" className="flex items-center gap-2 group">
          <LastDealLogo size="sm" />
        </a>

        {/* Primary Navigation */}
        <nav className="hidden items-center gap-6 md:flex text-sm font-semibold text-slate-700" aria-label="Primary">
          <a href="#deals" className="hover:text-orange-600 transition-colors">
            Deals
          </a>
          {reservations.length > 0 && (
            <button 
              onClick={handleOpenPasses}
              className="hover:text-orange-700 transition-colors flex items-center gap-1.5 font-bold text-orange-700 bg-orange-50 px-3 py-1 rounded-full border border-orange-200 cursor-pointer shadow-xs"
            >
              <Ticket className="size-3.5 text-orange-600" />
              <span>Passes ({reservations.length})</span>
            </button>
          )}
          <a href="#smart-deals" className="hover:text-orange-600 transition-colors flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-orange-600" />
            Smart Deals
          </a>
          <a href="#why" className="hover:text-orange-600 transition-colors">
            Why LastDeal
          </a>
          <a href="#merchant-portal" className="hover:text-orange-600 transition-colors flex items-center gap-1">
            <Store className="size-3.5 text-orange-600" />
            For Stores
          </a>
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          
          {/* Location Selector Pill */}
          <div className="relative">
            <button
              onClick={() => setShowLocationMenu(!showLocationMenu)}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-800 hover:border-orange-500 transition-colors shadow-xs cursor-pointer"
            >
              <MapPin className="size-3.5 text-orange-600" />
              <span>{userLocation?.city || 'Koramangala, BLR'}</span>
              <ChevronDown className="size-3 text-slate-400" />
            </button>

            {showLocationMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase">Select Neighborhood</div>
                {locations.map(loc => (
                  <button
                    key={loc.city}
                    onClick={() => {
                      setUserLocation(loc);
                      setShowLocationMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-orange-50 cursor-pointer ${
                      userLocation?.city === loc.city ? 'font-bold text-orange-700 bg-orange-50/70' : 'text-slate-700'
                    }`}
                  >
                    {loc.city}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Sign In / Profile Switcher */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-orange-50 border border-orange-200/80 px-3 py-1.5 rounded-full text-xs font-semibold text-orange-950">
                <span className="size-2 rounded-full bg-orange-500 animate-pulse"></span>
                <span>{user.name}</span>
                <span className="text-[10px] bg-orange-200/70 text-orange-900 px-1.5 py-0.5 rounded-md font-bold uppercase">{user.role}</span>
              </div>
              <button
                onClick={logout}
                title="Sign out"
                className="size-8 rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <LogOut className="size-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 text-xs font-bold shadow-md shadow-orange-600/20 transition-all active:scale-95 cursor-pointer"
            >
              <User className="size-3.5" />
              Sign in
            </button>
          )}

        </div>

      </div>
    </header>
  );
};

