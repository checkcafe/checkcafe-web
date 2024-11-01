import { Form, useNavigate, useSearchParams } from "@remix-run/react";
import { SearchIcon } from "lucide-react";
import { FormEvent } from "react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { SelectCity } from "./select-city";

export function Searchbar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const query = String(formData.get("q"));
    const city = String(formData.get("city"));

    if (query) searchParams.set("q", query);
    if (city && city !== "null" && city !== "none") {
      searchParams.set("city", city);
    }
    navigate(`/places?${searchParams.toString()}`);
  };
  return (
    <Form onSubmit={handleSubmit} className="hidden w-[40%] gap-2 md:flex">
      <span className="flex h-10 w-full overflow-hidden rounded-md bg-white shadow-lg">
        <Input
          type="search"
          name="q"
          placeholder="Search..."
          defaultValue={searchParams.get("q") || ""}
          className="w-full border-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <SelectCity />
      </span>

      <Button type="submit" className="h-10">
        <SearchIcon className="h-6 w-6 cursor-pointer" />
      </Button>
    </Form>
  );
}
