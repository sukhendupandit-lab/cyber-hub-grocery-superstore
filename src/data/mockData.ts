import { GroceryProduct, CyberService, PromoOffer } from '../types';

export const GROCERY_PRODUCTS: GroceryProduct[] = [
  {
    id: 'g-1',
    name: 'Farm Fresh Whole Milk',
    category: 'dairy-bakery',
    price: 2.99,
    originalPrice: 3.49,
    unit: '1 Litre',
    stock: 45,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=600',
    badge: 'Fresh Daily',
    description: 'Pure, pasteurized fresh milk sourced daily from local dairy farms.'
  },
  {
    id: 'g-2',
    name: 'Artisan Whole Wheat Bread',
    category: 'dairy-bakery',
    price: 2.49,
    unit: '400g pack',
    stock: 20,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600',
    description: 'Soft freshly baked whole wheat loaf rich in natural fiber.'
  },
  {
    id: 'g-3',
    name: 'Organic Cavendish Bananas',
    category: 'fruits-veg',
    price: 1.49,
    originalPrice: 1.99,
    unit: '1 kg',
    stock: 60,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=600',
    isOrganic: true,
    badge: 'Best Seller',
    description: 'Naturally sweet and potassium-rich ripe organic yellow bananas.'
  },
  {
    id: 'g-4',
    name: 'Crisp Red Gala Apples',
    category: 'fruits-veg',
    price: 3.29,
    unit: '1 kg',
    stock: 35,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=600',
    description: 'Juicy, sweet, orchard-picked Gala red apples.'
  },
  {
    id: 'g-5',
    name: 'Royal Aged Basmati Rice',
    category: 'staples',
    price: 9.99,
    originalPrice: 11.99,
    unit: '5 kg bag',
    stock: 18,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600',
    badge: 'Premium Quality',
    description: 'Long-grain aromatic aged Basmati rice for biryanis and everyday meals.'
  },
  {
    id: 'g-6',
    name: 'Extra Virgin Cold Pressed Olive Oil',
    category: 'staples',
    price: 7.99,
    unit: '500ml bottle',
    stock: 15,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=600',
    description: '100% pure cold pressed extra virgin olive oil ideal for cooking and salads.'
  },
  {
    id: 'g-7',
    name: 'Roasted Salted Jumbo Cashews',
    category: 'beverages-snacks',
    price: 4.99,
    originalPrice: 5.99,
    unit: '200g pack',
    stock: 30,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1536591375315-198956582373?auto=format&fit=crop&q=80&w=600',
    description: 'Crunchy premium oven-roasted cashews with a touch of sea salt.'
  },
  {
    id: 'g-8',
    name: 'Dark Roast Ground Arabica Coffee',
    category: 'beverages-snacks',
    price: 6.49,
    unit: '250g pack',
    stock: 25,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=600',
    badge: 'Popular',
    description: 'Rich, aromatic 100% Arabica dark roast ground coffee.'
  },
  {
    id: 'g-9',
    name: 'Organic Brown Eggs',
    category: 'dairy-bakery',
    price: 3.49,
    unit: '12 pcs pack',
    stock: 40,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=600',
    isOrganic: true,
    description: 'Cage-free organic farm fresh eggs packed with protein.'
  },
  {
    id: 'g-10',
    name: 'Pure Cold Pressed Orange Juice',
    category: 'beverages-snacks',
    price: 3.29,
    unit: '1 Litre bottle',
    stock: 22,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=600',
    description: '100% natural freshly squeezed Valencia orange juice without added sugar.'
  },
  {
    id: 'g-11',
    name: 'Eco Dishwashing Gel & Sponge',
    category: 'personal-household',
    price: 2.80,
    unit: '750ml bottle',
    stock: 50,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1585832770485-e68a5fc88280?auto=format&fit=crop&q=80&w=600',
    description: 'Tough on grease, gentle on hands citrus eco dishwashing liquid.'
  },
  {
    id: 'g-12',
    name: 'Fresh Tomatoes & Bell Pepper Combo',
    category: 'fruits-veg',
    price: 2.60,
    unit: '1 kg basket',
    stock: 30,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=600',
    badge: 'Farm Direct',
    description: 'Crisp red tomatoes and fresh tri-color bell peppers basket.'
  }
];

