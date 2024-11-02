// import { createCookie } from "@remix-run/node";
// import { jwtDecode } from "jwt-decode";

// // Create the cookie
// type CookieOptions = {
//   expires?: Date;
//   maxAge?: number;
// };

// export const createCustomCookie = (name: string, options?: CookieOptions) => {
//   return createCookie(name, {
//     path: "/",
//     sameSite: "lax",
//     httpOnly: true,
//     secure: true,
//     ...options,
//   });
// };

// export const serializedCookie = (
//   name: string,
//   token: string,
//   role?: string,
// ) => {
//   const decodedToken: { exp: number } = jwtDecode(token);
//   const expirationDate = new Date(decodedToken.exp * 1000);

//   // Return the serialized cookie with the correct expiration date
//   const cookie = createCustomCookie(name);

//   const cookieValue = role ? role : token;

//   return cookie.serialize(cookieValue, {
//     expires: expirationDate,
//     maxAge: Math.floor((expirationDate.getTime() - Date.now()) / 1000),
//   });
// };

// export const isTokenExpired = (token: string): boolean => {
//   try {
//     const { exp } = jwtDecode<{ exp: number }>(token);
//     return exp ? exp < Math.floor(Date.now() / 1000) : true;
//   } catch {
//     return true;
//   }
// };
