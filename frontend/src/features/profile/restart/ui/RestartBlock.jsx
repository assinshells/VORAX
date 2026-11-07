import { useState } from "react";
import { RotateCcw } from "lucide-react";

/**
 * RestartBlock — блок «Начать заново» в настройках. Двухшаговое
 * подтверждение, чтобы случайно не стереть данные.
 * onRestart() -> Promise<boolean>
 */
export function RestartBlock({ saving, error, onRestart }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="card p-4 rounded-4 shadow-sm">
      <h5 className="mb-2">Начать заново</h5>
      <p className="text-muted mb-3">
        Все параметры (никнейм, название компании, имя и фамилия) будут
        удалены, а вы вернётесь на стартовую страницу.
      </p>

      {error && <p className="text-danger mb-3">{error}</p>}

      {!confirming ? (
        <div>
          <button
            type="button"
            className="btn btn-outline-danger rounded-4"
            onClick={() => setConfirming(true)}
          >
            <RotateCcw size={18} strokeWidth={2} className="me-2" />
            Начать заново
          </button>
        </div>
      ) : (
        <div className="d-flex flex-wrap align-items-center gap-2">
          <span className="fw-semibold me-2">Вы уверены?</span>
          <button
            type="button"
            className="btn btn-danger rounded-4"
            disabled={saving}
            onClick={onRestart}
          >
            {saving ? "Удаляем..." : "Да, удалить всё"}
          </button>
          <button
            type="button"
            className="btn btn-outline-primary rounded-4"
            disabled={saving}
            onClick={() => setConfirming(false)}
          >
            Отмена
          </button>
        </div>
      )}
    </div>
  );
}
