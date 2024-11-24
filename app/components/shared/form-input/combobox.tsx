"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { City } from "~/types/model";

type ComboboxProps = {
  cities: City[];
  setCityId: (value: string) => void;
  cityId: string;
};
export function Combobox({ cities, setCityId, cityId }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  function getIdByName(name: string) {
    const city = cities.find(city => city.name === name);
    return city ? city.id : "";
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {cityId
            ? cities.find(city => city.id === cityId)?.name
            : "Select city..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search City..." />
          <CommandList>
            <CommandEmpty>No city found.</CommandEmpty>
            <CommandGroup>
              {cities.map(city => (
                <CommandItem
                  key={city.id}
                  value={city.name}
                  onSelect={currentValue => {
                    setCityId(
                      currentValue === city.name
                        ? getIdByName(currentValue)
                        : "",
                    );
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      cityId === city.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {city.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
