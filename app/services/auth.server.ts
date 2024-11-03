import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";

import { BACKEND_API_URL } from "~/lib/env";
import { loginSchema } from "~/schemas/auth";
import { sessionStorage } from "~/services/session.server";
import { AuthToken } from "~/types/auth";

export const authenticator = new Authenticator<
  AuthToken | AuthorizationError | Error
>(sessionStorage, {
  sessionKey: "authToken",
  sessionErrorKey: "authError",
});
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

    if (!response.ok) {
      const errorData = await response.json();
      throw new AuthorizationError(
        errorData.error || "Username or password is incorrect!",
      );
    }

    const token = await response.json();

    if (!token) {
      throw new AuthorizationError(
        "Invalid credentials: Missing required authentication tokens",
      );
    }

    return token as AuthToken;
  }),
  "user-pass",
);
