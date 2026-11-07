import { apiClient } from "@shared/api/axios.js";

/**
 * @typedef {Object} Profile
 * @property {number} id
 * @property {string} email
 * @property {string|null} nickname
 * @property {string|null} company_name
 * @property {string|null} first_name
 * @property {string|null} last_name
 * @property {string} created_at
 * @property {string|null} restarted_at
 * @property {boolean} online
 */

/** @returns {Promise<Profile>} */
export const getProfileRequest = () =>
  apiClient.get("/api/users/me").then((r) => r.data.user);

/** @returns {Promise<Profile>} */
export const saveSetupRequest = (dto) =>
  apiClient.put("/api/users/me/setup", dto).then((r) => r.data.user);

/** @returns {Promise<Profile>} */
export const restartRequest = () =>
  apiClient.post("/api/users/me/restart").then((r) => r.data.user);

export const heartbeatRequest = () =>
  apiClient.post("/api/users/me/heartbeat").then((r) => r.data);
