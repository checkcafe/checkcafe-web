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
  const url = `${BACKEND_API_URL}/places`;
  const responsePlaces = await fetch(url);
  const places: PlaceItem[] = await responsePlaces.json();

  if (!places) {
    throw new Response(null, { status: 404, statusText: "Places Not Found" });
  }

  return json({ places });
}

export default function Index() {
  const { places } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col justify-center">
      <HomeHeroSection />

      <HomePopularPlaces places={places} />

      {/* <HomeExploreCity /> */}

      <HomeInputEmail />
    </div>
  );
}
