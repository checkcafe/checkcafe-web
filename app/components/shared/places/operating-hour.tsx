import type { OperatingHour } from "~/types/model";
import { formatTime } from "~/utils/formatter";

/**
 * Show operating hour item
 */
export function OperatingHourItem({
  operatingHour,
}: {
  operatingHour: OperatingHour;
}) {
  return (
    <div className="flex w-72 flex-row justify-between text-amber-950">
      <p>{operatingHour.day}</p>
      <div className="flex flex-row">
        <p>{formatTime(operatingHour.openingTime)}</p>
        <p className="mx-2">-</p>
        <p>{formatTime(operatingHour.closingTime)}</p>
      </div>
    </div>
  );
}
