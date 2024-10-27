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
import { AppLayout, CookiesType } from "./components/shared/app-layout";

import { createCustomCookie } from "./lib/access-token";

import "./tailwind.css";
import { auth } from "./lib/auth";

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

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const cookieHeader = request.headers.get("Cookie");
  const createRefreshTokenCookie = createCustomCookie("refreshToken");
  const refreshTokenCookie = createRefreshTokenCookie.parse(cookieHeader);
  const refreshToken = await refreshTokenCookie;
  const action = formData.get("action");
  console.log(action, "act");
  if (action === "logout") {
    const logout = await auth.logout(refreshToken);
    if (logout?.ok) {
      const cookieAccessToken = createCustomCookie("accessToken");
      const cookieRefreshToken = createCustomCookie("refreshToken");
      const cookieRole = createCustomCookie("role");

      const headers = new Headers();
      headers.append(
        "Set-Cookie",
        await cookieAccessToken.serialize("", { maxAge: 1 })
      );
      headers.append(
        "Set-Cookie",
        await cookieRefreshToken.serialize("", { maxAge: 1 })
      );
      headers.append(
        "Set-Cookie",
        await cookieRole.serialize("", { maxAge: 1 })
      );

      return redirect("/login", {
        headers,
      });
    }
  }
  return null;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const createAccessTokenCookie = createCustomCookie("accessToken");
  const createRefreshTokenCookie = createCustomCookie("refreshToken");
  const createRoleCookie = createCustomCookie("role");
  const accessTokenCookie = createAccessTokenCookie.parse(cookieHeader);
  const refreshTokenCookie = createRefreshTokenCookie.parse(cookieHeader);
  const roleCookie = createRoleCookie.parse(cookieHeader);

  const cookie = {
    accessToken: await accessTokenCookie,
    refreshToken: await refreshTokenCookie,
    role: await roleCookie,
  };
  if (!accessTokenCookie) return redirect("/login");

  return json({
    cookie,
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
          cookie={loaderData ? (loaderData.cookie as CookiesType) : null}
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
