export const DEFAULT_AVATAR_ID = "default";

export const GENDERS = Object.freeze({
  MALE: "male",
  FEMALE: "female",
  UNKNOWN: "unknown",
});

// Тексты описаний (заглушки) для правой части страницы выбора.
export const GENDER_META = Object.freeze({
  [GENDERS.MALE]: {
    title: "Мужской",
    short: "мужского пола",
    description:
      "Аватар мужского пола. В профиле будет указан пол: мужской. Это заглушка — позже здесь появятся настоящие изображения.",
  },
  [GENDERS.FEMALE]: {
    title: "Женский",
    short: "женского пола",
    description:
      "Аватар женского пола. В профиле будет указан пол: женский. Это заглушка — позже здесь появятся настоящие изображения.",
  },
  [GENDERS.UNKNOWN]: {
    title: "Не указан",
    short: "неопределённого пола",
    description:
      "Нейтральный аватар. В профиле пол останется не указанным. Это заглушка — позже здесь появятся настоящие изображения.",
  },
});

const COLORS = {
  [GENDERS.MALE]: ["#3b82f6", "#0ea5e9", "#6366f1", "#14b8a6"],
  [GENDERS.FEMALE]: ["#ec4899", "#f43f5e", "#a855f7", "#f97316"],
  [GENDERS.UNKNOWN]: ["#64748b", "#78716c", "#84cc16", "#eab308"],
};

// 12 аватаров: 4 мужских, 4 женских, 4 неизвестных.
// id должны совпадать с backend/src/constants/avatar.constants.js.
export const AVATARS = Object.freeze(
  Object.values(GENDERS).flatMap((gender) =>
    [1, 2, 3, 4].map((n) =>
      Object.freeze({
        id: `${gender}-${n}`,
        gender,
        variant: n,
        label: `${GENDER_META[gender].title} ${n}`,
        color: COLORS[gender][n - 1],
      }),
    ),
  ),
);

export const AVATAR_GROUPS = Object.freeze(
  Object.values(GENDERS).map((gender) => ({
    gender,
    title: GENDER_META[gender].title,
    avatars: AVATARS.filter((a) => a.gender === gender),
  })),
);

export const findAvatar = (id) => AVATARS.find((a) => a.id === id) ?? null;
