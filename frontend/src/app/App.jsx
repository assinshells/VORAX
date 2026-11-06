import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { ROUTES, APP_NAME } from "@shared/constants/auth.constants.js";
import { Storage } from "@shared/lib/storage.js";
import { refreshAccessToken } from "@shared/api/axios.js";
import { useProfileStore } from "@features/profile/model/useProfileStore.js";
import { DEFAULT_AVATAR_ID } from "@entities/avatar/model/avatars.js";

import { LoginPage } from "@pages/LoginPage.jsx";
import { RegisterPage } from "@pages/RegisterPage.jsx";
import { VerifyEmailPage } from "@pages/VerifyEmailPage.jsx";
import { ForgotPasswordPage } from "@pages/ForgotPasswordPage.jsx";
import { VerifyOtpPage } from "@pages/VerifyOtpPage.jsx";
import { ResetPasswordPage } from "@pages/ResetPasswordPage.jsx";
import { HomePage } from "@pages/HomePage.jsx";
import { AvatarPage } from "@pages/AvatarPage.jsx";

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
  const { profile, error: profileError, fetchProfile, reset } =
    useProfileStore();

  // Как только пользователь авторизован — подгружаем профиль (аватар/пол).
  useEffect(() => {
    if (authed) fetchProfile();
  }, [authed, fetchProfile]);

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
    reset();
    setAuthed(false);
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const loader = (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <span className="text-muted">{APP_NAME}…</span>
    </div>
  );

  if (booting) return loader;

  // Авторизован, но профиль ещё не загружен.
  if (authed && !profile) {
    if (!profileError) return loader;
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center gap-3"
        style={{ minHeight: "100vh" }}
      >
        <span className="text-danger">{profileError}</span>
        <button className="btn btn-primary rounded-4" onClick={fetchProfile}>
          Повторить
        </button>
      </div>
    );
  }

  // Первый вход: аватар не выбран (заглушка) — отправляем на выбор.
  const needsAvatar = authed && profile?.avatar === DEFAULT_AVATAR_ID;

  // Гостевые страницы недоступны авторизованному пользователю и наоборот.
  const guest = (element) =>
    authed ? <Navigate to={ROUTES.HOME} replace /> : element;

  return (
    <Routes>
      <Route
        path={ROUTES.HOME}
        element={
          !authed ? (
            <Navigate to={ROUTES.LOGIN} replace />
          ) : needsAvatar ? (
            <Navigate to={ROUTES.AVATAR} replace />
          ) : (
            <HomePage profile={profile} onLogout={handleLogout} />
          )
        }
      />
      <Route
        path={ROUTES.AVATAR}
        element={
          authed ? <AvatarPage /> : <Navigate to={ROUTES.LOGIN} replace />
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
