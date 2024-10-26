import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  Form,
  json,
  Link,
  redirect,
  useActionData,
  useNavigation,
} from "@remix-run/react";
import { useState } from "react";
import { z } from "zod";

import { EyeIcon, HiddenEyeIcon } from "~/components/icons/icons";
import LoadingSpinner from "~/components/shared/loader-spinner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { auth } from "~/lib/auth";
import { getPageTitle } from "~/lib/get-page-title";
import { RegisterSchema } from "~/schemas/auth";

export const meta: MetaFunction = () => {
  return [
    { title: getPageTitle("Register") },
    { name: "description", content: "Create a new account" },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const userRegister = Object.fromEntries(formData);
  try {
    const validatedRegister = RegisterSchema.parse(userRegister);
    const user = await auth.register(validatedRegister);
    if (!user) {
      return null;
    }
    return redirect("/login");
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: { [key: string]: string } = {};
      error.errors.forEach(err => {
        errors[err.path[0]] = err.message;
      });
      console.log(errors);
      return json({ errors });
    }
    console.log(error, "error");
  }
};
export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const actionData = useActionData<typeof action>();
  console.log(actionData, "action data");
  const navigation = useNavigation();
  return (
    <div className="flex flex-col items-center justify-center gap-16">
      <Form
        method="post"
        className="flex min-w-96 flex-col gap-3 rounded-md bg-slate-100 p-8 text-xl"
      >
        <span className="flex flex-col">
          <h2 className="text-center text-2xl">Register</h2>

          <span className="flex justify-center gap-1 text-lg">
            <p> Already have account?</p>
            <Link to={"/login"} className="text-amber-900">
              Login!
            </Link>
          </span>
        </span>
        <span className="">
          <Label htmlFor="name">
            <p className="inline-block"> Name</p>
            <p className="ml-1 inline-block text-sm text-red-700">*</p>
          </Label>
          <Input
            type="text"
            name="name"
            placeholder="Penikmat Kopi"
            id="name"
            className="mt-1"
          />
          {actionData && actionData.errors["name"] && (
            <span className="text-sm text-red-700">
              {actionData.errors["name"]}
            </span>
          )}
        </span>
        <span className="">
          <Label htmlFor="username">
            <p className="inline-block"> Username</p>
            <p className="ml-1 inline-block text-sm text-red-700">*</p>
          </Label>
          <Input
            type="text"
            name="username"
            placeholder="penikmat_kopi"
            id="username"
            className="mt-1"
          />
          {actionData && actionData.errors["username"] && (
            <span className="text-sm text-red-700">
              {actionData.errors["username"]}
            </span>
          )}
        </span>
        <span className="">
          <Label htmlFor="email">
            <p className="inline-block"> email</p>
            <p className="ml-1 inline-block text-sm text-red-700">*</p>
          </Label>
          <Input
            type="email"
            name="email"
            placeholder="penikmatkopi@gmail.com"
            id="email"
            className="mt-1"
          />
          {actionData && actionData.errors["email"] && (
            <span className="text-sm text-red-700">
              {actionData.errors["email"]}
            </span>
          )}
        </span>

        <span className="relative">
          <Label htmlFor="password" className="">
            <p className="inline-block"> Password</p>
            <p className="ml-1 inline-block text-sm text-red-700">*</p>
          </Label>
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="password"
            id="password"
            className="peer mt-1"
          />
          <span className="z-100 absolute -right-[105%] top-[50%] w-full transform flex-col justify-center gap-2 rounded text-sm text-slate-400 opacity-0 transition-opacity duration-500 peer-focus-visible:flex peer-focus-visible:opacity-100">
            <p className="">*Minimum password 8 Characters</p>
          </span>
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={`absolute ${
              actionData && actionData.errors["password"]
                ? "top-[45%]"
                : "top-[55%]"
            } right-0 flex items-center pr-3`}
          >
            {showPassword ? (
              <span role="img" aria-label="Hide password">
                <HiddenEyeIcon className="h-6 w-6" />
              </span> // Replace with an actual icon
            ) : (
              <span role="img" aria-label="Show password">
                <EyeIcon className="h-6 w-6" />
              </span> // Replace with an actual icon
            )}
          </button>
          {actionData && actionData.errors["password"] && (
            <p className="text-sm text-red-700">
              {actionData.errors["password"]}
            </p>
          )}
        </span>

        <span className="relative">
          <Label htmlFor="confirmPassword" className="">
            <p className="inline-block"> Confirm Password</p>
            <p className="ml-1 inline-block text-sm text-red-700">*</p>
          </Label>
          <Input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            id="confirmPassword"
            className="peer mt-1"
          />
          <span className="z-100 absolute -right-[105%] top-[50%] w-full transform flex-col justify-center gap-2 rounded text-sm text-slate-400 opacity-0 transition-opacity duration-500 peer-focus-visible:flex peer-focus-visible:opacity-100">
            <p className="">*Minimum password 8 Characters</p>
          </span>
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={`absolute ${
              actionData && actionData.errors["confirmPassword"]
                ? "top-[45%]"
                : "top-[55%]"
            } right-0 flex items-center pr-3`}
          >
            {showPassword ? (
              <span role="img" aria-label="Hide password">
                <HiddenEyeIcon className="h-6 w-6" />
              </span> // Replace with an actual icon
            ) : (
              <span role="img" aria-label="Show password">
                <EyeIcon className="h-6 w-6" />
              </span> // Replace with an actual icon
            )}
          </button>

          {actionData && actionData.errors["confirmPassword"] && (
            <p className="text-sm text-red-700">
              {actionData.errors["confirmPassword"]}
            </p>
          )}
        </span>
        <Button type="submit">
          {navigation.state === "loading" ||
          navigation.state === "submitting" ? (
            <LoadingSpinner />
          ) : (
            "Register"
          )}
        </Button>
      </Form>
    </div>
  );
}
