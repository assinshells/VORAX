import { useEffect } from "react";
import { PageLayout } from "@widgets/layouts";
import { useProfileStore } from "@features/profile/model/useProfileStore.js";
import { formatDate } from "@shared/lib/date.js";

function Row({ label, children }) {
  return (
    <div className="row py-2 border-bottom">
      <dt className="col-12 col-sm-5 text-muted fw-normal">{label}</dt>
      <dd className="col-12 col-sm-7 mb-0">{children}</dd>
    </div>
  );
}

export function ProfilePage() {
  const { profile, refreshProfile } = useProfileStore();

  // Обновляем данные при открытии — в частности актуальный статус.
  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  if (!profile) return null;

  const fullName =
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") || "—";

  return (
    <PageLayout title="Профиль">
      <div className="card p-4 rounded-4 shadow-sm">
        <dl className="mb-0">
          <Row label="Никнейм">{profile.nickname ?? "—"}</Row>
          <Row label="Имя Фамилия">{fullName}</Row>
          <Row label="Компания">{profile.companyName ?? "—"}</Row>
          <Row label="Статус">
            <span
              className={`badge rounded-pill ${
                profile.online ? "text-bg-success" : "text-bg-secondary"
              }`}
            >
              {profile.online ? "Онлайн" : "Офлайн"}
            </span>
          </Row>
          <Row label="Дата регистрации">{formatDate(profile.createdAt)}</Row>
          <Row label="Дата рестарта">{formatDate(profile.restartedAt)}</Row>
        </dl>
      </div>
    </PageLayout>
  );
}
