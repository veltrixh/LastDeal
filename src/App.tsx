import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from './StoreContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { HowItWorks } from './components/HowItWorks';
import { AiScanDemo } from './components/AiScanDemo';
import { CustomerApp } from './components/CustomerApp';
import { MerchantDashboard } from './components/MerchantDashboard';
import { LoginModal } from './components/LoginModal';
import { LastDealLogo } from './components/LastDealLogo';
import { Heart } from 'lucide-react';

function AppContent() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-slate-900">
      
      {/* Sticky Header with location and user switcher */}
      <Header onOpenLogin={() => setIsLoginOpen(true)} />

      {/* Main Experience Flow */}
      <main className="flex-1">
        {/* 1. Hero Section with Live Deal Preview & Metrics */}
        <HeroSection />

        {/* 2. Process Flow: What happens to unsold inventory? */}
        <HowItWorks />

        {/* 3. AI Inventory Intelligence Live Demo */}
        <AiScanDemo />

        {/* 4. Customer Deals Feed & Instant QR Pass Generator */}
        <CustomerApp />

        {/* 5. Merchant Portal with AI Markdown Pricing */}
        <MerchantDashboard />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Logo & Tagline */}
            <div className="flex items-center gap-3">
              <LastDealLogo size="sm" />
            </div>

            {/* Micro Nav */}
            <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-slate-600">
              <a href="#hero" className="hover:text-orange-600 transition-colors">Home</a>
              <a href="#deals" className="hover:text-orange-600 transition-colors">Browse Deals</a>
              <a href="#smart-deals" className="hover:text-orange-600 transition-colors">AI Intelligence</a>
              <a href="#why" className="hover:text-orange-600 transition-colors">How It Works</a>
              <a href="#merchant-portal" className="hover:text-orange-600 transition-colors">For Stores</a>
            </div>

            {/* Environmental Note */}
            <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
              <span>Made with</span>
              <Heart className="size-3.5 text-orange-500 fill-orange-500" />
              <span>for zero food waste</span>
            </div>

          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400">
            <p>© 2026 LastDeal Hyperlocal Network. All rights reserved.</p>
            <p className="mt-2 sm:mt-0">“Kyunki achha maal waste hone ke liye nahi bana.”</p>
          </div>
        </div>
      </footer>

      {/* Role & Persona Login Modal */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />

    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </StoreProvider>
  );
}
