"use client";

import { getStockByslug } from "@/actions/product/get-stock-by-slug";
import { titleFont } from "@/config/fonts";
import { useEffect, useState } from "react";

interface Props {
  slug: string;
}

export const StrockLabel = ({ slug }: Props) => {
  const [stock, setStock] = useState(0);
  const [isloading, setIsloading] = useState(true);

  useEffect(() => {
    const getStock = async () => {
      const inStock = await getStockByslug(slug);
      setStock(inStock);
      setIsloading(false)
    };
    getStock();
  }, [slug]);


  return (
    <>
    {
        isloading
            ?(
                <h1 className={` ${titleFont.className} antialiased font-bold text-lg bg-gray-200 animate-pulse`}>
                &nbsp;
              </h1>
            )
            :(
                <h1 className={` ${titleFont.className} antialiased font-bold text-lg`}>
                Stock: {stock}
              </h1>
            )
    }


    </>
  );
};
