import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.JWT_SECRET;

export const authToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    const user = await new Promise((resolve, reject) => {
      jwt.verify(token, secretKey, (err, user) => {
        if (err) {
          return reject(err);
        }

        resolve(user);
      });
    });
    req.user = user;
    next();
  } catch (err) {
    console.error("Unexpected error:", err.message);
    if (err.name === "JsonWebTokenError") {
      return res
        .status(403)
        .json({ error: "Forbidden", message: "JWT malformed" });
    }
    return res.status(403).json({ error: "Forbidden", message: err.message });
  }
};
