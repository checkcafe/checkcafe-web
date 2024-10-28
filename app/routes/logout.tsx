import { LoaderFunction, redirect } from "@remix-run/node";

import { deleteCookie, getCookie } from "~/lib/cookie";
import { BACKEND_API_URL } from "~/lib/env";

export const loader: LoaderFunction = async () => {
  const refreshToken = getCookie("refreshToken");

  const clearCookies = () => {
    deleteCookie("refreshToken");
    deleteCookie("accessToken");
    deleteCookie("role");
  };

  if (!refreshToken) {
    clearCookies();
    return redirect("/login");
  }

  try {
    await fetch(`${BACKEND_API_URL}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
  } finally {
    clearCookies();
  }

  return redirect("/login");
};
