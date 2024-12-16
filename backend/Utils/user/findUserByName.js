import { UserSchema } from "../../Models/UserSchema.js";

export async function findUserByUsername(username) {
  return await UserSchema.findOne({ username });
}
