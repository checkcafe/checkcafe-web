import { Link } from "@remix-run/react";
import Autoplay from "embla-carousel-autoplay";
import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";

interface SliderProps {
  imageSlides: { imageUrl: string; url?: string }[];
  autoplayDelay?: number;
  prevButtonText?: string;
  nextButtonText?: string;
  widthImage?: number;
  heightImage?: number;
}

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 400;

export const Sliders = ({
  imageSlides,
  autoplayDelay = 0,
  prevButtonText,
  nextButtonText,
  widthImage,
  heightImage,
}: SliderProps) => {
  const autoplayPlugin = React.useRef(
    autoplayDelay > 0
      ? Autoplay({ delay: autoplayDelay, stopOnInteraction: true })
      : null,
  );

  return (
    <div className="relative w-full overflow-hidden">
      <Carousel
        plugins={autoplayPlugin.current ? [autoplayPlugin.current] : []}
        className="h-full w-full"
        onMouseEnter={autoplayPlugin.current?.stop}
        onMouseLeave={autoplayPlugin.current?.reset}
      >
        <CarouselContent>
          {imageSlides.map((slide, index) => (
            <CarouselItem key={index} className="relative h-full w-full">
              {slide.url ? (
                <Link to={slide.url} className="block h-full w-full">
                  <img
                    src={slide.imageUrl}
                    alt={`Slide ${index + 1}`}
                    width={widthImage || DEFAULT_WIDTH}
                    height={heightImage || DEFAULT_HEIGHT}
                    className="h-[400px] w-full rounded-lg object-cover"
                    onError={e => {
                      e.currentTarget.src =
                        "https://placehold.co/600x400?text=No%20Image";
                      e.currentTarget.onerror = null;
                    }}
                  />
                </Link>
              ) : (
                <img
                  src={slide.imageUrl}
                  alt={`Slide ${index + 1}`}
                  width={DEFAULT_WIDTH}
                  height={DEFAULT_HEIGHT}
                  className="h-[400px] w-full rounded-lg object-cover"
                  onError={e => {
                    e.currentTarget.src =
                      "https://placehold.co/600x400?text=No%20Image";
                    e.currentTarget.onerror = null;
                  }}
                />
              )}
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="absolute left-16 top-1/2 -translate-y-1/2 transform">
          <CarouselPrevious className="rounded-full bg-gray-600 p-2 text-white hover:bg-gray-500">
            {prevButtonText}
          </CarouselPrevious>
        </div>

        <div className="absolute right-16 top-1/2 -translate-y-1/2 transform">
          <CarouselNext className="rounded-full bg-gray-600 p-2 text-white hover:bg-gray-500">
            {nextButtonText}
          </CarouselNext>
        </div>
      </Carousel>
    </div>
  );
};
