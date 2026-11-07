import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { authGuard } from "../guards/auth.guard.js";
import { csrfProtection } from "../middlewares/csrf.middleware.js";
import { RateLimitProvider } from "../providers/rateLimit.provider.js";

const router = Router();

router.get("/me", authGuard, UserController.me);
router.post("/me/heartbeat", authGuard, UserController.heartbeat);

// Стартовые данные и «Начать заново».
router.put("/me/setup", authGuard, csrfProtection, UserController.saveSetup);
router.post("/me/restart", authGuard, csrfProtection, UserController.restart);

// Удаление аккаунта: код на почту → подтверждение → отсрочка → автоудаление.
router.post(
  "/me/delete/request",
  authGuard,
  csrfProtection,
  RateLimitProvider.accountCode,
  UserController.requestDeletion,
);
router.post(
  "/me/delete/confirm",
  authGuard,
  csrfProtection,
  RateLimitProvider.accountVerify,
  UserController.confirmDeletion,
);
router.post(
  "/me/delete/cancel",
  authGuard,
  csrfProtection,
  UserController.cancelDeletion,
);

// Смена email: код на новую почту → подтверждение.
router.post(
  "/me/email/request",
  authGuard,
  csrfProtection,
  RateLimitProvider.accountCode,
  UserController.requestEmailChange,
);
router.post(
  "/me/email/confirm",
  authGuard,
  csrfProtection,
  RateLimitProvider.accountVerify,
  UserController.confirmEmailChange,
);

export default router;
