import type { PlaceFacility } from "~/types";

/**
 * Show facility item
 */
export function Facility({ facility }: { facility: PlaceFacility }) {
  return (
    <div key={facility.facility} className="mb-1 flex flex-row">
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
