import { createFileRoute } from '@tanstack/react-router';

import RegisterForm from '../components/register-form';
import AuthLayout from '../layouts/auth-layout';

export const Route = createFileRoute('/register')({
  component: Register,
});

function Register() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
