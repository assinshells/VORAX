import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@widgets/layouts";
import { RegisterForm } from "@features/auth/register/ui/RegisterForm.jsx";
import { ROUTES, APP_NAME } from "@shared/constants/auth.constants.js";

export function RegisterPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout
      title={APP_NAME}
      subtitle="Ще не з нами? Буває. У кожного колись перший раз — приєднуйтесь і побачите самі."
    >
      <RegisterForm
        onSuccess={(email) =>
          navigate(`${ROUTES.VERIFY_EMAIL}?email=${encodeURIComponent(email)}`)
        }
        onBack={() => navigate(ROUTES.LOGIN)}
      />
    </AuthLayout>
  );
}
