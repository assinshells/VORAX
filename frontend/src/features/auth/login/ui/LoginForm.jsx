import { useState } from "react";
import { useLoginStore } from "@features/auth/login/model/useLoginStore.js";
import { PasswordInput } from "@shared/ui/PasswordInput.jsx";

/**
 * LoginForm — тупой компонент.
 * onSuccess(email) — вызывается после успешного входа.
 * onUnverified(email) — почта ещё не активирована.
 */
export function LoginForm({ onSuccess, onUnverified, onRegister, onForgot }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error, login: doLogin, clearError } = useLoginStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    clearError();
    doLogin(
      { email, password },
      { onSuccess: () => onSuccess(email), onUnverified },
    );
  };

  return (
    <>
      {error && <p className="text-danger text-center mb-3">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            id="emailInput"
            type="email"
            className="form-control"
            placeholder="Введіть пошту"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <PasswordInput
            id="passwordInput"
            placeholder="Введіть пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-100 text-decoration-none rounded-4 fw-bold m-0"
        >
          {loading ? "Заходимо..." : "Увійти"}
        </button>
      </form>
      <button
        type="button"
        onClick={onForgot}
        className="btn btn-outline-primary w-100 text-break rounded-4 fw-bold mt-3"
      >
        Забули пароль?
      </button>

      <button
        type="button"
        onClick={onRegister}
        className="btn btn-outline-primary w-100 text-break rounded-4 fw-bold mt-4"
      >
        Зареєструватися
      </button>
    </>
  );
}
