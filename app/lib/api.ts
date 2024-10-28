import { getCookie } from "./cookie";
import { BACKEND_API_URL } from "./env";

const makeRequest = async (
  endpoint: string,
  method: string,
  payload?: any,
  token?: string,
) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BACKEND_API_URL}${endpoint}`, {
    method,
    headers,
    body: payload ? JSON.stringify(payload) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

const refreshAccessToken = async (refreshToken: string) => {
  const refreshResponse = await fetch(`${BACKEND_API_URL}/auth/refresh-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!refreshResponse.ok) {
    throw new Error(
      `Error refreshing token: ${refreshResponse.status} ${refreshResponse.statusText}`,
    );
  }

  const { accessToken: newAccessToken } = await refreshResponse.json();

  if (!newAccessToken) {
    throw new Error("Failed to obtain a new access token.");
  }

  return newAccessToken;
};

const fetchAPI = async (
  endpoint: string,
  method: string = "GET",
  payload?: any,
) => {
  const accessToken = getCookie("accessToken");
  const refreshToken = getCookie("refreshToken");

  try {
    if (accessToken) {
      return await makeRequest(endpoint, method, payload, accessToken);
    }
  } catch (error: Error | any) {
    console.warn("Access token request failed:", error.message);
  }

  if (refreshToken) {
    try {
      const newAccessToken = await refreshAccessToken(refreshToken);
      return await makeRequest(endpoint, method, payload, newAccessToken);
    } catch (refreshError: Error | any) {
      console.error("Refresh token request failed:", refreshError.message);
    }
  }

  throw new Error("No valid access token or refresh token available.");
};

export default fetchAPI;
