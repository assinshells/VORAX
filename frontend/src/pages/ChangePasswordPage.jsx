import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@widgets/layouts";
import { OtpCodeForm } from "@shared/ui/OtpCodeForm.jsx";
import { PasswordInput } from "@shared/ui/PasswordInput.jsx";
import { ROUTES } from "@shared/constants/auth.constants.js";
import { maskEmail } from "@shared/lib/maskEmail.js";
import { forgotPasswordRequest } from "@features/auth/forgot-password/api/forgotPassword.api.js";
import { verifyOtpRequest } from "@features/auth/verify-otp/api/verifyOtp.api.js";
import { resetPasswordRequest } from "@features/auth/reset-password/api/resetPassword.api.js";
import { useLogoutStore } from "@features/auth/logout/model/useLogoutStore.js";

const SUBTITLES = {
  email: "Подтвердите свой email — мы отправим на него код.",
  code: "Введите код из письма.",
  password: "Код подтверждён. Придумайте новый пароль.",
};

/**
 * Смена пароля: email → код → новый пароль → выход из аккаунта
 * (войти нужно уже с новым паролем). Использует те же эндпоинты, что и
 * «Забыли пароль?»: forgot-password → verify-otp → reset-password.
 */
export function ChangePasswordPage({ profile, onPasswordChanged }) {
  const navigate = useNavigate();
  const logout = useLogoutStore((s) => s.logout);

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [verifiedToken, setVerifiedToken] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  const normalized = email.trim().toLowerCase();

  const run = async (fn) => {
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      return await fn();
    } catch (err) {
      setError(err.message);
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  const sendCode = () => forgotPasswordRequest({ email: normalized });

  const handleEmail = async (e) => {
    e.preventDefault();
    if (normalized !== profile.email.toLowerCase()) {
      setError("Введите email вашего аккаунта.");
      return;
    }
    const res = await run(sendCode);
    if (res) setStep("code");
  };

  const handleResend = async () => {
    const res = await run(sendCode);
    if (res) setInfo("Код отправлен повторно.");
  };

  const handleCode = async (otpCode) => {
    const data = await run(() => verifyOtpRequest({ email: normalized, otpCode }));
    if (data?.verifiedToken) {
      setVerifiedToken(data.verifiedToken);
      setStep("password");
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Пароли не совпадают.");
      return;
    }
    const res = await run(() =>
      resetPasswordRequest({ verifiedToken, password, confirmPassword }),
    );
    // Пароль сменён: завершаем сессию, войти нужно с новым паролем.
    if (res) logout(onPasswordChanged);
  };

  return (
    <PageLayout title="Смена пароля" subtitle={SUBTITLES[step]} maxWidth="26rem">
      <div className="card p-4 rounded-4 shadow-sm">
        {step === "email" && (
          <>
            {error && <p className="text-danger text-center mb-3">{error}</p>}
            <form onSubmit={handleEmail}>
              <div className="mb-4">
                <input
                  type="email"
                  className="form-control"
                  placeholder={`Ваш email (${maskEmail(profile.email)})`}
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-100 rounded-4 fw-bold m-0"
              >
                {loading ? "Отправляем код..." : "Отправить код"}
              </button>
            </form>
            <button
              type="button"
              onClick={() => navigate(ROUTES.SETTINGS)}
              className="btn btn-outline-primary w-100 rounded-4 fw-bold mt-3"
            >
              Назад
            </button>
          </>
        )}

        {step === "code" && (
          <OtpCodeForm
            loading={loading}
            error={error}
            info={info}
            submitLabel="Подтвердить"
            onChange={() => setError(null)}
            onSubmit={handleCode}
            onResend={handleResend}
            onBack={() => {
              setError(null);
              setStep("email");
            }}
          />
        )}

        {step === "password" && (
          <>
            {error && <p className="text-danger text-center mb-3">{error}</p>}
            <form onSubmit={handlePassword}>
              <div className="mb-3">
                <PasswordInput
                  id="newPasswordInput"
                  autoComplete="new-password"
                  placeholder="Новый пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <PasswordInput
                  id="confirmNewPasswordInput"
                  autoComplete="new-password"
                  placeholder="Повторите пароль"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-100 rounded-4 fw-bold m-0"
              >
                {loading ? "Сохраняем..." : "Сменить пароль"}
              </button>
            </form>
          </>
        )}
      </div>
    </PageLayout>
  );
}
