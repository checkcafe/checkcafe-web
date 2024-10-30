import { Form } from "@remix-run/react";
import { Clock3 } from "lucide-react";
import React, { forwardRef } from "react";

import { LoveIcon, PinIcon, PriceTagIcon } from "~/components/icons/icons";
import { Card, CardContent, CardTitle } from "~/components/ui/card";
import { PlaceItem } from "~/types";
import { formatPrice } from "~/utils/formatter";

interface PlaceCardProps {
  place: PlaceItem;
  ref: React.Ref<HTMLDivElement>;
  isFavorite: boolean;
}

const AllPlaceCard = forwardRef<HTMLDivElement, PlaceCardProps>(
  ({ place, isFavorite }, ref) => (
    <Card
      ref={ref}
      key={place.id}
      className="flex h-[30vh] w-full border border-[#F9D9AA]"
    >
      <img
        src={place.thumbnail || "https://placehold.co/150?text=No%20Image"}
        alt={place.name}
        className="w-full min-w-96 max-w-96 rounded-l-lg object-cover"
      />
      <div className="flex w-full flex-col justify-between p-3">
        <CardTitle className="flex justify-between">
          <span>
            <h4 className="text-2xl font-semibold">{place.name}</h4>
            <span className="flex gap-2 text-sm text-slate-400">
              <PinIcon className="h-4 w-4" />
              <p className="self-center text-sm">
                {place.address.street}, {place.address.city}
              </p>
            </span>
          </span>
          <Form method="post" action="/places">
            <input type="hidden" name="placeId" value={place.id} />
            <button type="submit" className="cursor-pointer">
              <LoveIcon fills={isFavorite ? "red" : "#372816"} />
            </button>
          </Form>
        </CardTitle>
        <CardContent className="items-end p-0">
          <p className="font-bold">{place.description}</p>
          <span className="mb-2 flex items-center gap-4 font-bold">
            <PriceTagIcon className="h-4 w-4" />
            <p className="text-sm">{`${place.currency} ${formatPrice(parseInt(place.priceRange))}`}</p>
          </span>
          <span className="mb-2 flex items-center gap-4 font-bold">
            <Clock3 className="h-4 w-4" />
            <p className="text-sm">
              {place.openingTime} - {place.closingTime}
            </p>
          </span>
        </CardContent>
      </div>
    </Card>
  ),
);

export default AllPlaceCard;
