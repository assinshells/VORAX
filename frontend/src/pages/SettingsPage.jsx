import { RestartBlock } from "@features/profile/restart/ui/RestartBlock.jsx";
import { useProfileStore } from "@features/profile/model/useProfileStore.js";

export function SettingsPage() {
  const { saving, error, restart } = useProfileStore();

  // После успешного рестарта профиль без компании — App сам
  // перенаправит на стартовую страницу.
  return (
    <div style={{ maxWidth: "36rem" }}>
      <h4 className="mb-3">Настройки</h4>
      <RestartBlock saving={saving} error={error} onRestart={restart} />
    </div>
  );
}
