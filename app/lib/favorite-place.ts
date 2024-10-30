import { toast } from "~/hooks/use-toast";

import fetchAPI from "./api";
import { auth } from "./auth";
import { getCookie } from "./cookie";
import { BACKEND_API_URL } from "./env";

export async function getFavoritePlaces() {
  let favorites = [];

  const user = await auth.isLoggedIn();
  if (user && typeof user !== "boolean") {
    const username = user.username;
    const favoritesUrl = `/users/${username}/favorites`;

    try {
      const response = await fetchAPI(favoritesUrl);
      favorites = response.place_favorites;
    } catch (error) {
      console.error("Error fetching favorite places");
    }
  }

  return favorites;
}

export async function addFavoritePlace(placeId: string) {
  const token = getCookie("accessToken");
  const user = await auth.isLoggedIn();
  if (!user || typeof user === "boolean") {
    throw new Error("User is not logged in");
  }

  const username = user.username;
  const favoritesUrl = `${BACKEND_API_URL}/users/${username}/favorites`;

  try {
    // const response = await fetchAPI(favoritesUrl, "POST", { placeId });

    const response = await fetch(favoritesUrl, {
      method: "POST",
      body: JSON.stringify({
        id: placeId,
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error) {
    console.error("Error adding favorite place", error);
  }
}
