import { useEffect } from "react";
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
    [profile.first_name, profile.last_name].filter(Boolean).join(" ") || "—";

  return (
    <div className="card p-4 rounded-4 shadow-sm" style={{ maxWidth: "36rem" }}>
      <h4 className="mb-3">Профиль</h4>
      <dl className="mb-0">
        <Row label="Никнейм">{profile.nickname ?? "—"}</Row>
        <Row label="Имя Фамилия">{fullName}</Row>
        <Row label="Компания">{profile.company_name ?? "—"}</Row>
        <Row label="Статус">
          <span
            className={`badge rounded-pill ${
              profile.online ? "text-bg-success" : "text-bg-secondary"
            }`}
          >
            {profile.online ? "Онлайн" : "Офлайн"}
          </span>
        </Row>
        <Row label="Дата регистрации">{formatDate(profile.created_at)}</Row>
        <Row label="Дата рестарта">{formatDate(profile.restarted_at)}</Row>
      </dl>
    </div>
  );
}
