type NearbyPlace = {
  name: string;
  image: string;
  latitude: number;
  longitude: number;
};

/**
 * Show nearby place item
 */
export function NearbyPlace({ place }: { place: NearbyPlace }) {
  return (
    <div className="mr-7 flex flex-col">
      <h3 className="mb-2 text-lg font-normal text-amber-900">{place.name}</h3>
      <div>
        <img
          src={place.image}
          alt="Nearby Place"
          className="h-56 w-56 rounded-md"
        />
      </div>
    </div>
  );
}
