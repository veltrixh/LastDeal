import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Deal, Reservation, StoreContextType, UserRole, AiPredictionResult } from './types';

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Initial fallback mock deals
const FALLBACK_DEALS: Deal[] = [
  {
    id: 'deal-1',
    merchantId: 'm1',
    merchantName: 'Corner Bakehouse & Supermart',
    title: 'Whole Wheat Sliced Bread Pack',
    subtitle: 'Packaged Artisan Loaf, 400g',
    description: 'Pre-sliced sealed whole wheat sandwich bread. 100% whole grain with zero preservatives.',
    category: 'Bakery',
    originalPrice: 50,
    discountedPrice: 28,
    discountPercentage: 44,
    quantity: 14,
    unit: 'pack',
    expiryHours: 36,
    expiryTime: new Date(Date.now() + 1000 * 60 * 60 * 36).toISOString(),
    latitude: 12.9352,
    longitude: 77.6245,
    distance: '0.8 km',
    storeAddress: '5th Block, Koramangala, Bengaluru',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    wasteRisk: 'urgent',
    tagline: 'Daam kam. Value full.',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'deal-2',
    merchantId: 'm2',
    merchantName: 'Fresh Mart Superstore',
    title: 'Pure Orange Juice Carton (1L)',
    subtitle: 'Tetra Pak Sealed, 1000ml',
    description: '100% pure Valencia orange juice in sealed carton.',
    category: 'Beverages',
    originalPrice: 140,
    discountedPrice: 85,
    discountPercentage: 39,
    quantity: 10,
    unit: 'carton',
    expiryHours: 28,
    expiryTime: new Date(Date.now() + 1000 * 60 * 60 * 28).toISOString(),
    latitude: 12.9341,
    longitude: 77.6189,
    distance: '1.1 km',
    storeAddress: '4th Block, Koramangala, Bengaluru',
    imageUrl: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&auto=format&fit=crop&q=80',
    wasteRisk: 'attention',
    tagline: 'Piyo fresh, bacho cash.',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'deal-3',
    merchantId: 'm3',
    merchantName: 'Daily Dairy Essentials',
    title: 'Greek Yogurt Sealed Tub (400g)',
    subtitle: 'High Protein Probiotic Tub',
    description: 'Thick unsweetened Greek style yogurt sealed with foil freshness lock.',
    category: 'Dairy',
    originalPrice: 160,
    discountedPrice: 99,
    discountPercentage: 38,
    quantity: 18,
    unit: 'tub',
    expiryHours: 48,
    expiryTime: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    latitude: 12.9388,
    longitude: 77.6294,
    distance: '1.4 km',
    storeAddress: '6th Block, Koramangala, Bengaluru',
    imageUrl: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=600&auto=format&fit=crop&q=80',
    wasteRisk: 'safe',
    tagline: 'Healthy snack, wallet check.',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'deal-4',
    merchantId: 'm1',
    merchantName: 'Corner Bakehouse & Supermart',
    title: 'Organic Honey Oat Biscuits Box',
    subtitle: 'Packaged Cookies Box, 250g',
    description: 'Double sealed box of whole oat and pure honey crispy digestive cookies.',
    category: 'Snacks',
    originalPrice: 95,
    discountedPrice: 55,
    discountPercentage: 42,
    quantity: 22,
    unit: 'box',
    expiryHours: 96,
    expiryTime: new Date(Date.now() + 1000 * 60 * 60 * 96).toISOString(),
    latitude: 12.9352,
    longitude: 77.6245,
    distance: '0.8 km',
    storeAddress: '5th Block, Koramangala, Bengaluru',
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80',
    wasteRisk: 'safe',
    tagline: 'Biscuit bhi sweet lagta hai, jab sahi daam pe milta hai.',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'deal-5',
    merchantId: 'm2',
    merchantName: 'Fresh Mart Superstore',
    title: 'Pasteurized Full Cream Milk (1L Carton)',
    subtitle: 'Sealed Milk Tetra Pak',
    description: 'UHT treated homogenized pure dairy milk. Shelf stable packaging before breaking seal.',
    category: 'Dairy',
    originalPrice: 65,
    discountedPrice: 42,
    discountPercentage: 35,
    quantity: 25,
    unit: 'carton',
    expiryHours: 30,
    expiryTime: new Date(Date.now() + 1000 * 60 * 60 * 30).toISOString(),
    latitude: 12.9341,
    longitude: 77.6189,
    distance: '1.1 km',
    storeAddress: '4th Block, Koramangala, Bengaluru',
    imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80',
    wasteRisk: 'urgent',
    tagline: 'Daily essential, super savings.',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    id: 'deal-6',
    merchantId: 'm4',
    merchantName: 'Organic Harvest Store',
    title: 'Crunchy Almond Granola Pouch (500g)',
    subtitle: 'Zipper Sealed Breakfast Pouch',
    description: 'Roasted rolled oats, almonds, chia seeds, and wild honey in resealable packaging.',
    category: 'Snacks',
    originalPrice: 320,
    discountedPrice: 185,
    discountPercentage: 42,
    quantity: 12,
    unit: 'pouch',
    expiryHours: 120,
    expiryTime: new Date(Date.now() + 1000 * 60 * 60 * 120).toISOString(),
    latitude: 12.9365,
    longitude: 77.6212,
    distance: '0.5 km',
    storeAddress: '7th Block, Koramangala, Bengaluru',
    imageUrl: 'https://images.unsplash.com/photo-1517093157656-b9ec81653e0f?w=600&auto=format&fit=crop&q=80',
    wasteRisk: 'safe',
    tagline: 'Breakfast premium, pocket easy.',
    createdAt: new Date(Date.now() - 3600000 * 7).toISOString()
  },
  {
    id: 'deal-7',
    merchantId: 'm4',
    merchantName: 'Organic Harvest Store',
    title: 'Roasted Salted Cashews & Almonds Tin (300g)',
    subtitle: 'Airtight Vacuum Tin',
    description: 'Jumbo roasted cashews and California almonds vacuum sealed for crunchiness.',
    category: 'Snacks',
    originalPrice: 450,
    discountedPrice: 260,
    discountPercentage: 42,
    quantity: 8,
    unit: 'tin',
    expiryHours: 140,
    expiryTime: new Date(Date.now() + 1000 * 60 * 60 * 140).toISOString(),
    latitude: 12.9365,
    longitude: 77.6212,
    distance: '0.5 km',
    storeAddress: '7th Block, Koramangala, Bengaluru',
    imageUrl: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&auto=format&fit=crop&q=80',
    wasteRisk: 'safe',
    tagline: 'Nutritious munch, sweet discount.',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    id: 'deal-8',
    merchantId: 'm2',
    merchantName: 'Fresh Mart Superstore',
    title: 'Durum Wheat Penne Rigate Pasta Box (500g)',
    subtitle: 'Imported Sealed Box',
    description: '100% Italian durum wheat semolina dry pasta in recyclable box packaging.',
    category: 'Snacks',
    originalPrice: 190,
    discountedPrice: 110,
    discountPercentage: 42,
    quantity: 16,
    unit: 'box',
    expiryHours: 160,
    expiryTime: new Date(Date.now() + 1000 * 60 * 60 * 160).toISOString(),
    latitude: 12.9341,
    longitude: 77.6189,
    distance: '1.1 km',
    storeAddress: '4th Block, Koramangala, Bengaluru',
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?w=600&auto=format&fit=crop&q=80',
    wasteRisk: 'safe',
    tagline: 'Dinner sorted, zero waste.',
    createdAt: new Date(Date.now() - 3600000 * 9).toISOString()
  }
];

