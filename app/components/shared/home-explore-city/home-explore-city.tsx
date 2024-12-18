import { CityItem } from "./city-item";

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
 */
export const HomeExploreCity = () => {
  return (
    <div className="mt-28 px-5 md:px-[139px]">
      <h4 className="text-center text-4xl font-semibold text-[#372816]">
        Explore Suitable Places on Your City
      </h4>
      <div className="mt-12 grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] justify-items-center">
        {dummyCities.map(item => (
          <CityItem key={item.id} amount={item.amount} city={item.name} />
        ))}
      </div>
    </div>
  );
};
