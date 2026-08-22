import React, { useState } from 'react';
import { useStore } from '../StoreContext';
import { UserRole } from '../types';
import { X, User, Store, ArrowRight, Sparkles, Check } from 'lucide-react';
import { LastDealLogo } from './LastDealLogo';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEMO_PERSONAS = [
  {
    role: 'customer' as UserRole,
    name: 'Priya Sharma (Shopper)',
    avatar: '👩🏽',
    desc: 'Bargain hunter & zero food waste champion',
    tag: 'Neighborhood Shopper'
  },
  {
    role: 'merchant' as UserRole,
    name: 'Corner Bakehouse (Merchant)',
    avatar: '👨🏽‍🍳',
    desc: 'Surplus baker minimizing evening discard',
    tag: 'Artisan Bakery'
  },
  {
    role: 'merchant' as UserRole,
    name: 'Fresh Mart Superstore (Merchant)',
    avatar: '🏪',
    desc: 'Local grocery store liquidating daily dairy & beverages',
    tag: 'Supermarket'
  }
];

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useStore();
  const [role, setRole] = useState<UserRole>('customer');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    login(role, name.trim());
    onClose();
  };

  const handleSelectPersona = (persona: typeof DEMO_PERSONAS[0]) => {
    login(persona.role, persona.name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl border border-gray-100">
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
        >
          <X className="size-5" />
        </button>

        {/* Brand Icon */}
        <div className="flex justify-center mb-3">
          <LastDealLogo size="md" showText={false} />
        </div>

        <h3 className="font-display text-2xl font-bold text-center text-slate-950">
          Welcome to Last<span className="text-orange-600">Deal</span>
        </h3>
        <p className="text-center text-xs text-slate-500 mt-1 mb-6">
          Choose a role or click a demo persona to test live clearance workflows
        </p>

        {/* 1-Click Interactive Demo Personas */}
        <div className="space-y-2 mb-6">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            ⚡ Quick 1-Click Demo Personas:
          </p>
          <div className="grid grid-cols-1 gap-2">
            {DEMO_PERSONAS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPersona(p)}
                className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 bg-gray-50/70 hover:bg-orange-50 hover:border-orange-300 transition-all text-left cursor-pointer group"
              >
                <span className="text-2xl">{p.avatar}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-xs text-slate-950 group-hover:text-orange-700">{p.name}</p>
                    <span className="text-[10px] font-bold text-orange-800 bg-orange-100 px-2 py-0.5 rounded-full border border-orange-200">
                      {p.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 truncate mt-0.5">{p.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400 font-bold text-[10px]">Or enter custom name</span></div>
        </div>

        {/* Custom Role Selector */}
        <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1.5 rounded-2xl mb-4">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              role === 'customer'
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <User className="size-3.5" />
            Shopper / Customer
          </button>

          <button
            type="button"
            onClick={() => setRole('merchant')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              role === 'merchant'
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Store className="size-3.5" />
            Store Merchant
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              {role === 'customer' ? 'Your Name' : 'Store / Business Name'}
            </label>
            <input
              type="text"
              required
              placeholder={role === 'customer' ? 'e.g. Priya Sharma' : 'e.g. Corner Bakehouse'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-600 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 text-sm shadow-md shadow-orange-600/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Continue as {role === 'customer' ? 'Shopper' : 'Store Partner'}</span>
            <ArrowRight className="size-4" />
          </button>
        </form>

      </div>
    </div>
  );
};


