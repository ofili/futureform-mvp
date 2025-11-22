'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/auth/create-organization');
  }, [router]);
  
  return null;
}