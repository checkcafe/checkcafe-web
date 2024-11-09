import { Link } from "@remix-run/react";

export function Footer() {
  return (
    <footer className="mt-20 flex flex-col items-center justify-between bg-amber-50 p-4 md:mt-32 md:flex-row md:p-8">
      <div className="flex flex-col items-center gap-2 md:items-start">
        <h2 className="font-brand text-2xl tracking-tight text-gray-900 md:text-3xl">
          ☕ CheckCafe
        </h2>
        <p className="text-center text-sm md:text-left">
          The guide to various cafes and great vibes
        </p>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-4 md:mt-0 md:flex-row md:gap-8">
        <div className="min-w-[120px] flex-1 text-sm">
          <h2 className="font-bold tracking-tight text-gray-900">Help</h2>
          <ul className="mt-2 space-y-1">
            <li>
              <Link to="/about" className="text-primary hover:underline">
                About
              </Link>
            </li>
            <li>
              <Link to="/" className="text-primary hover:underline">
                Support
              </Link>
            </li>
          </ul>
        </div>
        <div className="min-w-[120px] flex-1 text-sm">
          <h2 className="font-bold tracking-tight text-gray-900">Contact Us</h2>
          <ul className="mt-2 space-y-1">
            <li>
              <Link to="/" className="text-primary hover:underline">
                Instagram
              </Link>
            </li>
            <li>
              <Link to="/" className="text-primary hover:underline">
                Telegram
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
