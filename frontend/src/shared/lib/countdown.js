const pad = (n) => String(n).padStart(2, "0");

/** Разбивает миллисекунды на дни/часы/минуты/секунды (не меньше 0). */
export const splitRemaining = (ms) => {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    total,
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
};

export const formatRemaining = ({ days, hours, minutes, seconds }) =>
  `${days} д ${pad(hours)} ч ${pad(minutes)} мин ${pad(seconds)} с`;
