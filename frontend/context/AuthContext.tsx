import { createContext, ReactNode, useContext } from 'react';
import { User } from '../common/entities/User';
import useAuthService from '../hooks/useAuthService';
import { AuthService } from '../services/AuthService';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  authService: AuthService;
};
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  authService: AuthService.getInstance(),
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading, authService } = useAuthService();

  return (
    <AuthContext.Provider value={{ user, loading, authService }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
