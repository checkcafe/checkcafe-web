/* eslint-disable react/display-name */

import { Link, useFetcher, useSearchParams } from "@remix-run/react";
import { Clock3 } from "lucide-react";
import React, { forwardRef } from "react";
import { BiHeart } from "react-icons/bi";
import { FaDollarSign, FaHeart } from "react-icons/fa6";

import { PinIcon } from "~/components/icons/icons";
import { Card, CardContent, CardTitle } from "~/components/ui/card";
import { PlaceItem } from "~/types/model";
import { formatPrice, formatTime } from "~/utils/formatter";

interface PlaceCardProps {
  place: PlaceItem;
  ref: React.Ref<HTMLDivElement>;
  isFavorite: boolean;
  favoriteId: string | null;
}

const AllPlaceCard = forwardRef<HTMLDivElement, PlaceCardProps>(
  ({ place, isFavorite, favoriteId }, ref) => {
    const fetcher = useFetcher();
    const [searchParams] = useSearchParams();

    const favorite = fetcher.formData
      ? fetcher.formData.get("favorite") === "true"
      : isFavorite;

    const method = isFavorite ? "delete" : "post";

    return (
      <Card
        ref={ref}
        key={place.id}
        className="flex h-[30vh] w-full border border-[#F9D9AA]"
      >
        <img
          src={place.thumbnailUrl || "https://placehold.co/150?text=No%20Image"}
          alt={place.name}
          className="w-64 min-w-64 rounded-l-lg object-cover"
        />
        <div className="flex w-full flex-col justify-between p-3">
          <CardTitle className="flex justify-between">
            <Link to={`/places/${place.slug}`}>
              <span>
                <h4 className="text-2xl font-semibold">{place.name}</h4>
                <span className="flex gap-2 text-sm text-slate-400">
                  <PinIcon className="h-4 w-4" />
                  <p className="self-center text-sm">
                    {place.address.street}, {place.address.city}
                  </p>
                </span>
              </span>
            </Link>
            <fetcher.Form
              method={method}
              action={`/places?${searchParams.toString()}`}
              preventScrollReset={true}
            >
              <input type="hidden" name="placeId" value={place.id} />
              <input type="hidden" name="favoriteId" value={favoriteId || ""} />
              <button
                type="submit"
                name="favorite"
                value={favorite ? "false" : "true"}
                className="cursor-pointer"
              >
                {favorite ? (
                  <FaHeart className="h-8 w-8" color="#FF9129" />
                ) : (
                  <BiHeart className="h-8 w-8" />
                )}
              </button>
            </fetcher.Form>
          </CardTitle>
          <CardContent className="items-end p-0">
            <p className="font-bold">{place.description}</p>
            <span className="mb-2 flex items-center gap-4 font-bold">
              <FaDollarSign className="h-4 w-4" />
              <p className="text-sm">{`${place.currency} ${formatPrice(parseInt(place.priceRangeMin))}`}</p>
            </span>
            <span className="mb-2 flex items-center gap-4 font-bold">
              <Clock3 className="h-4 w-4" />
              <p className="text-sm">
                {`${formatTime(place.openingTime)} - ${formatTime(place.closingTime)}`}
              </p>
            </span>
          </CardContent>
        </div>
      </Card>
    );
  },
);

export default AllPlaceCard;
