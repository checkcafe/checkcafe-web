import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";

import { BACKEND_API_URL } from "~/lib/env";
import { loginSchema } from "~/schemas/auth";
import { sessionStorage } from "~/services/session.server";
import { AuthResponse } from "~/types/auth";

export const authenticator = new Authenticator<
  AuthResponse | AuthorizationError | Error
>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const formData = {
      username: form.get("username"),
      password: form.get("password"),
    };

    const parsedData = loginSchema.safeParse(formData);
    if (parsedData.success !== true) {
      const issues = parsedData.error.errors.map(err => ({
        message: err.message,
        path: err.path,
      }));

      throw new AuthorizationError(JSON.stringify(issues));
    }

    const response = await fetch(`${BACKEND_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new AuthorizationError(
        responseData.error || "Username or password is incorrect!",
      );
    }

    return responseData as AuthResponse;
  }),
  "user-pass",
);
