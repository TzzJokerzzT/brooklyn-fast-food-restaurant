import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// ── UI Store ─────────────────────────────────────────────────
interface UIState {
  isMenuOpen: boolean;
  isDarkMode: boolean;
  toggleMenu: () => void;
  toggleDarkMode: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        isMenuOpen: false,
        isDarkMode: true,
        toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
        toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      }),
      { name: "ui-storage" }
    )
  )
);

// ── Cart Store (example) ─────────────────────────────────────
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        addItem: (item) =>
          set((state) => {
            const existing = state.items.find((i) => i.id === item.id);
            if (existing) {
              return {
                items: state.items.map((i) =>
                  i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                ),
              };
            }
            return { items: [...state.items, { ...item, quantity: 1 }] };
          }),
        removeItem: (id) =>
          set((state) => ({
            items: state.items.filter((i) => i.id !== id),
          })),
        updateQuantity: (id, quantity) =>
          set((state) => ({
            items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
          })),
        clearCart: () => set({ items: [] }),
        total: () =>
          get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      }),
      { name: "cart-storage" }
    )
  )
);
