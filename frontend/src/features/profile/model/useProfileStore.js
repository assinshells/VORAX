import { create } from "zustand";
import {
  getProfileRequest,
  saveSetupRequest,
  restartRequest,
} from "@features/profile/api/profile.api.js";

const initial = {
  profile: null,
  // serverNow - clientNow на момент последнего ответа сервера.
  clockOffset: 0,
  loading: false,
  saving: false,
  error: null,
};

export const useProfileStore = create((set, get) => {
  // Принимает ответ сервера { user, serverTime } и обновляет профиль
  // вместе со смещением часов.
  const applyProfile = ({ user, serverTime }) => {
    const parsed = Date.parse(serverTime);
    set({
      profile: user,
      clockOffset: Number.isNaN(parsed) ? get().clockOffset : parsed - Date.now(),
    });
  };

  const mutate = async (request) => {
    set({ saving: true, error: null });
    try {
      applyProfile(await request());
      return true;
    } catch (err) {
      set({ error: err.message });
      return false;
    } finally {
      set({ saving: false });
    }
  };

  return {
    ...initial,

    applyProfile,

    fetchProfile: async () => {
      set({ loading: true, error: null });
      try {
        applyProfile(await getProfileRequest());
      } catch (err) {
        set({ error: err.message });
      } finally {
        set({ loading: false });
      }
    },

    // Тихое обновление (например, статус онлайн) — без лоадера и ошибок.
    refreshProfile: async () => {
      try {
        applyProfile(await getProfileRequest());
      } catch {
        // игнорируем: данные останутся прежними
      }
    },

    saveSetup: (dto) => mutate(() => saveSetupRequest(dto)),

    // Сервер стирает все параметры — профиль без компании снова ведёт на старт.
    restart: () => mutate(restartRequest),

    clearError: () => set({ error: null }),

    reset: () => set({ ...initial }),
  };
});
