import {
  Form,
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { MenuIcon, SearchIcon, XIcon } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import {
  Fa,
  FaArrowDown,
  FaCaretDown,
  FaCartArrowDown,
  FaPlus,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import {
  FaArrowDown19,
  FaArrowDown91,
  FaArrowDownUpAcrossLine,
  FaCaretUp,
} from "react-icons/fa6";

import { SelectCity } from "~/components/shared/select-city";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { AuthUser } from "~/types/auth";

export function Navbar({ user }: { user: AuthUser }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [menuState, setMenuState] = useState({
    isPopoverOpen: false,
    isHamburgerOpen: false,
    isAccountOpen: false,
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const query = String(formData.get("q"));
    const city = String(formData.get("city"));

    // set url query params when value search changes
    if (query) {
      searchParams.set("q", query);
    } else {
      searchParams.delete("q");
    }
    if (city && city !== "null" && city !== "none") {
      searchParams.set("city", city);
    }
    navigate(`/places?${searchParams.toString()}`);
  };

  useEffect(() => {
    setMenuState(prev => ({
      ...prev,
      isPopoverOpen: false,
      isHamburgerOpen: false,
      isAccountOpen: false,
    }));
  }, [location.pathname]);

  const handleHamburgerClick = () => {
    setMenuState(prev => ({ ...prev, isHamburgerOpen: !prev.isHamburgerOpen }));
  };

  const closeAllMenus = () => {
    setMenuState({
      isPopoverOpen: false,
      isHamburgerOpen: false,
      isAccountOpen: false,
    });
  };

  const getCapitalization = (val: string) => {
    return val.charAt(0).toUpperCase() + val.slice(1);
  };

  return (
    <nav className="sticky top-0 z-50 flex w-full items-center justify-between bg-amber-50 p-4 md:p-8">
      <Link to="/" className="flex items-center">
        <h2 className="p-2 font-brand text-2xl tracking-tight text-gray-900 md:text-3xl">
          ☕ CheckCafe
        </h2>
      </Link>

      {/* Search for desktop */}
      <Form onSubmit={handleSubmit} className="hidden w-[40%] gap-2 md:flex">
        <span className="flex h-10 w-full overflow-hidden rounded-md bg-white shadow-lg">
          <Input
            type="search"
            name="q"
            placeholder="Search Places..."
            defaultValue={searchParams.get("q") || ""}
            className="w-full border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <SelectCity />
        </span>
        <Button type="submit" className="h-10">
          <SearchIcon className="h-6 w-6 cursor-pointer" />
        </Button>
      </Form>

      {/* Hamburger button for mobile */}
      <div className="z-50 flex items-center gap-4 md:hidden">
        <button onClick={handleHamburgerClick} className="text-primary">
          {menuState.isHamburgerOpen ? (
            <XIcon className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Links for desktop */}
      <div className="hidden items-center gap-8 text-base font-semibold md:flex">
        {user && user.name && !location.pathname.includes("edit") ? (
          <Button asChild>
            <Link to="/places/new" className="text-primary">
              <FaPlus size={14} /> New Place
            </Link>
          </Button>
        ) : null}

        <Link to="/places" className="text-primary">
          Places
        </Link>
        <Link to="/about" className="text-primary">
          About
        </Link>

        {user && user.name ? (
          <Popover
            open={menuState.isPopoverOpen}
            onOpenChange={open =>
              setMenuState(prev => ({ ...prev, isPopoverOpen: open }))
            }
          >
            <PopoverTrigger asChild>
              <button
                className="flex cursor-pointer items-center justify-center"
                aria-label="Open user menu"
              >
                <aside className="flex flex-row items-center gap-2">
                  <Avatar className="rounded-full bg-primary p-0.5">
                    <AvatarImage
                      className="rounded-full"
                      src={user.avatarUrl}
                      alt={user.name}
                    />
                    <AvatarFallback>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex flex-row gap-1 font-normal">
                    Hi,{" "}
                    <p className="font-semibold">
                      {getCapitalization(user.username)}
                    </p>
                  </span>
                </aside>
              </button>
            </PopoverTrigger>

            <PopoverContent
              align="end"
              side="bottom"
              className="w-40 rounded-md bg-white p-1 shadow-lg"
            >
              <div className="grid gap-1 text-sm font-semibold text-gray-700">
                <Link
                  to={`/${user.username}`}
                  className="flex items-center gap-2 p-2 text-primary transition-colors duration-200 hover:rounded hover:bg-primary hover:text-white"
                  onClick={closeAllMenus}
                >
                  <FaUser size={14} /> Profile
                </Link>
                <Link
                  to={`/dashboard/${user.username}`}
                  className="flex items-center gap-2 p-2 text-primary transition-colors duration-200 hover:rounded hover:bg-primary hover:text-white"
                  onClick={closeAllMenus}
                >
                  Dashboard
                </Link>
                {!location.pathname.includes("edit") && (
                  <Link
                    to="/places/new"
                    className="flex items-center gap-2 p-2 text-primary transition-colors duration-200 hover:rounded hover:bg-primary hover:text-white"
                    onClick={closeAllMenus}
                  >
                    <FaPlus size={14} /> <p>New Place</p>
                  </Link>
                )}

                <div className="my-1 border-t"></div>
                <Button asChild className="w-full text-left">
                  <Link
                    to="/logout"
                    className="flex items-center gap-2 p-2 text-primary transition-colors duration-200 hover:rounded hover:bg-red-600 hover:text-white"
                    onClick={closeAllMenus}
                  >
                    <FaSignOutAlt size={14} /> Logout
                  </Link>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <Button asChild>
            <Link to="/login" className="text-primary">
              Login
            </Link>
          </Button>
        )}
      </div>

      {/* Dropdown Menu untuk Mobile */}
      {menuState.isHamburgerOpen && (
        <div className="absolute left-0 top-16 w-full bg-amber-50 p-4 shadow-lg lg:hidden">
          <Form
            method="get"
            action="/places"
            className="mb-4 flex w-full gap-2"
          >
            <div className="flex h-10 w-full overflow-hidden rounded-md bg-white shadow-lg">
              <Input
                type="search"
                name="q"
                placeholder="Search Places..."
                className="w-full border-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <SelectCity />
            </div>
            <Button type="submit" className="h-10">
              <SearchIcon className="h-6 w-6" />
            </Button>
          </Form>

          <div className="flex w-full flex-col gap-1 text-primary">
            <Link
              to="/about"
              className="w-full rounded-md py-2 pl-4 text-left hover:bg-slate-100"
              onClick={closeAllMenus}
            >
              About
            </Link>
            <Link
              to="/places"
              className="w-full rounded-md py-2 pl-4 text-left hover:bg-slate-100"
              onClick={closeAllMenus}
            >
              Places
            </Link>
            {!location.pathname.includes("edit") && (
              <Link
                to="/places/new"
                className="gap-4rounded-md flex w-full items-center gap-2 py-2 pl-4 text-left hover:bg-slate-100"
                onClick={closeAllMenus}
              >
                <FaPlus size={14} /> New Places
              </Link>
            )}
            {user && user.name ? (
              <>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() =>
                      setMenuState(prev => ({
                        ...prev,
                        isAccountOpen: !prev.isAccountOpen,
                      }))
                    }
                    className="flex w-full justify-between rounded-md py-2 pl-4 text-left text-primary hover:bg-slate-100"
                  >
                    <p>My Account</p>{" "}
                    {menuState.isAccountOpen ? (
                      <FaCaretUp size={14} />
                    ) : (
                      <FaCaretDown size={14} />
                    )}
                  </button>

                  {menuState.isAccountOpen && (
                    <div className="flex flex-col gap-1 pl-4">
                      <Link
                        to={`/${user.username}`}
                        className="w-full rounded-md py-2 text-primary hover:bg-slate-100"
                        onClick={closeAllMenus}
                      >
                        Profile
                      </Link>
                      <Link
                        to={`/dashboard/${user.username}`}
                        className="w-full rounded-md py-2 text-primary hover:bg-slate-100"
                        onClick={closeAllMenus}
                      >
                        Dashboard
                      </Link>
                    </div>
                  )}
                  <Button asChild className="w-full text-left">
                    <Link
                      to="/logout"
                      className="flex items-center gap-2 p-2 text-primary transition-colors duration-200 hover:rounded hover:bg-red-600 hover:text-white"
                      onClick={closeAllMenus}
                    >
                      <FaSignOutAlt size={14} /> Logout
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <Button asChild>
                <Link
                  to="/login"
                  className="w-full rounded-md py-2 pl-4 text-left text-primary"
                  onClick={closeAllMenus}
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
