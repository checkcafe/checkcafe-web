import type {
  ActionFunctionArgs,
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  json,
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import React from "react";
import "./tailwind.css";
import { AppLayout } from "./components/shared/app-layout";

import "./tailwind.css";
import { auth } from "./lib/auth";
import { getCookie } from "./lib/cookie";

export const meta: MetaFunction = () => {
  return [
    { title: "CheckCafe" },
    {
      name: "description",
      content:
        "Check the best cafe for social, food, WFC, and comfortable experience",
    },
  ];
};

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

// export async function action({ request }: ActionFunctionArgs) {
 
//   return null;
// }

export async function loader({ request }: LoaderFunctionArgs) {
  const token = getCookie("accessToken");
 
  const login = await auth.isLoggedIn();

  return json({
    user:login.user,
    token
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <AppLayout
          user={loaderData.user}
          token={loaderData.token}
        >
          <div className="min-h-screen ">{children}</div>
        </AppLayout>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
