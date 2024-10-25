import * as React from "react";
import { ChevronRightIcon } from "lucide-react";
import { Link } from "@remix-run/react";

import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { formatPrice } from "~/utils/formatter.utils";
import { PlaceItem } from "~/types";

import PlaceCard from "./place-card";

type Props = {
  places: PlaceItem[];
};

/**
 * Show list of popular places
 *
 * @returns HomePopularPlaces component
 */
const HomePopularPlaces = (props: Props) => {
  const { places } = props;

  return (
    <div className="px-5 md:px-[139px] mt-12">
      <div className="flex flex-row justify-between mb-5">
        <p className="text-xl text-[#372816] font-medium">Popular Places</p>
        <ChevronRightIcon size={36} color="#372816" />
      </div>
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div className="flex w-max space-x-6">
          {places &&
            places.length > 0 &&
            places.map((place) => (
              <Link to={`/place/${place.slug}`} key={place.id}>
                <PlaceCard
                  placeName={place.name}
                  city={place.address.city}
                  price={`${place.currency} ${formatPrice(
                    parseInt(place.priceRange)
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

export default HomePopularPlaces;
