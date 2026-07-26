"use client";

import React from "react";
import type { ComparisonProduct } from "@/ai/tools/compareProducts";
import { ChartColumnBig } from "lucide-react";

interface ProductComparisonProps {
  products: ComparisonProduct[];
}
const featureKeys = [
  {
    label: "Price",

    getValue: (p: ComparisonProduct) => (p.price != null ? `$${p.price}` : "-"),
  },
  {
    label: "Display",
    getValue: (p: ComparisonProduct) => p.display ?? "-",
  },
  {
    label: "Chip",
    getValue: (p: ComparisonProduct) => p.chip ?? "-",
  },
  {
    label: "Camera",
    getValue: (p: ComparisonProduct) => p.camera ?? "-",
  },
  {
    label: "Battery",
    getValue: (p: ComparisonProduct) => p.battery ?? "-",
  },
  {
    label: "Storage",
    getValue: (p: ComparisonProduct) => p.storage ?? "-",
  },
  {
    label: "Color",
    getValue: (p: ComparisonProduct) => p.color ?? "-",
  },
  {
    label: "Category",
    getValue: (p: ComparisonProduct) => p.category ?? "-",
  },
];

const headerColors = [
  "text-primary",
  "text-purple-500",
  "text-amber-500",
  "text-green-500",
  "text-pink-500",
];

export const ProductComparison = ({ products }: ProductComparisonProps) => {
  if (!products || products.length < 2) return null;

  const validFeatures = featureKeys.filter((feature) =>
    products.some((p) => feature.getValue(p) !== "-"),
  );

  return (
    <div className="mt-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 backdrop-blur-md overflow-hidden shadow-sm">
      <div className="px-4 py-3 bg-neutral-100/80 dark:bg-neutral-900 font-semibold text-sm flex items-center gap-2 border-b border-neutral-200/60 dark:border-neutral-800">
        <span>
          <ChartColumnBig />
        </span>{" "}
        Specs Comparison ({products.length} Products)
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <table
          className="w-full text-sm border-collapse min-w-[320px]"
          aria-label="Product comparison"
        >
          <thead>
            <tr className="border-b border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/20">
              <th className="p-3 text-left font-medium text-neutral-500 dark:text-neutral-400 min-w-25">
                Feature
              </th>

              {products.map((product, idx) => (
                <th
                  key={product.id || idx}
                  className={`p-3 text-left font-semibold max-w-40 truncate ${headerColors[idx] ?? "text-neutral-700"}`}
                  title={product.title}
                >
                  {product.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {validFeatures.map((feature) => (
              <tr
                key={feature.label}
                className="border-b border-neutral-200/40 dark:border-neutral-800/40 last:border-none hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30 transition-colors"
              >
                <td className="p-3 font-medium text-neutral-700 dark:text-neutral-300">
                  {feature.label}
                </td>

                {products.map((product, idx) => (
                  <td
                    key={product.id || idx}
                    className="p-3 text-neutral-600 dark:text-neutral-300"
                  >
                    {feature.getValue(product)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
