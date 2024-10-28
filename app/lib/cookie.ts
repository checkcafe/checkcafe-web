import Cookies from "universal-cookie";

const cookies = new Cookies();

const SameSiteOptions = {
  STRICT: "strict" as const,
  LAX: "lax" as const,
  NONE: "none" as const,
};

type SameSite = (typeof SameSiteOptions)[keyof typeof SameSiteOptions];

/**
 * Generates options for setting a cookie.
 *
 * @param expirationDays - Number of days until the cookie expires. Defaults to 30 days.
 * @param sameSite - SameSite policy for the cookie. Defaults to "strict".
 */
const settings = (
  expirationDays: number = 30,
  sameSite: SameSite = SameSiteOptions.STRICT,
) => {
  return {
    expires: new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000),
    path: "/",
    secure: true,
    sameSite,
    httpOnly: true,
  };
};

/**
 * Sets a cookie with the given key, value, expiration days, and same site
 * policy.
 *
 * @param key The key of the cookie to set.
 * @param value The value of the cookie to set.
 * @param expirationDays The number of days until the cookie expires. Defaults
 * to 30 days.
 * @param sameSite The SameSite policy for the cookie. Defaults to "strict".
 */
export const setCookie = (
  key: string,
  value: string,
  expirationDays?: number,
  sameSite?: SameSite,
) => {
  cookies.set(key, value, {
    ...settings(expirationDays, sameSite),
  });
};

/**
 * Retrieves the value of a cookie with the given key.
 *
 * @param key The key of the cookie to retrieve.
 * @returns The value of the cookie if it exists, undefined otherwise.
 */
export const getCookie = (key: string) => {
  return cookies.get(key) || undefined;
};

/**
 * Deletes the cookie with the given key.
 *
 * @param key The key of the cookie to delete.
 */
export const deleteCookie = (key: string) => {
  cookies.remove(key, { path: "/" });
};
