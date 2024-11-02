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
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import LoadingSpinner from "~/components/shared/loader-spinner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { auth } from "~/lib/auth";
import { setCookie } from "~/lib/cookie";
import { getPageTitle } from "~/lib/get-page-title";
import { getExpirationDate } from "~/lib/jwt";
import { LoginSchema } from "~/schemas/auth";
import { ActionData, Issue } from "~/types/auth";

export const meta: MetaFunction = () => {
  return [
    { title: getPageTitle("Login") },
    { name: "description", content: "Login to existing account" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const login = await auth.isLoggedIn();

  if (login) {
    const referer = request.headers.get("Referer") || "/";

    return redirect(referer);
  }

  return null;
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
      toast((actionData as { message: string }).message);
      navigate("/");
    } else if (actionData?.error) {
      if (typeof actionData?.error === "string") {
        toast(actionData.error);
      }
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
  const formData = await request.formData();
  const userLogin = Object.fromEntries(formData);

  try {
    const validatedLogin = LoginSchema.parse(userLogin);
    const loginResponse = await auth.login(validatedLogin);

    if (!loginResponse.success) {
      return json({
        success: false,
        error: loginResponse.error?.message || "Login failed",
      });
    }

    const { accessToken, refreshToken, role } = loginResponse.data || {};

    if (!accessToken || !refreshToken || !role) {
      return json(
        { error: "Login response is missing required tokens." },
        { status: 500 },
      );
    }

    const [accessTokenExpiration, refreshTokenExpiration] = [
      getExpirationDate(accessToken),
      getExpirationDate(refreshToken),
    ];

    setCookie("accessToken", accessToken, accessTokenExpiration);
    setCookie("refreshToken", refreshToken, refreshTokenExpiration);
    setCookie("role", role, refreshTokenExpiration);

    return json({
      success: true,
      message: "You have successfully logged in.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.errors.map(err => ({
        code: "custom",
        message: err.message,
        path: err.path,
      }));

      return json({
        success: false,
        error: {
          issues,
        },
      });
    }

    return json({
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    });
  }
}
