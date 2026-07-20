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
  const description = product.product?.description || product.description;
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
  className={`group rounded-2xl block border border-neutral-100 dark:border-neutral-800 hover:shadow-xl hover:shadow-primary/5 
    ${isChat ? "p-3" : "p-4"}`}
>
  <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100/50 dark:bg-black/30 mb-4 border border-black/5 dark:border-white/5">
    <Image
      src={imageUrl}
      alt={title}
      fill
      className="object-contain p-4 transition-transform duration-500 group-hover:scale-110 dark:mix-blend-lighten"
    />
    <div className="absolute inset-0 bg-linear-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
  </div>

  <div className="space-y-1 px-1">
    <p className="text-[10px] text-primary font-bold uppercase tracking-widest opacity-70">
      {type}
    </p>
    <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 truncate group-hover:text-primary transition-colors text-sm">
      {title}
    </h3>
    {description && (
      <div
        className="prose prose-neutral max-w-none line-clamp-2 text-sm leading-relaxed dark:prose-invert opacity-60 pointer-events-none"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    )}
    <div className="flex items-center justify-between pt-2">
      <p className="font-black text-neutral-900 dark:text-white">
        {formatCurrency(price)}
      </p>
      <div className="bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-all p-2">
        <ShoppingBasket size={16} />
      </div>
    </div>
  </div>
</Link>
  );
};
