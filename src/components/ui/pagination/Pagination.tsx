"use client";

import Link from "next/link";
import React from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { redirect, usePathname, useSearchParams } from "next/navigation";
import { generatePaginationNumbers } from "@/utils/generatePaginationNumbers";
import clsx from "clsx";

interface Props {
  totalPages: number;
}

export const Pagination = ({ totalPages }: Props) => {
  const pathName = usePathname();
  const seachParams = useSearchParams();
  const pageString = seachParams.get("page") ?? 1

  const currenPages = isNaN(+pageString) ?1 : + pageString
  if(currenPages<1 || isNaN(+pageString)){
    redirect(pathName)
  }

  const allPages = generatePaginationNumbers(currenPages,totalPages)

  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams( seachParams)
    if(pageNumber === "..."){
        return `${pathName}?${params.toString()}`
    }
    if(+pageNumber <= 0){
        return `${pathName}`
    }
    if(+pageNumber > totalPages ){
        return `${pathName}?${params.toString()}`
    }
    params.set('page', pageNumber.toString())
    return `${pathName}?${params.toString()}`
  };

  return (
    <div className="flex text-center justify-center mt-10 mb-32">
      <nav aria-label="Page navigation example">
        <ul className="flex list-style-none">
          <li className="page-item">
            <Link
              className="page-link relative block py-1.5 px-3  border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
              href={createPageUrl(currenPages -1)}
              aria-disabled="true"
            >
              <IoChevronBackOutline size={30} />
            </Link>
          </li>
          {
            allPages.map((page)=>(

            <li key={page} className="page-item">
                <Link
                className={
                    clsx(
                        "page-link relative block py-1.5 px-3  border-0  outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none",
                        {
                            'bg-blue-600 shadow-sm text-white hover:text-white hover:bg-blue-700 ': page === currenPages
                        }
                    )
                }
                href={createPageUrl(page)}
                >
                {page}
                </Link>
            </li>
            ))
          }
          <li className="page-item">
            <Link
              className="page-link relative block py-1.5 px-3  border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
              href={createPageUrl(currenPages + 1)}
            >
              <IoChevronForwardOutline size={30} />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
