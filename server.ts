import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { GROCERY_PRODUCTS, CYBER_SERVICES, PROMO_OFFERS, DEFAULT_PRINT_RATES } from './src/data/mockData';
import { Order, PrintJobConfig, GroceryProduct, CyberService, PrintVarietyRate, PromoOffer } from './src/types';

// In-memory order store & store settings for live customization
const ordersDatabase: Record<string, Order> = {};
let storeProducts: GroceryProduct[] = [...GROCERY_PRODUCTS];
let storeServices: CyberService[] = [...CYBER_SERVICES];
let storePrintRates: PrintVarietyRate[] = [...DEFAULT_PRINT_RATES];
let storePromos: PromoOffer[] = [...PROMO_OFFERS];
let ownerPassword = '1234'; // Default protective owner password
let storeSettings = {
  storeName: 'CYBER HUB',
  storeTagline: 'Cyber Hub for Online Work, Fast Printing & Fresh Groceries',
  address: '108 Cyber & Digital Avenue, Tech Hub District',
  phone: '+1 (555) 902-3847',
  notice: 'Store Open • Cyber Hub Online Work & Counter Pickup Active'
};

// Helper to generate readable token numbers like "CYB-8092"
function generateToken(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `CM-${num}`;
}

// Calculate print cost reliably
function calculatePrintPrice(config: PrintJobConfig): number {
  const { paperSize, printType, sides, pages, copies, binding, lamination } = config;
  
  let basePageRate = 0.10; // B&W A4 default
  if (printType === 'color') basePageRate = 0.40;
  if (printType === 'hd-photo') basePageRate = 0.90;

  if (paperSize === 'A3') basePageRate *= 1.8;
  if (paperSize === 'Legal') basePageRate *= 1.2;
  if (paperSize === 'Glossy Photo (4x6)') basePageRate = 0.85;

  let pageMultiplier = sides === 'double' ? 0.85 : 1.0; // 15% discount for double sided paper saving
  let printingSubtotal = pages * basePageRate * pageMultiplier * copies;

  let bindingCost = 0;
  if (binding === 'staple') bindingCost = 0.25 * copies;
  if (binding === 'spiral') bindingCost = 2.00 * copies;
  if (binding === 'hardcover') bindingCost = 5.00 * copies;

  let laminationCost = lamination ? (0.75 * pages * copies) : 0;

  const total = printingSubtotal + bindingCost + laminationCost;
  return Math.round(total * 100) / 100;
}

