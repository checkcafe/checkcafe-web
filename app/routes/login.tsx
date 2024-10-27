import { type ActionFunctionArgs, type MetaFunction } from "@remix-run/node";
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
import { serializedCookie } from "~/lib/access-token";
import { auth } from "~/lib/auth";
import { getPageTitle } from "~/lib/get-page-title";
import { LoginSchema } from "~/schemas/auth";

export const meta: MetaFunction = () => {
  return [
    { title: getPageTitle("Login") },
    { name: "description", content: "Login to existing account" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const userLogin = Object.fromEntries(formData);
  try {
    const validatedLogin = LoginSchema.parse(userLogin);
    const login = await auth.login(validatedLogin);
    const cookieAccessToken = serializedCookie(
      "accessToken",
      login?.accessToken || "",
    );
    const cookieRefreshToken = serializedCookie(
      "refreshToken",
      login?.refreshToken || "",
    );
    const cookieRole = serializedCookie(
      "role",
      login?.accessToken || "",
      login?.role || "",
    );

    const headers = new Headers();
    headers.append("Set-Cookie", await cookieAccessToken);
    headers.append("Set-Cookie", await cookieRefreshToken);
    headers.append("Set-Cookie", await cookieRole);

    return redirect("/", { headers });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: { [key: string]: string } = {};
      error.errors.forEach(err => {
        errors[err.path[0]] = err.message;
      });
      return json({ errors });
    }
  }
}
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const actionData = useActionData<typeof action>();

  const navigation = useNavigation();
  return (
    <div className="flex translate-y-1/2 flex-col items-center justify-center gap-16">
      <Form
        method="post"
        className="flex min-w-96 flex-col gap-4 rounded-md bg-slate-100 p-8 text-xl"
      >
        <span className="flex justify-between">
          <h2 className="text-2xl">Login</h2>
          <Link to={"/register"} className="text-amber-900">
            register
          </Link>
        </span>
        <span className="">
          <Label htmlFor="username">
            <p className="inline-block"> Username</p>
            <p className="ml-1 inline-block text-sm text-red-700">*</p>
          </Label>
          <Input
            type="text"
            name="username"
            placeholder="penikmat-kopi"
            id="username"
            className="mt-1"
          />
          {actionData && actionData.errors["username"] && (
            <span className="text-sm text-red-700">
              {actionData.errors["username"]}
            </span>
          )}
        </span>
        <span className="relative">
          <Label htmlFor="username" className="">
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
          {actionData && actionData.errors && actionData.errors["password"] && (
            <p className="text-sm text-red-700">
              {actionData.errors["password"]}
            </p>
          )}
        </span>

        <Button type="submit">
          {navigation.state === "loading" ||
          navigation.state === "submitting" ? (
            <LoadingSpinner />
          ) : (
            "Login"
          )}
        </Button>
      </Form>
    </div>
  );
}
