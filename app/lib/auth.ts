import { BACKEND_API_URL } from "./env";

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
  // getToken: () => string | null;
  register(userRegister: z.infer<typeof RegisterSchema>): Promise<void | null>;
  login(userLogin: z.infer<typeof LoginSchema>): Promise<loginResponse | null>;
  // checkUser(): Promise<User | undefined>;
  // logout(): void;
};

// export type register = {
//   ok: boolean;
//   data: User;
//   message: string;
// };
export const auth: Auth = {
  // getToken() {
  //   // const getToken = getAccessToken();

  //   if (!getToken) {
  //     return null;
  //   }
  //   return getToken;
  // },

  async register(userRegister: z.infer<typeof RegisterSchema>) {
    try {
      const response = await fetch(`${BACKEND_API_URL}/auth/register`, {
        method: "POST",
        body: JSON.stringify(userRegister),
        headers: { "Content-Type": "application/json" },
      });

      const user = await response.json();
      console.log(user.error.issues, user, "userss");
      if (!user) return null;
      redirect("/login");
      return user;
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  async login(userLogin: z.infer<typeof LoginSchema>) {
    try {
      const response = await fetch(`${BACKEND_API_URL}/auth/login`, {
        method: "POST",
        body: JSON.stringify(userLogin),
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      const { accessToken, refreshToken, role } = result as loginResponse;
      if (!accessToken || !refreshToken) {
        return null;
      }
      return {
        accessToken,
        refreshToken,
        role,
      };
    } catch (error: unknown) {
      console.error(error, "error");
      return {
        accessToken: "",
        refreshToken: "",
        role: "",
      };
    }
  },

  // async checkUser() {
  //   if (token) {
  //     try {
  //       const response = await fetch(`${BACKEND_API_URL}/auth/me`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       const result = await response.json();
  //       const user: User = result.data;
  //       return user;
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // },

  // async logout() {
  //   const refreshToken = getRefreshToken();
  //   if (!refreshToken) return redirect("/login");

  //   fetch(`${BACKEND_API_URL}/auth/logout`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ refreshToken: refreshToken }),
  //   });
  //   removeAccessToken();
  //   removeRefreshToken();
  //   removeRole();
  //   redirect("/");
  // },
};
