import { apiFetch } from "./api";

export type Profile = {
    getProfileUser(username:string): Promise<Partial<UserProfile> | null>;
  };  

  export type UserProfile = {
    id?:string
    name: string;
    username: string;
    avatarUrl: string;
    placesUrl: string;
    favoritesUrl: string;
    role: string;
    email?:string
  };
  
  export const profile: Profile = {
  
  
    // async getProfileUsers(token:string,username:string) {
    //     console.log(username,'username');
    //     if (token) {
    //         console.log('test')
    //       try {
    //         const response = await fetch(`${BACKEND_API_URL}/users/${username}`, {
    //           headers: { Authorization: `Bearer ${token}` },
    //         });
    //         const result = await response.json();
    //         return result;
    //       } catch (error) {
    //         console.error(error);
    //       }
    //     }
    //   },
      async getProfileUser(username:string): Promise<Partial<UserProfile>|null> {
        const response = await apiFetch(`/users/${username}`);
        const result:UserProfile = await response.json();
        const user: Partial<UserProfile> = {
          id:result.id,
          username: result.username,
          avatarUrl: result.avatarUrl,
          name: result.name,
        };
        return user
      },
    }