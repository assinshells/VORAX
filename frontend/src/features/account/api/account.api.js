import { apiClient } from "@shared/api/axios.js";

export const requestDeletionRequest = () =>
  apiClient.post("/api/users/me/delete/request").then((r) => r.data);

/** @returns {Promise<{ user: object, serverTime: string }>} */
export const confirmDeletionRequest = (otpCode) =>
  apiClient.post("/api/users/me/delete/confirm", { otpCode }).then((r) => r.data);

/** @returns {Promise<{ user: object, serverTime: string }>} */
export const cancelDeletionRequest = () =>
  apiClient.post("/api/users/me/delete/cancel").then((r) => r.data);

export const requestEmailChangeRequest = (email) =>
  apiClient.post("/api/users/me/email/request", { email }).then((r) => r.data);

/** @returns {Promise<{ user: object, serverTime: string }>} */
export const confirmEmailChangeRequest = (otpCode) =>
  apiClient.post("/api/users/me/email/confirm", { otpCode }).then((r) => r.data);