export const CYBER_SERVICES: CyberService[] = [
  {
    id: 'cs-1',
    category: 'document-printing',
    title: 'Instant Online Printing & Photocopy',
    description: 'Upload PDF/Doc files online. Choose A4/A3, B&W or Vivid Color, single/double-sided, spiral binding.',
    startingPrice: 0.10,
    unitText: 'per page',
    image: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&q=80&w=600',
    popularBadge: 'Instant Upload',
    features: [
      'High speed 1200 DPI Laser Printing',
      'A4, A3, Legal & Glossy Photo Paper',
      'Spiral & Hardcover Thermal Binding',
      'Heavy duty 125 Micron Lamination'
    ]
  },
  {
    id: 'cs-2',
    category: 'workstation-booking',
    title: 'PC Workstation & Internet Station Slot',
    description: 'Reserve a PC equipped with 1Gbps Fiber Internet, Office Suite, Adobe CC, and attached fast printing.',
    startingPrice: 1.50,
    unitText: 'per 30 mins',
    image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=600',
    popularBadge: 'High Speed Fiber',
    features: [
      'Dual Monitor Workstations available',
      'High resolution A3 Scanner attached',
      'Quiet air-conditioned booths',
      'Full privacy and instant USB access'
    ]
  },
  {
    id: 'cs-3',
    category: 'passport-studio',
    title: 'Instant Passport & Visa Photo Studio',
    description: 'Professional lighting studio setup. Get 8 physical prints + high-res digital copy sent to email or WhatsApp.',
    startingPrice: 4.99,
    unitText: 'per set (8 copies)',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
    features: [
      'Complies with official Passport/Visa specs',
      'White/Blue background formatting',
      'Softskin retouching included',
      'Digital soft-copy sent instantly'
    ]
  },
  {
    id: 'cs-4',
    category: 'digital-forms',
    title: 'Govt. Forms, e-Services & Bill Payments',
    description: 'Assisted online form submission, PAN/Tax filing help, utility bill payments, and flight/train tickets.',
    startingPrice: 2.50,
    unitText: 'per form service',
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=600',
    features: [
      'Assisted document scanning & upload',
      'Instant print receipt confirmation',
      'Utility bills payment desk',
      'E-ticket booking assistant'
    ]
  },
  {
    id: 'cs-5',
    category: 'tech-accessories',
    title: 'High Speed 64GB USB 3.2 Flash Drive',
    description: 'Metallic compact USB thumb drive for fast file transfers, school homework, and document backups.',
    startingPrice: 9.99,
    unitText: 'per unit',
    image: 'https://images.unsplash.com/photo-1618410320928-25228d811631?auto=format&fit=crop&q=80&w=600',
    features: [
      'Read speed up to 150MB/s',
      'Plug-and-play USB 3.2 compatibility',
      '1 Year Replacement Warranty'
    ]
  },
  {
    id: 'cs-6',
    category: 'tech-accessories',
    title: 'Fast Charge Type-C Cable & OTG Hub',
    description: 'Durable braided 65W Type-C fast charging cable with USB to Type-C OTG connector.',
    startingPrice: 6.99,
    unitText: 'per item',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    features: [
      'Supports 65W Fast Charge & Data Sync',
      'Reinforced strain-relief joints',
      'Universal Phone & Laptop compatibility'
    ]
  }
];

