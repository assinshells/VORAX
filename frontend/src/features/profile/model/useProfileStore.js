import { create } from "zustand";
import {
  getProfileRequest,
  saveSetupRequest,
  restartRequest,
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

  // Тихое обновление (например, статус онлайн) — без лоадера и ошибок.
  refreshProfile: async () => {
    try {
      set({ profile: await getProfileRequest() });
    } catch {
      // игнорируем: данные останутся прежними
    }
  },

  saveSetup: async (dto) => {
    set({ saving: true, error: null });
    try {
      const profile = await saveSetupRequest(dto);
      set({ profile });
      return true;
    } catch (err) {
      set({ error: err.message });
      return false;
    } finally {
      set({ saving: false });
    }
  },

  // Сервер стирает все параметры — профиль без компании снова ведёт на старт.
  restart: async () => {
    set({ saving: true, error: null });
    try {
      const profile = await restartRequest();
      set({ profile });
      return true;
    } catch (err) {
      set({ error: err.message });
      return false;
    } finally {
      set({ saving: false });
    }
  },

  clearError: () => set({ error: null }),

  reset: () =>
    set({ profile: null, loading: false, saving: false, error: null }),
}));
