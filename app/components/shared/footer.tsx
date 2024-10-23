import { Link } from "@remix-run/react";

export function Footer() {
  return (
    <footer className="flex m-0 justify-between bg-white  p-8 ">
      <div className="md:flex flex-col gap-4">
        <h2 className="text-3xl font-brand tracking-tight text-gray-900">
          ☕CheckCafe
        </h2>
        <p className="text-sm">The guide to various cafes and great vibes</p>
      </div>

      <div className="mt-12 md:mt-0 flex gap-4">
        <div className="text-sm ">
          <h2 className="font-medium tracking-tight text-gray-900">Help</h2>
          <ul className="mt-4 ">
            <li>
              <Link to="/">About</Link>
            </li>
            <li>
              <Link to="/">Support</Link>
            </li>
          </ul>
        </div>
        <div className="text-sm ">
          <h2 className="font-medium tracking-tight text-gray-900">
            Contact Us
          </h2>
          <ul className="mt-4 ">
            <li>
              <Link to="/">Instagram</Link>
            </li>
            <li>
              <Link to="/">Telegram</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
