import type { OperatingHour as OperatingHourType } from "~/types";

type Props = {
  operatingHour: OperatingHourType;
};

/**
 * Show operating hour item
 *
 * @param props - props
 * @returns OperatingHour component
 */
export default function OperatingHour({ operatingHour }: Props) {
  return (
    <div className="flex flex-row w-60 justify-between">
      <p>{operatingHour.day}</p>
      <div className="flex flex-row">
        <p>{operatingHour.start} - </p>
        <p>{operatingHour.end}</p>
      </div>
    </div>
  );
}
