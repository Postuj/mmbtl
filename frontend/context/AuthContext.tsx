import { createContext, ReactNode, useContext } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebaseApp from '../firebase/client';

type AuthContextType = {
  user: User | null | undefined;
  loading: boolean;
};
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const auth = getAuth(firebaseApp);
  const [user, loading, error] = useAuthState(auth);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
