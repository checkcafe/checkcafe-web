import type { PlaceFacility } from "~/types";

type Props = {
  facility: PlaceFacility;
};

/**
 * Show facility item
 *
 * @param param - props
 * @returns Facility component
 */
export default function Facility({ facility }: Props) {
  return (
    <div key={facility.facility} className="flex flex-row mb-1">
      <p className="text-lg font-normal text-amber-900">
        * {facility.facility} -
      </p>
      <p className="text-lg font-medium text-amber-500">
        {"     "}
        {facility.description}
      </p>
    </div>
  );
}
