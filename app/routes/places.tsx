import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";

import { Button } from "~/components/ui/button";

// TODO: Could be more automatic from Swagger OpenAPI
type Place = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  cityId: string;
  userId: string;
  streetAddress: string;
};

export async function loader() {
  const response = await fetch("http://localhost:3000/places");
  const places: Place[] = await response.json();

  return json({ places });
}

export default function About() {
  const { places } = useLoaderData<typeof loader>();

  return (
    <div className="container px-4">
      <h1>About</h1>
      <p>This is the about page.</p>
      <Button asChild>
        <Link to="/">Home</Link>
      </Button>

      <ul>
        {places.map((places) => {
          return <li key={places.name}>{places.name}</li>;
        })}
      </ul>
    </div>
  );
}
