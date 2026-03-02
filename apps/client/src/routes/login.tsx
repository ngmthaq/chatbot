import { createFileRoute } from '@tanstack/react-router';

import LoginForm from '../components/login-form';
import AuthLayout from '../layouts/auth-layout';

export const Route = createFileRoute('/login')({
  component: Login,
});

function Login() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
