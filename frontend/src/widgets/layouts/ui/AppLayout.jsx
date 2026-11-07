import { Link, NavLink } from "react-router-dom";
import { LogoutButton } from "@features/auth/logout/ui/LogoutButton.jsx";
import { ROUTES, APP_NAME } from "@shared/constants/auth.constants.js";

const NAV = [
  { to: ROUTES.DASHBOARD, label: "Дашборд" },
  { to: ROUTES.PROFILE, label: "Профиль" },
  { to: ROUTES.SETTINGS, label: "Настройки" },
];

/** AppLayout — шапка с навигацией для авторизованных страниц. */
export function AppLayout({ onLogout, children }) {
  return (
    <>
      <header className="app-header border-bottom">
        <div className="container d-flex flex-wrap align-items-center gap-3 py-3">
          <Link
            to={ROUTES.DASHBOARD}
            className="fw-bold fs-5 text-decoration-none me-3"
          >
            {APP_NAME}
          </Link>
          <nav className="d-flex flex-wrap gap-1 flex-grow-1">
            {NAV.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `btn btn-sm rounded-4 ${
                    isActive ? "btn-primary" : "btn-outline-primary"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <LogoutButton
            onLoggedOut={onLogout}
            className="btn btn-sm btn-outline-danger rounded-4"
          />
        </div>
      </header>
      <main className="container py-4">{children}</main>
    </>
  );
}
