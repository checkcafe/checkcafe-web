import { Form, Link } from "@remix-run/react";
// import { ProfileIcon } from "../icons/icons";
import React from "react";
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

export function Navbar({ cookie }: { cookie: CookiesType | null }) {
  return (
    <nav className=" sticky top-0  w-full flex m-0 justify-between p-8 z-50 bg-background ">
      <div className="md:flex flex-col gap-4">
        <Link to={"/"}>
          <h2 className="text-3xl font-jacques  tracking-tight text-gray-900">
            ☕CheckCafe
          </h2>
        </Link>
      </div>
      <Searchbar />
      <div className="mt-12 md:mt-0 flex gap-4">
        <ul className="flex gap-8 font-semibold text-base self-center ">
          {/* <li>
            <Link to={"/contribute"} className='text-primary'>
              Contribute
            </Link>
          </li> */}
          <li>
            <Link to={"/about"} className="text-primary">
              About
            </Link>
          </li>
          <li>
            <Link to={"/favourite"} className="text-primary">
              Favourite
            </Link>
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
