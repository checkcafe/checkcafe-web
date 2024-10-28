import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useRef } from "react";

import AllPlaceCard from "~/components/shared/all-places/all-place-card";
import PlaceFilter from "~/components/shared/all-places/filter-places";
import { Input } from "~/components/ui/input";
import { MapboxView } from "~/components/ui/mapbox-view";
import { BACKEND_API_URL } from "~/lib/env";
import { PlaceItem } from "~/types";

interface Filter {
  name?: string;
  priceRange?: { from?: string; to?: string };
  "city.name"?: string;
  operatingHours?: {
    openingTime?: { gte: string };
    closingTime?: { lte: string };
  };
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  const filter: Filter = {};

  const nameQuery = url.searchParams.get("q");
  if (nameQuery) filter.name = nameQuery;

  const priceRangeFrom = url.searchParams.get("priceRangeFrom");
  const priceRangeTo = url.searchParams.get("priceRangeTo");
  if (priceRangeFrom || priceRangeTo) {
    filter.priceRange = {};
    if (priceRangeFrom) filter.priceRange.from = priceRangeFrom;
    if (priceRangeTo) filter.priceRange.to = priceRangeTo;
  }

  const city = url.searchParams.get("city");
  if (city) filter["city.name"] = city;

  const openingTimeGte = url.searchParams.get("openingTimeGte");
  if (openingTimeGte) {
    filter.operatingHours = filter.operatingHours || {};
    filter.operatingHours.openingTime = { gte: openingTimeGte };
  }

  const closingTimeLte = url.searchParams.get("closingTimeLte");
  if (closingTimeLte) {
    filter.operatingHours = filter.operatingHours || {};
    filter.operatingHours.closingTime = { lte: closingTimeLte };
  }

  const apiUrl = new URL(`${BACKEND_API_URL}/places`);
  if (Object.keys(filter).length > 0) {
    apiUrl.searchParams.append("filter", JSON.stringify(filter));
  }

  try {
    const response = await fetch(apiUrl.toString());
    if (!response.ok) {
      return { places: [], hasCityParam: Boolean(city) };
    }
    const places: PlaceItem[] = await response.json();

    return { places, hasCityParam: Boolean(city) };
  } catch (error) {
    return { places: [], hasCityParam: false };
  }
}

export default function Places() {
  const { places, hasCityParam } = useLoaderData<typeof loader>();

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleScrollToCard = (placeId: string) => {
    const cardIndex = places.findIndex(
      (place: PlaceItem) => place.id === placeId,
    );
    const selectedCard = cardRefs.current[cardIndex];
    if (selectedCard) {
      selectedCard.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="container mx-auto flex flex-col gap-8 px-8 pt-5">
      <PlaceFilter />

      <div className="flex gap-2">
        {places.length === 0 ? (
          <p className="w-full text-center text-gray-500">Not Found</p>
        ) : (
          <>
            <main className="w-1/2">
              <ul className="flex w-full flex-col gap-7">
                {places.map((place: PlaceItem, index: number) => (
                  <AllPlaceCard
                    place={place}
                    ref={el => (cardRefs.current[index] = el)}
                    key={place.id}
                  />
                ))}
              </ul>
            </main>

            {hasCityParam && places.length > 0 && (
              <aside className="sticky top-0 h-full w-1/2">
                <MapboxView places={places} onPlaceClick={handleScrollToCard} />
              </aside>
            )}
          </>
        )}
      </div>
    </div>
  );
}
