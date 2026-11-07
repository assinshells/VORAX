/**
 * @typedef {Object} ProfileDto
 * @property {number} id
 * @property {string} login
 * @property {string} email
 * @property {string} avatar     id аватара или "default"
 * @property {string} gender     male | female | unknown
 * @property {string|null} deleteAt  ISO-время окончательного удаления, если аккаунт помечен
 */
export const toProfileDto = (row) => ({
  id: row.id,
  login: row.login,
  email: row.email,
  avatar: row.avatar,
  gender: row.gender,
  deleteAt: row.delete_at ? new Date(row.delete_at).toISOString() : null,
});

export const toEmailChangeDto = (body) => ({
  email: String(body?.email ?? "").trim().toLowerCase(),
});

export const toOtpCodeDto = (body) => ({
  otpCode: String(body?.otpCode ?? "").trim(),
});
