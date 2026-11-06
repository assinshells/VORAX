import { create } from "zustand";
import {
  verifyEmailRequest,
  resendVerificationRequest,
} from "@features/auth/verify-email/api/verifyEmail.api.js";
import { AuthSession } from "@shared/lib/authSession.js";

export const useVerifyEmailStore = create((set) => ({
  loading: false,
  resending: false,
  resent: false,
  error: null,

  verify: async ({ email, otpCode }, onSuccess) => {
    set({ loading: true, error: null });
    try {
      const data = await verifyEmailRequest({ email, otpCode });
      AuthSession.setAccessToken(data.accessToken);
      onSuccess();
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  resend: async ({ email }) => {
    set({ resending: true, resent: false, error: null });
    try {
      await resendVerificationRequest({ email });
      set({ resent: true });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ resending: false });
    }
  },

  clearError: () => set({ error: null, resent: false }),
}));
