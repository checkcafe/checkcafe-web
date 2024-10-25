import * as React from "react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import { MapPin, Receipt } from "lucide-react";

import ImageCarousel from "~/components/shared/places/image-carousel";
import { MapboxView } from "~/components/ui/mapbox-view";
import NearbyPlace from "~/components/shared/places/nearby-place";
import Facility from "~/components/shared/places/facility";
import OperatingHour from "~/components/shared/places/operating-hour";
import { BACKEND_API_URL } from "~/lib/env";
import { formatPrice } from "~/utils/formatter.utils";
import type { Place } from "~/types";

const dummyNearbyPlaces = [
  {
    name: "Kopi Nako",
    image:
      "https://ditaanggraeniy.com/wp-content/uploads/2023/01/lokasi-dan-harga-menu-kopi-nako-summarecon-bekasi.jpeg?w=645",
    latitude: -6.2221583483225205,
    longitude: 106.99756345319413,
  },
  {
    name: "Kopi Nako",
    image:
      "https://ditaanggraeniy.com/wp-content/uploads/2023/01/lokasi-dan-harga-menu-kopi-nako-summarecon-bekasi.jpeg?w=645",
    latitude: -6.2221583483225205,
    longitude: 106.99756345319413,
  },
  {
    name: "Kopi Nako",
    image:
      "https://ditaanggraeniy.com/wp-content/uploads/2023/01/lokasi-dan-harga-menu-kopi-nako-summarecon-bekasi.jpeg?w=645",
    latitude: -6.2221583483225205,
    longitude: 106.99756345319413,
  },
  {
    name: "Kopi Nako",
    image:
      "https://ditaanggraeniy.com/wp-content/uploads/2023/01/lokasi-dan-harga-menu-kopi-nako-summarecon-bekasi.jpeg?w=645",
    latitude: -6.2221583483225205,
    longitude: 106.99756345319413,
  },
  {
    name: "Kopi Nako",
    image:
      "https://ditaanggraeniy.com/wp-content/uploads/2023/01/lokasi-dan-harga-menu-kopi-nako-summarecon-bekasi.jpeg?w=645",
    latitude: -6.2221583483225205,
    longitude: 106.99756345319413,
  },
];

/**
 * Loader for get place
 *
 * @param param -  LoaderFunctionArgs
 * @returns place loader
 */
export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params;
  if (!slug) return redirect("/places");

  const url = `${BACKEND_API_URL}/places/${slug}`;
  const responsePlace = await fetch(url);
  const place: Place = await responsePlace.json();

  if (!place) {
    throw new Response(null, { status: 404, statusText: "Place Not Found" });
  }

  return json({ place });
}

/**
 * Place Detail
 *
 * @returns PlaceSlug component
 */
export default function PlaceSlug() {
  const { place } = useLoaderData<typeof loader>();
  console.log("place", place);

  return (
    <div className="py-20 px-32">
      <section className="flex flex-row gap-28">
        <ImageCarousel images={place.placePhotos} />
        <header className="text-amber-900">
          <h1 className="text-3xl font-semibold ">{place.name}</h1>
          <p className="text-base font-normal mb-8">{place.description}</p>
          <span className="flex flex-row gap-2">
            <MapPin size={24} />
            <p className="text-sm font-medium mb-2">
              {place.address.street}, {place.address.state},{" "}
              {place.address.country}
            </p>
          </span>
          <span className="flex flex-row gap-2 items-center mt-2">
            <Receipt size={24} />
            <p className="text-sm font-medium">
              {place.currency} {formatPrice(parseInt(place.priceRange))}
            </p>
          </span>
          <p className="text-base font-semibold text-lime-600 mt-16">
            Operational Time
          </p>
          <div className="mt-2">
            {place.operatingHours?.length > 0 &&
              place.operatingHours.map((operatingHour, index) => (
                <OperatingHour operatingHour={operatingHour} key={index} />
              ))}
          </div>
        </header>
      </section>
      <section className="flex flex-row gap-28 mt-20">
        <aside className="w-1/2 h-96">
          <MapboxView
            places={[
              {
                id: place.id,
                name: place.name,
                longitude: place.longitude,
                latitude: place.latitude,
              },
              ...dummyNearbyPlaces,
            ]}
            initialViewState={{
              longitude: place.longitude || 0,
              latitude: place.latitude || 0,
              zoom: 14,
            }}
            onPlaceClick={() => {}}
            height="50vh"
          />
        </aside>
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold text-amber-900 mt-4 mb-12">
            Facility
          </h1>
          {place.placeFacilities.map((facility, index) => (
            <Facility facility={facility} key={index} />
          ))}
        </div>
      </section>
      <section className="flex flex-col mt-28">
        <h1 className="text-2xl font-semibold text-amber-900 mb-5">
          Nearby Places
        </h1>
        <div className="flex flex-row">
          {dummyNearbyPlaces.map((place, index) => (
            <NearbyPlace place={place} key={index} />
          ))}
        </div>
      </section>
    </div>
  );
}
