import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { Form, redirect, useLoaderData, useParams } from "@remix-run/react";
import { MapIcon, MapPin, Receipt } from "lucide-react";
import { useState } from "react";
import { BiHeart } from "react-icons/bi";
import { FaHeart, FaRegImages } from "react-icons/fa6";

import { Facility } from "~/components/shared/places/facility";
import { OperatingHourItem } from "~/components/shared/places/operating-hour";
import ShareButton from "~/components/shared/shared-button";
import { Sliders } from "~/components/shared/sliders";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { MapboxView } from "~/components/ui/mapbox-view";
import { BACKEND_API_URL } from "~/lib/env";
import { getPageTitle } from "~/lib/get-page-title";
import { getAccessToken } from "~/lib/token";
import { authenticator } from "~/services/auth.server";
import { getSession } from "~/services/session.server";
import {
  FavoritePlace,
  FavoritePlacesResponse,
  type Place,
  type PlaceItem,
} from "~/types/model";
import { formatPriceRange } from "~/utils/formatter";

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

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { slug } = params;
  if (!slug) return redirect("/places");

  const [responsePlace, placeFavorites] = await Promise.all([
    fetch(`${BACKEND_API_URL}/places/${slug}`),
    fetchFavorites(request),
  ]);
  const place: Place & PlaceItem = await responsePlace.json();

  if (!place) {
    throw new Response(null, { status: 404, statusText: "Place Not Found" });
  }

  const favoritePlace = placeFavorites.find(
    placeFavorite => placeFavorite.slug === slug,
  );

  return json({ place, favoritePlace });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: getPageTitle(`${data?.place.name}`) },
    {
      name: "description",
      content: `Discover ${data?.place.name} and explore what it has to offer.`,
    },
  ];
};

export default function PlaceSlug() {
  const { place, favoritePlace } = useLoaderData<typeof loader>();
  const { slug } = useParams();

  const [showMap, setShowMap] = useState(false);

  const placesOnMap = [
    {
      ...place,
      longitude: Number(place.longitude),
      latitude: Number(place.latitude),
    },
  ];
  const initialViewMap = {
    longitude: place.longitude || 0,
    latitude: place.latitude || 0,
    zoom: 14,
  };

  const method = favoritePlace ? "delete" : "post";

  return (
    <div className="px-4 py-8 md:px-32 md:py-20">
      <Button
        onClick={() => setShowMap((prev: boolean) => !prev)}
        variant="outline"
        className="mb-4 md:hidden"
      >
        {showMap ? "Show Photos" : "Show Map"}
        <span>{showMap ? <FaRegImages /> : <MapIcon />}</span>
      </Button>
      <section className="flex flex-col gap-10 md:flex-row md:gap-28">
        <div className="h-96 w-full md:w-2/4">
          {showMap ? (
            <aside className="md:hidden">
              <MapboxView
                places={placesOnMap}
                initialViewState={initialViewMap}
                onPlaceClick={() => {}}
                height="50vh"
              />
            </aside>
          ) : (
            <Sliders
              imageSlides={place.photos.map((photo: { url: string }) => ({
                imageUrl: photo.url,
              }))}
            />
          )}
        </div>
        <header className="w-full md:w-2/5">
          <div className="flex flex-row justify-between">
            <h1 className="text-2xl font-semibold text-amber-900 md:text-3xl">
              {place.name}
            </h1>
            <div className="flex flex-row items-center justify-center gap-1">
              <Form
                method={method}
                action={`/places/${slug}`}
                preventScrollReset={true}
              >
                <input type="hidden" name="placeId" value={place.id} />
                <input
                  type="hidden"
                  name="favoriteId"
                  value={favoritePlace?.favoriteId || ""}
                />
                <button
                  type="submit"
                  name="favorite"
                  value={favoritePlace ? "false" : "true"}
                  className="flex cursor-pointer items-center justify-center"
                >
                  {favoritePlace ? (
                    <FaHeart className="h-7 w-7" color="#FF9129" />
                  ) : (
                    <BiHeart className="h-8 w-8" />
                  )}
                </button>
              </Form>
              <ShareButton />
            </div>
          </div>
          <p className="mb-8 text-base font-normal">{place.description}</p>
          <span className="flex flex-row gap-2">
            <MapPin size={24} />
            <p className="mb-2 text-sm font-medium text-amber-950">
              {place.address.street}, {place.address.state},{" "}
              {place.address.country}
            </p>
          </span>
          <span className="mt-2 flex flex-row items-center gap-2">
            <Receipt size={24} />
            <p className="text-sm font-medium text-amber-950">
              {place.currency}{" "}
              {formatPriceRange(place.priceRangeMin, place.priceRangeMax)}
            </p>
          </span>
          <p className="mt-7 text-base font-semibold text-amber-950 md:mt-16">
            Operational Time
          </p>
          <div className="mt-2">
            {place.operatingHours?.length > 0 &&
              place.operatingHours.map((operatingHour, index) => (
                <OperatingHourItem operatingHour={operatingHour} key={index} />
              ))}
          </div>
        </header>
      </section>

      <section className="mt-7 flex flex-col gap-10 md:mt-20 md:flex-row md:gap-28">
        <aside className="hidden h-96 w-full md:block md:w-1/2">
          <MapboxView
            places={placesOnMap}
            initialViewState={initialViewMap}
            onPlaceClick={() => {}}
            height="50vh"
          />
        </aside>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <h1 className="mb-4 mt-2 text-base font-semibold text-amber-950 md:text-lg">
              Facility
            </h1>
            {place.placeFacilities?.length > 0 &&
              place.placeFacilities.map((facility, index) => (
                <Facility facility={facility} key={index} />
              ))}
          </div>
          <section>
            <h1 className="mb-4 mt-2 text-base font-semibold text-amber-950 md:text-lg">
              Submitter
            </h1>
            <div className="flex flex-row items-center gap-4">
              <Avatar>
                <AvatarImage
                  src={place.submitter.avatarUrl}
                  alt={place.submitter.username}
                />
                <AvatarFallback>
                  {place.submitter.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="md:text-md text-sm font-medium text-amber-950">
                {place.submitter.name}
              </p>
            </div>
          </section>
        </div>
      </section>
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

export async function action({ request, params }: ActionFunctionArgs) {
  const authenticated = await authenticator.isAuthenticated(request);
  const { accessToken, headers } = await getAccessToken(request);

  if (!authenticated || !accessToken) {
    return redirect("/login", { headers });
  }

  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();

  const username = session.get("userData")?.username;
  const placeId = formData.get("placeId")?.toString();
  const favoriteId = formData.get("favoriteId")?.toString();
  const method = request.method;
  const { slug } = params;

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

    return redirect(`/places/${slug}`, { headers });
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred.",
    );
  }
}
