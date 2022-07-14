import { useEffect, useState } from 'react';
import { User } from '../common/entities/User';
import { AuthService } from '../services/AuthService';

const useAuthService = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const authService = AuthService.getInstance();

  const tryRefreshTokenLogin = async () => {
    const result = await authService.tryRefreshTokenLogin();
    if (!result) setLoading(false);
  };

  useEffect(() => {
    authService.onAuthStateChanged((authUser) => {
      setUser(authUser);
      if (loading) setLoading(false);
    });
    tryRefreshTokenLogin();
  }, []);

  return {
    user,
    loading,
    authService,
  };
};

export default useAuthService;
