import { apiClient } from "@shared/api/axios.js";

/**
 * @param {{ login: string, email: string, password: string }} dto
 * @returns {Promise<{ success: boolean, email: string }>}
 */
export const registerRequest = (dto) =>
  apiClient.post("/api/auth/register", dto).then((r) => r.data);
