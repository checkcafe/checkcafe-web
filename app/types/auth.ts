export type Issue = {
  code: string;
  message: string;
  path: (string | number)[];
};

export type ActionData = {
  success?: boolean;
  error?:
    | {
        issues: Issue[];
      }
    | string;
};

export type AuthResponse = {
  token: AuthToken;
  user: AuthUser;
};

export type AuthUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string;
  role?: string;
};

export type AuthToken = {
  accessToken: string;
  refreshToken: string;
};

export type UserProfile = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  placesUrl: string;
  favoritesUrl: string;
  role: string;
  email?: string;
};

export type RegisterResponse = {
  success: boolean;
  data?: AuthUser;
  error?: {
    message: string;
    status: number;
    issues?: Array<{
      code: string;
      message: string;
      path: string[];
    }>;
  };
};

export type LoginResponse = {
  success: boolean;
  data?: AuthToken;
  error?: {
    message: string;
    status: number;
    issues?: Array<{
      code: string;
      message: string;
      path: string[];
    }>;
  };
};

export type isLoggedInResponse = {
  user: Partial<UserProfile> | null;
};
