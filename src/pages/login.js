import { useEffect } from 'react';
import { useRouter } from 'next/router';
import {  ROUTES } from '@/lib/constants';
import {  getAuth } from '@/lib/storage';
import LoginForm from '@/components/LoginForm/LoginForm';

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    if (getAuth()) {
      router.push(ROUTES.DASHBOARD);
    }
  }, [router]);

  return (
    <>
      <LoginForm />
    </>
  );
}