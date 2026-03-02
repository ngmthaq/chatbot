import { createFileRoute } from '@tanstack/react-router';

import ForgotPasswordForm from '../components/forgot-password-form';
import AuthLayout from '../layouts/auth-layout';

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPassword,
});

function ForgotPassword() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
