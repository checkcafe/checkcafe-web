import { getSession } from "~/services/session.server";

import { BACKEND_API_URL } from "./env";
import { getAccessToken } from "./token";

export async function getFavoritePlaces(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const { accessToken } = await getAccessToken(request);
  // if (!accessToken) {
  //   throw new Error("User is not logged in");
  // }
  //   const user = await auth.isLoggedIn();
  //   if (!user || typeof user === "boolean") {
  //     throw new Error("User is not logged in");
  //   }
  const user = session.get("userData");

  const username = user.username;
  try {
    const response = await fetch(
      `${BACKEND_API_URL}/users/${username}/favorites`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    //   favorites = response.placeFavorites;
    return response;
    //   const response = await fetchAPI(request, favoritesUrl);
  } catch (error) {
    console.error("Error fetching favorite places");
  }
}

export async function addFavoritePlace(request: Request, placeId: string) {
  const session = await getSession(request.headers.get("Cookie"));
  const { accessToken } = await getAccessToken(request);
  if (!accessToken) {
    throw new Error("User is not logged in");
  }
  //   const user = await auth.isLoggedIn();
  //   if (!user || typeof user === "boolean") {
  //     throw new Error("User is not logged in");
  //   }
  const user = session.get("userData");

  const username = user.username;
  //   const favoritesUrl = `/users/${username}/favorites`;

  const payload = {
    id: placeId,
  };

  try {
    const response = await fetch(
      `${BACKEND_API_URL}/users/${username}/favorites`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      },
    );

    return response;
  } catch (error) {
    console.error("Error adding favorite place", error);
  }
}

export async function unfavoritePlace(request: Request, favoriteId: string) {
  const session = await getSession(request.headers.get("Cookie"));
  const { accessToken } = await getAccessToken(request);
  if (!accessToken) {
    throw new Error("User is not logged in");
  }
  //   const user = await auth.isLoggedIn();
  //   if (!user || typeof user === "boolean") {
  //     throw new Error("User is not logged in");
  //   }
  const user = session.get("userData");

  const username = user.username;
  //   const favoritesUrl = `/users/${username}/favorites`;

  try {
    const response = await fetch(
      `${BACKEND_API_URL}/users/${username}/favorites/${favoriteId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response;
  } catch (error) {
    //   const username = user.username;
    //   const unfavoriteUrl = `/users/${username}/favorites/${favoriteId}`;

    //   try {
    //     const response = await fetchAPI(request, unfavoriteUrl, "DELETE");
    //     return response;
    //   }
    console.error("Error removing favorite place", error);
  }
}
