import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * PasswordInput — поле пароля с кнопкой показать/скрыть (без рамки).
 */
export function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  autoComplete = "current-password",
  required = true,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="position-relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        className="form-control pe-5"
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        required={required}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="password-toggle position-absolute top-50 end-0 translate-middle-y me-3"
        aria-label={visible ? "Сховати пароль" : "Показати пароль"}
        aria-pressed={visible}
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
