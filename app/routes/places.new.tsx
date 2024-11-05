import { LoaderFunctionArgs, redirect } from "@remix-run/node";

import { BACKEND_API_URL } from "~/lib/env";
import { getAccessToken } from "~/lib/token";
import { authenticator } from "~/services/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const authenticated = await authenticator.isAuthenticated(request);
  const { accessToken, headers } = await getAccessToken(request);

  if (!authenticated || !accessToken) {
    return redirect("/login", {
      headers,
    });
  }

  try {
    const response = await fetch(`${BACKEND_API_URL}/places`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to create new place. Please try again later.");
    }

    const place = await response.json();
    return redirect(`/places/${place.id}/edit`, {
      status: 302,
      headers,
    });
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred.",
    );
  }
};
