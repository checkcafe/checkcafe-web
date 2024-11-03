export type AuthIssue = {
  message: string;
  path: (string | number)[];
};

export type AuthResponse = {
  token?: AuthToken;
  user?: AuthUser;
};

export type AuthToken = {
  accessToken?: string;
  refreshToken?: string;
};

export type AuthUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string;
  role?: string;
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

export type RegisterActionData = {
  success?: boolean;
  error?:
    | {
        issues: AuthIssue[];
      }
    | string;
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
