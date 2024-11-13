import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, Link, useLoaderData } from "@remix-run/react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { BACKEND_API_URL } from "~/lib/env";
import { getPageTitle } from "~/lib/get-page-title";
import { getAccessToken } from "~/lib/token";
import { paths } from "~/types/schema";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: getPageTitle(`${data?.user.name}`) },
    {
      name: "description",
      content: `Explore ${data?.user.name}'s profile, their favorite places, and more.`,
    },
  ];
};

type UserSuccessResponse =
  paths["/users/{username}"]["get"]["responses"][200]["content"]["application/json"];

type UserPlaces =
  paths["/users/{username}"]["get"]["responses"][200]["content"]["application/json"]["places"];

type UserPlaceFavorites =
  paths["/users/{username}"]["get"]["responses"][200]["content"]["application/json"]["placeFavorites"];

export async function loader({ params, request }: LoaderFunctionArgs) {
  // TODO: Get authenticated user
  const { username } = params;
  const { accessToken } = await getAccessToken(request);

  try {
    // TODO: Get private user profile with unpublished places
    const response = await fetch(
      `${BACKEND_API_URL}/users/${username}/dashboard`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to load user profile. Please try again later.");
    }

    const user: UserSuccessResponse = await response.json();

    return json({ user });
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred.",
    );
  }
}

export default function Profile() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <main className="mx-auto flex max-w-7xl flex-col gap-10 p-5 pt-10">
        <section className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={user.avatarUrl || ""}
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

        {/* <section>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </section> */}

        <section className="space-y-2">
          <h2 className="text-xl font-bold">Submitted Places</h2>
          <UserPlacesList places={user.places as UserPlaces} />
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold">Favorited Places</h2>
          <UserPlaceFavoritesList
            placeFavorites={user.placeFavorites as UserPlaceFavorites}
          />
        </section>
      </main>
    </div>
  );
}

export function UserPlacesList({ places }: { places: UserPlaces }) {
  if (places.length <= 0) {
    return <p>No submitted places.</p>;
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
}

export function UserPlaceFavoritesList({
  placeFavorites,
}: {
  placeFavorites: UserPlaceFavorites;
}) {
  if (placeFavorites.length <= 0) {
    return <p>No favorited places.</p>;
  }

  return (
    <div>
      {placeFavorites.map(({ place }) => (
        <Link
          to={`/places/${place.slug}`}
          key={place.slug}
          className="flex items-center border-b py-2"
        >
          <img
            src={
              place.thumbnailUrl || "https://placehold.co/150?text=No%20Image"
            }
            alt={place.name}
            className="mr-4 h-16 w-16 rounded-md object-cover"
          />
          <div className="flex-grow">
            <h3 className="font-bold">{place.name}</h3>
            <p>{place.streetAddress}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
