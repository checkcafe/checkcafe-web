import { Input } from "~/components/ui/input";

export default function PlaceFilter() {
  return (
    <form
      method="get"
      action="/places"
      className="flex items-end justify-between pr-[8px]"
    >
      <div className="flex w-1/2 gap-4">
        <span>
          <p className="font-bold">Price per person</p>
          <span className="flex gap-6">
            <div className="w-1/2">
              <label htmlFor="from">From</label>
              <Input
                placeholder="Rp 50.000"
                id="from"
                name="PriceFrom"
                type="number"
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="to">To</label>
              <Input
                placeholder="Rp 100.000"
                id="to"
                name="PriceTo"
                type="number"
              />
            </div>
          </span>
        </span>
        <span>
          <p className="font-bold">Open Hour</p>
          <span className="flex gap-6">
            <div className="w-1/2">
              <label htmlFor="openingTimeFrom">From</label>
              <Input
                placeholder="09:00"
                id="openingTimeFrom"
                name="openingTimeFrom"
                type="number"
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="closingTimeTo">To</label>
              <Input
                placeholder="22:00"
                id="closingTimeTo"
                name="closingTimeTo"
                type="number"
              />
            </div>
          </span>
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
