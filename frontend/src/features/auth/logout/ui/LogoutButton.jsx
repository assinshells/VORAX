import { LogOut } from "lucide-react";
import { useLogoutStore } from "@features/auth/logout/model/useLogoutStore.js";

/**
 * LogoutButton — иконка выхода (для шапки).
 * Вызывает logout() из useLogoutStore: шлёт запрос на /api/auth/logout,
 * затем в любом случае (даже если сессия уже истекла) чистит локальную
 * сессию и вызывает onLoggedOut().
 */
export function LogoutButton({ onLoggedOut, className = "header-icon-btn" }) {
  const { loading, logout } = useLogoutStore();

  return (
    <button
      type="button"
      className={className}
      onClick={() => logout(onLoggedOut)}
      disabled={loading}
      title="Выйти"
      aria-label="Выйти"
    >
      <LogOut size={20} strokeWidth={2} />
    </button>
  );
}
