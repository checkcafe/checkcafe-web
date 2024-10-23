import {
  createCookie,
  type ActionFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Form, json, redirect, useActionData } from "@remix-run/react";
import { useState } from "react";
import { z } from "zod";
import { EyeIcon, HiddenEyeIcon } from "~/components/icons/icons";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { auth } from "~/lib/auth";
import { getPageTitle } from "~/lib/getTitle";
import { LoginSchema } from "~/schemas/auth";

export const meta: MetaFunction = () => {
  return [
    { title: getPageTitle("Login") },
    { name: "Talenta 37 apps", content: "Welcome to Talenta 37!" },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const userLogin = Object.fromEntries(formData);
  try {
    const validatedLogin = LoginSchema.parse(userLogin);
    await auth.login(validatedLogin);
    const cookie = createCookie("user-prefs", {
      secrets: ["n3wsecr3t", "olds3cret"],
    });
    return redirect("/", {
      headers: {
        "Set-Cookie": await cookie.serialize("test"),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: { [key: string]: string } = {};
      error.errors.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
      return json({ errors });
    }
  }
};
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const actionData = useActionData<typeof action>();
  return (
    <div className="flex flex-col gap-16 items-center justify-center translate-y-1/2">
      <Form method="post" className="flex flex-col gap-4 text-xl min-w-96 ">
        <span className="">
          <Label htmlFor="username">
            <p className="inline-block"> Username</p>
            <p className="inline-block text-red-700 text-sm  ml-1">*</p>
          </Label>
          <Input
            type="text"
            name="username"
            placeholder="naswa13"
            id="username"
            className="mt-1"
          />
          {actionData && actionData.errors["username"] && (
            <span className="text-red-700 text-sm  ">
              {actionData.errors["username"]}
            </span>
          )}
        </span>
        <span className="relative">
          <Label htmlFor="username" className="">
            <p className="inline-block"> Password</p>
            <p className="inline-block text-red-700 text-sm  ml-1">*</p>
          </Label>
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="password"
            id="password"
            className="peer mt-1"
          />
          <span className="absolute opacity-0 top-[50%] -right-[105%] peer-focus-visible:flex flex-col gap-2 justify-center peer-focus-visible:opacity-100  transition-opacity duration-500 transform  rounded w-full z-100 text-slate-400 text-sm">
            <p className="">*Minimum password 8 Characters</p>
          </span>
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={`absolute ${
              actionData && actionData.errors["password"]
                ? "top-[45%]"
                : "top-[55%]"
            }  right-0 flex items-center pr-3 `}
          >
            {showPassword ? (
              <span role="img" aria-label="Hide password">
                <HiddenEyeIcon className="w-6 h-6" />
              </span> // Replace with an actual icon
            ) : (
              <span role="img" aria-label="Show password">
                <EyeIcon className="w-6 h-6" />
              </span> // Replace with an actual icon
            )}
          </button>
          {actionData && actionData.errors["password"] && (
            <p className="text-red-700 text-sm">
              {actionData.errors["password"]}
            </p>
          )}
        </span>

        <Button type="submit">Masuk</Button>
      </Form>
    </div>
  );
}
