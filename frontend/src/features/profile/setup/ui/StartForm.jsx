import { useState } from "react";
import { CounterInput } from "@shared/ui/CounterInput.jsx";
import {
  LIMITS,
  WORD_RE,
  NAME_RE,
  WORD_HINT,
  NAME_HINT,
} from "@shared/lib/validation.js";

const wordError = (v) =>
  v && !WORD_RE.test(v) ? "Допустимы только латинские буквы, цифры и _" : null;
const nameError = (v) =>
  v && !NAME_RE.test(v) ? "Допустимы только латинские буквы" : null;

/**
 * StartForm — три блока: никнейм, название компании, имя и фамилия.
 * onSave({ nickname, companyName, firstName, lastName }) -> Promise<boolean>
 */
export function StartForm({ saving, error, onSave }) {
  const [nickname, setNickname] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const errors = {
    nickname: wordError(nickname),
    companyName: wordError(companyName),
    firstName: nameError(firstName),
    lastName: nameError(lastName),
  };
  const filled = nickname && companyName && firstName && lastName;
  const valid = filled && !Object.values(errors).some(Boolean);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!valid) return;
    onSave({ nickname, companyName, firstName, lastName });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="card p-4 rounded-4 shadow-sm mb-3">
        <h5 className="mb-3">Никнейм</h5>
        <CounterInput
          id="nicknameInput"
          value={nickname}
          max={LIMITS.NICKNAME}
          onChange={setNickname}
          placeholder="Введите никнейм"
          autoComplete="username"
          info={WORD_HINT}
          error={errors.nickname}
        />
      </div>

      <div className="card p-4 rounded-4 shadow-sm mb-3">
        <h5 className="mb-3">Название компании</h5>
        <CounterInput
          id="companyInput"
          value={companyName}
          max={LIMITS.COMPANY}
          onChange={setCompanyName}
          placeholder="Введите название компании"
          info={WORD_HINT}
          error={errors.companyName}
        />
      </div>

      <div className="card p-4 rounded-4 shadow-sm mb-3">
        <h5 className="mb-3">Имя и фамилия</h5>
        <div className="row">
          <div className="col-12 col-md-6">
            <CounterInput
              id="firstNameInput"
              value={firstName}
              max={LIMITS.NAME}
              onChange={setFirstName}
              placeholder="Имя"
              autoComplete="given-name"
              error={errors.firstName}
            />
          </div>
          <div className="col-12 col-md-6">
            <CounterInput
              id="lastNameInput"
              value={lastName}
              max={LIMITS.NAME}
              onChange={setLastName}
              placeholder="Фамилия"
              autoComplete="family-name"
              error={errors.lastName}
            />
          </div>
        </div>
        <div className="text-muted small">{NAME_HINT}</div>
      </div>

      {error && <p className="text-danger text-center mb-3">{error}</p>}

      <button
        type="submit"
        disabled={!valid || saving}
        className="btn btn-primary w-100 rounded-4 fw-bold"
      >
        {saving ? "Сохраняем..." : "Сохранить"}
      </button>
    </form>
  );
}
