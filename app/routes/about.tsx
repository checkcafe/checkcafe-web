import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export function loader() {
  const teamMembers = [{ name: "A" }, { name: "B" }];

  return json({ teamMembers });
}

export default function About() {
  const { teamMembers } = useLoaderData<typeof loader>();

  return (
    <div className="container px-4">
      <h1>About</h1>
      <pre>{JSON.stringify(teamMembers, null, 2)}</pre>
    </div>
  );
}
