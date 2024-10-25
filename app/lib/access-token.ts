import { createCookie } from "@remix-run/node";
import { jwtDecode } from "jwt-decode";
// Function to create a cookiee

// Create the cookie
type CookieOptions = {
  expires?: Date;
  maxAge?: number;
};
export const createCustomCookie = (name: string, options?: CookieOptions) => {
  return createCookie(name, {
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    secure: true,
    ...options,
  });
};

// export const expiredDate = (token: string) => {};
export const serializedCookie = (
  name: string,
  token: string,
  role?: string
) => {
  const decodedToken: { exp: number } = jwtDecode(token);
  const expirationDate = new Date(decodedToken.exp * 1000);
  const cookie = createCustomCookie(name);
  // Return the serialized cookie with the correct expiration date
  const cookieValue = role ? role : token;
  return cookie.serialize(cookieValue, {
    expires: expirationDate,
    maxAge: Math.floor((expirationDate.getTime() - Date.now()) / 1000),
  });
};
