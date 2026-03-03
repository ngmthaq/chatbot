import { createFileRoute } from '@tanstack/react-router';

import RegisterForm from '../../components/register-form';

export const Route = createFileRoute('/_guest/register')({
  component: Register,
});

function Register() {
  return <RegisterForm />;
}
