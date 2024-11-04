import { useNavigate, useSearchParams } from "@remix-run/react";
import { SlidersHorizontal } from "lucide-react";
import { FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { filterSchema } from "~/schemas/filter";

import SelectHour from "./select-hour";

export default function PlaceFilter() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const hasFilters =
    searchParams.has("priceFrom") ||
    searchParams.has("priceTo") ||
    searchParams.has("openTime") ||
    searchParams.has("closeTime");

  const getActiveFilterCount = () => {
    let count = 0;

    if (searchParams.has("priceFrom") || searchParams.has("priceTo")) count++;

    if (searchParams.has("openTime") || searchParams.has("closeTime")) count++;

    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const priceFrom = String(formData.get("priceFrom"));
    const priceTo = String(formData.get("priceTo"));
    const openTime = String(formData.get("openTime"));
    const closeTime = String(formData.get("closeTime"));

    const filterData = {
      priceRangeMin: priceFrom ? Number(priceFrom) : undefined,
      priceRangeMax: priceTo ? Number(priceTo) : undefined,
      openTime: openTime !== "none" ? openTime : undefined,
      closeTime: closeTime !== "none" ? closeTime : undefined,
    };

    const result = filterSchema.safeParse(filterData);
    if (!result.success) {
      result.error.errors.forEach(error => {
        toast(error.message);
      });
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
    <>
      {/* Filter for desktop */}
      <form
        key={formKey}
        onSubmit={handleSubmit}
        className={`sticky top-32 hidden h-32 flex-col gap-4 md:flex`}
      >
        <div className={`flex flex-col gap-4`}>
          <span className={``}>
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
          <span className={``}>
            <p className="font-bold">Open Hour</p>
            <SelectHour
              defaultOpenTime={searchParams.get("openTime") || ""}
              defaultCloseTime={searchParams.get("closeTime") || ""}
            />
          </span>
        </div>

        <div className={`flex justify-between gap-5`}>
          <Button className="w-1/2" type="submit">
            Apply Filter
          </Button>

          {hasFilters && (
            <Button className="w-1/2" type="button" onClick={handleReset}>
              Reset Filter
            </Button>
          )}
        </div>
      </form>

      {/* Filter for Mobile */}
      <div className="sticky top-20 z-40 flex w-full gap-2 bg-white py-2 md:hidden">
        <Sheet key="bottom">
          <SheetTrigger asChild>
            <div className="relative">
              {activeFilterCount > 0 && (
                <div className="absolute right-[-3px] top-[-3px] flex h-4 w-4 items-center justify-center rounded-full bg-black text-xs text-white">
                  {activeFilterCount}
                </div>
              )}
              <Button
                className={`${activeFilterCount ? "border-2 border-black font-semibold" : ""}`}
                variant="outline"
              >
                FILTER
                <span>
                  <SlidersHorizontal />
                </span>
              </Button>
            </div>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-full">
            <SheetHeader>
              <SheetTitle className="text- text-start font-semibold">
                FILTERS
              </SheetTitle>
            </SheetHeader>
            <form
              key={formKey}
              onSubmit={handleSubmit}
              className={`flex flex-col gap-4`}
            >
              <div className={`flex flex-col gap-4`}>
                <span className={``}>
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
                <span className={``}>
                  <p className="font-bold">Open Hour</p>
                  <SelectHour
                    defaultOpenTime={searchParams.get("openTime") || ""}
                    defaultCloseTime={searchParams.get("closeTime") || ""}
                  />
                </span>
              </div>

              <div className={`flex w-full justify-between gap-5`}>
                <Button className="w-1/2" type="submit">
                  Apply Filter
                </Button>

                {hasFilters && (
                  <Button className="w-1/2" type="button" onClick={handleReset}>
                    Reset Filter
                  </Button>
                )}
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
