import { ChevronRightIcon } from "lucide-react";
import React from "react";

import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";

import PlaceCard from "./place-card";

const dummyPlaces = [
  {
    id: "1",
    name: "Kopi Nako",
    city: "Jakarta",
    price: "$ - $$$",
    time: "09:00 - 23:00",
  },
  {
    id: "2",
    name: "Kopi Nako",
    city: "Jakarta",
    price: "$ - $$$",
    time: "09:00 - 23:00",
  },
  {
    id: "3",
    name: "Kopi Nako",
    city: "Jakarta",
    price: "$ - $$$",
    time: "09:00 - 23:00",
  },
  {
    id: "4",
    name: "Kopi Nako",
    city: "Jakarta",
    price: "$ - $$$",
    time: "09:00 - 23:00",
  },
  {
    id: "5",
    name: "Kopi Nako",
    city: "Jakarta",
    price: "$ - $$$",
    time: "09:00 - 23:00",
  },
  {
    id: "6",
    name: "Kopi Nako",
    city: "Jakarta",
    price: "$ - $$$",
    time: "09:00 - 23:00",
  },
  {
    id: "7",
    name: "Kopi Nako",
    city: "Jakarta",
    price: "$ - $$$",
    time: "09:00 - 23:00",
  },
  {
    id: "8",
    name: "Kopi Nako",
    city: "Jakarta",
    price: "$ - $$$",
    time: "09:00 - 23:00",
  },
];

/**
 * Show list of popular places
 *
 * @returns HomePopularPlaces component
 */
const HomePopularPlaces = (): React.ReactElement => {
  return (
    <div className="px-5 md:px-[139px] mt-12">
      <div className="flex flex-row justify-between mb-5">
        <p className="text-xl text-[#372816] font-medium">Popular Places</p>
        <ChevronRightIcon size={36} color="#372816" />
      </div>
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div className="flex w-max space-x-6">
          {dummyPlaces.map((item) => (
            <PlaceCard
              key={item.id}
              placeName={item.name}
              city={item.city}
              price={item.price}
              time={item.time}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default HomePopularPlaces;
