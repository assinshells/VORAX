export const GENDERS = Object.freeze({
  MALE: "male",
  FEMALE: "female",
  UNKNOWN: "unknown",
});

// Значение по умолчанию в БД: пользователь ещё не выбирал аватар.
export const DEFAULT_AVATAR = "default";

// Каталог аватаров-заглушек: 4 мужских, 4 женских, 4 нейтральных.
// Пол определяется на сервере по id аватара — клиенту не доверяем,
// иначе можно записать аватар одного пола с другим полом.
// Должен совпадать с каталогом на frontend (entities/avatar).
export const AVATARS = Object.freeze(
  [GENDERS.MALE, GENDERS.FEMALE, GENDERS.UNKNOWN].flatMap((gender) =>
    [1, 2, 3, 4].map((n) => Object.freeze({ id: `${gender}-${n}`, gender })),
  ),
);

export const AVATAR_GENDER_BY_ID = Object.freeze(
  Object.fromEntries(AVATARS.map((a) => [a.id, a.gender])),
);
