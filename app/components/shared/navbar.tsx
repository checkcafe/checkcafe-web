import { Link } from "@remix-run/react";
// import { ProfileIcon } from "../icons/icons";
import React from "react";
import { Searchbar } from "./searchbar";
import { Button } from "../ui/button";
import { ProfileIcon } from "../icons/icons";

export function Navbar({ cookie }: { cookie: string }) {
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
        </ul>
        {cookie ? (
          <Link to={"/profile"} className="text-primary self-center">
            <ProfileIcon className="w-10 h-10" />
          </Link>
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
