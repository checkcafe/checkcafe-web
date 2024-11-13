import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { List, MapIcon } from "lucide-react";
import { useRef, useState } from "react";

import AllPlaceCard from "~/components/pages/all-places/all-place-card";
import PlaceFilter from "~/components/pages/all-places/filter-places";
import { Button } from "~/components/ui/button";
import { MapboxView } from "~/components/ui/mapbox-view";
import { BACKEND_API_URL } from "~/lib/env";
import { getPageTitle } from "~/lib/get-page-title";
import { getAccessToken } from "~/lib/token";
import { authenticator } from "~/services/auth.server";
import { getSession } from "~/services/session.server";
import { Filter } from "~/types/filter";
import {
  FavoritePlace,
  FavoritePlacesResponse,
  PlaceItem,
} from "~/types/model";
import { formatFilterTime } from "~/utils/formatter";

export const meta: MetaFunction = () => {
  return [
    { title: getPageTitle("Places") },
    {
      name: "description",
      content: "Explore all places available in our collection.",
    },
  ];
};

async function fetchFavorites(request: Request): Promise<FavoritePlace[]> {
  const isAuthenticated = await authenticator.isAuthenticated(request);
  if (!isAuthenticated) return [];

  const session = await getSession(request.headers.get("Cookie"));
  const username = session.get("userData")?.username;

  const response = await fetch(
    `${BACKEND_API_URL}/users/${username}/favorites`,
    { method: "GET", headers: { "Content-Type": "application/json" } },
  );

  if (!response.ok) return [];

  const { placeFavorites }: FavoritePlacesResponse = await response.json();
  return placeFavorites || [];
}

async function fetchPlaces(url: URL): Promise<PlaceItem[]> {
  const apiUrl = new URL(`${BACKEND_API_URL}/places`);
  const filter: Filter = {};

  const params: { [key: string]: (value: string) => void } = {
    q: value => (filter.name = value),
    priceFrom: value => (filter["priceRangeMin"] = { gte: value }),
    priceTo: value => (filter["priceRangeMax"] = { lte: value }),
    city: value => (filter["city.name"] = value),
    openTime: value =>
      (filter["openingTime"] = { lte: formatFilterTime(value) }),
    closeTime: value =>
      (filter["closingTime"] = { gte: formatFilterTime(value) }),
  };

  Object.keys(params).forEach(param => {
    const value = url.searchParams.get(param);
    if (value && params[param]) {
      params[param](value);
    }
  });

  if (Object.keys(filter).length > 0) {
    apiUrl.searchParams.append("filter", JSON.stringify(filter));
  }

  const response = await fetch(apiUrl.toString());
  if (!response.ok) return [];
  return await response.json();
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const [placeFavorites, places] = await Promise.all([
    fetchFavorites(request),
    fetchPlaces(url),
  ]);

  return {
    places,
    favorites: placeFavorites,
    hasCityParam: Boolean(url.searchParams.get("city")),
  };
}

export default function Places() {
  const { places, hasCityParam, favorites } = useLoaderData<typeof loader>();
  const favoriteMap = new Map(favorites.map(fav => [fav.slug, fav.favoriteId]));
  const [showMap, setShowMap] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleScrollToCard = (placeId: string) => {
    const cardIndex = places.findIndex(place => place.id === placeId);
    const selectedCard = cardRefs.current[cardIndex];
    selectedCard?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="container relative mx-auto flex min-h-screen flex-col gap-2 px-4 pt-5 md:flex-row md:px-8">
      <div className="sticky top-20 z-40 flex justify-between bg-white py-2">
        <PlaceFilter />

        <Button
          onClick={() => setShowMap(prev => !prev)}
          variant="outline"
          className="md:hidden"
        >
          {showMap ? "Show List" : "Show Map"}
          <span>{showMap ? <List /> : <MapIcon />}</span>
        </Button>
      </div>

      <div className="flex h-full w-full gap-2">
        {places.length === 0 ? (
          <p className="w-full text-center text-gray-500">
            {hasCityParam
              ? "No cafes have been added for this city yet."
              : "Cafe Not Found"}
          </p>
        ) : (
          <>
            <main
              className={`w-full md:${hasCityParam ? "w-3/4" : "w-full"} ${showMap ? "hidden" : ""}`}
            >
              <ul className="flex w-full flex-col gap-4 md:gap-7">
                {places.map((place, index) => (
                  <div key={place.id}>
                    <AllPlaceCard
                      place={place}
                      ref={el => (cardRefs.current[index] = el)}
                      isFavorite={favoriteMap.has(place.slug)}
                      favoriteId={favoriteMap.get(place.slug) ?? null}
                    />
                  </div>
                ))}
              </ul>
            </main>

            <aside
              className={`sticky top-0 ${showMap ? "" : "hidden"} h-full w-full md:flex md:w-2/3`}
            >
              <MapboxView
                places={places}
                onPlaceClick={handleScrollToCard}
                showMap={showMap}
                hasCityParam={hasCityParam}
              />
            </aside>
          </>
        )}
      </div>
    </div>
  );
}

async function modifyFavoritePlace(
  accessToken: string,
  username: string,
  placeId?: string,
  favoriteId?: string,
) {
  const method = placeId ? "POST" : "DELETE";
  const url = placeId
    ? `${BACKEND_API_URL}/users/${username}/favorites`
    : `${BACKEND_API_URL}/users/${username}/favorites/${favoriteId}`;

  const body = placeId ? JSON.stringify({ id: placeId }) : undefined;

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body,
  });

  if (!response.ok) {
    throw new Error(
      method === "POST"
        ? "Failed to add favorite place"
        : "Failed to unfavorite place",
    );
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const authenticated = await authenticator.isAuthenticated(request);
  const { accessToken, headers } = await getAccessToken(request);

  if (!authenticated || !accessToken) {
    return redirect("/login", { headers });
  }

  const session = await getSession(request.headers.get("Cookie"));
  const username = session.get("userData")?.username;
  const formData = await request.formData();
  const placeId = formData.get("placeId")?.toString();
  const favoriteId = formData.get("favoriteId")?.toString();
  const method = request.method;

  if (!placeId && !favoriteId) {
    return json({ error: "Place ID or Favorite ID is required" });
  }

  try {
    if (method === "POST") {
      await modifyFavoritePlace(accessToken, username, placeId);
    } else if (method === "DELETE") {
      await modifyFavoritePlace(accessToken, username, undefined, favoriteId);
    } else {
      throw new Error("Invalid method");
    }

    return redirect(`/places${new URL(request.url).search}`, { headers });
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred.",
    );
  }
}
