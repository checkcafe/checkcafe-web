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
    } else {
      searchParams.delete("city");
    }
    navigate(`/places?${searchParams.toString()}`);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleValueChange("");
  };

  return (
    <div className="flex h-full w-full items-center px-1">
      <Select value={value} onValueChange={handleValueChange} name="city">
        <SelectTrigger className="rounded-none border-0 border-l border-gray-300 bg-white text-gray-700">
          <SelectValue placeholder="Choose location" />
        </SelectTrigger>
        <SelectContent className="max-h-32 overflow-y-auto">
          <SelectGroup>
            <SelectItem value="none" className="hidden"></SelectItem>
            <SelectItem value="jakarta">Jakarta</SelectItem>
            <SelectItem value="bandung">Bandung</SelectItem>
            <SelectItem value="pontianak">Pontianak</SelectItem>
            <SelectItem value="pontianak">Kuala Lumpur</SelectItem>
            <SelectItem value="pontianak">Singapore</SelectItem>
            <SelectItem value="pontianak">Denpasar</SelectItem>
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
