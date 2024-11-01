import { LoaderFunction, redirect } from "@remix-run/node";

import fetchAPI from "~/lib/api";
import { auth } from "~/lib/auth";

export const loader: LoaderFunction = async () => {
  const isLoggedIn = await auth.isLoggedIn();

  if (!isLoggedIn) {
    return redirect("/login");
  }

  try {
    const place = await fetchAPI("/places", "POST");
    return redirect(`/places/${place.id}/edit`);
  } catch (error: Error | any) {
    throw new Error(error.message || "Failed to create new place");
  }
};
