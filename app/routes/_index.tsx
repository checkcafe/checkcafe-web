import React from "react";
import type { MetaFunction } from "@remix-run/node";

import HeroSection from "~/components/shared/hero-section";
import HomePopularPlaces from "~/components/shared/home-popular-places/home-popular-places";
import HomeExploreCity from "~/components/shared/home-explore-city/home-explore-city";
import HomeInputEmail from "~/components/shared/home-input-email";

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

export default function Index(): React.ReactElement {
  return (
    <div className="flex flex-col justify-center">
      <HeroSection />
      <HomePopularPlaces />
      <HomeExploreCity />
      <HomeInputEmail />
    </div>
  );
}