const FALLBACK_RESERVATIONS: Reservation[] = [
  {
    id: 'res-101',
    dealId: 'deal-1',
    dealTitle: 'Whole Wheat Sliced Bread Pack',
    customerId: 'Priya Sharma',
    customerName: 'Priya Sharma',
    merchantId: 'm1',
    merchantName: 'Corner Bakehouse & Supermart',
    quantity: 2,
    totalAmount: 56,
    status: 'reserved',
    reservedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    qrCodeData: 'STOCKSHARE-RES-101-DEAL-1',
    deal: FALLBACK_DEALS[0]
  }
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial deals from localStorage or fallback
  const [deals, setDeals] = useState<Deal[]>(() => {
    try {
      const saved = localStorage.getItem('stockshare_deals_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading stored deals:', e);
    }
    return FALLBACK_DEALS;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const saved = localStorage.getItem('stockshare_reservations_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading stored reservations:', e);
    }
    return FALLBACK_RESERVATIONS;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Deals');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [highlightDealId, setHighlightDealId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; city: string } | null>({
    lat: 12.9352,
    lng: 77.6245,
    city: 'Koramangala, BLR'
  });
  
  // Persist user in localStorage if available
  const [user, setUser] = useState<{ role: UserRole; name: string } | null>(() => {
    try {
      const saved = localStorage.getItem('stockshare_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Save deals to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('stockshare_deals_v3', JSON.stringify(deals));
    } catch (e) {
      console.error(e);
    }
  }, [deals]);

  // Save reservations to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('stockshare_reservations_v3', JSON.stringify(reservations));
    } catch (e) {
      console.error(e);
    }
  }, [reservations]);

  const login = (role: UserRole, name: string) => {
    const newUser = { role, name };
    setUser(newUser);
    try {
      localStorage.setItem('stockshare_user', JSON.stringify(newUser));
    } catch (e) {
      console.error(e);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('stockshare_user');
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch deals from backend API if available
  const refreshDeals = useCallback(async () => {
    try {
      const res = await fetch('/api/deals');
      if (res.ok) {
        const data = await res.json();
        if (data.deals && Array.isArray(data.deals) && data.deals.length > 0) {
          setDeals(data.deals);
        }
      }
    } catch (err) {
      // Backend not running, local state is active
    }
  }, []);

  // Fetch reservations from backend API if available
  const refreshReservations = useCallback(async () => {
    try {
      const res = await fetch('/api/reservations');
      if (res.ok) {
        const data = await res.json();
        if (data.reservations && Array.isArray(data.reservations)) {
          setReservations(data.reservations);
        }
      }
    } catch (err) {
      // Backend not running, local state is active
    }
  }, []);

  useEffect(() => {
    refreshDeals();
    refreshReservations();
  }, [refreshDeals, refreshReservations]);

  // Add a deal (Merchant)
  const addDeal = async (dealData: Omit<Deal, 'id' | 'createdAt'>): Promise<Deal> => {
    const newId = `deal-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const newDeal: Deal = {
      ...dealData,
      id: newId,
      createdAt: new Date().toISOString()
    };

    // Try posting to API if available
    try {
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dealData)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.deal) {
          setDeals(prev => [data.deal, ...prev]);
          setHighlightDealId(data.deal.id);
          return data.deal;
        }
      }
    } catch (e) {
      console.warn('API post failed, using local deal creation:', e);
    }

    // Always update local state immediately
    setDeals(prev => [newDeal, ...prev]);
    setHighlightDealId(newDeal.id);
    return newDeal;
  };

  // Reserve a deal (Customer)
  const reserveDeal = async (dealId: string, customerName: string, quantity: number): Promise<Reservation> => {
    const deal = deals.find(d => d.id === dealId);
    const reservationId = `res-${Date.now().toString(36)}`;
    const localRes: Reservation = {
      id: reservationId,
      dealId,
      dealTitle: deal?.title || 'Surplus Item',
      merchantId: deal?.merchantId || 'm1',
      merchantName: deal?.merchantName || 'Local Merchant',
      customerId: customerName,
      customerName,
      quantity,
      totalAmount: (deal?.discountedPrice || 0) * quantity,
      status: 'reserved',
      reservedAt: new Date().toISOString(),
      qrCodeData: `STOCKSHARE-RES-${reservationId.toUpperCase()}-${dealId}`,
      deal
    };

    try {
      const res = await fetch(`/api/deals/${dealId}/reserve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          quantity
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reservation) {
          setReservations(prev => [data.reservation, ...prev]);
          setDeals(prev => prev.map(d => d.id === dealId ? { ...d, quantity: data.remainingQuantity } : d));
          return data.reservation;
        }
      }
    } catch (e) {
      console.warn('API reserve failed, using local state:', e);
    }

    // Local fallback update
    setReservations(prev => [localRes, ...prev]);
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, quantity: Math.max(0, d.quantity - quantity) } : d));
    return localRes;
  };

  // Mark pickup (Merchant)
  const markPickedUp = async (reservationId: string) => {
    try {
      await fetch(`/api/reservations/${reservationId}/pickup`, {
        method: 'POST'
      });
    } catch (e) {
      // Local fallback
    }

    setReservations(prev => prev.map(r => r.id === reservationId ? { ...r, status: 'picked_up', pickedUpAt: new Date().toISOString() } : r));
  };

  // AI Pricing Prediction
  const predictAiPrice = async (params: { originalPrice: number; expiryHours: number; category?: string; quantity?: number }): Promise<AiPredictionResult> => {
    try {
      const res = await fetch('/api/ai/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (res.ok) {
        const data = await res.json();
        return data.prediction;
      }
    } catch (e) {
      // Local fallback
    }

    // Dynamic smart pricing algorithm
    let baseDiscount = 35;
    if (params.expiryHours <= 12) baseDiscount = 55;
    else if (params.expiryHours <= 24) baseDiscount = 45;
    else if (params.expiryHours <= 48) baseDiscount = 35;
    else baseDiscount = 25;

    if (params.category === 'Dairy' || params.category === 'Bakery') baseDiscount += 5;
    if ((params.quantity || 1) >= 10) baseDiscount += 5;

    baseDiscount = Math.min(Math.max(baseDiscount, 15), 75);
    const recommendedPrice = Math.round(params.originalPrice * (1 - baseDiscount / 100));
    return {
      discountPercentage: baseDiscount,
      recommendedPrice,
      potentialRecovery: recommendedPrice * (params.quantity || 5),
      confidence: 0.94,
      reasoning: `Recommended ${baseDiscount}% off based on ${params.expiryHours}h expiry horizon to accelerate clearance.`
    };
  };

  return (
    <StoreContext.Provider value={{
      deals,
      reservations,
      isLoading,
      selectedCategory,
      setSelectedCategory,
      searchQuery,
      setSearchQuery,
      userLocation,
      setUserLocation,
      user,
      login,
      logout,
      addDeal,
      reserveDeal,
      markPickedUp,
      predictAiPrice,
      refreshDeals,
      highlightDealId,
      setHighlightDealId
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
