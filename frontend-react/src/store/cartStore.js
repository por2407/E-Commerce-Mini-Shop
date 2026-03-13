import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set) => ({
      cartItems: [],

      // เพิ่มสินค้า (ถ้ามีอยู่แล้วให้เพิ่มจำนวน)
      addToCart: (item, quantity = 1) =>
        set((state) => {
          const getId = (obj) => obj?.id ?? obj?._id;
          const itemId = getId(item);
          const existingItem = state.cartItems.find(
            (cartItem) => getId(cartItem) === itemId,
          );

          if (existingItem) {
            return {
              cartItems: state.cartItems.map((cartItem) =>
                getId(cartItem) === itemId
                  ? {
                      ...cartItem,
                      quantity: (cartItem.quantity || 0) + quantity,
                    }
                  : cartItem,
              ),
            };
          }
          return {
            cartItems: [...state.cartItems, { ...item, quantity }],
          };
        }),

         // ลบสินค้า
        removeFromCart: (itemId) =>
          set((state) => ({
            cartItems: state.cartItems.filter(
              (cartItem) => cartItem._id !== itemId
            ),
          })),
    }),
    {
      name: "cart-storage",
    },
  ),
);

export default useCartStore;
