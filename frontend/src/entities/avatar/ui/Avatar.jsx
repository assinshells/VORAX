import { DEFAULT_AVATAR_ID, findAvatar, GENDERS } from "../model/avatars.js";

const SKIN = "#fde3c8";
const HAIR = "#3f2d20";

// Волосы: разный силуэт для каждого из 4 вариантов.
function Hair({ gender, variant }) {
  if (gender === GENDERS.MALE) {
    const paths = [
      "M30 44 Q32 22 50 22 Q68 22 70 44 Q60 32 50 32 Q40 32 30 44Z",
      "M29 48 Q27 20 50 20 Q73 20 71 48 Q66 30 50 30 Q34 30 29 48Z",
      "M31 42 Q36 26 52 24 Q66 24 70 40 Q56 30 31 42Z",
      "M32 40 Q40 18 58 24 Q70 28 68 42 Q52 26 32 40Z",
    ];
    return <path d={paths[variant - 1]} fill={HAIR} />;
  }
  if (gender === GENDERS.FEMALE) {
    const paths = [
      "M28 70 Q22 20 50 20 Q78 20 72 70 Q70 40 50 34 Q30 40 28 70Z",
      "M30 62 Q24 22 50 20 Q76 22 70 62 Q72 36 50 32 Q28 36 30 62Z",
      "M27 78 Q20 24 50 20 Q80 24 73 78 Q74 46 50 34 Q26 46 27 78Z",
      "M31 56 Q28 22 50 20 Q72 22 69 56 Q64 34 50 32 Q36 34 31 56Z",
    ];
    return <path d={paths[variant - 1]} fill={HAIR} />;
  }
  return null; // у нейтральных аватаров волос нет
}

/**
 * Avatar — SVG-заглушка. id === "default" (или неизвестный id) рисует
 * серый силуэт «аватар не выбран».
 */
export function Avatar({ id = DEFAULT_AVATAR_ID, size = 64, className = "" }) {
  const meta = findAvatar(id);
  const bg = meta?.color ?? "#cbd5e1";
  const gender = meta?.gender ?? GENDERS.UNKNOWN;
  const variant = meta?.variant ?? 1;
  const skin = meta ? SKIN : "#f1f5f9";

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={meta ? meta.label : "Аватар по умолчанию"}
    >
      <defs>
        <clipPath id={`clip-${id}-${size}`}>
          <circle cx="50" cy="50" r="50" />
        </clipPath>
      </defs>
      <g clipPath={`url(#clip-${id}-${size})`}>
        <rect width="100" height="100" fill={bg} />
        {gender === GENDERS.FEMALE && meta && (
          <Hair gender={gender} variant={variant} />
        )}
        <ellipse cx="50" cy="104" rx="36" ry="30" fill={skin} opacity="0.95" />
        <circle cx="50" cy="46" r="18" fill={skin} />
        {gender === GENDERS.MALE && <Hair gender={gender} variant={variant} />}
        {gender === GENDERS.UNKNOWN && meta && variant > 1 && (
          <circle
            cx="50"
            cy="46"
            r="18"
            fill="none"
            stroke="#fff"
            strokeWidth={variant === 2 ? 0 : 2}
            strokeDasharray={variant === 4 ? "4 3" : undefined}
            opacity="0.7"
          />
        )}
      </g>
    </svg>
  );
}
