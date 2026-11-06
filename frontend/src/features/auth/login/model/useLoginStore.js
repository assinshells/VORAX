import { create } from "zustand";
import { loginRequest } from "@features/auth/login/api/login.api.js";
import { resendVerificationRequest } from "@features/auth/verify-email/api/verifyEmail.api.js";
import { AuthSession } from "@shared/lib/authSession.js";

export const useLoginStore = create((set) => ({
  loading: false,
  error: null,

  login: async ({ email, password }, { onSuccess, onUnverified }) => {
    set({ loading: true, error: null });
    try {
      const data = await loginRequest({ email, password });
      // refreshToken/csrfToken пришли как cookie (см. axios.js/backend);
      // в теле ответа — только accessToken, он живёт в памяти вкладки.
      AuthSession.setAccessToken(data.accessToken);
      onSuccess();
    } catch (err) {
      if (err.code === "EMAIL_NOT_VERIFIED") {
        // Пароль верный, но почта не активирована: высылаем новый код
        // и отправляем пользователя на экран ввода кода.
        try {
          await resendVerificationRequest({ email });
        } catch {
          // код можно запросить повторно на экране активации
        }
        onUnverified(email);
      } else {
        set({ error: err.message });
      }
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
