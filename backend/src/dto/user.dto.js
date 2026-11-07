/**
 * @typedef {Object} ProfileDto
 * @property {number} id
 * @property {string} email
 * @property {string|null} nickname
 * @property {string|null} companyName
 * @property {string|null} firstName
 * @property {string|null} lastName
 * @property {string} createdAt     дата регистрации (ISO)
 * @property {string|null} restartedAt  дата последнего «Начать заново» (ISO)
 * @property {string|null} deleteAt ISO-время окончательного удаления, если аккаунт помечен
 * @property {boolean} online
 */
const iso = (v) => (v ? new Date(v).toISOString() : null);

export const toProfileDto = (row, online = false) => ({
  id: row.id,
  email: row.email,
  nickname: row.nickname ?? null,
  companyName: row.company_name ?? null,
  firstName: row.first_name ?? null,
  lastName: row.last_name ?? null,
  createdAt: iso(row.created_at),
  restartedAt: iso(row.restarted_at),
  deleteAt: iso(row.delete_at),
  online,
});

export const toEmailChangeDto = (body) => ({
  email: String(body?.email ?? "").trim().toLowerCase(),
});

export const toOtpCodeDto = (body) => ({
  otpCode: String(body?.otpCode ?? "").trim(),
});
