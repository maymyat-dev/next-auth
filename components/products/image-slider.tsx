"use client";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { VariantsWithImageTags } from "@/lib/infer-types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "../ui/card";

type ImageSliderProps = {
  variants: VariantsWithImageTags[];
};



const ImageSlider = ({ variants }: ImageSliderProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState<number[]>([0]);

  const searchParams = useSearchParams();
  const currentVariantType = searchParams.get("type");

  const updateSlider = (index: number) => {
    api?.scrollTo(index);
  };

  

  useEffect(() => {
    if (!api) return;

    api.on("slidesInView", (e) => {
      setActiveIndex(e.slidesInView());
    });
  }, [api]);

  return (
    <Carousel setApi={setApi} opts={{ loop: true }}>

        <CarouselContent className="">
        {variants.map(
          (v) =>
            v.colorName === currentVariantType &&
            v.variantImages.map((img, index) => (
              <CarouselItem
                key={index}
                className="flex items-center justify-center bg-white dark:bg-card rounded-sm shadow-lg transition-shadow duration-200"
              >
                {img.image_url && (
                  <Image
                    src={img.image_url}
                    alt={img.name}
                    width={400}
                    height={400}
                    priority
                    className="w-[260px] h-[260px] md:w-[500px] md:h-[500px] object-contain rounded-xl"
                  />
                )}
              </CarouselItem>
            ))
        )}
      </CarouselContent>

      <div className="flex gap-3 mt-6 justify-center">
        {variants.map(
          (v) =>
            v.colorName === currentVariantType &&
            v.variantImages.map((img, index) => (
              <button
                key={index}
                onClick={() => updateSlider(index)}
                className={cn(
                  "rounded-lg overflow-hidden cursor-pointer transition-all duration-200 border",
                  index === activeIndex[0]
                    ? "ring-2 ring-primary scale-105"
                    : "opacity-60 hover:opacity-100"
                )}
              >
                {img.image_url && (
                  <Image
                    src={img.image_url}
                    alt={img.name}
                    width={60}
                    height={60}
                    priority
                    className="w-[55px] h-[55px] object-contain"
                  />
                )}
              </button>
            ))
        )}
      </div>
    </Carousel>
  );
};

export default ImageSlider;
