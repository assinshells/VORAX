import { useNavigate } from "react-router-dom";
import { PageLayout } from "@widgets/layouts";
import { ROUTES } from "@shared/constants/auth.constants.js";
import { StartForm } from "@features/profile/setup/ui/StartForm.jsx";
import { useProfileStore } from "@features/profile/model/useProfileStore.js";

export function StartPage() {
  const navigate = useNavigate();
  const { saving, error, saveSetup } = useProfileStore();

  const handleSave = async (dto) => {
    const ok = await saveSetup(dto);
    if (ok) navigate(ROUTES.DASHBOARD, { replace: true });
  };

  return (
    <PageLayout
      title="Добро пожаловать"
      subtitle="Заполните данные, чтобы начать работу."
    >
      <StartForm saving={saving} error={error} onSave={handleSave} />
    </PageLayout>
  );
}