// Helper for Gemini AI initialization
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      storeSettings,
      time: new Date().toISOString(),
    });
  });

  // Owner Security & Password Routes
  app.post('/api/owner/verify-password', (req: Request, res: Response) => {
    const { password } = req.body;
    if (password === ownerPassword) {
      return res.json({ success: true, authenticated: true });
    }
    return res.status(401).json({ success: false, error: 'Incorrect owner password. Access denied.' });
  });

  app.post('/api/owner/change-password', (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    if (oldPassword !== ownerPassword) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect.' });
    }
    if (!newPassword || newPassword.trim().length < 3) {
      return res.status(400).json({ success: false, error: 'New password must be at least 3 characters long.' });
    }
    ownerPassword = newPassword.trim();
    return res.json({ success: true, message: 'Owner password updated successfully.' });
  });

  // Print Variety Rates Management Routes
  app.get('/api/print-rates', (_req: Request, res: Response) => {
    res.json({ printRates: storePrintRates });
  });

  app.post('/api/print-rates', (req: Request, res: Response) => {
    const newRate: PrintVarietyRate = {
      id: `pr-custom-${Date.now()}`,
      varietyName: req.body.varietyName || 'New Print Variety',
      paperSize: req.body.paperSize || 'A4',
      printType: req.body.printType || 'bw',
      pricePerPage: Number(req.body.pricePerPage) || 0.20,
      duplexMultiplier: Number(req.body.duplexMultiplier) || 0.85,
      bindingPrice: Number(req.body.bindingPrice) || 0,
      laminationPricePerPage: Number(req.body.laminationPricePerPage) || 0,
      gsmQuality: req.body.gsmQuality || '80 GSM',
      description: req.body.description || 'Custom print variety option.',
    };
    storePrintRates.unshift(newRate);
    res.json({ success: true, printRate: newRate, printRates: storePrintRates });
  });

  app.put('/api/print-rates/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const index = storePrintRates.findIndex((pr) => pr.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Print rate variety not found' });
    }
    storePrintRates[index] = {
      ...storePrintRates[index],
      ...req.body,
      pricePerPage: req.body.pricePerPage !== undefined ? Number(req.body.pricePerPage) : storePrintRates[index].pricePerPage,
      duplexMultiplier: req.body.duplexMultiplier !== undefined ? Number(req.body.duplexMultiplier) : storePrintRates[index].duplexMultiplier,
      bindingPrice: req.body.bindingPrice !== undefined ? Number(req.body.bindingPrice) : storePrintRates[index].bindingPrice,
      laminationPricePerPage: req.body.laminationPricePerPage !== undefined ? Number(req.body.laminationPricePerPage) : storePrintRates[index].laminationPricePerPage,
    };
    res.json({ success: true, printRate: storePrintRates[index], printRates: storePrintRates });
  });

  app.delete('/api/print-rates/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    storePrintRates = storePrintRates.filter((pr) => pr.id !== id);
    res.json({ success: true, printRates: storePrintRates });
  });

  app.get('/api/settings', (_req: Request, res: Response) => {
    res.json({ settings: storeSettings });
  });

  app.post('/api/settings', (req: Request, res: Response) => {
    const { storeName, storeTagline, address, phone, notice } = req.body;
    if (storeName) storeSettings.storeName = storeName;
    if (storeTagline) storeSettings.storeTagline = storeTagline;
    if (address) storeSettings.address = address;
    if (phone) storeSettings.phone = phone;
    if (notice) storeSettings.notice = notice;
    res.json({ success: true, settings: storeSettings });
  });

  app.get('/api/products', (_req: Request, res: Response) => {
    res.json({ products: storeProducts });
  });

  app.post('/api/products', (req: Request, res: Response) => {
    const newProduct: GroceryProduct = {
      id: req.body.id || `g-custom-${Date.now()}`,
      name: req.body.name || 'New Item',
      category: req.body.category || 'staples',
      price: Number(req.body.price) || 1.99,
      originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : undefined,
      unit: req.body.unit || '1 unit',
      stock: Number(req.body.stock) || 50,
      rating: Number(req.body.rating) || 5.0,
      image: req.body.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
      description: req.body.description || 'Quality item',
      badge: req.body.badge || undefined,
      isOrganic: req.body.isOrganic || false,
    };
    storeProducts.unshift(newProduct);
    res.json({ success: true, product: newProduct, products: storeProducts });
  });

  app.put('/api/products/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const index = storeProducts.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    storeProducts[index] = {
      ...storeProducts[index],
      ...req.body,
      price: req.body.price !== undefined ? Number(req.body.price) : storeProducts[index].price,
      stock: req.body.stock !== undefined ? Number(req.body.stock) : storeProducts[index].stock,
      rating: req.body.rating !== undefined ? Number(req.body.rating) : storeProducts[index].rating,
    };
    res.json({ success: true, product: storeProducts[index], products: storeProducts });
  });

  app.delete('/api/products/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    storeProducts = storeProducts.filter((p) => p.id !== id);
    res.json({ success: true, products: storeProducts });
  });

  app.get('/api/services', (_req: Request, res: Response) => {
    res.json({ services: storeServices });
  });

  app.put('/api/services/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const index = storeServices.findIndex((s) => s.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Service not found' });
    }
    storeServices[index] = {
      ...storeServices[index],
      ...req.body,
      startingPrice: req.body.startingPrice !== undefined ? Number(req.body.startingPrice) : storeServices[index].startingPrice,
    };
    res.json({ success: true, service: storeServices[index], services: storeServices });
  });

  app.delete('/api/services/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    storeServices = storeServices.filter((s) => s.id !== id);
    res.json({ success: true, services: storeServices });
  });

  app.get('/api/promos', (_req: Request, res: Response) => {
    res.json({ promos: storePromos });
  });

  app.post('/api/promos', (req: Request, res: Response) => {
    const newPromo: PromoOffer = {
      id: `p-${Date.now()}`,
      title: req.body.title || 'Special Deal',
      code: (req.body.code || 'DEAL10').toUpperCase(),
      description: req.body.description || 'Special store offer discount',
      badge: req.body.badge || 'Special Offer',
      color: req.body.color || 'from-emerald-600 to-teal-700',
    };
    storePromos.unshift(newPromo);
    res.json({ success: true, promo: newPromo, promos: storePromos });
  });

  app.put('/api/promos/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const index = storePromos.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Promo offer not found' });
    }
    storePromos[index] = {
      ...storePromos[index],
      ...req.body,
      code: req.body.code ? req.body.code.toUpperCase() : storePromos[index].code,
    };
    res.json({ success: true, promo: storePromos[index], promos: storePromos });
  });

  app.delete('/api/promos/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    storePromos = storePromos.filter((p) => p.id !== id);
    res.json({ success: true, promos: storePromos });
  });

  app.post('/api/print-quote', (req: Request, res: Response) => {
    try {
      const config: PrintJobConfig = req.body;
      const calculatedCost = calculatePrintPrice(config);
      res.json({ success: true, estimatedCost: calculatedCost });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Invalid print config' });
    }
  });

  app.get('/api/orders', (_req: Request, res: Response) => {
    // Return array of unique orders
    const uniqueOrders = Array.from(new Set(Object.values(ordersDatabase)));
    res.json({ orders: uniqueOrders });
  });

  app.post('/api/orders', (req: Request, res: Response) => {
    try {
      const orderData = req.body;
      const orderId = `ORD-${Date.now()}`;
      const tokenNumber = generateToken();

      const newOrder: Order = {
        id: orderId,
        tokenNumber,
        createdAt: new Date().toISOString(),
        items: orderData.items || [],
        subtotal: orderData.subtotal || 0,
        deliveryFee: 0,
        discount: orderData.discount || 0,
        total: Math.max(0, (orderData.subtotal || 0) - (orderData.discount || 0)),
        fulfillmentType: 'store-pickup',
        customerName: orderData.customerName || 'Valued Customer',
        customerPhone: orderData.customerPhone || '',
        deliveryAddress: orderData.deliveryAddress || '',
        notes: orderData.notes || '',
        paymentMethod: orderData.paymentMethod || 'cash-on-pickup',
        status: 'received',
      };

      ordersDatabase[orderId] = newOrder;
      ordersDatabase[tokenNumber] = newOrder;

      res.json({ success: true, order: newOrder });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to create order' });
    }
  });

  app.get('/api/orders/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const order = ordersDatabase[id];
    if (!order) {
      return res.status(404).json({ error: 'Order or Token not found' });
    }
    res.json({ order });
  });

  // AI Meal & Grocery Recipe Assistant Route
  app.post('/api/ai/recipe-assistant', async (req: Request, res: Response) => {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Smart Fallback response if API key is not configured yet
      const matchedProducts = GROCERY_PRODUCTS.slice(0, 4);
      return res.json({
        mealTitle: `Recipe Idea: ${prompt}`,
        description: `Here is a custom meal kit matching "${prompt}" curated directly from our fresh store catalog.`,
        suggestedProductIds: matchedProducts.map((p) => p.id),
        cookingTips: [
          'Use fresh local milk and organic produce for maximum flavor.',
          'Combine with our store bakery bread for a complete wholesome meal.',
        ],
      });
    }

    try {
      const catalogSummary = GROCERY_PRODUCTS.map(
        (p) => `${p.id}: ${p.name} ($${p.price}/${p.unit}, Category: ${p.category})`
      ).join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `You are the AI Chef & Smart Shopping Assistant for "CyberMart & Tech Express".
User Request: "${prompt}"

Available Store Catalog:
${catalogSummary}

Provide a JSON output matching this schema:
{
  "mealTitle": "Catchy Recipe Name",
  "description": "Brief 2-sentence description of the dish and why it fits",
  "suggestedProductIds": ["g-1", "g-2"], // Array of matching product IDs from catalog above
  "cookingTips": ["Tip 1", "Tip 2"]
}`,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '{}';
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch (err: any) {
      console.error('Gemini Recipe Assistant error:', err);
      res.json({
        mealTitle: `Custom Grocery Bundle for "${prompt}"`,
        description: 'Here are handpicked fresh items from our store.',
        suggestedProductIds: ['g-1', 'g-3', 'g-4'],
        cookingTips: ['Keep ingredients refrigerated until prep.'],
      });
    }
  });

  // AI Document & Print Assistant Route
  app.post('/api/ai/doc-assistant', async (req: Request, res: Response) => {
    const { documentDescription, taskType } = req.body;
    if (!documentDescription) {
      return res.status(400).json({ error: 'documentDescription is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        summary: 'Recommendation based on standard cyber print rules',
        paperSize: 'A4',
        printType: 'bw',
        sides: 'double',
        binding: 'spiral',
        lamination: false,
        advice: 'Double-sided printing reduces paper usage by 50% and lowers your total cost!',
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `You are the AI Cyber Cafe Printing & Document Specialist.
User Document Description: "${documentDescription}" (Task type: ${taskType || 'print'})

Analyze the document requirement and provide JSON output:
{
  "summary": "Short 1-sentence recommendation summary",
  "recommendedPages": 10,
  "paperSize": "A4", // A4, A3, Legal, Glossy Photo (4x6)
  "printType": "bw", // bw, color, hd-photo
  "sides": "double", // single, double
  "binding": "spiral", // none, staple, spiral, hardcover
  "lamination": false,
  "advice": "Practical advice for optimal document quality and cost efficiency"
}`,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '{}';
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch (err: any) {
      console.error('Gemini Doc Assistant error:', err);
      res.json({
        summary: 'Standard A4 Document Printing Recommendation',
        recommendedPages: 5,
        paperSize: 'A4',
        printType: 'bw',
        sides: 'double',
        binding: 'none',
        lamination: false,
        advice: 'Using double-sided black & white printing offers the best value for documents.',
      });
    }
  });

  // Vite development middleware or production static handling
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
