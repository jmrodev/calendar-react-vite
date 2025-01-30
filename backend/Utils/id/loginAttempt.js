import LoginAttemptSchema from "../../Models/LoginAttemptSchema.js";

export const newLoginAttemptId = async () => {
  try {
    const attempts = await LoginAttemptSchema.find();
    const maxId = attempts.reduce((max, attempt) => 
      attempt._id > max ? attempt._id : max, 0);
    return String(maxId + 1); // Convertir a cadena
  } catch (error) {
    console.error("Error generating new login attempt ID:", error);
    throw new Error("Could not generate new login attempt ID");
  }
};

