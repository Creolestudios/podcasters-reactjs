import React, { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { APP_HOST, USER_ROLE } from '../../constant';
import {
  PODCASTER_APP_ROUTES,
  ADVERTISER_APP_ROUTES,
  ADMIN_APP_ROUTES,
  OPEN_APP_ROUTES,
} from '../../constant/appRoute';

const PublicRoute: FC<{ children: JSX.Element }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('accessToken');
  const HOST = localStorage.getItem('host');
  const ROLES = localStorage.getItem('roles')
    ? JSON.parse(localStorage.getItem('roles') ?? '')
    : null;

  if (!isAuthenticated) {
    return children;
  }

  if (ROLES.includes(USER_ROLE.PODCASTER) && HOST === APP_HOST.PODCASTER) {
    return <Navigate to={PODCASTER_APP_ROUTES.ROOT} />;
  }
  if (ROLES.includes(USER_ROLE.LISTENER) && HOST === APP_HOST.LISTENER) {
    return <Navigate to={OPEN_APP_ROUTES.ROOT} />;
  }
  if (ROLES.includes(USER_ROLE.ADVERTISER) && HOST === APP_HOST.ADVERTISER) {
    return <Navigate to={ADVERTISER_APP_ROUTES.ROOT} />;
  }
  if (ROLES.includes(USER_ROLE.ADMIN) && HOST === APP_HOST.ADMIN) {
    return <Navigate to={ADMIN_APP_ROUTES.ROOT} />;
  }
  return <Navigate to={OPEN_APP_ROUTES.ROOT} />;
};

export default PublicRoute;
