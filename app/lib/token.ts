import { jwtDecode } from "jwt-decode";

import { BACKEND_API_URL } from "~/lib/env";
import {
  commitSession,
  destroySession,
  getSession,
} from "~/services/session.server";

/**
 * Given a JWT token, return the expiration date as a Unix timestamp (in seconds).
 *
 * @param token - a JWT token
 * @returns a Unix timestamp representing the expiration date of the token
 */
const getExpirationDate = (token: string): number => {
  if (!token) return 0;
  return jwtDecode<{ exp: number }>(token).exp;
};

/**
 * Given a JWT token, returns true if the token is expired, false otherwise.
 *
 * @param token - a JWT token
 * @returns true if the token is expired, false otherwise
 */
const isTokenExpired = (token: string): boolean => {
  if (!token) return true;
  // console.log(getExpirationDate(token), "gettime");
  return getExpirationDate(token) < Date.now() / 1000;
};

/**
 * Destroys the session and returns an object with a null access token and the
 * "Set-Cookie" header set to the result of calling destroySession on the given
 * session.
 *
 * @param session - the session to destroy
 * @returns an object with a null access token and the "Set-Cookie" header
 */
const handleSessionDestruction = async (session: any) => {
  return {
    accessToken: null,
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  };
};

/**
 * Given a Request object, returns an object with an access token and the
 * "Set-Cookie" header set to the result of calling commitSession on the given
 * session. If the access token is expired or does not exist, it refreshes the
 * access token using the refresh token and updates the session.
 *
 * @param request - the request to get the session from
 * @returns an object with an access token and the "Set-Cookie" header
 */
export const getAccessToken = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie"));
  const { accessToken, refreshToken } = session.get("authToken") || {};
  if (!accessToken || isTokenExpired(accessToken)) {
    if (!refreshToken || isTokenExpired(refreshToken)) {
      return handleSessionDestruction(session);
    }
    const newTokenData = await refreshAccessToken(refreshToken);
    if (!newTokenData) {
      return handleSessionDestruction(session);
    }
    session.set("authToken", newTokenData);
    return {
      accessToken: newTokenData.accessToken,
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    };
  }
  return {
    accessToken,
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  };
};

/**
 * Refreshes the access token using the provided refresh token.
 *
 * @param refreshToken - The refresh token used to obtain a new access token.
 * @returns A promise that resolves to the new token data if successful, or null if an error occurs.
 * @throws Will throw an error if the network request fails or returns a non-OK response.
 */
export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    return null;
  }
};
