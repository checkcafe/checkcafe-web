import { Link } from "@remix-run/react";

import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Searchbar } from "./searchbar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";

export function Navbar({ user }: { user: any }) {
  return (
    <nav className="sticky top-0 z-50 m-0 flex w-full justify-between bg-amber-50 p-8">
      <div className="flex-col gap-4 md:flex">
        <Link to={"/"}>
          <h2 className="font-brand text-3xl tracking-tight text-gray-900">
            ☕ CheckCafe
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
         
            {user && user.name ? (
              <>
              
              <Popover >
                <PopoverTrigger asChild>
                <span className="flex cursor-pointer items-center justify-center rounded-full bg-primary p-1">
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="h-8 w-8 rounded-full"
                      />
                    </span>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-amber-50">
                <div className="grid gap-4 font-semibold">
                    <span
                      className="flex gap-2 self-center text-primary justify-center "
                    >
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="h-8 w-8 rounded-full"
                      />
                      <p className="self-center ">{user.name}</p>
                    </span>
                    <Separator orientation="horizontal"/>
                    <Link to={`${user.username}`}
                    className="text-primary hover:bg-slate-100 p-2 rounded-md">
                      Profile
                      </Link>
                    <Button asChild className="w-full self-center text-white">
                      <Link to={"/logout"}>Logout</Link>
                    </Button>
        </div>
      </PopoverContent>
    </Popover>
              
              </>
            ) : (
              <Button asChild>
                <Link to={"/login"} className="self-center text-primary">
                  Login
                </Link>
              </Button>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
