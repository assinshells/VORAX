import { apiClient } from "@shared/api/axios.js";

/**
 * @param {{ email: string, otpCode: string }} dto
 * @returns {Promise<{ accessToken: string, csrfToken: string }>}
 */
export const verifyEmailRequest = (dto) =>
  apiClient.post("/api/auth/verify-email", dto).then((r) => r.data);

/** @param {{ email: string }} dto */
export const resendVerificationRequest = (dto) =>
  apiClient.post("/api/auth/resend-verification", dto).then((r) => r.data);
