import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";

export function ImageCarousel(props: { images: string[] }) {
  const { images } = props;
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api?.selectedScrollSnap() + 1);

    api?.on("select", () => {
      setCurrent(api?.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Card className="h-96 w-2/4">
      <CardContent className="p-0">
        <Carousel setApi={setApi} className="h-full w-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-[3/2] w-full rounded-lg">
                  <img
                    src={image}
                    alt="Place Image"
                    className="h-full w-full rounded-lg object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute inset-0 flex items-center justify-between">
            <CarouselPrevious>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full bg-white/70 hover:bg-white/90"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous slide</span>
              </Button>
            </CarouselPrevious>
            <CarouselNext>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full bg-white/70 hover:bg-white/90"
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next slide</span>
              </Button>
            </CarouselNext>
          </div>
        </Carousel>
        <div className="text-center text-sm text-muted-foreground">
          Image {current} of {images.length}
        </div>
      </CardContent>
    </Card>
  );
}
