import { json, type MetaFunction } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { Armchair, Wifi } from "lucide-react";
import { IoSend } from "react-icons/io5";

import { FloatingCard } from "~/components/shared/floating-card";
import PopularPlaces from "~/components/shared/home/popular-places";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { BACKEND_API_URL } from "~/lib/env";
import { type PlaceItem } from "~/types/model";

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
    const response = await fetch(`${BACKEND_API_URL}/places?limit=7`);

    if (!response.ok) {
      throw new Error(response.statusText || "Failed to fetch places");
    }

    const places: PlaceItem[] = await response.json();

    return json({ places });
  } catch (error: any) {
    return json({ places: [], error: error.message });
  }
}

export default function Index() {
  const { places } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col justify-center">
      {/* Hero Section */}
      <section className="flex justify-center bg-amber-50 py-10 md:py-10">
        <div className="flex flex-col gap-32 px-5 md:flex-row">
          <div className="space-y-10 pt-2 md:pt-14">
            <h1 className="text-amber-00 font-brand text-4xl md:text-5xl">
              Find your <span className="text-amber-600">comfort</span>
              <br />
              <span>Enjoy your work</span>
            </h1>

            <p className="max-w-xl text-lg text-amber-700">
              CheckCafe is the guide to various cafes and great vibes
            </p>

            <Button size="cta">
              <Link to="/places">Explore Places</Link>
            </Button>
          </div>

          <div className="relative px-6 md:px-0">
            <img
              src="https://ucarecdn.com/b18da909-9d28-4371-b7b1-814943e88b32/heroimage.jpg"
              alt="checkcafe-hero-image"
              width={500}
              height={500}
              className="rounded-md"
            />
            <FloatingCard
              title="Price: $-$$$"
              className="left-[-10px] top-14 md:left-[-80px] md:top-24"
            />
            <FloatingCard
              icon={<Armchair className="h-4 w-4 md:h-[30px] md:w-[30px]" />}
              title="6-Seat Capacity"
              className="bottom-5 left-[-10px] md:bottom-14 md:left-[-100px]"
            />
            <FloatingCard
              icon={<Wifi className="h-4 w-4 md:h-[30px] md:w-[30px]" />}
              title="WiFi: 150 Mbps"
              className="bottom-32 right-[-10px] md:bottom-52 md:right-[-100px]"
            />
          </div>
        </div>
      </section>

      {/* Popular places */}
      {places.length > 0 && <PopularPlaces places={places} />}

      {/* Join our community */}
      <div className="mb-12 mt-16 px-4 sm:px-6 lg:px-[139px]">
        <div className="rounded-lg bg-[#372816] p-8 sm:p-12 lg:p-16">
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-center text-3xl font-semibold text-white md:text-4xl">
              Join our community
            </h2>
            <p className="text-center text-base font-normal text-white">
              Let’s explore and favorite your choice
            </p>
            <Form
              method="get"
              className="relative flex w-full justify-center"
              action="/register"
            >
              <div className="relative w-full max-w-md">
                <Input
                  type="email"
                  name="email"
                  placeholder="example@email.com"
                  className="w-full rounded-md border border-gray-300 px-4 py-3 pr-12 transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-3 flex cursor-pointer items-center border-none bg-transparent"
                >
                  <IoSend className="size-5 text-gray-600 transition-colors hover:text-blue-500" />
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
