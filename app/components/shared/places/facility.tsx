import type { PlaceFacility } from "~/types";

/**
 * Show facility item
 */
export function Facility({ facility }: { facility: PlaceFacility }) {
  return (
    <div key={facility.facility} className="mb-1 flex flex-row">
      <p className="text-md font-normal text-amber-950">
        * {facility.facility} -
      </p>
      <p className="text-md font-semibold text-amber-950">
        {"     "}
        {facility.description}
      </p>
    </div>
  );
}
