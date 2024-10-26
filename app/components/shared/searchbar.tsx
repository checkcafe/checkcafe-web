import { Form } from "@remix-run/react";

import { MagnifyGlassIcon } from "../icons/icons";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function Searchbar() {
  return (
    <>
      <Form method="get" action="/places" className="w-[40%] flex gap-5">
        <span className="flex w-full bg-white shadow-lg rounded-md h-10">
          <Input
            type="search"
            name="search"
            placeholder="Search..."
            className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 "
          />
          {/* <Separator orientation='vertical' className='h-8 self-center' /> */}
        </span>
        <Button type="submit" className="h-10">
          <MagnifyGlassIcon className="w-6 h-6" />
        </Button>
      </Form>
    </>
  );
}
