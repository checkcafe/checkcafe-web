import { useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Input } from "~/components/ui/input";

import SelectHour from "./select-hour";

export default function PlaceFilter() {
  const priceFromRef = useRef<HTMLInputElement | null>(null);
  const priceToRef = useRef<HTMLInputElement | null>(null);
  const openTimeRef = useRef<HTMLSelectElement | null>(null);
  const closeTimeRef = useRef<HTMLSelectElement | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const hasCityParam = searchParams.has("city");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceFrom = priceFromRef.current?.value || "";
    const priceTo = priceToRef.current?.value || "";
    const openTime = openTimeRef.current?.value || "";
    const closeTime = closeTimeRef.current?.value || "";

    const queryParts: string[] = [];

    if (priceFrom) queryParts.push(`priceFrom=${priceFrom}`);
    if (priceTo) queryParts.push(`priceTo=${priceTo}`);
    if (openTime) queryParts.push(`openTime=${openTime}`);
    if (closeTime) queryParts.push(`closeTime=${closeTime}`);

    const queryString = queryParts.join("&");

    navigate(`/places?${queryString}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex ${hasCityParam ? "items-end justify-between" : "flex-col gap-4"} pr-[8px]`}
    >
      <div className={`flex ${hasCityParam ? "w-1/2" : "flex-col"} gap-4`}>
        {!hasCityParam && <span className="pb-5 font-bold">Filter</span>}
        <span className={`${hasCityParam ? "w-1/2" : ""}`}>
          <p className="font-bold">Price per person</p>
          <span className="flex gap-6">
            <div className="w-1/2">
              <label htmlFor="from">From</label>
              <Input
                placeholder="50.000"
                id="from"
                name="PriceFrom"
                type="number"
                ref={priceFromRef}
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="to">To</label>
              <Input
                placeholder="100.000"
                id="to"
                name="PriceTo"
                type="number"
                ref={priceToRef}
              />
            </div>
          </span>
        </span>
        <span className={`${hasCityParam ? "w-1/2" : ""}`}>
          <p className="font-bold">Open Hour</p>
          <SelectHour openTimeRef={openTimeRef} closeTimeRef={closeTimeRef} />
        </span>
      </div>

      <button
        type="submit"
        className="rounded-sm bg-[#372816] px-10 py-2 font-semibold text-white"
      >
        Apply
      </button>
    </form>
  );
}
