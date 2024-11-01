import { json, LoaderFunctionArgs } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  if (!id) return redirect("/places");

  // const url = `${BACKEND_API_URL}/places/${id}`;

  // const responsePlace = await fetch(url);
  // const place: Place = await responsePlace.json();

  // if (!place) {
  //   throw new Response(null, { status: 404, statusText: "Place Not Found" });
  // }

  return json({
    place: {
      id: "temp",
    },
  });
}

export default function PlaceSlug() {
  const { place } = useLoaderData<typeof loader>();

  return (
    <div className="px-32 py-20">
      <h1>EDIT</h1>
      <pre>{JSON.stringify(place, null, 2)}</pre>
    </div>
  );
}
