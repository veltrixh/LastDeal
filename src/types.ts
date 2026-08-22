export type UserRole = 'customer' | 'merchant';

export interface Deal {
  id: string;
  merchantId: string;
  merchantName: string;
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  quantity: number;
  unit?: string;
  expiryHours?: number;
  expiryTime: string; // ISO string
  latitude: number;
  longitude: number;
  distance?: string;
  storeAddress?: string;
  imageUrl?: string;
  wasteRisk?: 'urgent' | 'attention' | 'safe';
  tagline?: string;
  createdAt: string;
}

export interface Reservation {
  id: string;
  dealId: string;
  dealTitle?: string;
  customerId: string;
  customerName?: string;
  merchantId?: string;
  merchantName?: string;
  quantity: number;
  totalAmount?: number;
  status: 'reserved' | 'picked_up' | 'cancelled';
  reservedAt: string;
  pickedUpAt?: string;
  qrCodeData: string;
  deal?: Deal;
}

export interface AiPredictionResult {
  discountPercentage: number;
  recommendedPrice: number;
  potentialRecovery: number;
  confidence: number;
  reasoning: string;
}

export interface StoreContextType {
  deals: Deal[];
  reservations: Reservation[];
  isLoading: boolean;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  userLocation: { lat: number; lng: number; city: string } | null;
  setUserLocation: (loc: { lat: number; lng: number; city: string }) => void;
  user: { role: UserRole; name: string } | null;
  login: (role: UserRole, name: string) => void;
  logout: () => void;
  addDeal: (dealData: Omit<Deal, 'id' | 'createdAt'>) => Promise<Deal>;
  reserveDeal: (dealId: string, customerName: string, quantity: number) => Promise<Reservation>;
  markPickedUp: (reservationId: string) => Promise<void>;
  predictAiPrice: (params: { originalPrice: number; expiryHours: number; category?: string; quantity?: number }) => Promise<AiPredictionResult>;
  refreshDeals: () => Promise<void>;
  highlightDealId: string | null;
  setHighlightDealId: (id: string | null) => void;
}

