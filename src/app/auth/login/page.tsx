import { AuthLayout } from '@/components/auth/auth-layout';
import { AuthCard } from '@/components/auth/auth-card';
import LoginForm from '@/components/auth/login-form';

export default function Login() {
  return (
    <AuthLayout>
      <AuthCard title="Sign In">
        <LoginForm />
      </AuthCard>
    </AuthLayout>
  );
}