export const DEFAULT_PRINT_RATES = [
  {
    id: 'pr-1',
    varietyName: 'A4 Standard B&W (80 GSM)',
    paperSize: 'A4' as const,
    printType: 'bw' as const,
    pricePerPage: 0.10,
    duplexMultiplier: 0.85,
    bindingPrice: 0.00,
    laminationPricePerPage: 0.00,
    gsmQuality: '80 GSM Standard',
    description: 'High speed crisp black & white laser print on standard 80 GSM paper.'
  },
  {
    id: 'pr-2',
    varietyName: 'A4 Vivid Full Color (100 GSM Bond)',
    paperSize: 'A4' as const,
    printType: 'color' as const,
    pricePerPage: 0.40,
    duplexMultiplier: 0.85,
    bindingPrice: 0.00,
    laminationPricePerPage: 0.00,
    gsmQuality: '100 GSM Premium Bond',
    description: 'Vivid color laser printing for presentations, reports, and certificates.'
  },
  {
    id: 'pr-3',
    varietyName: 'A3 Poster & Diagram B&W (100 GSM)',
    paperSize: 'A3' as const,
    printType: 'bw' as const,
    pricePerPage: 0.25,
    duplexMultiplier: 0.90,
    bindingPrice: 0.00,
    laminationPricePerPage: 0.00,
    gsmQuality: '100 GSM Large Format',
    description: 'Large A3 size black & white prints for blueprints, maps, and posters.'
  },
  {
    id: 'pr-4',
    varietyName: 'A3 Full Color Heavy Glossy (170 GSM)',
    paperSize: 'A3' as const,
    printType: 'color' as const,
    pricePerPage: 0.85,
    duplexMultiplier: 0.90,
    bindingPrice: 0.00,
    laminationPricePerPage: 0.00,
    gsmQuality: '170 GSM Heavy Glossy',
    description: 'Heavy glossy finish for marketing posters, banners, and artwork.'
  },
  {
    id: 'pr-5',
    varietyName: 'Legal Paper B&W Document (80 GSM)',
    paperSize: 'Legal' as const,
    printType: 'bw' as const,
    pricePerPage: 0.15,
    duplexMultiplier: 0.85,
    bindingPrice: 0.00,
    laminationPricePerPage: 0.00,
    gsmQuality: '80 GSM Legal Format',
    description: 'Standard legal size document prints for affidavits and legal forms.'
  },
  {
    id: 'pr-6',
    varietyName: 'HD Studio Photo Print (4x6 Glossy 250 GSM)',
    paperSize: 'Glossy Photo (4x6)' as const,
    printType: 'hd-photo' as const,
    pricePerPage: 0.90,
    duplexMultiplier: 1.0,
    bindingPrice: 0.00,
    laminationPricePerPage: 0.00,
    gsmQuality: '250 GSM Ultra Glossy Photo',
    description: 'Lab-quality 4x6 photo print with smudge-proof glossy finish.'
  },
  {
    id: 'pr-7',
    varietyName: 'Spiral Book Binding (Plastic Comb)',
    paperSize: 'A4' as const,
    printType: 'bw' as const,
    pricePerPage: 0.00,
    duplexMultiplier: 1.0,
    bindingPrice: 2.00,
    laminationPricePerPage: 0.00,
    gsmQuality: 'Clear Cover + Comb',
    description: 'Durable plastic comb spiral binding with front transparent sheet.'
  },
  {
    id: 'pr-8',
    varietyName: 'Heavy Duty Document Lamination (125 Micron)',
    paperSize: 'A4' as const,
    printType: 'bw' as const,
    pricePerPage: 0.00,
    duplexMultiplier: 1.0,
    bindingPrice: 0.00,
    laminationPricePerPage: 0.75,
    gsmQuality: '125 Micron Thermal Pouch',
    description: 'Waterproof, tear-proof thick lamination pouch per page.'
  }
];

export const PROMO_OFFERS: PromoOffer[] = [
  {
    id: 'p-1',
    title: 'Combo Super Saver',
    code: 'PRINTGROCERY',
    description: 'Get 5 FREE B&W A4 Printouts with any grocery order over $20!',
    badge: 'Popular Deal',
    color: 'from-emerald-600 to-teal-700'
  },
  {
    id: 'p-2',
    title: 'Student Special',
    code: 'STUDENT15',
    description: '15% OFF all PC Workstation bookings & document binding with valid Student ID.',
    badge: '15% OFF',
    color: 'from-blue-600 to-indigo-700'
  },
  {
    id: 'p-3',
    title: 'Express Counter Pickup',
    code: 'EXPRESSPICKUP',
    description: 'Get $2.50 OFF your order on instant 10-minute counter pickup!',
    badge: 'Quick Pickup',
    color: 'from-amber-500 to-orange-600'
  }
];
