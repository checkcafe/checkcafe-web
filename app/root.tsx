import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  isRouteErrorResponse,
  json,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { Analytics } from "@vercel/analytics/remix";
import { FaHouse } from "react-icons/fa6";

import { Footer } from "~/components/shared/footer";
import { Navbar } from "~/components/shared/navbar";
import { Button } from "~/components/ui/button";
import { Toaster } from "~/components/ui/sonner";
import { getAccessToken } from "~/lib/token";

import "./tailwind.css";

import { BACKEND_API_URL } from "./lib/env";
import { commitSession, getSession } from "./services/session.server";

export const meta: MetaFunction = () => [
  { title: "CheckCafe" },
  {
    name: "description",
    content:
      "Check the best cafe for social, food, WFC, and comfortable experience",
  },
];

export const links: LinksFunction = () => [
  {
    rel: "shortcut icon",
    href: "https://fav.farm/☕",
  },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Playwrite+GB+S&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("userData");
  if (user) {
    return json({ user });
  }

  const { accessToken, headers } = await getAccessToken(request);
  if (!accessToken) {
    return json({ user: null }, { headers });
  }

  const response = await fetch(`${BACKEND_API_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.ok) {
    const user = await response.json();
    session.set("userData", user);
    return json(
      { user },
      { headers: { "Set-Cookie": await commitSession(session) } },
    );
  }

  return json({ user: null }, { headers });
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useLoaderData<typeof loader>() || {};

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Navbar user={user} />
        <div className="min-h-screen">{children}</div>
        <Footer />
        <ScrollRestoration />
        <Toaster position="top-right" richColors />
        <Scripts />
        <Analytics />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 text-center">
      {isRouteErrorResponse(error) ? (
        <>
          <h1 className="text-3xl font-bold">
            {error.status || "Error"} -{" "}
            {error.statusText || "An unexpected error occurred."}
          </h1>
          <p className="mt-2 text-lg text-gray-700">
            The server encountered an unexpected error. Please try again later!
          </p>
        </>
      ) : error instanceof Error ? (
        <>
          <h1 className="text-3xl font-bold">Oops!</h1>
          <p className="mt-2 text-lg text-gray-700">{error.message}</p>
        </>
      ) : (
        <h1 className="text-3xl font-bold">Unknown Error!</h1>
      )}
      <div className="mt-6">
        <Link to="/" className="inline-block">
          <Button className="flex items-center rounded bg-gray-300 px-4 py-2 text-gray-800 transition duration-200 hover:bg-gray-400">
            <FaHouse className="mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return <Outlet />;
}
