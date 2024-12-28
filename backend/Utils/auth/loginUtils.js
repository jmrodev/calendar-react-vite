export const handleLoginAttempts = async (user) => {
  user.loginAttempts = (user.loginAttempts || 0) + 1;
  if (user.loginAttempts >= 5) {
    user.lockUntil = standardizeDate(new Date(Date.now() + 15 * 60 * 1000));
  }
  await user.save();
};
