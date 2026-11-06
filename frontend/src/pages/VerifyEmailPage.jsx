import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { AuthLayout } from "@widgets/layouts";
import { VerifyEmailForm } from "@features/auth/verify-email/ui/VerifyEmailForm.jsx";
import { ROUTES, APP_NAME } from "@shared/constants/auth.constants.js";

export function VerifyEmailPage({ onVerified }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email = params.get("email");

  if (!email) return <Navigate to={ROUTES.REGISTER} replace />;

  return (
    <AuthLayout
      title={APP_NAME}
      subtitle={`Ми надіслали код на ${email}. Введіть його, щоб активувати пошту.`}
    >
      <VerifyEmailForm
        email={email}
        onSuccess={() => onVerified(email)}
        onBack={() => navigate(ROUTES.LOGIN)}
      />
    </AuthLayout>
  );
}
