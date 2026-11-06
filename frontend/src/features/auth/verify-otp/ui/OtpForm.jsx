import { useState } from "react";
import { useVerifyOtpStore } from "@features/auth/verify-otp/model/useVerifyOtpStore.js";
import { OtpInput } from "@shared/ui/OtpInput.jsx";
import { OTP_LENGTH } from "@shared/constants/auth.constants.js";

export function OtpForm({ email, onSuccess, onBack }) {
  const [otp, setOtp] = useState("");
  const { loading, error, verify, clearError } = useVerifyOtpStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length !== OTP_LENGTH) return;
    clearError();
    verify({ email, otpCode: otp }, onSuccess);
  };

  return (
    <>
      {error && <p className="text-danger text-center mb-3">{error}</p>}
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
          {loading ? "Верифікація..." : "Верифікувати"}
        </button>
      </form>

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
