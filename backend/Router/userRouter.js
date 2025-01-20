import { Router } from "express";
import {
  createUserController,
  deleteUserController,
  getAllUsersController,
  getUserByIdController,
} from "../Controller/userController.js";
import { authorize } from "../middleware/roles/authorize.js";

const router = Router();

router.get("/", authorize("users", "read"), getAllUsersController);

router.get("/:id", authorize("users", "read"), getUserByIdController);

router.post("/", authorize("users", "create"), createUserController);

router.delete("/:id", authorize("users", "delete"), deleteUserController);

export default router;
