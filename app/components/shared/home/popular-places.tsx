import { Link } from "@remix-run/react";
import { FaClock, FaDollarSign } from "react-icons/fa6";

import { Card, CardContent } from "~/components/ui/card";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import type { PlaceItem } from "~/types/model";
import { formatPriceRange, formatTime } from "~/utils/formatter";

type Props = {
  places: PlaceItem[];
};

export default function PopularPlaces({ places }: Props) {
  return (
    <div className="mt-12 px-4 md:px-[139px]">
      <div className="mb-5 flex flex-row items-center justify-between">
        <p className="text-xl font-medium text-[#372816]">Popular Places</p>
      </div>
      <ScrollArea className="w-full overflow-hidden pb-1">
        <div className="mb-4 flex space-x-4 overflow-x-auto overflow-y-hidden md:space-x-6">
          {places.map(
            ({
              id,
              slug,
              thumbnailUrl,
              name,
              address: { city },
              currency,
              priceRangeMin,
              priceRangeMax,
              openingTime,
              closingTime,
            }) => (
              <Link to={`places/${slug}`} key={id}>
                <Card className="h-80 w-56 shadow-lg hover:cursor-pointer hover:opacity-50">
                  <CardContent className="flex flex-col px-5 py-5">
                    <img
                      src={
                        thumbnailUrl ||
                        "https://placehold.co/150?text=No%20Image"
                      }
                      alt="cafe-image"
                      className="h-40 w-full rounded-md rounded-b-none object-cover"
                    />
                    <div className="mt-2 flex flex-col justify-between gap-4">
                      <div className="flex flex-col">
                        <p className="max-w-full truncate text-base font-medium text-[#372816]">
                          {name}
                        </p>
                        <p className="text-sm font-normal text-[#9BA0A7]">
                          {city}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        {currency && (priceRangeMin || priceRangeMax) && (
                          <div className="flex items-center gap-2">
                            <FaDollarSign
                              size={16}
                              className="text-[#372816]"
                            />
                            <p className="text-xs font-normal text-[#372816]">
                              {`${currency} ${formatPriceRange(priceRangeMin, priceRangeMax)}`}
                            </p>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <FaClock size={16} className="text-[#372816]" />
                          <p className="text-xs font-normal text-[#372816]">
                            {`${formatTime(openingTime)} - ${formatTime(closingTime)}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ),
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
