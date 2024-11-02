import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";

import { login } from "~/lib/auth";
import { sessionStorage } from "~/services/session.server";
import { AuthUser } from "~/types/auth";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator<AuthUser>(sessionStorage);

// Tell the Authenticator to use the form strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    const username = String(form.get("username"));
    const password = String(form.get("password"));

    // console.log({ username, password });

    const authResponse = await login(username, password);

    // console.log({ authResponse });

    // the type of this user must match the type you pass to the Authenticator
    // the strategy will automatically inherit the type if you instantiate
    // directly inside the `use` method
    return authResponse.user;
  }),
  // each strategy has a name and can be changed to use another one
  // same strategy multiple times, especially useful for the OAuth2 strategy.
  "user-pass",
);
