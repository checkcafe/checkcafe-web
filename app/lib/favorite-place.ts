import fetchAPI from "./api";
import { auth } from "./auth";

export async function getFavoritePlaces() {
  let favorites = [];

  const user = await auth.isLoggedIn();
  if (user && typeof user !== "boolean") {
    const username = user.username;
    const favoritesUrl = `/users/${username}/favorites`;

    try {
      const response = await fetchAPI(favoritesUrl);
      favorites = response.placeFavorites;
    } catch (error) {
      console.error("Error fetching favorite places");
    }
  }

  return favorites;
}

export async function addFavoritePlace(placeId: string) {
  const user = await auth.isLoggedIn();
  if (!user || typeof user === "boolean") {
    throw new Error("User is not logged in");
  }

  const username = user.username;
  const favoritesUrl = `/users/${username}/favorites`;

  const payload = {
    id: placeId,
  };

  try {
    const response = await fetchAPI(favoritesUrl, "POST", payload);

    return response;
  } catch (error) {
    console.error("Error adding favorite place", error);
  }
}

export async function unfavoritePlace(favoriteId: string) {
  const user = await auth.isLoggedIn();
  if (!user || typeof user === "boolean") {
    throw new Error("User is not logged in");
  }

  const username = user.username;
  const unfavoriteUrl = `/users/${username}/favorites/${favoriteId}`;

  try {
    const response = await fetchAPI(unfavoriteUrl, "DELETE");
    return response;
  } catch (error) {
    console.error("Error removing favorite place", error);
  }
}
