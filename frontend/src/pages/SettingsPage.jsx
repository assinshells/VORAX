import { Link, useLocation, useNavigate } from "react-router-dom";
import { PageLayout } from "@widgets/layouts";
import { ROUTES } from "@shared/constants/auth.constants.js";
import { maskEmail } from "@shared/lib/maskEmail.js";
import { RestartBlock } from "@features/profile/restart/ui/RestartBlock.jsx";
import { useProfileStore } from "@features/profile/model/useProfileStore.js";
import { useAccountStore } from "@features/account/model/useAccountStore.js";

export function SettingsPage({ profile }) {
  const navigate = useNavigate();
  const notice = useLocation().state?.notice;
  const { saving, error: restartError, restart } = useProfileStore();
  const {
    loading,
    error: accountError,
    requestDeletion,
    cancelDeletion,
  } = useAccountStore();

  // Код отправляем сразу, а подтверждение — на отдельной странице.
  const handleDelete = async () => {
    if (await requestDeletion()) navigate(ROUTES.DELETE_ACCOUNT);
  };

  // После успешного «Начать заново» профиль без компании —
  // App сам перенаправит на стартовую страницу.
  return (
    <PageLayout title="Настройки">
      {notice && <p className="text-success mb-3">{notice}</p>}

      <div className="card p-4 rounded-4 shadow-sm mb-3">
        <h5 className="mb-2">Email</h5>
        <p className="text-muted mb-3">{maskEmail(profile.email)}</p>
        <div>
          <Link to={ROUTES.CHANGE_EMAIL} className="btn btn-outline-primary rounded-4">
            Сменить email
          </Link>
        </div>
      </div>

      <div className="card p-4 rounded-4 shadow-sm mb-3">
        <h5 className="mb-2">Пароль</h5>
        <p className="text-muted mb-3">
          Код подтверждения придёт на вашу почту. После смены нужно войти заново.
        </p>
        <div>
          <Link to={ROUTES.CHANGE_PASSWORD} className="btn btn-outline-primary rounded-4">
            Сменить пароль
          </Link>
        </div>
      </div>

      <div className="mb-3">
        <RestartBlock saving={saving} error={restartError} onRestart={restart} />
      </div>

      <div className="card p-4 rounded-4 shadow-sm">
        <h5 className="mb-2">Удаление аккаунта</h5>
        {profile.deleteAt ? (
          <>
            <p className="text-muted mb-3">
              Аккаунт помечен для удаления — срок указан в баннере вверху
              страницы. До этого момента его можно восстановить.
            </p>
            {accountError && <p className="text-danger mb-3">{accountError}</p>}
            <div>
              <button
                type="button"
                className="btn btn-primary rounded-4"
                disabled={loading}
                onClick={cancelDeletion}
              >
                {loading ? "Отменяем..." : "Отменить удаление"}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-muted mb-3">
              Мы отправим код на вашу почту. После подтверждения аккаунт будет
              удалён через несколько дней — до этого удаление можно отменить.
            </p>
            {accountError && <p className="text-danger mb-3">{accountError}</p>}
            <div>
              <button
                type="button"
                className="btn btn-outline-danger rounded-4"
                disabled={loading}
                onClick={handleDelete}
              >
                {loading ? "Отправляем код..." : "Удалить аккаунт"}
              </button>
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}
