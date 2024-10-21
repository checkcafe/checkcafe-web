import { Link } from "@remix-run/react";
import { ProfileIcon } from "../icons/icons";
import { Input } from "~/components/ui/input";

export function Navbar() {
  return (
    <nav className='  fixed top-0  w-full flex m-0 justify-between   p-8 bg-[#F6EBDA] '>
      <div className='md:flex flex-col gap-4'>
        <Link to={"/"}>
          <h2 className='text-3xl font-jacques  tracking-tight text-gray-900'>
            ☕CheckCafe
          </h2>
        </Link>
      </div>

      <Input
        type='search'
        placeholder='Search Cafes'
        className='w-4/12 shadow-lg'
      />
      <div className='mt-12 md:mt-0 flex gap-4'>
        <ul className='flex gap-8 font-semibold text-base self-center '>
          <li>
            <Link to={"/about"} className='text-primButton'>
              About
            </Link>
          </li>
          <li>
            <Link to={"/favourite"} className='text-primButton'>
              Favourite
            </Link>
          </li>
        </ul>
        <Link to={"/profile"} className='text-primButton self-center'>
          <ProfileIcon className='w-10 h-10' />
        </Link>
      </div>
    </nav>
  );
}
