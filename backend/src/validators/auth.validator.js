import { ValidationException } from "../exceptions/auth.exceptions.js";

const isNonEmptyString = (val) =>
  typeof val === "string" && val.trim().length > 0;
const isValidEmail = (val) =>
  typeof val === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
const isValidPassword = (val) => typeof val === "string" && val.length >= 6;

export const validateLoginRequest = (body) => {
  const errors = [];
  if (!isValidEmail(body.email)) errors.push("valid email is required");
  if (!isValidPassword(body.password))
    errors.push("password must be at least 6 characters");
  if (errors.length) throw new ValidationException("Validation failed", errors);
};

export const validateRegisterRequest = (body) => {
  const errors = [];
  if (!isNonEmptyString(body.login)) errors.push("login is required");
  if (!isValidPassword(body.password))
    errors.push("password must be at least 6 characters");
  if (!isValidEmail(body.email)) errors.push("valid email is required");
  if (errors.length) throw new ValidationException("Validation failed", errors);
};

export const validateForgotPasswordRequest = (body) => {
  const errors = [];
  if (!isValidEmail(body.email))
    errors.push("valid email is required");
  if (errors.length) throw new ValidationException("Validation failed", errors);
};

export const validateVerifyOtpRequest = (body) => {
  const errors = [];
  if (!isValidEmail(body.email))
    errors.push("valid email is required");
  if (!isNonEmptyString(body.otpCode)) errors.push("otpCode is required");
  if (errors.length) throw new ValidationException("Validation failed", errors);
};

export const validateResetPasswordRequest = (body) => {
  const errors = [];
  if (!isNonEmptyString(body.verifiedToken))
    errors.push("verifiedToken is required");
  if (!isValidPassword(body.password))
    errors.push("password must be at least 6 characters");
  if (!isNonEmptyString(body.confirmPassword))
    errors.push("confirmPassword is required");
  if (body.password !== body.confirmPassword)
    errors.push("Passwords do not match");
  if (errors.length) throw new ValidationException("Validation failed", errors);
};

export const validateVerifyEmailRequest = validateVerifyOtpRequest;
export const validateResendVerificationRequest = validateForgotPasswordRequest;

