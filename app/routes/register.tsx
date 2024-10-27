import type {
  ActionFunctionArgs,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import {
  Form,
  json,
  Link,
  redirect,
  useActionData,
  useNavigation,
} from "@remix-run/react";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

import LoadingSpinner from "~/components/shared/loader-spinner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/hooks/use-toast";
import { auth } from "~/lib/auth";
import { getPageTitle } from "~/lib/get-page-title";
import { RegisterSchema } from "~/schemas/auth";
import { ActionData, Issue } from "~/types/auth";

export const meta: MetaFunction = () => {
  return [
    { title: getPageTitle("Register") },
    { name: "description", content: "Create a new account" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const isLoggedIn = await auth.isLoggedIn();

  if (isLoggedIn) {
    const referer = request.headers.get("Referer") || "/";

    return redirect(referer);
  }

  return null;
};

export default function Register() {
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const { toast } = useToast();

  const togglePasswordVisibility = (field: "password" | "confirmPassword") => {
    setPasswordVisibility(prevState => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const errors =
    actionData?.error && typeof actionData.error !== "string"
      ? actionData.error.issues.reduce(
          (acc: Record<string, string>, issue: Issue) => {
            acc[issue.path[0]] = issue.message;
            return acc;
          },
          {},
        )
      : {};

  useEffect(() => {
    if (actionData?.success) {
      toast({
        title: "Registration Successful",
        description: "You have successfully registered. Please log in.",
        action: <Link to="/login">Login</Link>,
      });
    } else if (actionData?.error) {
      if (typeof actionData?.error === "string") {
        toast({
          title: "Error",
          description: actionData.error,
          variant: "destructive",
        });
      }
    }
  }, [actionData, toast]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-center text-2xl font-semibold">Register</h2>

        <Form method="post" className="flex flex-col gap-3">
          <span className="flex flex-col">
            <Label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Enter your name"
              className={`mt-1 rounded-md border p-2 ${errors.name ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-700">{errors.name}</p>
            )}
          </span>

          <span className="flex flex-col">
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </Label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              className={`mt-1 rounded-md border p-2 ${errors.email ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-700">{errors.email}</p>
            )}
          </span>

          <span>
            <Label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </Label>
            <Input
              type="text"
              name="username"
              id="username"
              placeholder="Enter your username or email"
              className={`mt-1 rounded-md border p-2 ${errors.username ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-700">{errors.username}</p>
            )}
          </span>

          <span>
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                type={passwordVisibility.password ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Enter your password"
                className={`mt-1 rounded-md border p-2 ${errors.password ? "border-red-500" : "border-gray-300"}`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("password")}
                className="absolute right-2.5 top-2.5"
              >
                {passwordVisibility.password ? (
                  <EyeIcon className="h-5 w-5" />
                ) : (
                  <EyeClosedIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-700">{errors.password}</p>
            )}
          </span>

          <span>
            <Label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                type={passwordVisibility.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm your password"
                className={`mt-1 rounded-md border p-2 ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                className="absolute right-2.5 top-2.5"
              >
                {passwordVisibility.confirmPassword ? (
                  <EyeIcon className="h-5 w-5" />
                ) : (
                  <EyeClosedIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-700">
                {errors.confirmPassword}
              </p>
            )}
          </span>

          <Button
            type="submit"
            className="rounded-md bg-blue-600 py-2 font-semibold text-white transition duration-200 hover:bg-blue-700"
          >
            {navigation.state === "loading" ||
            navigation.state === "submitting" ? (
              <LoadingSpinner />
            ) : (
              "Register"
            )}
          </Button>
        </Form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to={"/login"}
              className="font-semibold text-blue-600 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const userRegister = Object.fromEntries(formData);

  try {
    const validatedRegister = RegisterSchema.parse(userRegister);
    const registerResponse = await auth.register(validatedRegister);

    if (!registerResponse.success) {
      return json(
        { error: registerResponse.error?.message || "Register failed" },
        { status: registerResponse.error?.status || 400 },
      );
    }

    return json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.errors.map(err => ({
        code: "custom",
        message: err.message,
        path: err.path,
      }));

      return json({ success: false, error: { issues } }, { status: 400 });
    }

    return json(
      {
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 },
    );
  }
};
