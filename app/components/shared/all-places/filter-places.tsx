import { useNavigate, useSearchParams } from "@remix-run/react";
import { FormEvent, useEffect } from "react";

import { Input } from "~/components/ui/input";
import { filterSchema } from "~/schemas/filter";

import SelectHour from "./select-hour";

export default function PlaceFilter() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const hasCityParam = searchParams.has("city");
  const hasFilters =
    searchParams.has("priceFrom") ||
    searchParams.has("priceTo") ||
    searchParams.has("openTime") ||
    searchParams.has("closeTime");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const priceFrom = String(formData.get("priceFrom"));
    const priceTo = String(formData.get("priceTo"));
    const openTime = String(formData.get("openTime"));
    const closeTime = String(formData.get("closeTime"));

    const filterData = {
      priceFrom: priceFrom ? Number(priceFrom) : undefined,
      priceTo: priceTo ? Number(priceTo) : undefined,
      openTime: openTime !== "none" ? openTime : undefined,
      closeTime: closeTime !== "none" ? closeTime : undefined,
    };

    const result = filterSchema.safeParse(filterData);
    if (!result.success) {
      // result.error.errors.forEach(error => {
      //   Toaster({
      //     variant: "destructive",
      //     title: `${error.message}`,
      //   });
      // });
      return null;
    }

    if (priceFrom) searchParams.set("priceFrom", String(priceFrom));
    if (priceTo) searchParams.set("priceTo", String(priceTo));
    if (openTime && openTime !== "none") searchParams.set("openTime", openTime);
    if (closeTime && closeTime !== "none")
      searchParams.set("closeTime", closeTime);

    navigate(`?${searchParams.toString()}`);
  };

  const handleReset = () => {
    searchParams.delete("priceFrom");
    searchParams.delete("priceTo");
    searchParams.delete("openTime");
    searchParams.delete("closeTime");

    navigate(`?${searchParams.toString()}`);
  };

  const formKey = searchParams.toString();

  return (
    <form
      key={formKey}
      onSubmit={handleSubmit}
      className={`flex ${hasCityParam ? "items-end justify-between" : "flex-col gap-4"}`}
    >
      <div className={`flex ${hasCityParam ? "w-1/2" : "flex-col"} gap-4`}>
        {!hasCityParam && <span className="pb-5 font-bold">Filter</span>}
        <span className={`${hasCityParam ? "w-1/2" : ""}`}>
          <p className="font-bold">Price per person</p>
          <span className="flex gap-6">
            <div className="w-1/2">
              <label htmlFor="from">From</label>
              <Input
                placeholder="Min"
                id="from"
                name="priceFrom"
                type="number"
                defaultValue={searchParams.get("priceFrom") || ""}
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="to">To</label>
              <Input
                placeholder="Max"
                id="to"
                name="priceTo"
                type="number"
                defaultValue={searchParams.get("priceTo") || ""}
              />
            </div>
          </span>
        </span>
        <span className={`${hasCityParam ? "w-1/2" : ""}`}>
          <p className="font-bold">Open Hour</p>
          <SelectHour
            defaultOpenTime={searchParams.get("openTime") || ""}
            defaultCloseTime={searchParams.get("closeTime") || ""}
          />
        </span>
      </div>

      <div className={`flex ${hasCityParam ? "" : "justify-between"} gap-5`}>
        <button
          type="submit"
          className="rounded-sm bg-[#372816] px-9 py-2 font-semibold text-white"
        >
          Apply Filter
        </button>

        {hasFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="rounded-sm bg-[#372816] px-9 py-2 font-semibold text-white"
          >
            Reset Filter
          </button>
        )}
      </div>
    </form>
  );
}
