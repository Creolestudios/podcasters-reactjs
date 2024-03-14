import React, { FC, Suspense, lazy } from 'react';
import {
  Routes, Route, Outlet, Navigate,
} from 'react-router-dom';
import APP_ROUTES, { ADMIN_APP_ROUTES as ADMIN } from '../constant/appRoute';

const Dashboard = lazy(() => import('../pages/admin/Dashboard/Dashboard'));
const AdminListener = lazy(() => import('../pages/admin/Listener/AdminListener'));
const AdminPodcaster = lazy(() => import('../pages/admin/Podcaster/AdminPodcaster'));
const AdminPodcastList = lazy(() => import('../pages/admin/Podcaster/AdminPodcastList'));
const AdminPromoCode = lazy(
  () => import('../pages/admin/PromoCode/AdminPromoCode'),
);

const AdminRoutes: FC = () => (
  <Suspense fallback={null}>
    <Routes>
      <Route path={ADMIN.ROOT} element={<Outlet />}>
        <Route index element={<Navigate to={`${ADMIN.ROOT}/${ADMIN.DASHBOARD}`} />} />
        <Route path={ADMIN.DASHBOARD} element={<Dashboard />} />
        <Route path={ADMIN.PODCASTER} element={<Outlet />}>
          <Route index element={<AdminPodcaster />} />
          <Route path={ADMIN.PODCAST} element={<AdminPodcastList />} />
        </Route>
        <Route path={ADMIN.LISTENER} element={<AdminListener />} />
        <Route path={ADMIN.ADVERTISER} element={<h2>Admin Advertiser</h2>} />
        <Route path={ADMIN.CATEGORY} element={<h2>Admin Category</h2>} />
        <Route path={ADMIN.COMMENT} element={<h2>Admin Comment</h2>} />
        <Route path={ADMIN.SETTINGS} element={<h2>Admin Settings</h2>} />
        <Route path={ADMIN.PAYOUT} element={<h2>Admin Payout</h2>} />
        <Route path={ADMIN.PROMOCODE} element={<AdminPromoCode />} />

        <Route path={ADMIN.PROFILE} element={<h2>Profile</h2>} />
        <Route path={ADMIN.MANAGE_ADMIN} element={<h2>Manage Admin Page</h2>} />
        <Route path={ADMIN.MANAGE_PLAN} element={<h2>Manage Plan Page</h2>} />

        <Route
          path={APP_ROUTES.NOT_FOUND}
          element={<Navigate to={`${ADMIN.ROOT}/${ADMIN.DASHBOARD}`} />}
        />
      </Route>
      <Route
        path={APP_ROUTES.NOT_FOUND}
        element={<Navigate to={`${ADMIN.ROOT}/${ADMIN.DASHBOARD}`} />}
      />
    </Routes>
  </Suspense>
);

export default AdminRoutes;
