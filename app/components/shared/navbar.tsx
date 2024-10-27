import { Link } from "@remix-run/react";

import { ProfileIcon } from "../icons/icons";
import { Button } from "../ui/button";
import { Searchbar } from "./searchbar";

export function Navbar({ cookie }: { cookie: string }) {
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
      </div>
    </nav>
  );
}
