import Link from "next/link";
import Image from "next/image";
import { ShoppingBasket } from "lucide-react";
import formatCurrency from "@/lib/formatCurrency";

interface ProductCardProps {
  product: any;
  isChat?: boolean;
}

export const ProductCard = ({ product, isChat = false }: ProductCardProps) => {
  const id = product.variantId || product.id;
  const productId = product.productId || product.id;
  const title = product.product?.title || product.title;
  const price = product.product?.price || product.price;
  const type = product.productType || product.type;
  const rawDescription = product.product?.description || product.description;


  const cleanDescription = rawDescription
    ? rawDescription.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
    : "";

  const imageUrl =
    product.variantImages?.[0]?.image_url ||
    product.image_url ||
    "/images/placeholder-product.png";

  return (
    <Link
      href={{
        pathname: `/products/${id}`,
        query: {
          vid: id,
          productId: productId,
          type: type,
          image: imageUrl,
          title: title,
          price: price,
        },
      }}
      className={`group relative flex flex-col justify-between rounded-2xl bg-card border border-border/60 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all ${
        isChat ? "p-2.5" : "p-3 sm:p-4"
      }`}
    >
      <div>
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900/80 mb-3 border border-black/5 dark:border-white/5 flex items-center justify-center p-3">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-contain p-2 transition-transform group-hover:scale-105"
          />
        </div>

        <div className="space-y-1">
          {type && (
            <p className="text-[10px] text-primary font-bold uppercase tracking-wider">
              {type}
            </p>
          )}

          <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors text-xs sm:text-sm">
            {title}
          </h3>

          {cleanDescription && (
            <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-1 leading-normal opacity-80">
              {cleanDescription}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 mt-2 border-t border-border/40">
        <p className="font-bold text-xs sm:text-sm text-foreground">
          {formatCurrency(price)}
        </p>

        <div className="bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-all p-1.5 sm:p-2 shrink-0">
          <ShoppingBasket className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
      </div>
    </Link>
  );
};