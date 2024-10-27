type NearbyPlace = {
  name: string;
  image: string;
  latitude: number;
  longitude: number;
};
type Props = {
  place: NearbyPlace;
};

/**
 * Show nearby place item
 *
 * @param props - props
 * @returns NearbyPlace component
 */
export default function NearbyPlace({ place }: Props) {
  return (
    <div className="flex flex-col mr-7">
      <h3 className="text-lg font-normal text-amber-900 mb-2">{place.name}</h3>
      <div>
        <img
          src={place.image}
          alt="Nearby Place"
          className="w-56 h-56 rounded-md"
        />
      </div>
    </div>
  );
}
