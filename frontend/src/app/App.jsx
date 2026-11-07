import { useCallback, useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { ROUTES, APP_NAME } from "@shared/constants/auth.constants.js";
import { Storage } from "@shared/lib/storage.js";
import { AuthSession } from "@shared/lib/authSession.js";
import { refreshAccessToken } from "@shared/api/axios.js";
import { useProfileStore } from "@features/profile/model/useProfileStore.js";
import { usePresence } from "@features/profile/presence/usePresence.js";
import { Header } from "@widgets/header/ui/Header.jsx";
import { DeletionBanner } from "@widgets/deletion-banner/ui/DeletionBanner.jsx";

import { LoginPage } from "@pages/LoginPage.jsx";
import { RegisterPage } from "@pages/RegisterPage.jsx";
import { VerifyEmailPage } from "@pages/VerifyEmailPage.jsx";
import { ForgotPasswordPage } from "@pages/ForgotPasswordPage.jsx";
import { VerifyOtpPage } from "@pages/VerifyOtpPage.jsx";
import { ResetPasswordPage } from "@pages/ResetPasswordPage.jsx";
import { StartPage } from "@pages/StartPage.jsx";
import { DashboardPage } from "@pages/DashboardPage.jsx";
import { ProfilePage } from "@pages/ProfilePage.jsx";
import { SettingsPage } from "@pages/SettingsPage.jsx";
import { ChangeEmailPage } from "@pages/ChangeEmailPage.jsx";
import { ChangePasswordPage } from "@pages/ChangePasswordPage.jsx";
import { DeleteAccountPage } from "@pages/DeleteAccountPage.jsx";

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
  const {
    profile,
    clockOffset,
    error: profileError,
    fetchProfile,
    reset,
  } = useProfileStore();

  // Как только пользователь авторизован — подгружаем профиль.
  useEffect(() => {
    if (authed) fetchProfile();
  }, [authed, fetchProfile]);

  // Heartbeat для статуса онлайн/офлайн.
  usePresence(authed);

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

  // notice — необязательное сообщение для страницы входа.
  const handleLogout = (notice) => {
    Storage.remove(USER_KEY);
    reset();
    setAuthed(false);
    navigate(ROUTES.LOGIN, {
      replace: true,
      state: typeof notice === "string" ? { notice } : undefined,
    });
  };

  // Срок удаления истёк: аккаунт стёрт фоновой задачей на сервере.
  const handleExpired = useCallback(() => {
    AuthSession.clear();
    Storage.remove(USER_KEY);
    reset();
    setAuthed(false);
    navigate(ROUTES.LOGIN, {
      replace: true,
      state: { notice: "Аккаунт удалён." },
    });
  }, [navigate, reset]);

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

  // Нет названия компании (первый вход или после «Начать заново») —
  // показываем стартовую страницу.
  const needsSetup = authed && !profile?.companyName;
  const home = needsSetup ? ROUTES.START : ROUTES.DASHBOARD;

  // Гостевые страницы недоступны авторизованному пользователю и наоборот.
  const guest = (element) =>
    authed ? <Navigate to={home} replace /> : element;

  // Защищённые страницы: без входа — на логин, без стартовых данных — на старт.
  const protectedPage = (element) => {
    if (!authed) return <Navigate to={ROUTES.LOGIN} replace />;
    if (needsSetup) return <Navigate to={ROUTES.START} replace />;
    return element;
  };

  return (
    <>
      <Header authed={authed} showNav={!needsSetup} onLogout={handleLogout} />
      {authed && profile?.deleteAt && (
        <DeletionBanner
          deleteAt={profile.deleteAt}
          clockOffset={clockOffset}
          onExpired={handleExpired}
        />
      )}
      <Routes>
        <Route
          path={ROUTES.HOME}
          element={<Navigate to={authed ? home : ROUTES.LOGIN} replace />}
        />
        <Route
          path={ROUTES.START}
          element={
            !authed ? (
              <Navigate to={ROUTES.LOGIN} replace />
            ) : needsSetup ? (
              <StartPage />
            ) : (
              <Navigate to={ROUTES.DASHBOARD} replace />
            )
          }
        />
        <Route
          path={ROUTES.DASHBOARD}
          element={protectedPage(<DashboardPage />)}
        />
        <Route path={ROUTES.PROFILE} element={protectedPage(<ProfilePage />)} />
        <Route
          path={ROUTES.SETTINGS}
          element={protectedPage(<SettingsPage profile={profile} />)}
        />
        <Route
          path={ROUTES.CHANGE_EMAIL}
          element={protectedPage(<ChangeEmailPage profile={profile} />)}
        />
        <Route
          path={ROUTES.CHANGE_PASSWORD}
          element={protectedPage(
            <ChangePasswordPage
              profile={profile}
              onPasswordChanged={() =>
                handleLogout("Пароль изменён. Войдите с новым паролем.")
              }
            />,
          )}
        />
        <Route
          path={ROUTES.DELETE_ACCOUNT}
          element={protectedPage(<DeleteAccountPage profile={profile} />)}
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
    </>
  );
}
