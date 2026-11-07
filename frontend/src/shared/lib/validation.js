// Лимиты и правила должны совпадать с backend/src/validators/user.validator.js.
export const LIMITS = Object.freeze({ NICKNAME: 20, COMPANY: 40, NAME: 15 });

// Латиница: заглавные, строчные, цифры и нижнее подчёркивание.
export const WORD_RE = /^[A-Za-z0-9_]+$/;
// Имя и фамилия: только латинские буквы.
export const NAME_RE = /^[A-Za-z]+$/;

export const WORD_HINT =
  "Только латиница (без кириллицы): заглавные и строчные буквы, цифры и нижнее подчёркивание.";
export const NAME_HINT =
  "Только латиница (без кириллицы): заглавные и строчные буквы.";
