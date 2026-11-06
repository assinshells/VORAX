import { Link } from "react-router-dom";
import { LogoutButton } from "@features/auth/logout/ui/LogoutButton.jsx";
import { Avatar } from "@entities/avatar/ui/Avatar.jsx";
import { GENDER_META, GENDERS } from "@entities/avatar/model/avatars.js";
import { ROUTES } from "@shared/constants/auth.constants.js";

/**
 * HomePage — заглушка защищённой страницы, куда пользователь попадает
 * после успешного входа. Демонстрирует, где используется кнопка "Log out".
 */
export function HomePage({ profile, onLogout }) {
  const gender = GENDER_META[profile?.gender] ?? GENDER_META[GENDERS.UNKNOWN];

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 text-center">
          <Avatar id={profile?.avatar} size={112} className="mb-3" />
          <h2 className="mb-1">Вы вошли как {profile?.login ?? "anonymous"}</h2>
          <p className="text-muted mb-1">Пол: {gender.title}</p>
          <p className="mb-3">
            <Link to={ROUTES.AVATAR}>Сменить аватар</Link>
          </p>
          <p className="text-muted mb-4">
            Это защищённая страница. Доступ к ней возможен только с валидной
            сессией.
          </p>
          <LogoutButton onLoggedOut={onLogout} />
        </div>
      </div>
    </div>
  );
}
