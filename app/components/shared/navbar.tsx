import { Form, Link, useLocation } from "@remix-run/react";
import { MenuIcon, SearchIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export function Navbar({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isOpen) setIsOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <nav className="sticky top-0 z-50 flex w-full items-center justify-between bg-amber-50 p-4 md:p-8">
      <div className="flex items-center">
        <Link to="/">
          <h2 className="font-brand text-2xl tracking-tight text-gray-900 md:text-3xl">
            ☕ CheckCafe
          </h2>
        </Link>
      </div>

      <Form
        method="get"
        action="/places"
        className="hidden w-[40%] gap-2 md:flex"
      >
        <span className="flex h-10 w-full rounded-md bg-white shadow-lg">
          <Input
            type="search"
            name="search"
            placeholder="Search..."
            className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </span>
        <Button type="submit" className="h-10">
          <SearchIcon className="h-6 w-6" />
        </Button>
      </Form>

      <div className="flex items-center gap-4 md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="text-primary">
          {isOpen ? (
            <XIcon className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      <div className="hidden items-center gap-8 text-base font-semibold md:flex">
        <Link to="/places" className="text-primary">
          Places
        </Link>
        <Link to="/about" className="text-primary">
          About
        </Link>

        {user && user.name ? (
          <>
            <Button className="border-2 border-slate-700 bg-transparent text-slate-700 hover:bg-transparent">
              <Link to="/new">Add Places</Link>
            </Button>{" "}
            <Popover>
              <PopoverTrigger asChild>
                <span className="flex cursor-pointer items-center justify-center rounded-full bg-primary p-1">
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="h-8 w-8 rounded-full"
                  />
                </span>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                side="bottom"
                className="w-48 bg-amber-50 shadow-lg"
              >
                <div className="grid gap-2 font-semibold">
                  <Link
                    to={`/${user.username}`}
                    className="p-2 text-primary hover:rounded-md hover:bg-slate-100"
                  >
                    Profile
                  </Link>
                  <Button asChild className="w-full text-white">
                    <Link to="/logout">Logout</Link>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </>
        ) : (
          <Button asChild>
            <Link to="/login" className="text-primary">
              Login
            </Link>
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="absolute left-0 top-16 w-full bg-amber-50 p-4 shadow-lg lg:hidden">
          <Form
            method="get"
            action="/places"
            className="mb-4 flex w-full gap-2"
          >
            <Input
              type="search"
              name="search"
              placeholder="Search..."
              className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button type="submit" className="h-10">
              <SearchIcon className="h-6 w-6" />
            </Button>
          </Form>

          <div className="flex w-full flex-col gap-1 text-primary">
            <Link
              to="/about"
              className="w-full rounded-md py-2 pl-4 text-left hover:bg-slate-100"
            >
              About
            </Link>
            <Link
              to="/places"
              className="w-full rounded-md py-2 pl-4 text-left hover:bg-slate-100"
            >
              Places
            </Link>

            {user && user.name ? (
              <div className="flex flex-col gap-1">
                <Link
                  to={`/${user.username}`}
                  className="w-full rounded-md py-2 pl-4 text-left text-primary hover:bg-slate-100"
                >
                  Profile
                </Link>
                <Button asChild className="mt-2 w-full text-left">
                  <Link
                    to="/logout"
                    className="w-full rounded-md py-2 pl-4 text-primary hover:bg-slate-100"
                  >
                    Logout
                  </Link>
                </Button>
              </div>
            ) : (
              <Button asChild>
                <Link
                  to="/login"
                  className="w-full rounded-md py-2 pl-4 text-left text-primary"
                >
                  Login
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
