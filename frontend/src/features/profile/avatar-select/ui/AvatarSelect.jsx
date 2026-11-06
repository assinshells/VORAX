import { useState } from "react";
import { Check } from "lucide-react";
import { Avatar } from "@entities/avatar/ui/Avatar.jsx";
import {
  AVATAR_GROUPS,
  DEFAULT_AVATAR_ID,
  GENDER_META,
  findAvatar,
} from "@entities/avatar/model/avatars.js";

/**
 * AvatarSelect — страница делится 70/30: слева 12 аватаров (по 4 на пол),
 * справа описание выбранного. onSave(avatarId) -> Promise<boolean>.
 */
export function AvatarSelect({ currentAvatar, saving, error, onSave }) {
  const [selectedId, setSelectedId] = useState(
    currentAvatar && currentAvatar !== DEFAULT_AVATAR_ID ? currentAvatar : null,
  );
  const selected = findAvatar(selectedId);
  const meta = selected ? GENDER_META[selected.gender] : null;

  return (
    <div className="avatar-split">
      <section className="avatar-split__main">
        <h4 className="mb-4">Выберите аватар</h4>
        {AVATAR_GROUPS.map((group) => (
          <div key={group.gender} className="mb-4">
            <h6 className="text-muted mb-3">{group.title}</h6>
            <div className="avatar-grid">
              {group.avatars.map((a) => {
                const active = a.id === selectedId;
                return (
                  <button
                    key={a.id}
                    type="button"
                    className={`avatar-option${active ? " is-active" : ""}`}
                    onClick={() => setSelectedId(a.id)}
                    aria-pressed={active}
                    aria-label={a.label}
                  >
                    <Avatar id={a.id} size={80} />
                    {active && (
                      <span className="avatar-option__check">
                        <Check size={14} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <aside className="avatar-split__aside">
        <div className="card p-4 rounded-4 shadow-sm text-center">
          <Avatar id={selected?.id ?? DEFAULT_AVATAR_ID} size={120} className="mx-auto mb-3" />
          {selected ? (
            <>
              <h5 className="mb-1">{selected.label}</h5>
              <p className="fw-semibold mb-2">Аватар {meta.short}</p>
              <p className="text-muted small mb-3">{meta.description}</p>
              <dl className="small text-start mb-4">
                <dt className="text-muted">Пол в профиле</dt>
                <dd className="mb-0">{meta.title}</dd>
              </dl>
            </>
          ) : (
            <>
              <h5 className="mb-2">Аватар не выбран</h5>
              <p className="text-muted small mb-4">
                Выберите любой аватар слева — здесь появится его описание, а
                пол в профиле подставится автоматически.
              </p>
            </>
          )}

          {error && <p className="text-danger small">{error}</p>}

          <button
            type="button"
            className="btn btn-primary w-100 rounded-4 fw-bold"
            disabled={!selected || saving}
            onClick={() => onSave(selected.id)}
          >
            {saving ? "Сохраняем..." : "Сохранить"}
          </button>
        </div>
      </aside>
    </div>
  );
}
