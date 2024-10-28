import { z } from "zod";

import { LoginSchema, RegisterSchema } from "~/schemas/auth";
import { isLoggedInResponse, LoginResponse, RegisterResponse, TokenResponse } from "~/types/auth";

import fetchAPI from "./api";
import { BACKEND_API_URL } from "./env";
import { UserProfile } from "./profile-http-request";

export type Auth = {
  register(
    userRegister: z.infer<typeof RegisterSchema>,
  ): Promise<RegisterResponse>;
  login(userLogin: z.infer<typeof LoginSchema>): Promise<LoginResponse>;
  isLoggedIn(): Promise<isLoggedInResponse>;
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

      const { accessToken, refreshToken, role } = result as TokenResponse;

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
  // async login(userLogin: z.infer<typeof LoginSchema>): Promise<LoginResponse> {
  //   try {
  //     const response = await fetch(`${BACKEND_API_URL}/auth/login`, {
  //       headers: { "Content-Type": "application/json" },
  //       method: "POST",
  //       body: JSON.stringify(userLogin),
  //     });

 
  //     const result = await response.json();

  //     if (!response.ok) {
  //       return {
  //         success: false,
  //         error: {
  //           message: result.error || "Login failed: Unknown error",
  //           status: response.status,
  //         },
  //       };
  //     }

  //     const { accessToken, refreshToken, role } = result as TokenResponse;

  //     if (!accessToken || !refreshToken || !role) {
  //       return {
  //         success: false,
  //         error: {
  //           message:
  //             "Invalid credentials: Missing required authentication tokens",
  //           status: 401,
  //         },
  //       };
  //     }

  //     return {
  //       success: true,
  //       data: {
  //         accessToken,
  //         refreshToken,
  //         role,
  //       },
  //     };
  //   } catch (error: unknown) {
  //     return {
  //       success: false,
  //       error: {
  //         message: "An unexpected error occurred. Please try again later.",
  //         status: 500,
  //       },
  //     };
  //   }
  // },

  async isLoggedIn(): Promise<isLoggedInResponse> {
    const response = await fetchAPI("/auth/me");
    if(!response){
      return{
        isLoggedIn:false,
        user:null
      }}
    const result = await response.json();
    console.log(result,'res')
    const user: Partial<UserProfile> = {
      id: result.id,
      username: result.username,
      name: result.name,
      avatarUrl: result.ava,
    };
    return {
      isLoggedIn: true,
      user
    } ;
  },
  
};
