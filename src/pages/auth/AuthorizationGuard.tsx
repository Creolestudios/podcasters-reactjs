import React, { FC } from 'react';
import PodcasterRoutes from '../../routing/PodcasterRoutes';
import ListenerRoutes from '../../routing/ListenerRoutes';
import AdminRoutes from '../../routing/AdminRoutes';
import AdvertiserRoutes from '../../routing/AdvertiserRoutes';

import { USER_ROLE, APP_HOST } from '../../constant';
import OpenRoutes from '../../routing/OpenRoutes';

const AuthorizationGuard = () => {
  const ROLES = JSON.parse(localStorage.getItem('roles') ?? '');
  const HOST = localStorage.getItem('host');

  if (ROLES.includes(USER_ROLE.PODCASTER) && HOST === APP_HOST.PODCASTER) {
    return <PodcasterRoutes />;
  }
  if (ROLES.includes(USER_ROLE.LISTENER) && HOST === APP_HOST.LISTENER) {
    return <ListenerRoutes />;
  }
  if (ROLES.includes(USER_ROLE.ADVERTISER) && HOST === APP_HOST.ADVERTISER) {
    return <AdvertiserRoutes />;
  }
  if (ROLES.includes(USER_ROLE.ADMIN) && HOST === APP_HOST.ADMIN) {
    return <AdminRoutes />;
  }
  return <OpenRoutes />;
};

export default AuthorizationGuard;
