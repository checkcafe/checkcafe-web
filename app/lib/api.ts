import { getExpirationDate } from "~/lib/jwt";

import { deleteCookie, getCookie, setCookie } from "./cookie";
import { BACKEND_API_URL } from "./env";

/**
 * Checks if a given JWT token is expired.
 *
 * @param {string} token - The JWT token to check.
 * @returns {boolean} true if the token is expired, false otherwise.
 */
const isTokenExpired = (token: string): boolean => {
  const expirationDate = getExpirationDate(token);
  return Date.now() >= expirationDate * 1000;
};

/**
 * Handles an HTTP request with token validation and potential refresh.
 * If the access token is expired or invalid, it attempts to refresh the token.
 * Upon successful refresh, it sets the new token in cookies.
 * Executes the provided request function and returns the response.
 * If the request fails, invokes the error handler with the error.
 *
 * @param accToken - The access token to validate and potentially refresh.
 * @param requestFunc - The function to execute the HTTP request.
 * @param onError - The callback function to handle errors during the request.
 * @returns A Promise resolving to the HTTP response or error handling result.
 */
const handleRequest = async (
  accToken: string | undefined,
  requestFunc: () => Promise<Response>,
  onError: (error: Error) => any,
): Promise<Response | any> => {
  try {
    const refToken = getCookie("refreshToken");
    if (!accToken && !refToken) {
      throw new Error("Access and refresh tokens are missing.");
    }

    if ((!accToken || isTokenExpired(accToken)) && refToken) {
      const response = await fetch(`${BACKEND_API_URL}/auth/refresh-token`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ refreshToken: refToken }),
      });

      if (!response.ok) {
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        deleteCookie("role");
        throw new Error("Unable to refresh access token!");
      }

      const { accessToken, refreshToken } = await response.json();

      const [accessTokenExpiration, refreshTokenExpiration] = [
        getExpirationDate(accessToken),
        getExpirationDate(refreshToken),
      ];

      setCookie("accessToken", accessToken, accessTokenExpiration);
      setCookie("refreshToken", refreshToken, refreshTokenExpiration);
    }

    const response = await requestFunc();

    if (!response.ok) {
      const error = await response.json();
      const errorMessage =
        error.error?.toString() || "An unexpected error occurred.";
      throw new Error(errorMessage);
    }

    return response;
  } catch (error: Error | any) {
    return onError ? onError(error) : error;
  }
};

/**
 * Make a request to the API with the given endpoint and options.
 *
 * @param endpoint - the API endpoint to request
 * @param options - an object containing the request method and payload
 * @param onError - an optional function to call if an error occurs
 * @returns a Promise that resolves to the Response object or an error
 */
const apiFetch = async (
  endpoint: string,
  options: { method?: string; payload?: any } = {},
  onError?: (error: Error) => any,
): Promise<Response | any> => {
  const { method = "GET", payload } = options;
  const accessToken = getCookie("accessToken") as string; 
  return handleRequest(
    accessToken,
    async () => {
      const fetchOptions: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: payload ? JSON.stringify(payload) : undefined,
      };

      return fetch(`${BACKEND_API_URL}${endpoint}`, fetchOptions);
    },
    onError || (() => {}),
  );
};

export { apiFetch };
