export const revalidate = 604800 //7 dias

import { notFound } from 'next/navigation';

import { titleFont } from '@/config/fonts';
import { ProductMobileSlideshow, ProductSlideshow } from '@/components';
import { getProductBySlug } from '@/actions/product/get-product-by-slug';
import { StrockLabel } from '@/components/product/stock-label/StrockLabel';
import { Metadata } from 'next';
import { AddTocart } from './ui/AddTocart';


interface Props {
  params: {
    slug: string;
  };
}
export async function generateMetadata(
  { params }: Props,
  
): Promise<Metadata> {
  // read route params
  const slug = params.slug
 
  // fetch data
  const product = await getProductBySlug(slug)
 
  // optionally access and extend (rather than replace) parent metadata
 /*  const previousImages = (await parent).openGraph?.images || [] */
 
  return {
    title: product?.title ?? "producto no encontrado",
    description: product?.description ?? "",
    openGraph: {
      title: product?.title ?? "producto no encontrado",
      description: product?.description ?? "",
      images: [`/product/${product?.images[1]}`],
    },
  }
}
 



export default async function SlugProducPage( { params }: Props ) {

  const { slug } = params;
  const product = await  getProductBySlug(slug)

  if ( !product ) {
    notFound();
  }



  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">

      {/* Slideshow */ }
      <div className="col-span-1 md:col-span-2 ">
        
        {/* Mobile Slideshow */}
        <ProductMobileSlideshow 
          title={ product.title }
          images={ product.images }
          className="block md:hidden"
        />
        
        {/* Desktop Slideshow */}
        <ProductSlideshow 
          title={ product.title }
          images={ product.images }
          className="hidden md:block"
        />

        
      </div>

      {/* Detalles */ }
      <div className="col-span-1 px-5">
        <StrockLabel slug={product.slug} />
        <h1 className={ ` ${ titleFont.className } antialiased font-bold text-xl` }>
          { product.title }
        </h1>
        <p className="text-lg mb-5">${ product.price }</p>


        <AddTocart product={product} />

        {/* Descripción */ }
        <h3 className="font-bold text-sm">Descripción</h3>
        <p className="font-light">
          { product.description }
        </p>

      </div>

    </div>
  );
}