import { json, LoaderFunctionArgs } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import { MapPin, Receipt } from "lucide-react";

import { Facility } from "~/components/shared/places/facility";
import { ImageCarousel } from "~/components/shared/places/image-carousel";
import { OperatingHourItem } from "~/components/shared/places/operating-hour";
import { MapboxView } from "~/components/ui/mapbox-view";
import { BACKEND_API_URL } from "~/lib/env";
import { type Place } from "~/types";
import { formatPrice } from "~/utils/formatter";

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

export default function PlaceSlug() {
  const { place } = useLoaderData<typeof loader>();

  return (
    <div className="px-32 py-20">
      <section className="flex flex-row gap-28">
        {place.placePhotos?.length > 0 && (
          <ImageCarousel images={place.placePhotos} />
        )}

        <header className="text-amber-900">
          <h1 className="text-3xl font-semibold">{place.name}</h1>
          <p className="mb-8 text-base font-normal">{place.description}</p>
          <span className="flex flex-row gap-2">
            <MapPin size={24} />
            <p className="mb-2 text-sm font-medium">
              {place.address.street}, {place.address.state},{" "}
              {place.address.country}
            </p>
          </span>
          <span className="mt-2 flex flex-row items-center gap-2">
            <Receipt size={24} />
            <p className="text-sm font-medium">
              {place.currency} {formatPrice(parseInt(place.priceRange))}
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

      <section className="mt-20 flex flex-row gap-28">
        <aside className="h-96 w-1/2">
          <MapboxView
            places={[
              {
                id: place.id,
                name: place.name,
                longitude: place.longitude,
                latitude: place.latitude,
              },
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
          <h1 className="mb-12 mt-4 text-2xl font-semibold text-amber-900">
            Facility
          </h1>
          {place.placeFacilities?.length > 0 &&
            place.placeFacilities?.map((facility, index) => (
              <Facility facility={facility} key={index} />
            ))}
        </div>
      </section>
    </div>
  );
}
