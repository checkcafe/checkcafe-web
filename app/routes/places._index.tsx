import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { Place } from "~/types";

export async function loader() {
  const response = await fetch("https://api.checkcafe.com/place");
  const places: Place[] = await response.json();

  return json({ places });
}

export default function About() {
  const { places } = useLoaderData<typeof loader>();

  return (
    <div className="container px-4">
      <ul>
        {places.map((place) => {
          return <li key={place.name}>{place.name}</li>;
        })}
      </ul>
    </div>
  );
}
