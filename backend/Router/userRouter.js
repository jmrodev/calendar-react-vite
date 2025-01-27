import { Router } from "express";
import {
  createUserController,
  deleteUserController,
  getAllUsersController,
  getUserByIdController,
} from "../Controller/userController.js";
import { authorize } from "../middleware/roles/authorize.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// Primero autenticamos, luego autorizamos
router.get("/", 
  authMiddleware,
  authorize("users", "read"), 
  getAllUsersController
);

router.get("/:id", 
  authMiddleware,
  authorize("users", "read"), 
  getUserByIdController
);

router.post("/", 
  authMiddleware,
  authorize("users", "create"), 
  createUserController
);

router.delete("/:id", 
  authMiddleware,
  authorize("users", "delete"), 
  deleteUserController
);

export default router;
