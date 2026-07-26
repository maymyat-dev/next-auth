import { db } from "@/server";
import { products, productVariants, variantImages } from "@/server/schema";
import { tool } from "ai";
import { z } from "zod";
import { ilike, eq } from "drizzle-orm";

export type ComparisonProduct = {
  id: number;
  title: string;
  name: string;
  price: number;
  category: string | null;
  color: string | null;
  image_url: string | null;
  image: string | null;
  description: string;
  display?: string | null;
  chip?: string | null;
  camera?: string | null;
  battery?: string | null;
  storage?: string | null;
};

function parseSpecs(desc: string) {
  const specs: Record<string, string> = {};

  desc.split("\n").forEach((line) => {
    const idx = line.indexOf(":");
    if (idx === -1) return;

    const key = line.slice(0, idx).trim().toLowerCase();
    const value = line.slice(idx + 1).trim();

    specs[key] = value;
  });

  return specs;
}

export const createCompareProductsTool = (
  setComparison: (products: ComparisonProduct[]) => void,
) => {
  return tool({
    description:
      "Compare two or more products from the TechStore database. Use this tool whenever the user asks to compare products, asks for differences, or asks which product is better.",

    inputSchema: z.object({
      productNames: z
        .array(z.string())
        .min(2, "Need at least two products to compare.")
        .describe(
          "List of product names to compare. Example: ['iphone 15', 'iphone 15 pro']",
        ),
    }),

    execute: async ({ productNames }) => {
      const results = await Promise.all(
        productNames.map(async (productName) => {
          const keyword = productName.trim().toLowerCase();

          const items = await db
            .select({
              id: products.id,
              title: products.title,
              description: products.description,
              price: products.price,
              color: productVariants.color,
              category: productVariants.colorName,
              image_url: variantImages.image_url,
            })
            .from(products)
            .leftJoin(
              productVariants,
              eq(products.id, productVariants.productId),
            )
            .leftJoin(
              variantImages,
              eq(productVariants.id, variantImages.variantId),
            )
            .where(ilike(products.title, `%${keyword}%`))
            .limit(10);

          if (items.length === 0) return null;

          const exactMatch = items.find(
            (item) => item.title.toLowerCase() === keyword,
          );

          return exactMatch ?? items[0];
        }),
      );

      const comparisonProducts: ComparisonProduct[] = results
        .filter((item): item is NonNullable<typeof item> => item !== null)
        .map((item) => {
          const rawDescription = item.description || "";

          const cleanDescription = rawDescription
            .replace(/<\/li>/gi, "\n")
            .replace(/<\/p>/gi, "\n")
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<[^>]*>/g, "")
            .replace(/\n+/g, "\n")
            .trim();
          const specs = parseSpecs(cleanDescription);

          return {
            id: item.id,
            title: item.title,
            name: item.title,
            price: item.price,
            category: item.category,
            color: item.color,
            image_url: item.image_url,
            image: item.image_url,
            description: cleanDescription,
            display: specs.display ?? null,
            chip: specs.chip ?? null,
            camera: specs.camera ?? null,
            battery: specs.battery ?? null,
            storage: specs.storage ?? null,
          };
        });

      setComparison(comparisonProducts);

      return {
        success: comparisonProducts.length >= 2,
        count: comparisonProducts.length,
        products: comparisonProducts,
        message:
          comparisonProducts.length >= 2
            ? "Products found for comparison."
            : "Could not find enough products to compare.",
      };
    },
  });
};
