import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Card, CardContent } from "~/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { Button } from "~/components/ui/button";

type Props = {
  images: string[];
};

type CarouselApi = {
  selectedScrollSnap: () => number;
  on: (event: string, callback: () => void) => void;
};

export default function ImageCarousel(props: Props) {
  const { images } = props;
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api?.selectedScrollSnap() + 1);

    api?.on("select", () => {
      setCurrent(api?.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Card className="w-2/4 h-96">
      <CardContent className="p-0">
        <Carousel setApi={setApi} className="w-full h-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-[3/2] w-full rounded-lg">
                  <img
                    src={image}
                    alt="Place Image"
                    className="object-cover w-full h-full rounded-lg"
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
