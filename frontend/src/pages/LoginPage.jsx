import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@widgets/layouts";
import { LoginForm } from "@features/auth/login/ui/LoginForm.jsx";
import { ROUTES, APP_NAME } from "@shared/constants/auth.constants.js";

export function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();

  return (
    <AuthLayout
      title={APP_NAME}
      subtitle="Раді бачити вас знову. Увійдіть, щоб продовжити."
    >
      <LoginForm
        onSuccess={onLoginSuccess}
        onUnverified={(email) =>
          navigate(`${ROUTES.VERIFY_EMAIL}?email=${encodeURIComponent(email)}`)
        }
        onRegister={() => navigate(ROUTES.REGISTER)}
        onForgot={() => navigate(ROUTES.FORGOT)}
      />
    </AuthLayout>
  );
}
