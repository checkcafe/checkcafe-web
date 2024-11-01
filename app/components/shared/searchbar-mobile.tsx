import { Form } from "@remix-run/react";
import { SearchIcon } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function SearchbarMobile() {
  return (
    <Form method="get" action="/places" className="mb-4 flex w-full gap-2">
      <div className="flex h-10 w-full overflow-hidden rounded-md bg-white shadow-lg">
        <Input
          type="search"
          name="search"
          placeholder="Search..."
          className="w-full border-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        <select
          name="city"
          className="h-full border-l border-gray-300 bg-white px-3 text-gray-700 focus:outline-none"
        >
          <option value="">Choose Location</option>
          <option value="jakarta">Jakarta</option>
          <option value="bandung">Bandung</option>
          <option value="surabaya">Surabaya</option>
        </select>
      </div>

      <Button type="submit" className="h-10">
        <SearchIcon className="h-6 w-6" />
      </Button>
    </Form>
  );
}
