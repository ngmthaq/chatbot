import { createFileRoute } from '@tanstack/react-router';

import ForgotPasswordForm from '../../components/forgot-password-form';

export const Route = createFileRoute('/_guest/forgot-password')({
  component: ForgotPassword,
});

function ForgotPassword() {
  return <ForgotPasswordForm />;
}
