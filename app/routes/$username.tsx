import { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";

import { BACKEND_API_URL } from "~/lib/env";
import { UserProfile } from "~/types/auth";


export async function loader({ params }: LoaderFunctionArgs) {
  const { username } = params;

  try {
    const response = await fetch(`${BACKEND_API_URL}/users/${username}`);

    if (!response.ok) {
      throw new Error(`Error fetching user profile: @${username} not found`);
    }

    const user: UserProfile = await response.json();
    return json({ user });
  } catch (error: Error | any) {
    throw new Error(
      error.message || "Failed to load user profile. Please try again later.",
    );
  }
}

export default function Profile() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div>
      <main className="flex translate-y-1/4 flex-col gap-16 p-20">
        <section className="flex gap-4">
          <img src={user.avatarUrl} alt={user.name} className="rounded-full" />
          <span>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-slate-500">@{user.username}</p>
          </span>
        </section>
      </main>
    </div>
  );
}
