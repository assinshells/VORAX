import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { AuthLayout } from "@widgets/layouts";
import { OtpForm } from "@features/auth/verify-otp/ui/OtpForm.jsx";
import { ROUTES, APP_NAME } from "@shared/constants/auth.constants.js";

export function VerifyOtpPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email = params.get("email");

  if (!email) return <Navigate to={ROUTES.FORGOT} replace />;

  return (
    <AuthLayout
      title={APP_NAME}
      subtitle="Перевіримо, що це справді ви. Введіть код — і рухаємось далі."
    >
      <OtpForm
        email={email}
        // verifiedToken — секрет, поэтому передаём через router state, а не в URL.
        onSuccess={(verifiedToken) =>
          navigate(ROUTES.RESET, { state: { verifiedToken }, replace: true })
        }
        onBack={() => navigate(ROUTES.FORGOT)}
      />
    </AuthLayout>
  );
}
