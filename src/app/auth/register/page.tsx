'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function RegisterRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const plan = searchParams.get('plan');
    if (plan) {
      router.replace(`/auth/create-organization?plan=${plan}`);
    } else {
      router.replace('/auth/create-organization');
    }
  }, [router, searchParams]);

  return null;
}

export default function Register() {
  return (
    <Suspense fallback={null}>
      <RegisterRedirect />
    </Suspense>
  );
}