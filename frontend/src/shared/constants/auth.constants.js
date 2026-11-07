export const ROUTES = Object.freeze({
  HOME: "/",
  START: "/start",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  CHANGE_EMAIL: "/settings/email",
  CHANGE_PASSWORD: "/settings/password",
  DELETE_ACCOUNT: "/settings/delete",
  LOGIN: "/login",
  REGISTER: "/register",
  VERIFY_EMAIL: "/verify-email",
  FORGOT: "/forgot-password",
  VERIFY_OTP: "/verify-otp",
  RESET: "/reset-password",
});

export const APP_NAME = "VORAX";
export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";

// Должно совпадать с OTP_LENGTH на backend.
export const OTP_LENGTH = 6;
