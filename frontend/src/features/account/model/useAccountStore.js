import { create } from "zustand";
import {
  cancelDeletionRequest,
  confirmDeletionRequest,
  confirmEmailChangeRequest,
  requestDeletionRequest,
  requestEmailChangeRequest,
} from "@features/account/api/account.api.js";
import { useProfileStore } from "@features/profile/model/useProfileStore.js";

/**
 * Общий стор операций над аккаунтом. Каждая операция возвращает true/false
 * (успех) и кладёт текст ошибки в error; обновлённый профиль от сервера
 * сразу попадает в useProfileStore — шапка и баннер реагируют мгновенно.
 */
export const useAccountStore = create((set) => {
  const run = async (fn) => {
    set({ loading: true, error: null });
    try {
      const data = await fn();
      if (data?.user) useProfileStore.getState().applyProfile(data);
      return true;
    } catch (err) {
      set({ error: err.message });
      return false;
    } finally {
      set({ loading: false });
    }
  };

  return {
    loading: false,
    error: null,

    requestDeletion: () => run(requestDeletionRequest),
    confirmDeletion: (code) => run(() => confirmDeletionRequest(code)),
    cancelDeletion: () => run(cancelDeletionRequest),
    requestEmailChange: (email) => run(() => requestEmailChangeRequest(email)),
    confirmEmailChange: (code) => run(() => confirmEmailChangeRequest(code)),

    clearError: () => set({ error: null }),
  };
});
