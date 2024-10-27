import { MessageIcon } from "../icons/icons";
import { Input } from "../ui/input";

/**
 * Show input email in home page
 */
export const HomeInputEmail = () => {
  return (
    <div className="mb-12 mt-16 rounded-lg px-5 md:px-[139px]">
      <div className="rounded-lg bg-[#372816] px-16 py-16">
        <div className="flex flex-col gap-20">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-4xl font-semibold text-white">
              Join to our community
            </h2>
            <p className="text-base font-normal text-white">
              Let’s explore and favorite your choice
            </p>
          </div>
          <div className="relative flex w-full justify-center">
            <div className="relative w-full md:w-2/4">
              <Input
                placeholder="example@email.com"
                className="w-full px-4 py-3 pr-12"
                type="email"
              />
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center hover:cursor-pointer hover:opacity-45">
                <MessageIcon className="size-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
