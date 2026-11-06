import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { authGuard } from "../guards/auth.guard.js";
import { csrfProtection } from "../middlewares/csrf.middleware.js";

const router = Router();

router.get("/me", authGuard, UserController.me);
router.patch("/me/avatar", authGuard, csrfProtection, UserController.updateAvatar);

export default router;
