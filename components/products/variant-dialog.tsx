"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { VariantsWithImageTags } from "@/lib/infer-types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import { DialogHeader } from "../ui/dialog";
import z from "zod";
import { VariantSchema } from "@/types/variant-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TagsInput from "./tags-input";
import VariantImages from "./variant-images";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { createVariant, deleteVariant } from "@/server/actions/variants";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type VariantDialogProps = {
  children: React.ReactNode;
  editMode: boolean;
  productId?: number;
  variant?: VariantsWithImageTags;
};

const VariantDialog = ({
  children,
  editMode,
  productId,
  variant,
}: VariantDialogProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof VariantSchema>>({
    resolver: zodResolver(VariantSchema),
    defaultValues: {
      tags: ["iPhone", "MacBook", "iWatch"],
      variantImage: [],
      color: "#000",
      productId,
      id: undefined,
      colorName: "Black ",
      editMode,
    },
  });

  const { execute, status, result } = useAction(createVariant, {
    onSuccess: ({ data }) => {
      form.reset();
      setOpen(false);
      if (data?.error) {
        toast.error(data?.error);
        
      }
      if (data?.success) {
        toast.success(data?.success);
      }
    },
  });

  const variantDelete = useAction(deleteVariant, {
    
    onSuccess: ({ data }) => {
      form.reset();
      setOpen(false);
      
      if (data.error) {
        toast.error(data.error);
        
        return;
      }
     if (data.success) {
    toast.success(data.success as string);
}
      router.refresh();
    },
  });

  function onSubmit(values: z.infer<typeof VariantSchema>) {
    console.log(values);
    const { color, tags, variantImage, colorName, productId, id, editMode } =
      values;
    execute({
      color,
      tags,
      variantImage,
      colorName,
      productId,
      id,
      editMode,
    });
  }

  const getOldData = () => {
    if (!editMode) {
      form.reset();
    }
    if (editMode && variant) {
      form.setValue("editMode", true);
      form.setValue("id", variant.id);
      form.setValue("color", variant.color);
      form.setValue(
        "tags",
        variant.variantTags.map((t) => t.tag)
      );
      form.setValue(
        "variantImage",
        variant.variantImages.map((img) => {
          return {
            url: img.image_url,
            size: Number(img.size),
            name: img.name,
          };
        })
      );
      form.setValue("colorName", variant.colorName);
      form.setValue("productId", variant.productId);
    }
  };

  useEffect(() => {
    getOldData();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="overflow-y-auto max-h-screen sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editMode ? "Update Product's Variant" : "Create New Variant"}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>Manage your product's variants</DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="colorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Variant Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Color</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Tags</FormLabel>
                  <FormControl>
                    <TagsInput
                      {...field}
                      handleOnChange={(e) => field.onChange(e)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <VariantImages />
            <div className={cn(editMode ? "flex gap-2" : "")}>
              {editMode && (
                <Button
                  type="button"
                  variant="destructive"
                  className="flex-1 cursor-pointer"
                  disabled={variantDelete.status === "executing"}
                  onClick={(e) => {
                    e.preventDefault();
                    variantDelete.execute({ id: variant?.id! });
                  }}
                >
                  Delete Product's Variant
                </Button>
              )}
              <Button
                type="submit"
                className={cn(editMode ? "flex-1 cursor-pointer" : "w-full cursor-pointer")}
                disabled={status === "executing" || !form.formState.isValid}
              >
                {editMode ? "Update Product's Variant" : "Create New Variant"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default VariantDialog;
