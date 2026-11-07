import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { PageLayout } from "@widgets/layouts";
import { OtpCodeForm } from "@shared/ui/OtpCodeForm.jsx";
import { ROUTES } from "@shared/constants/auth.constants.js";
import { maskEmail } from "@shared/lib/maskEmail.js";
import { useAccountStore } from "@features/account/model/useAccountStore.js";
import { useProfileStore } from "@features/profile/model/useProfileStore.js";

const DAY_MS = 86_400_000;

export function DeleteAccountPage({ profile }) {
  const navigate = useNavigate();
  const { loading, error, confirmDeletion, requestDeletion, clearError } =
    useAccountStore();
  const [info, setInfo] = useState(null);

  // Уже помечен — подтверждать нечего.
  if (profile.deleteAt) return <Navigate to={ROUTES.SETTINGS} replace />;

  const handleSubmit = async (code) => {
    clearError();
    setInfo(null);
    if (!(await confirmDeletion(code))) return;

    // Срок берём из ответа сервера (а не хардкодим 7), по его часам.
    const { profile: updated, clockOffset } = useProfileStore.getState();
    const days = Math.round(
      (Date.parse(updated.deleteAt) - (Date.now() + clockOffset)) / DAY_MS,
    );
    navigate(ROUTES.SETTINGS, {
      replace: true,
      state: {
        notice: `Аккаунт помечен для удаления и будет удалён через ${days} дн. До этого момента он остаётся активным.`,
      },
    });
  };

  const handleResend = async () => {
    clearError();
    setInfo(null);
    if (await requestDeletion()) setInfo("Код отправлен повторно.");
  };

  return (
    <PageLayout
      title="Подтвердите удаление"
      subtitle={`Мы отправили код на ${maskEmail(profile.email)}. Введите его, чтобы пометить аккаунт для удаления.`}
      maxWidth="26rem"
    >
      <div className="card p-4 rounded-4 shadow-sm">
        <OtpCodeForm
          loading={loading}
          error={error}
          info={info}
          submitLabel="Подтвердить удаление"
          onChange={clearError}
          onSubmit={handleSubmit}
          onResend={handleResend}
          onBack={() => navigate(ROUTES.SETTINGS)}
        />
      </div>
    </PageLayout>
  );
}
