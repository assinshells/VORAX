import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { TriangleAlert } from "lucide-react";
import { ROUTES } from "@shared/constants/auth.constants.js";
import { formatRemaining, splitRemaining } from "@shared/lib/countdown.js";

/**
 * DeletionBanner — на всех страницах показывает, через сколько аккаунт
 * будет удалён (дни/часы/минуты/секунды). Время считается по часам
 * сервера: clockOffset = serverNow - clientNow на момент загрузки профиля.
 * Когда отсчёт дошёл до нуля — вызываем onExpired (аккаунт удалён).
 */
export function DeletionBanner({ deleteAt, clockOffset = 0, onExpired }) {
  const target = Date.parse(deleteAt);
  const [now, setNow] = useState(() => Date.now() + clockOffset);

  useEffect(() => {
    const tick = () => setNow(Date.now() + clockOffset);
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [clockOffset]);

  const remaining = splitRemaining(target - now);

  const firedRef = useRef(false);
  useEffect(() => {
    if (remaining.total === 0 && !firedRef.current) {
      firedRef.current = true;
      onExpired?.();
    }
  }, [remaining.total, onExpired]);

  return (
    <div className="deletion-banner" role="alert">
      <div className="container d-flex flex-wrap align-items-center justify-content-center gap-2 py-2">
        <TriangleAlert size={18} />
        <span>
          Аккаунт будет удалён через{" "}
          <strong className="deletion-banner__time">
            {formatRemaining(remaining)}
          </strong>
        </span>
        <Link to={ROUTES.SETTINGS} className="deletion-banner__link">
          Отменить
        </Link>
      </div>
    </div>
  );
}
