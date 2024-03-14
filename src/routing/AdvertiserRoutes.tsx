import React, { FC, Suspense } from 'react';
import {
  Routes, Route, Outlet, Navigate,
} from 'react-router-dom';

import APP_ROUTES, {
  ADVERTISER_APP_ROUTES as ADVERTISER,
} from '../constant/appRoute';

const AdvertiserRoutes: FC = () => (
  <Suspense fallback={null}>
    <Routes>
      <Route path={ADVERTISER.ROOT} element={<Outlet />}>
        <Route index element={<h2>Advertiser Compaign</h2>} />
        <Route
          path={ADVERTISER.ANALYTICS}
          element={<h2>Advertiser Analytics</h2>}
        />
        <Route
          path={ADVERTISER.TRANSACTION_HISTORY}
          element={<h2>Advertiser Transaction History</h2>}
        />
        <Route
          path={APP_ROUTES.NOT_FOUND}
          element={<Navigate to={ADVERTISER.ROOT} />}
        />
      </Route>
      <Route
        path={APP_ROUTES.NOT_FOUND}
        element={<Navigate to={ADVERTISER.ROOT} />}
      />
    </Routes>
  </Suspense>
);

export default AdvertiserRoutes;
