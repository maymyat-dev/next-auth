import { google } from "@ai-sdk/google";
import { generateText } from "ai";

import { techStoreSystemPrompt } from "@/ai/prompts/techstoreSystemPrompt";
import { createSearchProductsTool } from "@/ai/tools/searchProducts";
import {
  createCompareProductsTool,
  type ComparisonProduct,
} from "@/ai/tools/compareProducts";

export async function POST(req: Request) {
  try {
    const { messages = [] } = await req.json();

    let searchProducts: any[] = [];
    let comparisonProducts: ComparisonProduct[] = [];

    const searchTool = createSearchProductsTool((products) => {
      searchProducts = products;
    });

    const compareTool = createCompareProductsTool((products) => {
      comparisonProducts = products;
    });

    const result = await generateText({
      model: google("gemini-3.5-flash-lite"),
      messages,
      system: techStoreSystemPrompt,
      temperature: 0.7,
      tools: {
        searchProducts: searchTool,
        compareProducts: compareTool,
      },
    });

    const isComparison = comparisonProducts.length >= 2;

    return Response.json({
      text: result.text,
      products: isComparison ? [] : searchProducts,
      comparison: isComparison ? comparisonProducts : null,
    });
  } catch (error) {
    console.error("AI Chat Error:", error);

    return Response.json({ error: "AI Server Error" }, { status: 500 });
  }
}
