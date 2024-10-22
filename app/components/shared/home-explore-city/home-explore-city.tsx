import React from "react";

import CityItem from "./city-item";

const dummyCities = [
  {
    id: "1",
    name: "Jakarta",
    amount: 100,
  },
  {
    id: "2",
    name: "Jakarta",
    amount: 100,
  },
  {
    id: "3",
    name: "Jakarta",
    amount: 100,
  },
  {
    id: "4",
    name: "Jakarta",
    amount: 100,
  },
  {
    id: "5",
    name: "Jakarta",
    amount: 100,
  },
  {
    id: "6",
    name: "Jakarta",
    amount: 100,
  },
  {
    id: "7",
    name: "Jakarta",
    amount: 100,
  },
  {
    id: "8",
    name: "Jakarta",
    amount: 100,
  },
];

/**
 * Show Explore Cities section on home page
 *
 * @returns - HomeExploreCity component
 */
const HomeExploreCity = (): React.ReactElement => {
  return (
    <div className="px-5 md:px-[139px] mt-28">
      <h4 className="text-4xl text-[#372816] font-semibold text-center">
        Explore Suitable Places on Your City
      </h4>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] mt-12 justify-items-center">
        {dummyCities.map((item) => (
          <CityItem key={item.id} amount={item.amount} city={item.name} />
        ))}
      </div>
    </div>
  );
};

export default HomeExploreCity;
