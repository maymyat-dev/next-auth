import * as z from "zod";

export const VariantSchema = z.object({
  productId: z.number(),
  id: z.number().optional(),
  editMode: z.boolean(),
  color: z.string().min(3, {
    message: "Color must be at least 3 characters long",
  }),
  tags: z.array(
    z.string().min(3, {
      message: "At least one tag is required",
    }),
  ),
  colorName: z.string().min(3, {
    message: "Product type must be at least 3 characters long",
  }),
  variantImage: z
    .array(
      z.object({
        url: z.string().url({ message: "Please enter a valid image url" }),
        size: z.number(),
        key: z.string().optional(),
        id: z.number().optional(),
        name: z.string(),
        loading: z.boolean().optional(),
      }),
    )
    .min(1, {
      message: "At least one image is required",
    }),
});
