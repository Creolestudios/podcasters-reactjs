import React, { FC } from 'react';
import OpenRoutes from '../../routing/OpenRoutes';

const PrivateRoute: FC<{ children: JSX.Element }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('accessToken');

  if (!isAuthenticated) {
    return <OpenRoutes />;
  }

  return children;
};

export default PrivateRoute;
