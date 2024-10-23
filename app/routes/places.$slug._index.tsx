import { json, LoaderFunctionArgs } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";

import { Place } from "~/types";

export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params;
  if (!slug) return redirect("/places");

  const responsePlace = await fetch(`https://api.checkcafe.com/place/${slug}`);
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
      <header className="text-amber-900">
        <h1 className="text-3xl font-semibold ">{place.name}</h1>
        <p className="text-base font-normal mb-8">{place.description}</p>
        <p className="text-sm font-medium mb-2">{place.streetAddress}</p>
        <p className="text-sm font-medium">{place.priceRange}</p>
        <p className="text-base font-semibold text-lime-600 mt-6">
          Operational Time
        </p>
      </header>

      <div className="mt-2">
        {place.operatingHours?.length > 0 &&
          place.operatingHours.map((operatingHour) => (
            <div
              key={operatingHour.id}
              className="flex flex-row w-72 justify-between"
            >
              <p>{operatingHour.day}</p>
              <div className="flex flex-row">
                <p>
                  {new Date(operatingHour.startDateTime)
                    .getUTCHours()
                    .toString()
                    .padStart(2, "0")}
                  :
                  {new Date(operatingHour.startDateTime)
                    .getUTCMinutes()
                    .toString()
                    .padStart(2, "0")}{" "}
                  -{" "}
                </p>
                <p>
                  {new Date(operatingHour.endDateTime)
                    .getUTCHours()
                    .toString()
                    .padStart(2, "0")}
                  :
                  {new Date(operatingHour.endDateTime)
                    .getUTCMinutes()
                    .toString()
                    .padStart(2, "0")}{" "}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
