import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  Form,
  Link,
  redirect,
  useLoaderData,
  useParams,
} from "@remix-run/react";
import { MapIcon, MapPin, Receipt } from "lucide-react";
import React, { useState } from "react";
import { BiHeart } from "react-icons/bi";
import { FaClock, FaDollarSign, FaHeart, FaRegImages } from "react-icons/fa6";

import { Facility } from "~/components/shared/places/facility";
import { OperatingHourItem } from "~/components/shared/places/operating-hour";
import ShareButton from "~/components/shared/shared-button";
import { Sliders } from "~/components/shared/sliders";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { MapboxView } from "~/components/ui/mapbox-view";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import Constants from "~/constants";
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
import { formatPriceRange, formatTime } from "~/utils/formatter";

const { DEFAULT_HEIGHT, DEFAULT_WIDTH } = Constants;

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

  const session = await getSession(request.headers.get("Cookie"));
  const username = session.get("userData")?.username;

  if (!place.isPublished && place.submitter.username !== username) {
    return redirect("/login");
  }

  if (!place) {
    throw new Response(null, { status: 404, statusText: "Place Not Found" });
  }

  const cityId = place.address?.cityId;
  let nearbyPlaces: PlaceItem[] = [];

  if (cityId) {
    const responseNearbyPlaces = await fetch(
      `${BACKEND_API_URL}/places?filter={ "cityId":"${cityId}" }&limit=6`,
    );

    if (responseNearbyPlaces.ok) {
      nearbyPlaces = await responseNearbyPlaces.json();
    }
  }

  const favoritePlace = placeFavorites.find(
    placeFavorite => placeFavorite.slug === slug,
  );

  return json({ place, favoritePlace, nearbyPlaces, username });
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
  const { place, favoritePlace, nearbyPlaces } = useLoaderData<typeof loader>();
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
      <div className="mb-4 flex flex-row justify-between">
        <Button
          onClick={() => setShowMap((prev: boolean) => !prev)}
          variant="outline"
          className="md:hidden"
        >
          {showMap ? "Show Photos" : "Show Map"}
          <span>{showMap ? <FaRegImages /> : <MapIcon />}</span>
        </Button>
        {!place.isPublished && (
          <Button asChild className="ml-auto">
            <Link
              to={`/places/${place.id}/edit`}
              className="bg-amber-950 text-primary"
            >
              Continue Edit
            </Link>
          </Button>
        )}
      </div>
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
            <React.Fragment>
              {place.photos.length > 0 ? (
                <Sliders
                  imageSlides={place.photos.map((photo: { url: string }) => ({
                    imageUrl: photo.url,
                  }))}
                />
              ) : (
                <img
                  src={"https://placehold.co/600x400?text=No%20Image"}
                  alt={"No images"}
                  width={DEFAULT_WIDTH}
                  height={DEFAULT_HEIGHT}
                  className="h-[400px] w-full rounded-lg object-cover"
                />
              )}
            </React.Fragment>
          )}
        </div>
        <header className="w-full md:w-2/5">
          <div className="flex flex-row justify-between">
            <h1 className="text-2xl font-semibold text-amber-900 md:text-3xl">
              {place.name || "Name is not available"}
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
              {place.isPublished && <ShareButton />}
            </div>
          </div>
          <p className="mb-5 mt-2 text-base font-normal">
            {place.description || "Description is not available"}
          </p>
          {place.address ? (
            <span className="flex flex-row items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500">
                <MapPin size={24} color="white" />
              </div>
              <p className="mb-2 text-sm font-medium text-amber-950">
                {place.address.street || "No street"},{" "}
                {place.address.state || "No state"},{" "}
                {place.address.country || "No country"}
              </p>
            </span>
          ) : (
            <p className="text-base font-normal">Address is not available</p>
          )}
          <span className="mt-2 flex flex-row items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500">
              <Receipt size={24} color="white" />
            </div>
            <p className="text-sm font-medium text-amber-950">
              {place.currency || "IDR"}{" "}
              {formatPriceRange(place.priceRangeMin, place.priceRangeMax)}
            </p>
          </span>
          <p className="mt-7 text-2xl font-semibold text-amber-950 md:mt-7">
            Operational Time
          </p>
          <div className="mt-2">
            {place.operatingHours?.length > 0 ? (
              place.operatingHours.map((operatingHour, index) => (
                <OperatingHourItem operatingHour={operatingHour} key={index} />
              ))
            ) : (
              <p className="text-sm text-amber-950 md:text-base">
                Operational Hours is not available
              </p>
            )}
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
            <h1 className="mb-4 mt-2 text-base font-semibold text-amber-950 md:text-2xl">
              Facility
            </h1>
            {place.placeFacilities?.length > 0 ? (
              place.placeFacilities.map((facility, index) => (
                <Facility facility={facility} key={index} />
              ))
            ) : (
              <p className="text-sm text-amber-950 md:text-base">
                Facilities is not available
              </p>
            )}
          </div>
          <section>
            <h1 className="mb-4 mt-2 text-base font-semibold text-amber-950 md:text-2xl">
              Submitter
            </h1>
            <div className="flex flex-row items-center gap-4">
              <Avatar className="rounded-full bg-primary p-0.5">
                <AvatarImage
                  className="rounded-full"
                  src={place.submitter.avatarUrl}
                  alt={place.submitter.username}
                />
                <AvatarFallback>
                  {place.submitter.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium text-amber-950 md:text-base">
                {place.submitter.name || "Submitter name is not available"}
              </p>
            </div>
          </section>
        </div>
      </section>

      {nearbyPlaces.length > 0 && (
        <>
          <div className="mb-2 mt-16 flex flex-row items-center justify-between">
            <p className="text-xl font-medium text-[#372816]">Nearby Places</p>
          </div>
          <ScrollArea className="w-full overflow-hidden">
            <div className="flex space-x-4 overflow-x-auto overflow-y-hidden md:space-x-6">
              {nearbyPlaces.map(
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
        </>
      )}
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
  const isPublished = formData.get("isPublished")?.toString();
  const method = request.method;
  const { slug } = params;

  if (!isPublished) {
    throw new Error("The place must be published to favorite");
  }

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
