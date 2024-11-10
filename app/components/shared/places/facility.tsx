import type { PlaceFacility } from "~/types/model";

/**
 * Show facility item
 */
export function Facility({ facility }: { facility: PlaceFacility }) {
  return (
    <div
      key={facility.facility}
      className="mb-1 flex flex-row text-sm md:text-base"
    >
      <p className="font-normal text-amber-950">* {facility.facility} -</p>
      <p className="font-semibold text-amber-950">
        {"     "}
        {facility.description}
      </p>
    </div>
  );
}
