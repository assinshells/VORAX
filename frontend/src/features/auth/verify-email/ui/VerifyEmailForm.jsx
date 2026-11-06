import { useState } from "react";
import { useVerifyEmailStore } from "@features/auth/verify-email/model/useVerifyEmailStore.js";
import { OtpInput } from "@shared/ui/OtpInput.jsx";
import { OTP_LENGTH } from "@shared/constants/auth.constants.js";

export function VerifyEmailForm({ email, onSuccess, onBack }) {
  const [otp, setOtp] = useState("");
  const { loading, resending, resent, error, verify, resend, clearError } =
    useVerifyEmailStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length !== OTP_LENGTH) return;
    clearError();
    verify({ email, otpCode: otp }, onSuccess);
  };

  return (
    <>
      {error && <p className="text-danger text-center mb-3">{error}</p>}
      {resent && !error && (
        <p className="text-success text-center mb-3">Код надіслано повторно</p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <OtpInput
            value={otp}
            onChange={(value) => {
              setOtp(value);
              clearError();
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading || otp.length !== OTP_LENGTH}
          className="btn btn-primary w-100 text-decoration-none rounded-4 fw-bold m-0"
        >
          {loading ? "Перевіряємо..." : "Підтвердити пошту"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => resend({ email })}
        disabled={resending}
        className="btn btn-outline-primary w-100 text-break rounded-4 fw-bold mt-3"
      >
        {resending ? "Надсилаємо..." : "Надіслати код ще раз"}
      </button>

      {import.meta.env.DEV && (
        <p className="text-muted small text-center mt-3 mb-0">
          Dev: лист у{" "}
          <a href="http://localhost:8025" target="_blank" rel="noreferrer">
            Mailpit
          </a>
        </p>
      )}

      <p>
        <button
          type="button"
          onClick={onBack}
          className="btn btn-outline-primary w-100 text-break rounded-4 fw-bold mt-4"
        >
          Увійти
        </button>
      </p>
    </>
  );
}
