type Props = {
  city: string;
  amount: number;
};

/**
 * Show City Item with information about city name and places amount
 *
 * @param props - props
 * @returns CityItem component
 */
const CityItem = (props: Props): React.ReactElement => {
  const { amount, city } = props;

  return (
    <div className="mb-14 hover:opacity-50 hover:cursor-pointer">
      <div className="relative rounded-md h-60 w-60">
        <img
          src="https://assets-a1.kompasiana.com/items/album/2023/07/04/dki-jakarta-64a3f1afe1a16755f62bb802.jpg"
          alt="image-city"
          className="w-60 h-60 rounded-md"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center rounded-md">
          <span className="text-white text-4xl font-semibold">{city}</span>
          <span className="text-white text-xl font-normal">
            {amount} places
          </span>
        </div>
      </div>
    </div>
  );
};

export default CityItem;
