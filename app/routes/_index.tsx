import type { MetaFunction } from "@remix-run/node";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [
    { title: "CheckCafe" },
    {
      name: "description",
      content:
        "Check the best cafe for social, food, WFC, and comfortable experience",
    },
  ];
};

export default function Index() {
  return (
    <div className="flex justify-center">
      <header className="space-y-4 p-4">
        <h1 className="text-2xl font-bold">☕CheckCafe</h1>
        <h2 className="text-xl">
          Check the best cafe for social, food, WFC, and comfortable experience
        </h2>
        <Button>Coming Soon</Button>
      </header>
    </div>
  );
}
