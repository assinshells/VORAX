import { apiClient } from "@shared/api/axios.js";

/**
 * @typedef {Object} Profile
 * @property {number} id
 * @property {string} email
 * @property {string|null} nickname
 * @property {string|null} companyName
 * @property {string|null} firstName
 * @property {string|null} lastName
 * @property {string} createdAt
 * @property {string|null} restartedAt
 * @property {string|null} deleteAt   время окончательного удаления, если аккаунт помечен
 * @property {boolean} online
 */

// Все эндпоинты возвращают { user: Profile, serverTime: string } —
// serverTime нужен для таймера удаления (часы клиента могут идти неверно).

/** @returns {Promise<{ user: Profile, serverTime: string }>} */
export const getProfileRequest = () =>
  apiClient.get("/api/users/me").then((r) => r.data);

/** @returns {Promise<{ user: Profile, serverTime: string }>} */
export const saveSetupRequest = (dto) =>
  apiClient.put("/api/users/me/setup", dto).then((r) => r.data);

/** @returns {Promise<{ user: Profile, serverTime: string }>} */
export const restartRequest = () =>
  apiClient.post("/api/users/me/restart").then((r) => r.data);

export const heartbeatRequest = () =>
  apiClient.post("/api/users/me/heartbeat").then((r) => r.data);
