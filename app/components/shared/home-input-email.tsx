import { Form } from "@remix-run/react";

import { MessageIcon } from "../icons/icons";
import { Input } from "../ui/input";

export const HomeInputEmail = () => {
  return (
    <div className="mb-12 mt-16 px-4 sm:px-6 lg:px-[139px]">
      <div className="rounded-lg bg-[#372816] p-8 sm:p-12 lg:p-16">
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-center text-3xl font-semibold text-white md:text-4xl">
            Join our community
          </h2>
          <p className="text-center text-base font-normal text-white">
            Let’s explore and favorite your choice
          </p>
          <Form
            method="get"
            className="relative flex w-full justify-center"
            action="/register"
          >
            <div className="relative w-full max-w-md">
              <Input
                type="email"
                name="email"
                placeholder="example@email.com"
                className="w-full rounded-md border border-gray-300 px-4 py-3 pr-12 transition-colors"
                required
              />
              <div className="absolute inset-y-0 right-3 flex items-center">
                <MessageIcon className="size-5 text-white" />
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};
