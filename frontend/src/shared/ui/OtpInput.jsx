import { OTP_LENGTH } from "@shared/constants/auth.constants.js";

/**
 * OtpInput — одно поле для одноразового кода (one-time-code).
 * Оставляет только цифры; поддерживает автоподстановку кода из SMS/почты.
 */
export function OtpInput({ value, onChange, id = "otpInput", length = OTP_LENGTH }) {
  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      autoComplete="one-time-code"
      maxLength={length}
      className="form-control text-center fw-bold"
      style={value ? { letterSpacing: "0.4em" } : undefined}
      placeholder="Введіть код"
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, length))}
      required
    />
  );
}
