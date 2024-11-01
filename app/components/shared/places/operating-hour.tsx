import type { OperatingHour } from "~/types";

/**
 * Show operating hour item
 */
export function OperatingHourItem({
  operatingHour,
}: {
  operatingHour: OperatingHour;
}) {
  return (
    <div className="flex w-60 flex-row justify-between">
      <p>{operatingHour.day}</p>
      <div className="flex w-60 flex-row justify-between text-amber-950">
        <p>{operatingHour.start} - </p>
        <p>{operatingHour.end}</p>
      </div>
    </div>
  );
}
