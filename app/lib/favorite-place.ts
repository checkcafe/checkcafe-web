// import fetchAPI from "./api.server";
// import { auth } from "./auth-backup";

// export async function getFavoritePlaces(request: Request) {
//   let favorites = [];

//   const user = await auth.isLoggedIn();
//   if (user && typeof user !== "boolean") {
//     const username = user.username;
//     const favoritesUrl = `/users/${username}/favorites`;

//     try {
//       const response = await fetchAPI(request, favoritesUrl);
//       favorites = response.placeFavorites;
//     } catch (error) {
//       console.error("Error fetching favorite places");
//     }
//   }

//   return favorites;
// }

// export async function addFavoritePlace(request: Request, placeId: string) {
//   const user = await auth.isLoggedIn();
//   if (!user || typeof user === "boolean") {
//     throw new Error("User is not logged in");
//   }

//   const username = user.username;
//   const favoritesUrl = `/users/${username}/favorites`;

//   const payload = {
//     id: placeId,
//   };

//   try {
//     const response = await fetchAPI(request, favoritesUrl, "POST", payload);

//     return response;
//   } catch (error) {
//     console.error("Error adding favorite place", error);
//   }
// }

// export async function unfavoritePlace(request: Request, favoriteId: string) {
//   const user = await auth.isLoggedIn();
//   if (!user || typeof user === "boolean") {
//     throw new Error("User is not logged in");
//   }

//   const username = user.username;
//   const unfavoriteUrl = `/users/${username}/favorites/${favoriteId}`;

//   try {
//     const response = await fetchAPI(request, unfavoriteUrl, "DELETE");
//     return response;
//   } catch (error) {
//     console.error("Error removing favorite place", error);
//   }
// }
