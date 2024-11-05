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
        className="flex h-[15vh] w-full border border-[#F9D9AA] md:h-[30vh]"
      >
        <img
          src={place.thumbnailUrl || "https://placehold.co/150?text=No%20Image"}
          alt={place.name}
          className="w-36 min-w-36 rounded-l-lg object-cover md:w-64 md:min-w-64"
        />
        <div className="flex w-full flex-col justify-between px-2 md:p-3">
          <CardTitle className="flex justify-between">
            <Link to={`/places/${place.slug}`}>
              <span>
                <h4 className="text-base font-semibold md:text-2xl">
                  {place.name}
                </h4>
                <span className="flex gap-2 text-xs text-slate-400 md:text-sm">
                  <PinIcon className="h-3 w-3 md:h-4 md:w-4" />
                  <p className="self-center text-xs md:flex md:flex-col md:text-sm">
                    <span className="hidden md:flex">
                      {place.address.street},
                    </span>
                    {place.address.city}
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
                  <FaHeart className="h-4 w-4 md:h-8 md:w-8" color="#FF9129" />
                ) : (
                  <BiHeart className="h-4 w-4 md:h-8 md:w-8" />
                )}
              </button>
            </fetcher.Form>
          </CardTitle>
          <CardContent className="items-end p-0">
            <span className="mb-2 flex items-center gap-2 font-bold">
              <FaDollarSign className="h-3 w-3 md:h-4 md:w-4" />
              <p className="text-xs md:text-sm">{`${place.currency} ${formatPrice(parseInt(place.priceRangeMin))}`}</p>
            </span>
            <span className="mb-2 flex items-center gap-2 font-bold">
              <Clock3 className="h-3 w-3 md:h-4 md:w-4" />
              <p className="text-xs md:text-sm">
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
