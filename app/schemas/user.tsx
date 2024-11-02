import { z } from "zod";

const UserSchema = z.object({
  name: z.string(),
  username: z.string(),
  avatarUrl: z.string(),
});
export { UserSchema };
