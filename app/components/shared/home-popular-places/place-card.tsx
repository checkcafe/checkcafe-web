import { Clock } from "lucide-react";

import { PriceTagIcon } from "~/components/icons/icons";
import { Card, CardContent } from "~/components/ui/card";

export const PlaceCard = ({
  image,
  name,
  city,
  price,
  time,
}: {
  image?: string;
  name: React.ReactNode;
  city: string;
  price?: string;
  time: string | null;
}) => {
  return (
    <Card className="h-80 w-56 shadow-lg hover:cursor-pointer hover:opacity-50">
      <CardContent className="flex flex-col px-5 py-5">
        <img
          src={image || "https://placehold.co/150?text=No%20Image"}
          alt="cafe-image"
          className="h-40 w-full rounded-md rounded-b-none object-cover"
        />
        <div className="mt-2 flex flex-col justify-between gap-4">
          <div className="flex flex-col">
            <p className="text-base font-medium text-[#372816]">{name}</p>
            <p className="text-base font-normal text-[#9BA0A7]">{city}</p>
          </div>
          <div className="flex flex-col gap-1">
            <FacilityItem
              icon={<PriceTagIcon className="size-5" />}
              title={price || "-"}
            />
            <FacilityItem icon={<Clock size={20} />} title={time || "-"} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const FacilityItem = ({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) => (
  <div className="flex flex-row items-center gap-2">
    {icon}
    <p className="text-xs font-normal text-[#372816]">{title}</p>
  </div>
);
