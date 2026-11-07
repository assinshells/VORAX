/**
 * CounterInput — поле ввода со счётчиком символов «N/max» внутри поля,
 * подписью, информационным текстом и сообщением об ошибке.
 */
export function CounterInput({
  id,
  label,
  value,
  max,
  onChange,
  info,
  error,
  placeholder,
  autoComplete = "off",
}) {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={id} className="form-label fw-semibold">
          {label}
        </label>
      )}
      <div className="counter-input">
        <input
          id={id}
          type="text"
          className={`form-control${error ? " is-invalid" : ""}`}
          placeholder={placeholder}
          autoComplete={autoComplete}
          maxLength={max}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <span className="counter-input__counter">
          {value.length}/{max}
        </span>
      </div>
      {error ? (
        <div className="text-danger small mt-1">{error}</div>
      ) : (
        info && <div className="text-muted small mt-1">{info}</div>
      )}
    </div>
  );
}
