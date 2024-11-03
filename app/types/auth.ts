export type AuthIssue = {
  message: string;
  path: (string | number)[];
};

export type AuthToken = {
  accessToken?: string;
  refreshToken?: string;
};

export type AuthUser = {
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
