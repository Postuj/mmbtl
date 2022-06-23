import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useAuth from './useAuth';

const useProtectedRoute = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [router, user]);

  return user;
};

export default useProtectedRoute;
