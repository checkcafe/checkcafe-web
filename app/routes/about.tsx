import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";

export function loader() {
  const teamMembers = [{ name: "A" }, { name: "B" }];

  return json({ teamMembers });
}

export default function About() {
  const { teamMembers } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>About</h1>
      <p>This is the about page.</p>
      <Button asChild>
        <Link to="/">Home</Link>
      </Button>

      <ul>
        {teamMembers.map((teamMembers) => {
          return <li key={teamMembers.name}>{teamMembers.name}</li>;
        })}
      </ul>
    </div>
  );
}
