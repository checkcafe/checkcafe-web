/**
 * Show City Item with information about city name and places amount
 */
export const CityItem = ({
  amount,
  city,
}: {
  city: string;
  amount: number;
}) => {
  return (
    <div className="mb-14 hover:cursor-pointer hover:opacity-50">
      <div className="relative h-60 w-60 rounded-md">
        <img
          src="https://assets-a1.kompasiana.com/items/album/2023/07/04/dki-jakarta-64a3f1afe1a16755f62bb802.jpg"
          alt="image-city"
          className="h-60 w-60 rounded-md"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-md bg-black bg-opacity-30">
          <span className="text-4xl font-semibold text-white">{city}</span>
          <span className="text-xl font-normal text-white">
            {amount} places
          </span>
        </div>
      </div>
    </div>
  );
};
