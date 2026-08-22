import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Enable basic CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Helper functions for reading and writing JSON database
function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initialData = { deals: [], reservations: [] };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading DB:', err);
    return { deals: [], reservations: [] };
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing DB:', err);
    return false;
  }
}

// 1. GET /api/deals - List all deals with optional category & search filter
app.get('/api/deals', (req, res) => {
  const db = readDb();
  let deals = db.deals || [];

  const { category, search, activeOnly } = req.query;

  if (category && category !== 'All Deals') {
    deals = deals.filter(d => d.category?.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    deals = deals.filter(d => 
      d.title.toLowerCase().includes(q) || 
      d.merchantName.toLowerCase().includes(q) ||
      (d.subtitle && d.subtitle.toLowerCase().includes(q)) ||
      (d.category && d.category.toLowerCase().includes(q))
    );
  }

  if (activeOnly === 'true') {
    deals = deals.filter(d => d.quantity > 0);
  }

  res.json({ success: true, count: deals.length, deals });
});

// 2. GET /api/deals/:id - Get single deal
app.get('/api/deals/:id', (req, res) => {
  const db = readDb();
  const deal = db.deals.find(d => d.id === req.params.id);
  if (!deal) {
    return res.status(404).json({ success: false, message: 'Deal not found' });
  }
  res.json({ success: true, deal });
});

// 3. POST /api/deals - Create a new surplus deal
app.post('/api/deals', (req, res) => {
  const {
    merchantId,
    merchantName,
    title,
    subtitle,
    description,
    category,
    originalPrice,
    discountedPrice,
    quantity,
    expiryHours,
    imageUrl,
    storeAddress,
    latitude,
    longitude
  } = req.body;

  if (!title || !originalPrice || !discountedPrice || !quantity) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const db = readDb();
  const orig = Number(originalPrice);
  const disc = Number(discountedPrice);
  const discountPercentage = Math.round(((orig - disc) / orig) * 100);
  const expHours = Number(expiryHours) || 24;
  const expiryTime = new Date(Date.now() + expHours * 60 * 60 * 1000).toISOString();

  let wasteRisk = 'safe';
  if (expHours <= 24) wasteRisk = 'urgent';
  else if (expHours <= 48) wasteRisk = 'attention';

  const newDeal = {
    id: `deal-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`,
    merchantId: merchantId || 'm1',
    merchantName: merchantName || 'Local Merchant',
    title,
    subtitle: subtitle || `${category || 'Surplus Item'}`,
    description: description || 'High quality surplus food available at discounted pricing.',
    category: category || 'Bakery',
    originalPrice: orig,
    discountedPrice: disc,
    discountPercentage,
    quantity: Number(quantity),
    unit: 'item',
    expiryHours: expHours,
    expiryTime,
    latitude: latitude || 12.9352,
    longitude: longitude || 77.6245,
    distance: '0.8 km',
    storeAddress: storeAddress || 'Koramangala, Bengaluru',
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    wasteRisk,
    tagline: 'Daam kam. Value full.',
    createdAt: new Date().toISOString()
  };

  db.deals.unshift(newDeal);
  writeDb(db);

  res.status(201).json({ success: true, deal: newDeal });
});

// 4. POST /api/deals/:id/reserve - Reserve a deal
app.post('/api/deals/:id/reserve', (req, res) => {
  const { customerName, customerId, quantity } = req.body;
  const qtyToReserve = Number(quantity) || 1;

  const db = readDb();
  const dealIndex = db.deals.findIndex(d => d.id === req.params.id);

  if (dealIndex === -1) {
    return res.status(404).json({ success: false, message: 'Deal not found' });
  }

  const deal = db.deals[dealIndex];
  if (deal.quantity < qtyToReserve) {
    return res.status(400).json({ success: false, message: 'Not enough quantity in stock' });
  }

  // Deduct stock
  deal.quantity -= qtyToReserve;
  db.deals[dealIndex] = deal;

  const reservationId = `res-${Date.now().toString(36)}`;
  const reservation = {
    id: reservationId,
    dealId: deal.id,
    dealTitle: deal.title,
    merchantId: deal.merchantId,
    merchantName: deal.merchantName,
    customerId: customerId || customerName || 'Guest User',
    customerName: customerName || 'Valued Customer',
    quantity: qtyToReserve,
    totalAmount: deal.discountedPrice * qtyToReserve,
    status: 'reserved',
    reservedAt: new Date().toISOString(),
    qrCodeData: `STOCKSHARE-RES-${reservationId.toUpperCase()}-${deal.id}`,
    deal
  };

  if (!db.reservations) db.reservations = [];
  db.reservations.unshift(reservation);
  writeDb(db);

  res.status(201).json({ success: true, reservation, remainingQuantity: deal.quantity });
});

// 5. GET /api/reservations - List reservations
app.get('/api/reservations', (req, res) => {
  const db = readDb();
  let reservations = db.reservations || [];
  const { customerName, merchantId, status } = req.query;

  if (customerName) {
    reservations = reservations.filter(r => 
      r.customerName?.toLowerCase() === customerName.toLowerCase() ||
      r.customerId?.toLowerCase() === customerName.toLowerCase()
    );
  }

  if (merchantId) {
    reservations = reservations.filter(r => r.merchantId === merchantId);
  }

  if (status) {
    reservations = reservations.filter(r => r.status === status);
  }

  res.json({ success: true, count: reservations.length, reservations });
});

// 6. POST /api/reservations/:id/pickup - Mark reservation as picked up
app.post('/api/reservations/:id/pickup', (req, res) => {
  const db = readDb();
  const resIndex = (db.reservations || []).findIndex(r => r.id === req.params.id);

  if (resIndex === -1) {
    return res.status(404).json({ success: false, message: 'Reservation not found' });
  }

  db.reservations[resIndex].status = 'picked_up';
  db.reservations[resIndex].pickedUpAt = new Date().toISOString();
  writeDb(db);

  res.json({ success: true, reservation: db.reservations[resIndex] });
});

// 7. POST /api/ai/predict - Smart inventory pricing recommendation
app.post('/api/ai/predict', (req, res) => {
  const { originalPrice, expiryHours, category, quantity } = req.body;
  const price = Number(originalPrice) || 100;
  const hours = Number(expiryHours) || 24;
  const qty = Number(quantity) || 5;

  // AI inventory pricing formula
  let baseDiscount = 30;
  if (hours <= 6) baseDiscount = 60;
  else if (hours <= 12) baseDiscount = 50;
  else if (hours <= 24) baseDiscount = 40;
  else if (hours <= 48) baseDiscount = 35;
  else baseDiscount = 25;

  if (qty > 10) baseDiscount += 5;
  if (category === 'Dairy' || category === 'Bakery') baseDiscount += 5;

  baseDiscount = Math.min(Math.max(baseDiscount, 15), 75);

  const recommendedPrice = Math.round(price * (1 - baseDiscount / 100));
  const potentialRecovery = Math.round(recommendedPrice * qty);

  res.json({
    success: true,
    prediction: {
      discountPercentage: baseDiscount,
      recommendedPrice,
      potentialRecovery,
      confidence: 0.94,
      reasoning: `Based on ${hours}h expiry window and ${qty} units surplus, a ${baseDiscount}% discount maximizes neighborhood conversion while recovering ₹${potentialRecovery}.`
    }
  });
});

app.listen(PORT, () => {
  console.log(`✨ LastDeal / StockShare Backend running on http://localhost:${PORT}`);
});
