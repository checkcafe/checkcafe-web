import { Clock } from "lucide-react";
import React from "react";

import PriceTagIcon from "~/components/icons/price-tag";
import { Card, CardContent } from "~/components/ui/card";

type Props = {
  placeName: string;
  city: string;
  price: string;
  time: string;
};

type FacilityItemProps = {
  icon: React.ReactElement;
  title: string;
};

/**
 * Facility Item with icon and value
 * @param props - props
 * @returns Facility Item component
 */
const renderFacilityItem = (props: FacilityItemProps): React.ReactElement => (
  <div className="flex flex-row gap-2 items-center">
    {props.icon}
    <p className="text-xs text-[#372816] font-normal">{props.title}</p>
  </div>
);

/**
 * Card for place item
 * @param props - props
 * @returns PlaceCard component
 */
const PlaceCard = (props: Props): React.ReactElement => {
  const { placeName, city, price, time } = props;

  return (
    <Card className="shadow-lg h-80 w-56 hover:opacity-50 hover:cursor-pointer">
      <CardContent className="flex flex-col px-5 py-5">
        <img
          src="https://assets-pergikuliner.com/an832QRg3dvUvMG-K4ItyoTh3Do=/312x0/smart/https://assets-pergikuliner.com/uploads/image/picture/2932909/picture-1685879331.JPG"
          alt="cafe-image"
          className="rounded-md rounded-b-none h-40 w-full"
        />
        <div className="flex flex-col justify-between gap-4 mt-2">
          <div className="flex flex-col">
            <p className="text-base text-[#372816] font-medium">{placeName}</p>
            <p className="text-base text-[#9BA0A7] font-normal">{city}</p>
          </div>
          <div className="flex flex-col gap-1">
            {renderFacilityItem({
              icon: <PriceTagIcon width={20} height={20} />,
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
