import { Link, NavLink } from "react-router-dom";
import { Settings } from "lucide-react";
import { LogoutButton } from "@features/auth/logout/ui/LogoutButton.jsx";
import { APP_NAME, ROUTES } from "@shared/constants/auth.constants.js";

const LINKS = [
  { to: ROUTES.DASHBOARD, label: "Дашборд" },
  { to: ROUTES.PROFILE, label: "Профиль" },
];

/**
 * Header — шапка на всех страницах. Гостю показывает только название.
 * Авторизованному — выход; навигацию (Дашборд, Профиль, Настройки)
 * только когда стартовые данные уже заполнены (showNav).
 */
export function Header({ authed, showNav, onLogout }) {
  return (
    <header className="app-header">
      <div className="container d-flex align-items-center justify-content-between py-2">
        <div className="d-flex align-items-center gap-3">
          <Link
            to={authed ? ROUTES.HOME : ROUTES.LOGIN}
            className="app-header__brand"
          >
            {APP_NAME}
          </Link>
          {authed && showNav && (
            <nav className="d-flex align-items-center gap-1">
              {LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `app-header__link${isActive ? " is-active" : ""}`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          )}
        </div>

        {authed && (
          <div className="d-flex align-items-center gap-1">
            {showNav && (
              <NavLink
                to={ROUTES.SETTINGS}
                className={({ isActive }) =>
                  `header-icon-btn${isActive ? " is-active" : ""}`
                }
                title="Настройки"
                aria-label="Настройки"
              >
                <Settings size={20} strokeWidth={2} />
              </NavLink>
            )}
            <LogoutButton onLoggedOut={onLogout} />
          </div>
        )}
      </div>
    </header>
  );
}
