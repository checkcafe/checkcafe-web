import { Link } from "@remix-run/react";
import { ChevronRightIcon } from "lucide-react";

import { PlaceCard } from "~/components/shared/home-popular-places/place-card";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { PlaceItem } from "~/types";
import { formatPrice } from "~/utils/formatter";

/**
 * Show list of popular places
 */
export const HomePopularPlaces = (props: { places: PlaceItem[] }) => {
  const { places } = props;

  return (
    <div className="mt-12 px-5 md:px-[139px]">
      <div className="mb-5 flex flex-row justify-between">
        <p className="text-xl font-medium text-[#372816]">Popular Places</p>
        <ChevronRightIcon size={36} color="#372816" />
      </div>
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div className="flex w-max space-x-6">
          {places &&
            places.length > 0 &&
            places.map(place => (
              <Link to={`/place/${place.slug}`} key={place.id}>
                <PlaceCard
                  placeName={place.name}
                  city={place.address.city}
                  price={`${place.currency} ${formatPrice(
                    parseInt(place.priceRange),
                  )}`}
                  time={`${place.openingTime} - ${place.closingTime}`}
                />
              </Link>
            ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
