
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { CartItem, MenuItem, DeliveryDetails } from '@/types';

interface CartStore {
  items: CartItem[];
  deliveryDetails: DeliveryDetails | null;
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setDeliveryDetails: (details: DeliveryDetails) => void;
  subtotal: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      deliveryDetails: null,
      addItem: (menuItem: MenuItem) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.menuItemId === menuItem.id);
        
        if (existingItem) {
          // Update quantity if item already exists
          return set({
            items: currentItems.map(item => 
              item.menuItemId === menuItem.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          });
        }
        
        // Add new item
        const newItem: CartItem = {
          id: uuidv4(),
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
          image: menuItem.images && menuItem.images.length > 0 ? menuItem.images[0] : undefined
        };
        
        set({ items: [...currentItems, newItem] });
        toast.success(`${menuItem.name} agregado al carrito`);
      },
      removeItem: (id: string) => {
        const currentItems = get().items;
        const itemToRemove = currentItems.find(item => item.id === id);
        
        if (itemToRemove) {
          set({ 
            items: currentItems.filter(item => item.id !== id) 
          });
          toast.info(`${itemToRemove.name} eliminado del carrito`);
        }
      },
      updateQuantity: (id: string, quantity: number) => {
        const currentItems = get().items;
        
        if (quantity < 1) {
          return;
        }
        
        set({
          items: currentItems.map(item => 
            item.id === id ? { ...item, quantity } : item
          )
        });
      },
      clearCart: () => {
        set({ items: [], deliveryDetails: null });
      },
      setDeliveryDetails: (details: DeliveryDetails) => {
        set({ deliveryDetails: details });
      },
      subtotal: () => {
        return get().items.reduce((total, item) => {
          return total + (item.price * item.quantity);
        }, 0);
      }
    }),
    {
      name: 'rio-segundo-cart',
    }
  )
);
