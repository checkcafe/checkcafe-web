import { z } from "zod";

import { LoginSchema, RegisterSchema } from "~/schemas/auth";
import {
  AuthToken,
  LoginResponse,
  RegisterResponse,
  UserProfile,
} from "~/types/auth";

import fetchAPI from "./api.server";
import { getCookie } from "./cookie";
import { BACKEND_API_URL } from "./env";

export type Auth = {
  register(
    userRegister: z.infer<typeof RegisterSchema>,
  ): Promise<RegisterResponse>;
  login(userLogin: z.infer<typeof LoginSchema>): Promise<LoginResponse>;
  isLoggedIn(): Promise<UserProfile | null>;
};

export const auth: Auth = {
  async register(
    userRegister: z.infer<typeof RegisterSchema>,
  ): Promise<RegisterResponse> {
    try {
      const response = await fetch(`${BACKEND_API_URL}/auth/register`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(userRegister),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            message: result.error || "Registration failed: Unknown error",
            status: response.status,
          },
        };
      }

      return { success: true };
    } catch (error: unknown) {
      return {
        success: false,
        error: {
          message: "An unexpected error occurred. Please try again later.",
          status: 500,
        },
      };
    }
  },

  async login(userLogin: z.infer<typeof LoginSchema>): Promise<LoginResponse> {
    try {
      const response = await fetch(`${BACKEND_API_URL}/auth/login`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(userLogin),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            message: result.error || "Login failed: Unknown error",
            status: response.status,
          },
        };
      }

      const { accessToken, refreshToken, role } = result as AuthToken;

      if (!accessToken || !refreshToken || !role) {
        return {
          success: false,
          error: {
            message:
              "Invalid credentials: Missing required authentication tokens",
            status: 401,
          },
        };
      }

      return {
        success: true,
        data: {
          accessToken,
          refreshToken,
          role,
        },
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: {
          message: "An unexpected error occurred. Please try again later.",
          status: 500,
        },
      };
    }
  },

  async isLoggedIn(): Promise<UserProfile | null> {
    const token = getCookie("accessToken");

    if (!token) {
      return null;
    }

    try {
      return await fetchAPI("/auth/me");
    } catch {
      return null;
    }
  },
};
