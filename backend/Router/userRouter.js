import express from "express";
import { authenticateToken, authorizeRoles } from "../Middleware/authMiddleware.js";
import { createUser,getAllUsers,getUserById,deleteUser,updateUser } from "../Controller/UserController.js";

const userRouter = express.Router();

userRouter.post("/", authenticateToken, authorizeRoles("admin"), createUser);
userRouter.get("/", authenticateToken, authorizeRoles("admin"), getAllUsers);
userRouter.get("/:id", authenticateToken, authorizeRoles("admin"), getUserById);
userRouter.delete("/:id", authenticateToken, authorizeRoles("admin"), deleteUser);
userRouter.put("/:id", authenticateToken, authorizeRoles("admin"), updateUser);

export default userRouter;
