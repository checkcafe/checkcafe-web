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

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), 3000),
  );

  try {
    await Promise.race([
      fetch(`${BACKEND_API_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      }),
      timeoutPromise,
    ]);
  } finally {
    clearCookies();
  }

  return redirect("/");
};
