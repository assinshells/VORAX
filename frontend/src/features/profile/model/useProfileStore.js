import { create } from "zustand";
import {
  getProfileRequest,
  updateAvatarRequest,
} from "@features/profile/api/profile.api.js";

export const useProfileStore = create((set) => ({
  profile: null,
  loading: false,
  saving: false,
  error: null,

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const profile = await getProfileRequest();
      set({ profile });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  // Сервер сам определяет пол по id аватара и возвращает обновлённый профиль.
  saveAvatar: async (avatarId) => {
    set({ saving: true, error: null });
    try {
      const profile = await updateAvatarRequest(avatarId);
      set({ profile });
      return true;
    } catch (err) {
      set({ error: err.message });
      return false;
    } finally {
      set({ saving: false });
    }
  },

  reset: () => set({ profile: null, loading: false, saving: false, error: null }),
}));
