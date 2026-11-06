import { apiClient } from "@shared/api/axios.js";

/** @returns {Promise<{ id: number, login: string, email: string, avatar: string, gender: string }>} */
export const getProfileRequest = () =>
  apiClient.get("/api/users/me").then((r) => r.data.user);

export const updateAvatarRequest = (avatar) =>
  apiClient.patch("/api/users/me/avatar", { avatar }).then((r) => r.data.user);
