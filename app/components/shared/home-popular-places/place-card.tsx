import { Clock } from "lucide-react";

import { PriceTagIcon } from "~/components/icons/icons";
import { Card, CardContent } from "~/components/ui/card";

type Props = {
  placeName: string;
  city: string;
  price: string;
  time: string;
};

type FacilityItemProps = {
  icon: React.ReactNode;
  title: string;
};

/**
 * Facility Item with icon and value
 */
const renderFacilityItem = (props: FacilityItemProps) => (
  <div className="flex flex-row items-center gap-2">
    {props.icon}
    <p className="text-xs font-normal text-[#372816]">{props.title}</p>
  </div>
);

/**
 * Card for place item
 * @param props - props
 * @returns PlaceCard component
 */
const PlaceCard = (props: Props) => {
  const { placeName, city, price, time } = props;

  return (
    <Card className="h-80 w-56 shadow-lg hover:cursor-pointer hover:opacity-50">
      <CardContent className="flex flex-col px-5 py-5">
        <img
          src="https://assets-pergikuliner.com/an832QRg3dvUvMG-K4ItyoTh3Do=/312x0/smart/https://assets-pergikuliner.com/uploads/image/picture/2932909/picture-1685879331.JPG"
          alt="cafe-image"
          className="h-40 w-full rounded-md rounded-b-none"
        />
        <div className="mt-2 flex flex-col justify-between gap-4">
          <div className="flex flex-col">
            <p className="text-base font-medium text-[#372816]">{placeName}</p>
            <p className="text-base font-normal text-[#9BA0A7]">{city}</p>
          </div>
          <div className="flex flex-col gap-1">
            {renderFacilityItem({
              icon: <PriceTagIcon className="size-5" />,
              title: price,
            })}
            {renderFacilityItem({
              icon: <Clock size={20} />,
              title: time,
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlaceCard;
