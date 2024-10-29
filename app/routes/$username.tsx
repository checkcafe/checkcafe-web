import { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect, useLoaderData } from "@remix-run/react";

import { createCustomCookie } from "~/lib/access-token";
import { profile } from "~/lib/profile-http-request";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { username } = params;

  const user = await profile.getProfileUser(username!);

  return json({
    user,
  });
}

export default function Profile() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <div className=" ">
      <main className="flex translate-y-1/4 flex-col gap-16 p-20">
        <section className="flex gap-4">
          <img
            src={loaderData.user?.avatarUrl}
            alt={loaderData.user?.name}
            className="rounded-full"
          />
          <span>
            <h1 className="text-2xl font-bold">{loaderData.user?.name}</h1>
            <p className="text-slate-500">{loaderData.user?.username}</p>
          </span>
        </section>
      </main>
    </div>
  );
}
