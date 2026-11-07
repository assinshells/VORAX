import { Link, NavLink } from "react-router-dom";
import { Settings } from "lucide-react";
import { Avatar } from "@entities/avatar/ui/Avatar.jsx";
import { LogoutButton } from "@features/auth/logout/ui/LogoutButton.jsx";
import { APP_NAME, ROUTES } from "@shared/constants/auth.constants.js";

/**
 * Header — шапка на всех страницах. Гостю показывает только название,
 * авторизованному — аватар, настройки и выход.
 */
export function Header({ authed, profile, onLogout }) {
  return (
    <header className="app-header">
      <div className="container d-flex align-items-center justify-content-between py-2">
        <Link to={ROUTES.HOME} className="app-header__brand">
          {APP_NAME}
        </Link>

        {authed && (
          <nav className="d-flex align-items-center gap-1">
            {profile && (
              <Link
                to={ROUTES.AVATAR}
                className="d-flex align-items-center gap-2 text-decoration-none me-2"
                title="Сменить аватар"
              >
                <Avatar id={profile.avatar} size={32} />
                <span className="d-none d-sm-inline small fw-semibold text-body">
                  {profile.login}
                </span>
              </Link>
            )}
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
            <LogoutButton onLoggedOut={onLogout} />
          </nav>
        )}
      </div>
    </header>
  );
}
