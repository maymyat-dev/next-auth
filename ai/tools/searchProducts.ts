import { db } from "@/server";
import { products, productVariants, variantImages } from "@/server/schema";

import { tool } from "ai";

import { z } from "zod";
import { ilike, eq, and, lte, or, desc, gte, notIlike } from "drizzle-orm";
import { SYNONYM_MAP } from "@/lib/constants";

type ProductSearchResult = {
  id: number;
  title: string;
  description: string;
  price: number;
  variantId: number | null;
  color: string | null;
  category: string | null;
  image_url: string | null;
  name: string | null;
  size: string | null;
  order: number | null;
};
export const createSearchProductsTool = (
  setProducts: (p: ProductSearchResult[]) => void,
) => {
  return tool({
    description: "Search products from TechStore database",

    inputSchema: z.object({
      query: z.string(),
      maxPrice: z.number().optional(),
      minPrice: z.number().optional(),
      category: z.string().optional(),
    }),

    execute: async ({ query, maxPrice, minPrice, category }) => {
      let searchQuery = query.toLowerCase().trim();

      Object.entries(SYNONYM_MAP).forEach(([key, value]) => {
        const regex = new RegExp(`\\b${key}\\b`, "g");
        searchQuery = searchQuery.replace(regex, value);
      });

      const words = searchQuery.split(/\s+/).filter((w) => w.length > 0);
      const modelNumber = words.find((word) => /^\d+$/.test(word));

      const priceStopWords = [
        "under",
        "below",
        "above",
        "than",
        "less",
        "more",
        "budget",
        "around",
        "price",
      ];

      const searchWords = words.filter((word) => {
        const cleanWord = word.replace(/[$]/g, "");
        const wordAsNumber = Number(cleanWord);

        const isPriceStopWord = priceStopWords.includes(cleanWord);
        const isPriceValue =
          (!isNaN(wordAsNumber) &&
            maxPrice !== undefined &&
            wordAsNumber === maxPrice) ||
          (minPrice !== undefined && wordAsNumber === minPrice);

        const isModelNumber = cleanWord === modelNumber;

        return !isPriceStopWord && !isPriceValue && !isModelNumber;
      });

      let conditions = [];

      if (category) {
        conditions.push(ilike(productVariants.productType, `%${category}%`));
      }
      console.log("Final Search Query:", searchQuery);
      console.log("Search Words:", searchWords);
      console.log("Conditions Length:", conditions.length);

      if (searchWords.length > 0) {
        searchWords.forEach((word) => {
          if (word !== category?.toLowerCase()) {
            conditions.push(
              or(
                ilike(products.title, `%${word}%`),
                ilike(products.description, `%${word}%`),
                ilike(productVariants.productType, `%${word}%`),
              ),
            );
          }
        });
      }
      if (modelNumber) {
        const isPro = searchQuery.includes("pro");
        const isMax = searchQuery.includes("max");
        const isPlus = searchQuery.includes("plus");

        if (!isPro && !isMax && !isPlus) {
          conditions.push(ilike(products.title, `iphone ${modelNumber}`));
        } else if (isPro && isMax) {
          conditions.push(
            ilike(products.title, `%iphone ${modelNumber} pro max%`),
          );
        } else if (isPro) {
          conditions.push(
            and(
              ilike(products.title, `%iphone ${modelNumber} pro%`),
              notIlike(products.title, `%pro max%`),
            ),
          );
        } else if (isPlus) {
          conditions.push(
            ilike(products.title, `%iphone ${modelNumber} plus%`),
          );
        }
      }
      if (maxPrice !== undefined) {
        conditions.push(lte(products.price, maxPrice));
      }

      if (minPrice !== undefined) {
        conditions.push(gte(products.price, minPrice));
      }

      const whereCondition =
        conditions.length > 0 ? and(...conditions) : undefined;

      const results = await db
        .select({
          id: products.id,
          title: products.title,
          description: products.description,
          price: products.price,
          variantId: productVariants.id,
          color: productVariants.color,
          category: productVariants.productType,
          image_url: variantImages.image_url,
          name: variantImages.name,
          size: variantImages.size,
          order: variantImages.order,
        })
        .from(products)
        .leftJoin(productVariants, eq(products.id, productVariants.productId))
        .leftJoin(
          variantImages,
          eq(productVariants.id, variantImages.variantId),
        )
        .where(whereCondition)
        .orderBy(desc(products.createdAt))
        .limit(20);

      const uniqueResults = [
        ...new Map(results.map((item) => [item.variantId, item])).values(),
      ];

      const aiResults = uniqueResults.map((p) => ({
        title: p.title,
        price: p.price,
        color: p.color,
        category: p.category,
        image: p.image_url,
        description: p.description
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim(),
      }));

      setProducts(uniqueResults);

      console.log("DB results found:", aiResults);

      return {
        success: aiResults.length > 0,
        count: aiResults.length,
        products: aiResults,
        message:
          aiResults.length === 0
            ? "No products found."
            : "Products retrieved successfully.",
      };
    },
  });
};
