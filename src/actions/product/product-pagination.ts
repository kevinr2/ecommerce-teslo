"use server";

import prisma from "@/lib/prisma";
import { Gender } from "@prisma/client";

interface PaginationOptions {
  page?: number;
  take?: number;
  gender?: Gender
}

export const getPginatedProductWithImages = async ({
  page = 1,
  take = 12,
  gender
}: PaginationOptions) => {
  if (isNaN(Number(page))) page = 1;
  if (page < 1) page = 1;

  try {
    const products = await prisma.product.findMany({
      skip: (page - 1) * take,
      take: take,
      include: {
        ProductImage: {
          take: 2,
          select: {
            url: true,
          },
        },
      },
     //! Por género
  where: {
    gender: gender
  }
    });
    // 2. obtener el total de paginas
    const totalCount = await prisma.product.count({where:{gender:gender}});
    const totalPages = Math.ceil(totalCount / take);

    return {
      currentPage: page,
      totalPages: totalPages,
      products: products.map((product) => ({
        ...product,
        images: product.ProductImage.map((image) => image.url),
      })),
    };
  } catch (error) {
    throw new Error(`${error} no se pudo `);
  }
};
