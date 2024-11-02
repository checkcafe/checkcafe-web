import fetchAPI from "~/lib/api";
import { getCookie } from "~/lib/cookie";
import { BACKEND_API_URL } from "~/lib/env";
import { AuthResponse } from "~/types/auth";

export const login = async (username: string, password: string) => {
  const response = await fetch(`${BACKEND_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Username or password is incorrect!");
  }

  return (await response.json()) as AuthResponse;
};

export const checkLoggedIn = async () => {
  const accessToken = getCookie("accessToken");
  const refreshToken = getCookie("refreshToken");

  if (!accessToken || !refreshToken) {
    return false;
  }

  return true;
};

export const getAuthUser = async () => {
  try {
    return await fetchAPI("/auth/me");
  } catch {
    return null;
  }
};
