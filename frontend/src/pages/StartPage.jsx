import { useNavigate } from "react-router-dom";
import { ROUTES, APP_NAME } from "@shared/constants/auth.constants.js";
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
    <div className="container py-4" style={{ maxWidth: "36rem" }}>
      <header className="mb-4">
        <h4 className="mb-1 text-muted">{APP_NAME}</h4>
        <span className="d-block text-muted">
          Заполните данные, чтобы начать работу.
        </span>
      </header>
      <StartForm saving={saving} error={error} onSave={handleSave} />
    </div>
  );
}
