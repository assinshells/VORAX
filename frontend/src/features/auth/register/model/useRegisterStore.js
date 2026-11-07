import { create } from "zustand";
import { registerRequest } from "@features/auth/register/api/register.api.js";

export const useRegisterStore = create((set) => ({
  loading: false,
  error: null,

  register: async ({ email, password }, onSuccess) => {
    set({ loading: true, error: null });
    try {
      await registerRequest({ email, password });
      onSuccess(email);
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
