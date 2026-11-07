/**
 * PageLayout — обычная страница приложения под шапкой:
 * заголовок + узкая колонка контента.
 */
export function PageLayout({ title, subtitle, children, maxWidth = "36rem" }) {
  return (
    <div className="container py-4">
      <div className="mx-auto w-100" style={{ maxWidth }}>
        <header className="mb-4">
          <h4 className="mb-1">{title}</h4>
          {subtitle && <span className="d-block text-muted">{subtitle}</span>}
        </header>
        {children}
      </div>
    </div>
  );
}
