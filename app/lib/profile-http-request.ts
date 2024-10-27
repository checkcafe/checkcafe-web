import { BACKEND_API_URL } from "./env";

export type Profile = {
    getProfileUser(token: string,username:string): Promise<UserProfile | undefined>;
  };  

  export type UserProfile = {
    name: string;
    username: string;
    avatarUrl: string;
    placesUrl: string;
    favoritesUrl: string;
    role: string;
    email?:string
  };
  
  export const profile: Profile = {
  
  
    async getProfileUser(token:string,username:string) {
        console.log(username,'username');
        if (token) {
            console.log('test')
          try {
            const response = await fetch(`${BACKEND_API_URL}/users/${username}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            return result;
          } catch (error) {
            console.error(error);
          }
        }
      },
    }