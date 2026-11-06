import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { ROUTES, APP_NAME } from "@shared/constants/auth.constants.js";
import { Storage } from "@shared/lib/storage.js";
import { refreshAccessToken } from "@shared/api/axios.js";

import { LoginPage } from "@pages/LoginPage.jsx";
import { RegisterPage } from "@pages/RegisterPage.jsx";
import { VerifyEmailPage } from "@pages/VerifyEmailPage.jsx";
import { ForgotPasswordPage } from "@pages/ForgotPasswordPage.jsx";
import { VerifyOtpPage } from "@pages/VerifyOtpPage.jsx";
import { ResetPasswordPage } from "@pages/ResetPasswordPage.jsx";
import { HomePage } from "@pages/HomePage.jsx";

import "@app/styles/index.css";

const USER_KEY = "userLogin";

export default function App() {
  // accessToken живёт только в памяти (AuthSession) и не переживает
  // перезагрузку страницы — поэтому при монтировании делаем "тихий"
  // refresh: если у браузера есть валидная httpOnly refreshToken-cookie,
  // сессия восстановится сама, без повторного логина.
  const [booting, setBooting] = useState(true);
  const [authed, setAuthed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    refreshAccessToken()
      .then(() => {
        if (!cancelled) setAuthed(true);
      })
      .catch(() => {
        // Нет валидной cookie-сессии — остаёмся неавторизованными.
      })
      .finally(() => {
        if (!cancelled) setBooting(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleAuthSuccess = (email) => {
    Storage.set(USER_KEY, email);
    setAuthed(true);
    navigate(ROUTES.HOME, { replace: true });
  };

  const handleLogout = () => {
    Storage.remove(USER_KEY);
    setAuthed(false);
    navigate(ROUTES.LOGIN, { replace: true });
  };

  if (booting) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <span className="text-muted">{APP_NAME}…</span>
      </div>
    );
  }

  // Гостевые страницы недоступны авторизованному пользователю и наоборот.
  const guest = (element) =>
    authed ? <Navigate to={ROUTES.HOME} replace /> : element;

  return (
    <Routes>
      <Route
        path={ROUTES.HOME}
        element={
          authed ? (
            <HomePage
              login={Storage.get(USER_KEY) ?? "anonymous"}
              onLogout={handleLogout}
            />
          ) : (
            <Navigate to={ROUTES.LOGIN} replace />
          )
        }
      />
      <Route
        path={ROUTES.LOGIN}
        element={guest(<LoginPage onLoginSuccess={handleAuthSuccess} />)}
      />
      <Route path={ROUTES.REGISTER} element={guest(<RegisterPage />)} />
      <Route
        path={ROUTES.VERIFY_EMAIL}
        element={guest(<VerifyEmailPage onVerified={handleAuthSuccess} />)}
      />
      <Route path={ROUTES.FORGOT} element={guest(<ForgotPasswordPage />)} />
      <Route path={ROUTES.VERIFY_OTP} element={guest(<VerifyOtpPage />)} />
      <Route path={ROUTES.RESET} element={guest(<ResetPasswordPage />)} />
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
}
