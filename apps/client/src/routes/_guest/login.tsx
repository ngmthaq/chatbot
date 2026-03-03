import { createFileRoute } from '@tanstack/react-router';

import LoginForm from '../../components/login-form';

export const Route = createFileRoute('/_guest/login')({
  component: Login,
});

function Login() {
  return <LoginForm />;
}
