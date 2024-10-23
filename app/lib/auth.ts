import { BACKEND_API_URL } from "./env";
import {
  getAccessToken,
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  removeRole,
  setAccessToken,
  setRefreshToken,
  setRole,
} from "./access-token";
import { redirect } from "react-router-dom";
import { z } from "zod";
import { LoginSchema, RegisterSchema } from "~/schemas/auth";

export type User = {
  name: string;
  username: string;
  email: string;
  role: string;
};
export type loginResponse = {
  accessToken?: string;
  refreshToken?: string;
  role?: string;
};
export type Auth = {
  getToken: () => string | null;
  register(userRegister: z.infer<typeof RegisterSchema>): Promise<void | null>;
  login(userLogin: z.infer<typeof LoginSchema>): Promise<void | null>;
  checkUser(): Promise<User | undefined>;
  logout(): void;
};

// export type register = {
//   ok: boolean;
//   data: User;
//   message: string;
// };
export const auth: Auth = {
  getToken() {
    const getToken = getAccessToken();

    if (!getToken) {
      return null;
    }
    return getToken;
  },

  async register(userRegister: z.infer<typeof RegisterSchema>) {
    const response = await fetch(`${BACKEND_API_URL}/auth/register`, {
      method: "POST",
      body: JSON.stringify(userRegister),
      headers: { "Content-Type": "application/json" },
    });

    const user = await response.json();

    if (!user) return null;
    redirect("/login");
    return user;
  },

  async login(userLogin: z.infer<typeof LoginSchema>) {
    try {
      const response = await fetch(`${BACKEND_API_URL}/auth/login`, {
        method: "POST",
        body: JSON.stringify(userLogin),
        headers: { "Content-Type": "application/json" },
      });

      const { accessToken, refreshToken, role }: loginResponse =
        await response.json();

      setAccessToken(accessToken || "");
      setRefreshToken(refreshToken || "");
      setRole(accessToken!, role || "");
      if (!accessToken || !refreshToken) {
        return null;
      }
    } catch (error: unknown) {
      console.error(error, "error");
      removeAccessToken();
      removeRefreshToken();
      removeRole();
    }
  },

  async checkUser() {
    const token = getAccessToken();
    if (token) {
      try {
        const response = await fetch(`${BACKEND_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        const user: User = result.data;
        return user;
      } catch (error) {
        console.error(error);
        removeAccessToken();
      }
    }
  },

  async logout() {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return redirect("/login");

    fetch(`${BACKEND_API_URL}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: refreshToken }),
    });
    removeAccessToken();
    removeRefreshToken();
    removeRole();
    redirect("/");
  },
};
