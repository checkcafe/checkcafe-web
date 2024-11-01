import { LoaderFunctionArgs } from "@remix-run/node";
import { json, Link, useLoaderData, useParams } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { FaHeart, FaStar } from "react-icons/fa";

import LoadingSpinner from "~/components/shared/loader-spinner";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { BACKEND_API_URL } from "~/lib/env";
import { UserProfile } from "~/types/auth";

type Place = {
  name: string;
  slug: string;
  description?: string;
  thumbnailUrl?: string;
};

type Favorite = {
  name: string;
  slug: string;
  streetAddress: string;
  thumbnailUrl?: string;
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { username } = params;

  if (!username) {
    throw new Error("Username is required");
  }

  try {
    const userResponse = await fetch(`${BACKEND_API_URL}/users/${username}`);

    if (!userResponse.ok) {
      throw new Error(`Error fetching user profile: @${username} not found`);
    }

    const userData = await userResponse.json();

    const user: UserProfile = {
      id: userData.id,
      name: userData.name,
      username: userData.username,
      avatarUrl: userData.avatarUrl,
      placesUrl: userData.placesUrl,
      favoritesUrl: userData.favoritesUrl,
      role: userData.role,
    };

    return json({ user });
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to load user profile. Please try again later.",
    );
  }
}

const fetchData = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Data not found.");
    return await response.json();
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "An unknown error occurred. Please try again.",
    };
  }
};

const fetchPlacesCreated = (username: string) =>
  fetchData(`${BACKEND_API_URL}/users/${username}/places?limit=9`);

const fetchFavorites = (username: string) =>
  fetchData(`${BACKEND_API_URL}/users/${username}/favorites?limit=10`);

export default function Profile() {
  const { user } = useLoaderData<typeof loader>() as { user: UserProfile };
  const { username } = useParams<{ username: string }>();

  const {
    data: placesCreated,
    refetch: refetchPlaces,
    isFetching: isFetchingPlaces,
    error: placesCreatedError,
  } = useQuery({
    queryKey: ["placesCreated", username],
    queryFn: () => fetchPlacesCreated(username!),
    enabled: !!username,
  });

  const {
    data: favorites,
    refetch: refetchFavorites,
    isFetching: isFetchingFavorites,
    error: favoritesError,
  } = useQuery({
    queryKey: ["favorites", username],
    queryFn: () => fetchFavorites(username!),
    enabled: false,
  });

  const handleTabChange = (tab: string) => {
    tab === "favorites" ? refetchFavorites() : refetchPlaces();
  };

  const renderPlaces = (places: Place[], isError: boolean) => {
    if (isError) {
      return (
        <p className="mt-4 text-center text-lg font-medium">
          An error occurred while fetching places.
        </p>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {places.map(place => (
          <Link
            to={`/places/${place.slug}`}
            key={place.slug}
            className="flex flex-col overflow-hidden rounded-lg border shadow-md"
          >
            <img
              src={
                place.thumbnailUrl || "https://placehold.co/150?text=No%20Image"
              }
              alt={place.name}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold">{place.name}</h3>
              <p className="text-gray-600">
                {place.description || "No description available."}
              </p>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  const renderFavorites = (favorites: Favorite[], isError: boolean) => {
    if (isError) {
      return (
        <p className="mt-4 text-center text-lg font-medium">
          An error occurred while fetching favorites.
        </p>
      );
    }

    return favorites.map(favorite => (
      <Link
        to={`/places/${favorite.slug}`}
        key={favorite.slug}
        className="flex items-center border-b py-2"
      >
        <img
          src={
            favorite.thumbnailUrl || "https://placehold.co/150?text=No%20Image"
          }
          alt={favorite.name}
          className="mr-4 h-16 w-16 rounded-md object-cover"
        />
        <div className="flex-grow">
          <h3 className="font-bold">{favorite.name}</h3>
          <p>{favorite.streetAddress}</p>
        </div>
      </Link>
    ));
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <main className="mx-auto flex max-w-7xl flex-col gap-10 p-5 pt-10">
        <section className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={user.avatarUrl}
              alt={user.name}
              className="h-full w-full object-cover"
            />
            <AvatarFallback>
              {user.name.charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <span className="mt-1">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-slate-500">@{user.username}</p>
          </span>
        </section>

        <Tabs
          defaultValue="created"
          className="w-full"
          onValueChange={handleTabChange}
        >
          <TabsList className="flex w-full flex-wrap">
            <TabsTrigger
              value="created"
              className="flex min-w-[120px] flex-1 items-center"
            >
              <FaStar className="mr-2" /> Places Created
            </TabsTrigger>
            <TabsTrigger
              value="favorites"
              className="flex min-w-[120px] flex-1 items-center"
            >
              <FaHeart className="mr-2" /> Favorite Places
            </TabsTrigger>
          </TabsList>

          <TabsContent value="created">
            {isFetchingPlaces ? (
              <LoadingSpinner size="default" color="text-gray-500" />
            ) : placesCreatedError ? (
              <p className="mt-4 text-center text-lg font-medium">
                {placesCreatedError.message ||
                  "An error occurred while fetching places."}
              </p>
            ) : placesCreated?.places ? (
              renderPlaces(placesCreated.places, false)
            ) : (
              <p className="mt-4 text-center text-lg font-medium">
                No places created yet.
              </p>
            )}
          </TabsContent>

          <TabsContent value="favorites">
            {isFetchingFavorites ? (
              <LoadingSpinner size="default" color="text-gray-500" />
            ) : favoritesError ? (
              <p className="mt-4 text-center text-lg font-medium">
                {favoritesError.message ||
                  "An error occurred while fetching favorites."}
              </p>
            ) : favorites?.placeFavorites ? (
              renderFavorites(favorites.placeFavorites, false)
            ) : (
              <p className="mt-4 text-center text-lg font-medium">
                No favorite places yet.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
