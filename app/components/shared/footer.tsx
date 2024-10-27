import { Link } from "@remix-run/react";

export function Footer() {
  return (
    <footer className="m-0 flex justify-between bg-white p-8">
      <div className="flex-col gap-4 md:flex">
        <h2 className="font-brand text-3xl tracking-tight text-gray-900">
          ☕CheckCafe
        </h2>
        <p className="text-sm">The guide to various cafes and great vibes</p>
      </div>

      <div className="mt-12 flex gap-4 md:mt-0">
        <div className="text-sm">
          <h2 className="font-medium tracking-tight text-gray-900">Help</h2>
          <ul className="mt-4">
            <li>
              <Link to="/">About</Link>
            </li>
            <li>
              <Link to="/">Support</Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <h2 className="font-medium tracking-tight text-gray-900">
            Contact Us
          </h2>
          <ul className="mt-4">
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
