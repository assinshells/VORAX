import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@widgets/layouts";
import { OtpCodeForm } from "@shared/ui/OtpCodeForm.jsx";
import { ROUTES } from "@shared/constants/auth.constants.js";
import { maskEmail } from "@shared/lib/maskEmail.js";
import { useAccountStore } from "@features/account/model/useAccountStore.js";

/**
 * Смена email: 1) ввод новой почты → 2) код, отправленный на неё.
 */
export function ChangeEmailPage({ profile }) {
  const navigate = useNavigate();
  const { loading, error, requestEmailChange, confirmEmailChange, clearError } =
    useAccountStore();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [info, setInfo] = useState(null);

  const normalized = email.trim().toLowerCase();

  const handleEmail = async (e) => {
    e.preventDefault();
    clearError();
    if (await requestEmailChange(normalized)) {
      setInfo(null);
      setStep("code");
    }
  };

  const handleCode = async (code) => {
    clearError();
    if (!(await confirmEmailChange(code))) return;
    navigate(ROUTES.SETTINGS, {
      replace: true,
      state: { notice: `Email изменён на ${maskEmail(normalized)}.` },
    });
  };

  const handleResend = async () => {
    clearError();
    setInfo(null);
    if (await requestEmailChange(normalized)) setInfo("Код отправлен повторно.");
  };

  return (
    <PageLayout
      title="Смена email"
      subtitle={
        step === "email"
          ? `Сейчас: ${maskEmail(profile.email)}. Введите новую почту — мы отправим на неё код.`
          : `Введите код, отправленный на ${maskEmail(normalized)}.`
      }
      maxWidth="26rem"
    >
      <div className="card p-4 rounded-4 shadow-sm">
        {step === "email" ? (
          <>
            {error && <p className="text-danger text-center mb-3">{error}</p>}
            <form onSubmit={handleEmail}>
              <div className="mb-4">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Новый email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError();
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
        ) : (
          <OtpCodeForm
            loading={loading}
            error={error}
            info={info}
            submitLabel="Сменить email"
            onChange={clearError}
            onSubmit={handleCode}
            onResend={handleResend}
            onBack={() => {
              clearError();
              setStep("email");
            }}
          />
        )}
      </div>
    </PageLayout>
  );
}
