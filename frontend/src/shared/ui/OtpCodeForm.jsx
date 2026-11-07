import { useState } from "react";
import { OtpInput } from "@shared/ui/OtpInput.jsx";
import { OTP_LENGTH } from "@shared/constants/auth.constants.js";

/**
 * OtpCodeForm — ввод кода подтверждения (общий для удаления аккаунта,
 * смены email и смены пароля).
 * onSubmit(code), onResend() — опционально, onBack() — вернуться.
 */
export function OtpCodeForm({
  loading,
  error,
  info,
  submitLabel = "Подтвердить",
  onSubmit,
  onResend,
  onBack,
  onChange,
}) {
  const [otp, setOtp] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length !== OTP_LENGTH) return;
    onSubmit(otp);
  };

  return (
    <>
      {error && <p className="text-danger text-center mb-3">{error}</p>}
      {!error && info && <p className="text-success text-center mb-3">{info}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <OtpInput
            value={otp}
            onChange={(value) => {
              setOtp(value);
              onChange?.();
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading || otp.length !== OTP_LENGTH}
          className="btn btn-primary w-100 rounded-4 fw-bold m-0"
        >
          {loading ? "Проверяем..." : submitLabel}
        </button>
      </form>
      {onResend && (
        <button
          type="button"
          onClick={onResend}
          disabled={loading}
          className="btn btn-outline-primary w-100 rounded-4 fw-bold mt-3"
        >
          Отправить код ещё раз
        </button>
      )}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="btn btn-outline-primary w-100 rounded-4 fw-bold mt-2"
        >
          Назад
        </button>
      )}
    </>
  );
}
