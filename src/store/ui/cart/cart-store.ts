import { create } from "zustand";
import type { CartProduct } from "../../../interfaces/product.interface";
import { persist } from "zustand/middleware";

interface State {
  cart: CartProduct[];
  getTotalItems: () => number;
  getSummaryInformation: () => {
    subsTotal: number;
    tax: number;
    total: number;
    itemCart: number;
  };

  addProductTocart: (product: CartProduct) => void;
  updateProductQuantify: (product: CartProduct, quantify: number) => void;
  removeProduct: (product: CartProduct) => void;
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],

      getTotalItems: () => {
        const { cart } = get();
        cart.filter((item) => item.price > 100);

        return cart.reduce((total, item) => total + item.quantity, 0);
      },

      addProductTocart: (product: CartProduct) => {
        const { cart } = get();

        const productInCart = cart.some(
          (item) => item.id === product.id && item.size === product.size
        );
        if (!productInCart) {
          set({ cart: [...cart, product] });
          return;
        }
        const updatedCartProduct = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity: item.quantity + product.quantity };
          }
          return item;
        });

        set({ cart: updatedCartProduct });
      },
      updateProductQuantify(product: CartProduct, quantify: number) {
        const { cart } = get();
        const updateCarProduct = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity: quantify };
          }
          return item;
        });
        set({ cart: updateCarProduct });
      },
      getSummaryInformation : ()=> {
        const { cart } = get();
        const subsTotal = cart.reduce(
          (subtotal, product) => product.quantity * product.price + subtotal,
          0
        );

        const tax = subsTotal * 0.15;
        const total = subsTotal + tax;
        const itemCart = cart.reduce((total, item) => total + item.quantity, 0);

        return {
          subsTotal,
          tax,
          total,
          itemCart,
        };
      },
      removeProduct(product: CartProduct) {
        const { cart } = get();
        const updateCartProduct = cart.filter(
          (item) => item.id !== product.id || item.size !== product.size
        );

        set({ cart: updateCartProduct });
      },
    }),
    {
      name: "shopping-cart",
    }
  )
);
