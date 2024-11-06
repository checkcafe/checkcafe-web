import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, Link, useLoaderData } from "@remix-run/react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { BACKEND_API_URL } from "~/lib/env";
import { getPageTitle } from "~/lib/get-page-title";
import { AuthUser } from "~/types/auth";
import { ProfileFavorite, ProfilePlace } from "~/types/profile";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: getPageTitle(`${data?.user.name}`) },
    {
      name: "description",
      content: `Explore ${data?.user.name}'s profile, their favorite places, and more.`,
    },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { username } = params;

  try {
    const response = await fetch(`${BACKEND_API_URL}/users/${username}`);

    if (!response.ok) {
      throw new Error("Failed to load user profile. Please try again later.");
    }

    const user: AuthUser = await response.json();

    return json({ user });
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred.",
    );
  }
}

export default function Profile() {
  const { user } = useLoaderData<typeof loader>();

  // const handleTabChange = (tab: string) => {
  //   tab === "favorites" ? refetchFavorites() : refetchPlaces();
  // };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderPlaces = (places: ProfilePlace[], isError: boolean) => {
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderFavorites = (favorites: ProfileFavorite[], isError: boolean) => {
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

          <div className="mt-1">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-slate-500">@{user.username}</p>
          </div>
        </section>

        <section>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </section>
      </main>
    </div>
  );
}
