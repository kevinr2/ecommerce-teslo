"use client";

import { useCartStore } from "@/store/ui/cart/cart-store";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export const OrderSummary = () => {
  const router = useRouter();

  const { cart, getSummaryInformation } = useCartStore();
  const [loaded, setLoaded] = useState(false);

  const { itemsInCart, subTotal, tax, total } = useMemo(
    () => getSummaryInformation(),
    [cart]
  );
  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) return <p>Loading...</p>;

  return (
    <>
      <div className="grid grid-cols-2">
        <span>No. Productos</span>
        <span className="text-right">
          {itemsInCart === 1 ? "1 artículo" : `${itemsInCart} artículos`}
        </span>

        <span>Subtotal</span>
        <span className="text-right">{subTotal}</span>

        <span>Impuestos (15%)</span>
        <span className="text-right">{tax}</span>

        <span className="mt-5 text-2xl">Total:</span>
        <span className="mt-5 text-2xl text-right">{total}</span>
      </div>
    </>
  );
};
