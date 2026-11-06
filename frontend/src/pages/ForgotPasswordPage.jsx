import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@widgets/layouts";
import { ForgotPasswordForm } from "@features/auth/forgot-password/ui/ForgotPasswordForm.jsx";
import { ROUTES, APP_NAME } from "@shared/constants/auth.constants.js";

export function ForgotPasswordPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout
      title={APP_NAME}
      subtitle="Забули пароль? Не страшно. Ми теж не пам'ятаємо все на світі — зараз все виправимо."
    >
      <ForgotPasswordForm
        onSuccess={(email) =>
          navigate(`${ROUTES.VERIFY_OTP}?email=${encodeURIComponent(email)}`)
        }
        onBack={() => navigate(ROUTES.LOGIN)}
      />
    </AuthLayout>
  );
}
