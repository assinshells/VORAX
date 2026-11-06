import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthLayout } from "@widgets/layouts";
import { ResetPasswordForm } from "@features/auth/reset-password/ui/ResetPasswordForm.jsx";
import { ROUTES, APP_NAME } from "@shared/constants/auth.constants.js";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const verifiedToken = state?.verifiedToken;

  if (!verifiedToken) return <Navigate to={ROUTES.FORGOT} replace />;

  return (
    <AuthLayout
      title={APP_NAME}
      subtitle="Код підтверджено. Лишилось малого — придумайте новий пароль і спробуйте його запам'ятати."
    >
      <ResetPasswordForm
        verifiedToken={verifiedToken}
        onSuccess={() => navigate(ROUTES.LOGIN, { replace: true })}
        onBack={() => navigate(ROUTES.LOGIN)}
      />
    </AuthLayout>
  );
}
