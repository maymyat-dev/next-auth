"use server";

import { actionClient } from "./safe-action";
import { db } from "@/server";
import { VariantSchema } from "@/types/variant-schema";
import { eq } from "drizzle-orm";
import {
  products,
  productVariants,
  variantImages,
  variantTags,
} from "../schema";
import { revalidatePath } from "next/cache";
import z from "zod";

export const createVariant = actionClient
  .schema(VariantSchema)
  .action(
    async ({
      parsedInput: {
        color,
        tags,
        id,
        variantImage: vImgs,
        editMode,
        colorName,
        productId,
      },
    }) => {
      try {
        if (editMode && id) {
          const editVariant = await db
            .update(productVariants)
            .set({
              color,
              colorName,
              updated: new Date(),
            })
            .where(eq(productVariants.id, id))
            .returning();

          await db
            .delete(variantTags)
            .where(eq(variantTags.variantId, editVariant[0].id));

          if (tags && tags.length > 0) {
            await db.insert(variantTags).values(
              tags.map((tag) => {
                return {
                  tag,
                  variantId: editVariant[0].id,
                };
              }),
            );
          }
          await db
            .delete(variantImages)
            .where(eq(variantImages.variantId, editVariant[0].id));

          if (vImgs && vImgs.length > 0) {
            await db.insert(variantImages).values(
              vImgs.map((img, index) => {
                return {
                  image_url: img.url,
                  name: img.name,
                  size: img.size.toString(),
                  order: index,
                  variantId: editVariant[0].id,
                };
              }),
            );
          }

          revalidatePath("/dashboard/products");
          return { success: "Variant updated successfully" };
        }
        if (!editMode) {
          const variant = await db
            .insert(productVariants)
            .values({
              color,
              colorName,
              productId,
            })
            .returning();

          if (tags && tags.length > 0) {
            await db.insert(variantTags).values(
              tags.map((tag) => {
                return {
                  tag,
                  variantId: variant[0].id,
                };
              }),
            );
          }

          const product = await db.query.products.findFirst({
            where: eq(products.id, productId),
          });

          if (vImgs && vImgs.length > 0) {
            await db.insert(variantImages).values(
              vImgs.map((img, index) => {
                return {
                  image_url: img.url,
                  name: img.name,
                  size: img.size.toString(),
                  order: index,
                  variantId: variant[0].id,
                };
              }),
            );
          }
          revalidatePath("/dashboard/products");
          return { success: "Variant created successfully" };
        }
      } catch (error) {
        console.log(error);
        return { error: "Something went wrong" };
      }
    },
  );

export const deleteVariant = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      await db.delete(productVariants).where(eq(productVariants.id, id));
      // revalidatePath("/dashboard/products");

      return { success: "Variant deleted successfully" };
    } catch (error) {
      console.log(error);
      return { error: "Something went wrong" };
    }
  });
