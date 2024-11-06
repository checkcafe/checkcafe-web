import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import { MapPin, Receipt } from "lucide-react";
import { useState } from "react";
import { BiHeart } from "react-icons/bi";
import { FaHeart } from "react-icons/fa6";

import { Facility } from "~/components/shared/places/facility";
import { OperatingHourItem } from "~/components/shared/places/operating-hour";
import ShareButton from "~/components/shared/shared-button";
import { Sliders } from "~/components/shared/sliders";
import { MapboxView } from "~/components/ui/mapbox-view";
import { BACKEND_API_URL } from "~/lib/env";
import { getPageTitle } from "~/lib/get-page-title";
import { type Place, type PlaceItem } from "~/types/model";
import { formatPriceRange } from "~/utils/formatter";

export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params;
  if (!slug) return redirect("/places");

  const url = `${BACKEND_API_URL}/places/${slug}`;
  const responsePlace = await fetch(url);
  const place: Place & PlaceItem = await responsePlace.json();

  if (!place) {
    throw new Response(null, { status: 404, statusText: "Place Not Found" });
  }

  return json({ place });
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
  const { place } = useLoaderData<typeof loader>();
  const [isFavorited, setIsFavorited] = useState<boolean>(false);

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

  const handleFavoriteClicked = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <div className="px-4 py-8 md:px-32 md:py-20">
      <section className="flex flex-col gap-10 md:flex-row md:gap-28">
        <div className="h-96 w-full md:w-2/4">
          <Sliders
            imageSlides={place.photos.map((photo: { url: string }) => ({
              imageUrl: photo.url,
            }))}
          />
        </div>
        <header className="w-full md:w-2/5">
          <div className="flex flex-col justify-between md:flex-row">
            <h1 className="text-2xl font-semibold text-amber-900 md:text-3xl">
              {place.name}
            </h1>
            <div className="flex flex-row items-center justify-center gap-1">
              <button
                onClick={handleFavoriteClicked}
                className="hover:cursor-pointer hover:opacity-50"
              >
                {isFavorited ? (
                  <FaHeart className="h-8 w-8" color="#FF9129" />
                ) : (
                  <BiHeart className="h-8 w-8" />
                )}
              </button>
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
          <p className="mt-16 text-base font-semibold text-lime-600">
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

      <section className="mt-20 flex flex-col gap-10 md:flex-row md:gap-28">
        <aside className="h-96 w-full md:w-1/2">
          <MapboxView
            places={placesOnMap}
            initialViewState={initialViewMap}
            onPlaceClick={() => {}}
            height="50vh"
          />
        </aside>

        <div className="flex flex-col">
          <h1 className="mb-9 mt-2 text-xl font-semibold text-amber-950 md:text-2xl">
            Facility
          </h1>
          {place.placeFacilities?.length > 0 &&
            place.placeFacilities.map((facility, index) => (
              <Facility facility={facility} key={index} />
            ))}
        </div>
      </section>
    </div>
  );
}
