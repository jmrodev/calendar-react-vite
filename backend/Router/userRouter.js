import express from "express";
import { authenticateToken, authorize } from "../Middleware/authMiddleware.js";
import { createUser,getAllUsers,getUserById,deleteUser,updateUser } from "../Controller/UserController.js";

const userRouter = express.Router();

userRouter.post("/", authenticateToken, authorize("admin"), createUser);
userRouter.get("/", authenticateToken, authorize("admin"), getAllUsers);
userRouter.get("/:id", authenticateToken, authorize("admin"), getUserById);
userRouter.delete("/:id", authenticateToken, authorize("admin"), deleteUser);
userRouter.put("/:id", authenticateToken, authorize("admin"), updateUser);

export default userRouter;
