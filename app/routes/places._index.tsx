import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useRef } from "react";

import AllPlaceCard from "~/components/shared/all-places/all-place-card";
import PlaceFilter from "~/components/shared/all-places/filter-places";
import { MapboxView } from "~/components/ui/mapbox-view";
import { BACKEND_API_URL } from "~/lib/env";
import {
  addFavoritePlace,
  getFavoritePlaces,
  unfavoritePlace,
} from "~/lib/favorite-place";
import { getAccessToken } from "~/lib/token";
import { Filter } from "~/types/filter";
import {
  FavoritePlace,
  FavoritePlacesResponse,
  PlaceItem,
} from "~/types/model";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const responseFavorites = await getFavoritePlaces(request);
  const favoritesData: FavoritePlacesResponse = responseFavorites
    ? await responseFavorites.json()
    : { placeFavorites: [] };
  const { placeFavorites } = favoritesData;

  const filter: Filter = {};

  const nameQuery = url.searchParams.get("q");
  if (nameQuery) filter.name = nameQuery;

  const priceFrom = url.searchParams.get("priceFrom");
  if (priceFrom) filter.priceRangeMin = Number(priceFrom);
  const priceTo = url.searchParams.get("priceTo");
  if (priceTo) filter.priceRangeMax = Number(priceTo);

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
      return { places: [], favorites: [], hasCityParam: Boolean(city) };
    }
    const places: PlaceItem[] = await response.json();

    return { places, favorites: placeFavorites, hasCityParam: Boolean(city) };
  } catch (error) {
    return { places: [], favorites: [], hasCityParam: false };
  }
}

export default function Places() {
  const { places, hasCityParam, favorites } = useLoaderData<typeof loader>();

  const favoriteMap = new Map();
  favorites.forEach((favorite: FavoritePlace) => {
    favoriteMap.set(favorite.slug, favorite.favoriteId);
  });

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
          hasCityParam ? (
            <p className="w-full text-center text-gray-500">
              No cafes have been added for this city yet.
            </p>
          ) : (
            <p className="w-full text-center text-gray-500">Cafe Not Found</p>
          )
        ) : (
          <>
            <main className={`${hasCityParam ? "w-2/3" : "w-full"}`}>
              <ul className="flex w-full flex-col gap-7">
                {places.map((place, index) => {
                  const isFavorite = favoriteMap.has(place.slug);
                  const favoriteId = isFavorite
                    ? favoriteMap.get(place.slug)
                    : null;

                  return (
                    <div key={place.id}>
                      <AllPlaceCard
                        place={place}
                        ref={el => (cardRefs.current[index] = el)}
                        isFavorite={isFavorite}
                        favoriteId={favoriteId}
                      />
                    </div>
                  );
                })}
              </ul>
            </main>

            {hasCityParam && places.length > 0 && (
              <aside className="sticky top-0 h-full w-1/3">
                <MapboxView places={places} onPlaceClick={handleScrollToCard} />
              </aside>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const { accessToken } = await getAccessToken(request);

  if (!accessToken) return redirect("/login");

  const url = new URL(request.url);

  const formData = await request.formData();
  const placeId = formData.get("placeId")?.toString();
  const favoriteId = formData.get("favoriteId")?.toString();
  const method = request.method;

  if (!placeId) {
    return json({ error: "Place ID is required" });
  }

  try {
    if (method === "POST") {
      const response = await addFavoritePlace(request, placeId);
      console.log(response, "responseadd");
    } else if (method === "DELETE") {
      if (!favoriteId) {
        return json({ error: "Favorite ID is required" });
      }
      await unfavoritePlace(request, favoriteId);
    } else {
      return json({ error: "Invalid action type" });
    }

    return redirect(`/places${url.search}`);

    // return json({
    //   success: true,
    //   message: "Added to favorites!",
    // });
  } catch (error) {
    console.error("Error processing favorite place action:", error);
    return json({ error: "Failed to process favorite place" }, { status: 500 });
  }
}
