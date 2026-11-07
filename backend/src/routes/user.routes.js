import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { authGuard } from "../guards/auth.guard.js";
import { csrfProtection } from "../middlewares/csrf.middleware.js";

const router = Router();

router.get("/me", authGuard, UserController.me);
router.put("/me/setup", authGuard, csrfProtection, UserController.saveSetup);
router.post("/me/restart", authGuard, csrfProtection, UserController.restart);
router.post("/me/heartbeat", authGuard, UserController.heartbeat);

export default router;
