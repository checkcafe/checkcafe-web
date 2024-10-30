import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useRef } from "react";

import AllPlaceCard from "~/components/shared/all-places/all-place-card";
import PlaceFilter from "~/components/shared/all-places/filter-places";
import { MapboxView } from "~/components/ui/mapbox-view";
import { BACKEND_API_URL } from "~/lib/env";
import { PlaceItem } from "~/types";
import { Filter } from "~/types/filter";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  const filter: Filter = {};

  const nameQuery = url.searchParams.get("q");
  if (nameQuery) filter.name = nameQuery;

  const priceFrom = url.searchParams.get("priceFrom");
  const priceTo = url.searchParams.get("priceTo");
  if (priceFrom || priceTo) {
    filter.priceRange = {};
    if (priceFrom) filter.priceRange.gte = priceFrom;
    if (priceTo) filter.priceRange.lte = priceTo;
  }

  const city = url.searchParams.get("city");
  if (city) filter["city.name"] = city;

  const openTime = url.searchParams.get("openTime");
  if (openTime) {
    filter["operatingHours.openingTime"] = { gte: openTime };
  }

  const closingTime = url.searchParams.get("closeTime");
  if (closingTime) {
    filter["operatingHours.closingTime"] = { lte: closingTime };
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
    <div
      className={`container mx-auto flex ${hasCityParam ? "flex-col" : ""} gap-8 px-8 pt-5`}
    >
      <PlaceFilter />

      <div className="flex w-full gap-2">
        {places.length === 0 ? (
          <p className="w-full text-center text-gray-500">Not Found</p>
        ) : (
          <>
            <main className={`${hasCityParam ? "w-1/2" : "w-full"}`}>
              <ul className="flex w-full flex-col gap-7">
                {places.map((place: PlaceItem, index: number) => (
                  <Link to={`/places/${place.slug}`} key={place.id}>
                    <AllPlaceCard
                      place={place}
                      ref={el => (cardRefs.current[index] = el)}
                    />
                  </Link>
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