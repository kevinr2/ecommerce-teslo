export interface Product {
  id: string;
  description: string;
  images: string[];
  inStock: number;
  price: number;
  sizes: Size[];
  slug: string;
  tags: string[];
  title: string;
  //TODO: type: ValidTypes;
  gender: Category;
}
export interface CartProduct{
  id:string
  slug:string
  title:string
  price:number
  quantity: number
  size: Size
  image: string,
}
export interface ProductImage  {
  id: number;
  url: string;
}


export type Category = "men" | "women" | "kid" | "unisex";
export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL";
export type ValidTypes = "shirts" | "pants" | "hoodies" | "hats";
