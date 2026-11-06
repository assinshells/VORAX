import { ValidationException } from "../exceptions/auth.exceptions.js";
import { AVATAR_GENDER_BY_ID } from "../constants/avatar.constants.js";

export const validateAvatarRequest = (body) => {
  const errors = [];
  if (
    typeof body?.avatar !== "string" ||
    !Object.hasOwn(AVATAR_GENDER_BY_ID, body.avatar)
  ) {
    errors.push("avatar must be one of the available avatars");
  }
  if (errors.length) throw new ValidationException("Validation failed", errors);
};
