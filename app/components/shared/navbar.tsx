import { Form, Link } from "@remix-run/react";
// import { ProfileIcon } from "../icons/icons";
import { Searchbar } from "./searchbar";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { UserIcon } from "lucide-react";
import { CookiesType } from "./app-layout";

import { ProfileIcon } from "../icons/icons";

export function Navbar({ cookie }: { cookie: CookiesType | null }) {
  return (
    <nav className="sticky top-0 z-50 m-0 flex w-full justify-between bg-amber-50 p-8">
      <div className="flex-col gap-4 md:flex">
        <Link to={"/"}>
          <h2 className="font-brand text-3xl tracking-tight text-gray-900">
            ☕CheckCafe
          </h2>
        </Link>
      </div>

      <Searchbar />

      <div className="mt-12 flex gap-4 md:mt-0">
        <ul className="flex items-center gap-8 self-center text-base font-semibold">
          <li>
            <Link to={"/places"} className="text-primary">
              Places
            </Link>
          </li>
          <li>
            <Link to={"/about"} className="text-primary">
              About
            </Link>
          </li>
          <li>
            {!cookie && (
              <Button asChild>
                <Link to={"/login"} className="self-center text-primary">
                  Login
                </Link>
              </Button>
            )}
            {cookie && (
              <Link to={"/profile"} className="self-center text-primary">
                <ProfileIcon className="h-10 w-10" />
              </Link>
            )}
          </li>
        </ul>
        {cookie?.accessToken ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="bg-primary rounded-full p-1 flex items-center justify-center cursor-pointer">
                  <UserIcon className=" w-8 h-8 text-white" />
                </span>
              </TooltipTrigger>
              <TooltipContent className="flex flex-col gap-4">
                <Link
                  to={"/profile"}
                  className="text-primary self-center hover:transform hover:scale-110 "
                >
                  Profile Account
                </Link>
                <Link
                  to={"/dashboard"}
                  className="text-primary self-center  hover:transform hover:scale-110 "
                >
                  Dashboard
                </Link>
                <Form method="post">
                  <input type="hidden" name="action" value="logout" />{" "}
                  <Button type="submit" className=" self-center text-white">
                    Logout
                  </Button>
                </Form>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button asChild>
            <Link to={"/login"} className="text-primary self-center">
              Login
            </Link>
          </Button>
        )}
      </div>
    </nav>
  );
}
