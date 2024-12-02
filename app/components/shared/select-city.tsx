import { useNavigate, useSearchParams } from "@remix-run/react";
import { XIcon } from "lucide-react";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export function SelectCity() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCityValue = searchParams.get("city") || "";
  const [value, setValue] = useState(initialCityValue);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    if (newValue) {
      searchParams.set("city", newValue);
      searchParams.delete("limit");
    } else {
      searchParams.delete("city");
    }
    navigate(`/places?${searchParams.toString()}`);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleValueChange("");
  };

  const cities = [
    {
      id: 1,
      value: "Jakarta",
    },
    {
      id: 2,
      value: "Bandung",
    },
    {
      id: 3,
      value: "Pontianak",
    },
    {
      id: 4,
      value: "Kuala Lumpur",
    },
    {
      id: 5,
      value: "Singapore",
    },
    {
      id: 6,
      value: "Denpasar",
    },
  ];
  const sortedCities = cities.sort((a, b) => a.value.localeCompare(b.value));

  return (
    <div className="flex h-full w-full items-center px-1">
      <Select value={value} onValueChange={handleValueChange} name="city">
        <SelectTrigger className="rounded-none border-0 border-l border-gray-300 bg-white text-gray-700">
          <SelectValue placeholder="Choose location" />
        </SelectTrigger>
        <SelectContent className="max-h-32 overflow-y-auto md:max-h-none md:overflow-visible">
          <SelectGroup>
            <SelectItem value="none" className="hidden"></SelectItem>
            {sortedCities.map(item => (
              <SelectItem key={item.id} value={item.value}>
                {item.value}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {value && (
        <XIcon
          className="mr-2 h-4 w-4 cursor-pointer text-gray-500"
          onClick={handleClear}
        />
      )}
    </div>
  );
}
