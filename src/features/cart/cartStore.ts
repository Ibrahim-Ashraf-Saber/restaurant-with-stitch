import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotals: () => { subtotal: number; taxes: number; total: number; totalItems: number };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        });
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: quantity > 0 
            ? state.items.map((i) => (i.id === id ? { ...i, quantity } : i))
            : state.items.filter((i) => i.id !== id),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotals: () => {
        const { items } = get();
        const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const taxes = subtotal * 0.1; // 10% tax example
        const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
        return {
          subtotal,
          taxes,
          total: subtotal + taxes,
          totalItems,
        };
      },
    }),
    {
      name: 'culinary-pro-cart',
    }
  )
);
