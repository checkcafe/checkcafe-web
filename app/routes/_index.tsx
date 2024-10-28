import { json, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { HomeHeroSection } from "~/components/shared/hero-section";
import { HomeInputEmail } from "~/components/shared/home-input-email";
import { HomePopularPlaces } from "~/components/shared/home-popular-places/home-popular-places";
import { BACKEND_API_URL } from "~/lib/env";
import { type PlaceItem } from "~/types";

export const meta: MetaFunction = () => {
  return [
    { title: "CheckCafe" },
    {
      name: "description",
      content:
        "Check the best cafe for social, food, WFC, and comfortable experience",
    },
  ];
};

export async function loader() {
  try {
    const response = await fetch(`${BACKEND_API_URL}/places`);

    if (!response.ok) {
      throw new Error(response.statusText || "Failed to fetch places");
    }

    const places: PlaceItem[] = await response.json();
    return json({ places });
  } catch (error: Error | any) {
    return json({ places: [], error: error.message });
  }
}

export default function Index() {
  const { places } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col justify-center">
      <HomeHeroSection />
      {places?.length > 0 && <HomePopularPlaces places={places} />}
      <HomeInputEmail />
    </div>
  );
}
