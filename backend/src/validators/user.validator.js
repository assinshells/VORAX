import { ValidationException } from "../exceptions/auth.exceptions.js";

export const LIMITS = Object.freeze({
  NICKNAME: 20,
  COMPANY: 40,
  NAME: 15,
});

// Только латиница: заглавные, строчные, цифры и нижнее подчёркивание.
const WORD_RE = /^[A-Za-z0-9_]+$/;
// Имя/фамилия — только латинские буквы.
const NAME_RE = /^[A-Za-z]+$/;

const check = (errors, value, field, max, re, hint) => {
  if (typeof value !== "string" || value.length === 0) {
    errors.push(`${field} is required`);
  } else if (value.length > max) {
    errors.push(`${field} must be at most ${max} characters`);
  } else if (!re.test(value)) {
    errors.push(`${field}: ${hint}`);
  }
};

export const validateSetupRequest = (body) => {
  const errors = [];
  const b = body ?? {};
  check(errors, b.nickname, "nickname", LIMITS.NICKNAME, WORD_RE,
    "only Latin letters, digits and underscore");
  check(errors, b.companyName, "companyName", LIMITS.COMPANY, WORD_RE,
    "only Latin letters, digits and underscore");
  check(errors, b.firstName, "firstName", LIMITS.NAME, NAME_RE,
    "only Latin letters");
  check(errors, b.lastName, "lastName", LIMITS.NAME, NAME_RE,
    "only Latin letters");
  if (errors.length) throw new ValidationException("Validation failed", errors);
};
