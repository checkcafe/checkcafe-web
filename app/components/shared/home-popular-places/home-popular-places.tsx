import { Link } from "@remix-run/react";

import { PlaceCard } from "~/components/shared/home-popular-places/place-card";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { PlaceItem } from "~/types";
import { formatPrice } from "~/utils/formatter";

export const HomePopularPlaces = ({ places }: { places: PlaceItem[] }) => {
  return (
    <div className="mt-12 px-4 md:px-[139px]">
      <div className="mb-5 flex flex-row items-center justify-between">
        <p className="text-xl font-medium text-[#372816]">Popular Places</p>
      </div>
      <ScrollArea className="w-full overflow-hidden">
        <div className="flex space-x-4 overflow-x-auto md:space-x-6">
          {places?.length > 0 ? (
            places.map(
              ({
                id,
                slug,
                thumbnail,
                name,
                address,
                currency,
                priceRange,
                openingTime,
                closingTime,
              }) => {
                return (
                  <Link to={`/places/${slug}`} key={id}>
                    <PlaceCard
                      name={<span className="truncate">{name}</span>}
                      image={thumbnail}
                      city={address.city}
                      price={`${currency || "IDR"} ${formatPrice(parseInt(priceRange))}`}
                      time={
                        openingTime && closingTime
                          ? `${openingTime} - ${closingTime}`
                          : null
                      }
                    />
                  </Link>
                );
              },
            )
          ) : (
            <p className="text-gray-500">No popular places available.</p>
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
