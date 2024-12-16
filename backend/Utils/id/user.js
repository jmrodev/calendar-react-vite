import { UserSchema } from "../../Models/UserSchema.js";

export const newUserId = () => {
  const allUsers = UserSchema.find();
  if (allUsers.length === 0) return 1;
  return Math.max(...allUsers.map((user) => user._id)) + 1;
};
