
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'pizzas' | 'lomitos' | 'hamburguesas' | 'minutas';
  images: string[];
  available: boolean;
}

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface DeliveryDetails {
  type: 'delivery' | 'pickup';
  address?: string;
  notes: string;
  paymentMethod: 'card' | 'cash';
  cashAmount?: number;
}

export type CategoryType = 'pizzas' | 'lomitos' | 'hamburguesas' | 'minutas';
