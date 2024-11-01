import { Form, Link, useLocation } from "@remix-run/react";
import { MenuIcon, SearchIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { FaPlus, FaSignOutAlt, FaUser } from "react-icons/fa";

import { useUser } from "~/contexts/UserContext";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Searchbar } from "./searchbar";
import { SearchbarMobile } from "./searchbar-mobile";

export function Navbar({ user }: { user: any }) {
  const { setUser } = useUser();
  const [menuState, setMenuState] = useState({
    isPopoverOpen: false,
    isHamburgerOpen: false,
    isAccountOpen: false,
  });
  const location = useLocation();

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  useEffect(() => {
    setMenuState({
      isPopoverOpen: false,
      isHamburgerOpen: false,
      isAccountOpen: false,
    });
  }, [location.pathname]);

  const handleHamburgerClick = () => {
    setMenuState(prev => ({ ...prev, isHamburgerOpen: !prev.isHamburgerOpen }));
  };

  const toggleAccountDropdown = () => {
    setMenuState(prev => ({ ...prev, isAccountOpen: !prev.isAccountOpen }));
  };

  const closeAllMenus = () => {
    setMenuState({
      isPopoverOpen: false,
      isHamburgerOpen: false,
      isAccountOpen: false,
    });
  };

  return (
    <nav className="sticky top-0 z-50 flex w-full items-center justify-between bg-amber-50 p-4 md:p-8">
      <div className="flex items-center">
        <Link to="/">
          <h2 className="p-2 font-brand text-2xl tracking-tight text-gray-900 md:text-3xl">
            ☕ CheckCafe
          </h2>
        </Link>
      </div>

      <Searchbar />

      <div className="flex items-center gap-4 md:hidden">
        <button onClick={handleHamburgerClick} className="text-primary">
          {menuState.isHamburgerOpen ? (
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
          <Popover
            open={menuState.isPopoverOpen}
            onOpenChange={open =>
              setMenuState(prev => ({ ...prev, isPopoverOpen: open }))
            }
          >
            <PopoverTrigger asChild>
              <button
                className="flex cursor-pointer items-center justify-center rounded-full bg-primary p-0.5"
                onClick={closeAllMenus}
                aria-label="Open user menu"
              >
                <Avatar>
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>
                    {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                  </AvatarFallback>
                </Avatar>
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
                  onClick={closeAllMenus}
                  className="flex items-center gap-2 p-2 text-primary transition-colors duration-200 hover:rounded hover:bg-primary hover:text-white"
                >
                  <FaUser size={14} /> Profile
                </Link>
                <Link
                  to="/new"
                  onClick={closeAllMenus}
                  className="flex items-center gap-2 p-2 text-primary transition-colors duration-200 hover:rounded hover:bg-primary hover:text-white"
                >
                  <FaPlus size={14} /> New Place
                </Link>
                <div className="my-1 border-t"></div>
                <Button asChild className="w-full text-left">
                  <Link
                    to="/logout"
                    onClick={closeAllMenus}
                    className="flex items-center gap-2 p-2 text-primary transition-colors duration-200 hover:rounded hover:bg-red-600 hover:text-white"
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
          <SearchbarMobile />

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

            {/* Dropdown untuk My Account */}
            {user && user.name ? (
              <div className="flex flex-col gap-1">
                <button
                  onClick={toggleAccountDropdown}
                  className="w-full rounded-md py-2 pl-4 text-left text-primary hover:bg-slate-100"
                >
                  My Account
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
                      to="/new"
                      className="w-full rounded-md py-2 text-primary hover:bg-slate-100"
                      onClick={closeAllMenus}
                    >
                      New Place
                    </Link>
                    <Button asChild>
                      <Link
                        to="/logout"
                        className="w-full rounded-md py-2 text-primary hover:bg-slate-100"
                        onClick={closeAllMenus}
                      >
                        Logout
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
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
