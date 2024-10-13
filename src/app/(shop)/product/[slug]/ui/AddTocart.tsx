"use client";

import { useState } from "react";
import { QuantitySelector, SizeSelector } from "@/components";
import { Product, Size } from "@/interfaces";
import { useCartStore } from "@/store/ui/cart/cart-store";
import { CartProduct } from '../../../../../interfaces/product.interface';

interface Props {
  product: Product;
}

export const AddTocart = ({ product }: Props) => {
  const addProductToCart = useCartStore(state => state.addProductTocart)
  const [size, setSize] = useState<Size | undefined>();
  const [quantity, setQuantify] = useState<number>(1);
  const [posted, setPosted] = useState(false)
  const [stockMsg, setStockMsg] = useState(false)

  const addTocart = () => {
    setPosted(true)
    if (!size) return;
    const cartProduct:CartProduct = {
        id:product.id,
        slug:product.slug,
        title:product.title,
        price:product.price,
        quantity:quantity,
        size:size,
        image: product.images[0],
    }
    
    if(product.inStock < quantity){
      setStockMsg(true)
      return
    }
    addProductToCart(cartProduct)
    setPosted(false)
    setQuantify(1)
    setSize(undefined)
    setStockMsg(false)

  };
  return (
    <>
    {
        (posted && !size && (
            <span className="mt-2 text-red-500 fade-in">
            Debe de Seleccionar una talla*
          </span>
        ))
    }
    {
      stockMsg && (
      <span className="mt-2 text-red-500 fade-in">
         pedido mayor a stock en inventario
      </span>
      )

    }

      {/* Selector de Tallas */}
      <SizeSelector
        selectedSize={size}
        availableSizes={product.sizes}
        onSizeChanged={setSize}
      />

      {/* Selector de Cantidad */}
      <QuantitySelector quantity={quantity} onQuantityChanged={setQuantify} />

      {/* Button */}
      <button onClick={addTocart} className="btn-primary my-5">
        Agregar al carrito
      </button>
    </>
  );
};
