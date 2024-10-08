"use client"

import { useCartStore } from "@/store/ui/cart/cart-store";
import { currentFormat } from "@/utils/currrencyFormat";
import { useEffect, useState } from "react";

export const OrderSummary = () => {

    const [loaded, setLoaded] = useState(false)
    const {itemCart,subsTotal,tax,total} = useCartStore(state=> state.getSummaryInformation() )

    useEffect(() => {
        setLoaded(true)
    }, [])
    if(!loaded)return <p>Loading...</p>

  return (
    <>
      <div className="grid grid-cols-2">
        <span>No. Productos</span>
        <span className="text-right">{itemCart === 1 ?"1 articulo":`${itemCart} articulos`}</span>

        <span>Subtotal</span>
        <span className="text-right">{currentFormat(subsTotal) }</span>

        <span>Impuestos (15%)</span>
        <span className="text-right">{currentFormat(tax)}</span>

        <span className="mt-5 text-2xl">Total:</span>
        <span className="mt-5 text-2xl text-right">{currentFormat(total) }</span>
      </div>
    </>
  );
};
