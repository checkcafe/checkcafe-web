import { useNavigate, useSearchParams } from "@remix-run/react";
import { SlidersHorizontal } from "lucide-react";
import { FormEvent, useMemo } from "react";
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

import SelectHour from "../../shared/select-hour";

const FilterInputs = ({ searchParams }: { searchParams: URLSearchParams }) => (
  <div className="flex flex-col gap-4 rounded-lg border border-gray-300 p-4">
    <span>
      <p className="text-lg font-bold">Price per person</p>
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
    <span>
      <p className="text-lg font-bold">Open Hour</p>
      <SelectHour
        defaultOpenTime={searchParams.get("openTime") || ""}
        defaultCloseTime={searchParams.get("closeTime") || ""}
      />
    </span>
  </div>
);

export default function PlaceFilter() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const hasFilters = useMemo(() => {
    return ["priceFrom", "priceTo", "openTime", "closeTime"].some(param =>
      searchParams.has(param),
    );
  }, [searchParams]);

  const activeFilterCount = useMemo(() => {
    return ["priceFrom", "priceTo", "openTime", "closeTime"].filter(param =>
      searchParams.has(param),
    ).length;
  }, [searchParams]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const filterData = {
      priceRangeMin: Number(formData.get("priceFrom") as string) || undefined,
      priceRangeMax: Number(formData.get("priceTo") as string) || undefined,
      openTime:
        formData.get("openTime") !== "none"
          ? (formData.get("openTime") as string)
          : undefined,
      closeTime:
        formData.get("closeTime") !== "none"
          ? (formData.get("closeTime") as string)
          : undefined,
    };

    const result = filterSchema.safeParse(filterData);
    if (!result.success) {
      result.error.errors.forEach(error => {
        toast(error.message);
      });
      return;
    }

    for (const param of ["priceFrom", "priceTo", "openTime", "closeTime"]) {
      const value = formData.get(param) as string;
      if (value) {
        searchParams.set(param, value !== "none" ? value : "");
      } else {
        searchParams.delete(param);
      }
    }

    navigate(`?${searchParams.toString()}`);
  };

  const handleReset = () => {
    ["priceFrom", "priceTo", "openTime", "closeTime"].forEach(param =>
      searchParams.delete(param),
    );
    navigate(`?${searchParams.toString()}`);
  };

  const formKey = searchParams.toString();

  return (
    <>
      {/* Filter for desktop */}
      <form
        key={formKey}
        onSubmit={handleSubmit}
        className="sticky top-32 hidden h-32 flex-col gap-4 md:flex"
      >
        <FilterInputs searchParams={searchParams} />
        <div className="mt-2 flex justify-between gap-4">
          <Button
            className="w-1/2 bg-blue-500 text-white transition-colors duration-200 hover:bg-blue-600"
            type="submit"
          >
            Apply Filter
          </Button>
          {hasFilters && (
            <Button
              className="w-1/2 bg-red-500 text-white transition-colors duration-200 hover:bg-red-600"
              type="button"
              onClick={handleReset}
            >
              Reset Filter
            </Button>
          )}
        </div>
      </form>

      {/* Filter for Mobile */}
      <Sheet key="bottom">
        <SheetTrigger asChild>
          <div className="relative">
            {activeFilterCount > 0 && (
              <div className="absolute right-[-3px] top-[-3px] flex h-4 w-4 items-center justify-center rounded-full bg-black text-xs text-white md:hidden">
                {activeFilterCount}
              </div>
            )}
            <Button
              className={`${
                activeFilterCount ? "border-2 border-black font-semibold" : ""
              } bg-gray-200 text-black transition-colors duration-200 hover:bg-gray-300 md:hidden`}
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
            <SheetTitle className="text-start text-lg font-semibold">
              FILTERS
            </SheetTitle>
          </SheetHeader>
          <form
            key={formKey}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 p-4"
          >
            <FilterInputs searchParams={searchParams} />
            <div className="mt-2 flex w-full justify-between gap-4">
              <Button
                className="w-1/2 bg-blue-500 text-white transition-colors duration-200 hover:bg-blue-600"
                type="submit"
              >
                Apply Filter
              </Button>
              {hasFilters && (
                <Button
                  className="w-1/2 bg-red-500 text-white transition-colors duration-200 hover:bg-red-600"
                  type="button"
                  onClick={handleReset}
                >
                  Reset Filter
                </Button>
              )}
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
