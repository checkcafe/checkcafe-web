import { jwtDecode } from "jwt-decode";

/**
 * Given a JWT token, return the expiration date as a Unix timestamp (in seconds).
 *
 * @param token - a JWT token
 * @returns a Unix timestamp representing the expiration date of the token
 */
export const getExpirationDate = (token: string): number => {
  return jwtDecode<{ exp: number }>(token).exp;
};
