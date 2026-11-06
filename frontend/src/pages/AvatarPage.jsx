import { useNavigate } from "react-router-dom";
import { ROUTES } from "@shared/constants/auth.constants.js";
import { AvatarSelect } from "@features/profile/avatar-select/ui/AvatarSelect.jsx";
import { useProfileStore } from "@features/profile/model/useProfileStore.js";

export function AvatarPage() {
  const navigate = useNavigate();
  const { profile, saving, error, saveAvatar } = useProfileStore();

  const handleSave = async (avatarId) => {
    const ok = await saveAvatar(avatarId);
    if (ok) navigate(ROUTES.HOME, { replace: true });
  };

  return (
    <div className="container py-4">
      <AvatarSelect
        currentAvatar={profile?.avatar}
        saving={saving}
        error={error}
        onSave={handleSave}
      />
    </div>
  );
}
