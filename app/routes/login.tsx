import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  Form,
  json,
  Link,
  useActionData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { AuthorizationError } from "remix-auth";
import { toast } from "sonner";

import LoadingSpinner from "~/components/shared/loader-spinner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { getPageTitle } from "~/lib/get-page-title";
import { authenticator } from "~/services/auth.server";
import { AuthIssue } from "~/types/auth";

export const meta: MetaFunction = () => [
  { title: getPageTitle("Login") },
  { name: "description", content: "Login to existing account" },
];

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, { successRedirect: "/" });
}

export default function LoginRoute() {
  const [showPassword, setShowPassword] = useState(false);
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();
  const navigation = useNavigation();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const errors = Array.isArray(actionData?.error)
    ? actionData.error.reduce(
        (acc: Record<string, string>, { message, path }: AuthIssue) => {
          acc[path[0]] = message;
          return acc;
        },
        {},
      )
    : {};

  useEffect(() => {
    if (actionData?.success) {
      toast((actionData as { message: string }).message, {
        action: {
          label: "Close",
          onClick: () => {},
        },
      });
      navigate("/");
    } else if (actionData?.error && typeof actionData.error === "string") {
      toast(actionData.error, {
        action: {
          label: "Close",
          onClick: () => {},
        },
      });
    }
  }, [actionData, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-center text-2xl font-semibold">Login</h2>
        <Form method="post" className="flex flex-col gap-3">
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
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Enter your password"
                className={`mt-1 rounded-md border p-2 ${errors.password ? "border-red-500" : "border-gray-300"}`}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2.5 top-2.5"
              >
                {showPassword ? (
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

          <Button
            type="submit"
            className="rounded-md bg-blue-600 py-2 font-semibold text-white transition duration-200 hover:bg-blue-700"
          >
            {navigation.state === "submitting" ? <LoadingSpinner /> : "Login"}
          </Button>
        </Form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account yet?{" "}
            <Link
              to={"/register"}
              className="font-semibold text-blue-600 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    return await authenticator.authenticate("user-pass", request, {
      successRedirect: "/",
      throwOnError: true,
    });
  } catch (error: any) {
    if (error instanceof Response) return error;
    if (error instanceof AuthorizationError) {
      let issue;
      try {
        issue = JSON.parse(error.message);
      } catch {
        issue = error.message;
      }

      return json(Array.isArray(issue) ? { error: issue } : { error: issue });
    }

    return json({
      error: error.message,
    });
  }
}
