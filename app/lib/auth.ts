import fetchAPI from "./api";
import { getCookie } from "./cookie";
import { BACKEND_API_URL } from "./env";

export const login = async (username: string, password: string) => {
  try {
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

    return await response.json();
  } catch (error: Error | any) {
    return {
      error: {
        message:
          error.message ||
          "An unexpected error occurred. Please try again later.",
        status: error.status || 500,
      },
    };
  }
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
