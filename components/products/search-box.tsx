"use client";

import { VariantsWithProduct } from "@/lib/infer-types";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type SearchBoxProps = {
  productWithVariants: VariantsWithProduct[];
};

const SearchBox = ({ productWithVariants }: SearchBoxProps) => {
  const [searchKey, setSearchKey] = useState("");
  const [searchResults, setSearchResults] = useState<VariantsWithProduct[]>([]);

  useEffect(() => {
    if (!searchKey.trim()) {
      setSearchResults([]);
      return;
    }

    const q = searchKey.toLowerCase();

    const filtered = productWithVariants.filter((item) =>
      item.product.title.toLowerCase().includes(q)
    );

    setSearchResults(filtered);
  }, [searchKey, productWithVariants]);

  return ( 
    <div className="md:w-1/3 relative">

      <div className="relative w-full">
        <Input
          type="text"
          placeholder="Search products…"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          className="pr-10 rounded-full"
          name="search"
          aria-label="Search products"
        />
        <Search className="absolute right-3 top-2 h-4 w-4 text-muted-foreground" />
      </div>


      {searchKey && searchResults.length === 0 && (
        <div className="absolute top-14 w-full max-w-lg rounded-xl bg-white dark:bg-card z-20 shadow-md p-6 text-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
            No products found
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Try searching a different keyword
          </p>
        </div>
      )}


      {searchResults.length > 0 && (
        <div className="absolute top-14 w-full max-w-lg rounded-xl bg-white dark:bg-card shadow-xl z-20 max-h-80 overflow-y-auto">
          <p className="px-4 py-2 text-xs text-gray-500">
            {searchResults.length} items found
          </p>

          <ul className="divide-y divide-gray-100 dark:divide-gray-600">
            {searchResults.map((item) => (
              <li key={item.id}>
                <Link
                   href={{
              pathname: `/products/${item.id}`,
              query: {
                vid: item.id,
                productId: item.productId,
                type: item.productType,
                image: item.variantImages[0].image_url,
                title: item.product.title,
                price: item.product.price,
              },
            }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                >
                  <Image
                    src={item.variantImages[0].image_url!}
                    alt={item.product.title}
                    width={45}
                    height={45}
                    className="rounded-md border object-cover"
                  />

                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {item.product.title}
                    </span>
                    <span className="text-xs text-gray-500">
                      ${item.product.price}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBox;
