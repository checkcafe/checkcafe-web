import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function loader() {
  const teamMembers = [{ name: "A" }, { name: "B" }];

  return json({ teamMembers });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const teamMember = {
    name: String(formData.get("name")),
  };

  return json({ teamMember });
}

export default function About() {
  const { teamMembers } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="container px-4">
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

      <Form method="post">
        <Label htmlFor="name">Name</Label>
        <Input type="text" name="name" defaultValue="Siapa" />
        <Button type="submit">Submit</Button>
      </Form>

      <pre>{JSON.stringify(actionData, null, 2)}</pre>
    </div>
  );
}
