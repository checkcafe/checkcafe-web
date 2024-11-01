import fetchAPI from "./api";

export type Profile = {
  getProfileUser(username: string): Promise<Partial<UserProfile> | null>;
};

export type UserProfile = {
  id?: string;
  name: string;
  username: string;
  avatarUrl: string;
  placesUrl: string;
  favoritesUrl: string;
  role: string;
  email?: string;
};

export const profile: Profile = {

  async getProfileUser(username: string): Promise<Partial<UserProfile> | null> {
    const response = await fetchAPI(`/users/${username}`);
    return response;
  },
};
