import { Form } from "@remix-run/react";

import { MagnifyGlassIcon } from "../icons/icons";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function Searchbar() {
  return (
    <>
      <Form method="get" action="/places" className="flex w-[40%] gap-5">
        <span className="flex h-10 w-full rounded-md bg-white shadow-lg">
          <Input
            type="search"
            name="search"
            placeholder="Search..."
            className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {/* <Separator orientation='vertical' className='h-8 self-center' /> */}
        </span>
        <Button type="submit" className="h-10">
          <MagnifyGlassIcon className="h-6 w-6" />
        </Button>
      </Form>
    </>
  );
}
