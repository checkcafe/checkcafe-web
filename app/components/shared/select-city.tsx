import { useNavigate, useSearchParams } from "@remix-run/react";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function SelectCity() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [value, setValue] = useState(searchParams.get("city") || "");

  useEffect(() => {
    setValue(searchParams.get("city") || "");
  }, [searchParams]);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue("");
    if (searchParams.get("city")) {
      searchParams.delete("city");
      navigate(`/places?${searchParams.toString()}`);
    }
  };

  return (
    <div className="flex h-full w-full items-center px-1">
      <Select value={value} onValueChange={setValue} name="city">
        <SelectTrigger className="rounded-none border-0 border-l border-gray-300 bg-white text-gray-700">
          <SelectValue placeholder="Choose location" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="none" className="hidden"></SelectItem>
            <SelectItem value="jakarta">Jakarta</SelectItem>
            <SelectItem value="bandung">Bandung</SelectItem>
            <SelectItem value="pontianak">Pontianak</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <XIcon
        className={`h-4 w-4 cursor-pointer text-gray-500 ${value ? "opacity-100" : "opacity-0"}`}
        onClick={value ? handleClear : undefined}
      />
    </div>
  );
}
