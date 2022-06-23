import { useRouter } from 'next/router';
import React, { ReactNode, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import useProtectedRoute from '../../hooks/useProtectedRoute';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const user = useProtectedRoute();

  return <>{user && children}</>;
};

export default ProtectedRoute;
