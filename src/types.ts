export type GroceryCategory =
  | 'all'
  | 'fruits-veg'
  | 'dairy-bakery'
  | 'beverages-snacks'
  | 'staples'
  | 'personal-household';

export interface GroceryProduct {
  id: string;
  name: string;
  category: GroceryCategory;
  price: number;
  originalPrice?: number;
  unit: string;
  stock: number;
  rating: number;
  image: string;
  isOrganic?: boolean;
  badge?: string;
  description: string;
}

export type CyberServiceCategory =
  | 'all'
  | 'document-printing'
  | 'workstation-booking'
  | 'passport-studio'
  | 'digital-forms'
  | 'tech-accessories';

export interface CyberService {
  id: string;
  category: CyberServiceCategory;
  title: string;
  description: string;
  startingPrice: number;
  unitText: string;
  image: string;
  popularBadge?: string;
  features: string[];
}

export interface PrintJobConfig {
  paperSize: 'A4' | 'A3' | 'Legal' | 'Glossy Photo (4x6)';
  printType: 'bw' | 'color' | 'hd-photo';
  sides: 'single' | 'double';
  pages: number;
  copies: number;
  binding: 'none' | 'staple' | 'spiral' | 'hardcover';
  lamination: boolean;
  notes?: string;
  uploadedFileName?: string;
  estimatedCost: number;
}

export interface WorkstationBookingConfig {
  stationType: 'standard-pc' | 'heavy-work-gaming' | 'scanner-doc-station';
  date: string;
  timeSlot: string;
  durationMinutes: number;
  addOns: string[];
  estimatedCost: number;
}

export interface CartItem {
  cartItemId: string;
  itemType: 'grocery' | 'print-job' | 'pc-booking' | 'cyber-service' | 'tech-hardware';
  id: string;
  name: string;
  price: number;
  quantity: number;
  unitOrSummary: string;
  image?: string;
  printConfig?: PrintJobConfig;
  bookingConfig?: WorkstationBookingConfig;
}

export interface PrintVarietyRate {
  id: string;
  varietyName: string; // e.g. "A4 Black & White", "A4 Vivid Color", "A3 Black & White", "A3 Vivid Color", "Legal Paper B&W", "Glossy Photo 4x6", "Double-Sided (Duplex) Discount", "Spiral Binding", "Hardcover Binding", "Micron Lamination"
  paperSize: 'A4' | 'A3' | 'Legal' | 'Glossy Photo (4x6)';
  printType: 'bw' | 'color' | 'hd-photo';
  pricePerPage: number;
  duplexMultiplier: number; // e.g. 0.85
  bindingPrice: number; // e.g. 2.00
  laminationPricePerPage: number; // e.g. 0.75
  gsmQuality: string; // e.g. "80 GSM Standard", "100 GSM Bond", "200 GSM Glossy"
  description: string;
}

export type FulfillmentType = 'store-pickup';

export interface Order {
  id: string;
  tokenNumber: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  fulfillmentType: FulfillmentType;
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
  notes?: string;
  paymentMethod: 'cash-on-pickup' | 'upi-qr' | 'card';
  status: 'received' | 'printing-packing' | 'ready-for-pickup' | 'completed';
}

export interface PromoOffer {
  id: string;
  title: string;
  code: string;
  description: string;
  badge: string;
  color: string;
}
