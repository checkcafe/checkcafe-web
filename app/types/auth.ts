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

export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string;
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
  data?: User;
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

export type TokenResponse = {
  accessToken: string;
  refreshToken: string;
  role?: string;
};

export type LoginResponse = {
  success: boolean;
  data?: TokenResponse;
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
