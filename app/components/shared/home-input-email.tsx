import * as React from "react";

import MessageIcon from "../icons/message";
import { Input } from "../ui/input";

/**
 * Show input email in home page
 *
 * @returns HomeInputEmail component
 */
const HomeInputEmail = () => {
  return (
    <div className="px-5 md:px-[139px] mb-12 rounded-lg mt-16">
      <div className="bg-[#372816] rounded-lg py-16 px-16">
        <div className="flex flex-col gap-20">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-white text-4xl font-semibold">
              Join to our community
            </h2>
            <p className="text-white text-base font-normal">
              Let’s explore and favorite your choice
            </p>
          </div>
          <div className="relative w-full flex justify-center">
            <div className="w-full md:w-2/4 relative">
              <Input
                placeholder="example@email.com"
                className="w-full px-4 py-3 pr-12"
                type="email"
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none hover:opacity-45 hover:cursor-pointer">
                <MessageIcon width={20} height={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeInputEmail;
