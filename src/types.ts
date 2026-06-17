export interface MenuItem {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  category: string;
  image: string; // Emoji character or placeholder identifier
  isPopular?: boolean;
  isSpicy?: boolean;
  isVegetarian?: boolean;
  calories?: number;
}

export interface CartItem {
  id: string; // unique cart line ID (allows same item with different customization/notes)
  menuItem: MenuItem;
  quantity: number;
  notes: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dineIn: boolean;
  isDelivery?: boolean;
  tableNumber?: string;
  customerName?: string;
  deliveryAddress?: string;
  deliveryPhone?: string;
  items: {
    id: string;
    nameAr: string;
    nameEn: string;
    price: number;
    quantity: number;
    notes?: string;
  }[];
  subtotal: number;
  discount: number;
  vat: number; // e.g., 15% VAT
  serviceCharge?: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'apple_pay';
  status: 'paid' | 'pending';
  preparationStatus?: 'pending' | 'preparing' | 'ready' | 'completed';
}

export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  iconName: string; // Corresponding Lucide icon name
}
