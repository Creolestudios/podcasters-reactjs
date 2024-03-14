import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LinkedInCallback } from 'react-linkedin-login-oauth2';
import APP_ROUTES, {
  ADMIN_APP_ROUTES,
  PODCASTER_APP_ROUTES,
  OPEN_APP_ROUTES,
  ADVERTISER_APP_ROUTES,
} from '../constant/appRoute';
import NotFoundRedirect from './NotFoundRedirect';
import PrivateRoute from '../components/auth/PrivateRoute';
import PublicRoute from '../components/auth/PublicRoute';
import FullPageLoader from '../components/Loader/FullPageLoader';

const AuthorizationGuard = lazy(() => import('../pages/auth/AuthorizationGuard'));
const Layout = lazy(() => import('../pages/layout/Layout'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));
const PodcasterSignupPage = lazy(() => import('../pages/podcaster/Signup/Signup'));
const AdvertiserSignupPage = lazy(() => import('../pages/Advertiser/Signup/Signup'));
const ListenerSignupPage = lazy(() => import('../pages/listener/Signup/Signup'));
const PodCasterLoginPage = lazy(() => import('../pages/podcaster/Login/Login'));
const AdvertiserLoginPage = lazy(() => import('../pages/Advertiser/Login/Login'));
const ListenerLoginPage = lazy(() => import('../pages/listener/Login/LoginPage'));
const ChangePassword = lazy(() => import('../components/Login/ChangePassword'));
const AdminLoginPage = lazy(() => import('../pages/admin/Login/LoginPage'));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy/PrivacyPolicy'));
const TermAndCondition = lazy(() => import('../pages/TermAndCondition/TermAndCondition'));
const ListenerHomePage = lazy(() => import('../pages/listener/Home'));
const ListenerForgotPassword = lazy(
  () => import('../pages/listener/ForgotPassword/ListenerForgotPassword'),
);
const PodcasterForgotPassword = lazy(
  () => import('../pages/podcaster/ForgotPassword/PodcasterForgotPassword'),
);
const AdvertiserForgotPassword = lazy(
  () => import('../pages/Advertiser/ForgotPassword/AdvertiserForgotPassword'),
);
const AdminForgotPassword = lazy(() => import('../pages/admin/ForgotPassword/AdminForgotPassword'));

const Router = () => (
  <Suspense fallback={<FullPageLoader isScreenExist />}>
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<ListenerHomePage />} />
        <Route path={`${APP_ROUTES.PRIVACY_POLICY}`} element={<PrivacyPolicy />} />
        <Route path={`${APP_ROUTES.TERM_CONDITION}`} element={<TermAndCondition />} />
        <Route
          path='/*'
          element={(
            <PrivateRoute>
              <AuthorizationGuard />
            </PrivateRoute>
          )}
        />
      </Route>
      {/* Admin module public routes */}
      <Route
        path={`${ADMIN_APP_ROUTES.ROOT}${APP_ROUTES.LOGIN}`}
        element={(
          <PublicRoute>
            <AdminLoginPage />
          </PublicRoute>
        )}
      />
      {/* Podcaster module public routes */}
      <Route
        path={PODCASTER_APP_ROUTES.SIGN_UP}
        element={(
          <PublicRoute>
            <PodcasterSignupPage />
          </PublicRoute>
        )}
      />
      <Route
        path={PODCASTER_APP_ROUTES.VERIFY}
        element={(
          <PublicRoute>
            <PodCasterLoginPage />
          </PublicRoute>
        )}
      />
      <Route
        path={PODCASTER_APP_ROUTES.ACTIVATION}
        element={(
          <PublicRoute>
            <PodCasterLoginPage />
          </PublicRoute>
        )}
      />
      <Route
        path={PODCASTER_APP_ROUTES.LOGIN}
        element={(
          <PublicRoute>
            <PodCasterLoginPage />
          </PublicRoute>
        )}
      />
      {/* Listener Forgot Password */}
      <Route
        path={`${OPEN_APP_ROUTES.FORGOT_PASSWORD}`}
        element={(
          <PublicRoute>
            <ListenerForgotPassword />
          </PublicRoute>
        )}
      />
      {/* Podcaster Forgot Password */}
      <Route
        path={`/${PODCASTER_APP_ROUTES.FORGOT_PASSWORD}`}
        element={(
          <PublicRoute>
            <PodcasterForgotPassword />
          </PublicRoute>
        )}
      />
      {/* Admin Forgot Password */}
      <Route
        path={`/${ADMIN_APP_ROUTES.FORGOT_PASSWORD}`}
        element={(
          <PublicRoute>
            <AdminForgotPassword />
          </PublicRoute>
        )}
      />
      {/* Advertiser Forgot Password */}
      <Route
        path={`/${ADVERTISER_APP_ROUTES.FORGOT_PASSWORD}`}
        element={(
          <PublicRoute>
            <AdvertiserForgotPassword />
          </PublicRoute>
        )}
      />
      <Route path={OPEN_APP_ROUTES.PASSWORD_UPDATE} element={<ChangePassword />} />
      <Route
        path={OPEN_APP_ROUTES.RESET_PASSWORD}
        element={(
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        )}
      />
      {/* Listener module public routes */}
      <Route
        path={`${OPEN_APP_ROUTES.LOGIN}`}
        element={(
          <PublicRoute>
            <ListenerLoginPage />
          </PublicRoute>
        )}
      />
      <Route
        path={`${OPEN_APP_ROUTES.SIGN_UP}`}
        element={(
          <PublicRoute>
            <ListenerSignupPage />
          </PublicRoute>
        )}
      />
      <Route
        path={OPEN_APP_ROUTES.VERIFY}
        element={(
          <PublicRoute>
            <ListenerLoginPage />
          </PublicRoute>
        )}
      />
      <Route
        path={OPEN_APP_ROUTES.INVITED_USER}
        element={(
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        )}
      />
      <Route
        path={ADVERTISER_APP_ROUTES.SIGN_UP}
        element={(
          <PublicRoute>
            <AdvertiserSignupPage />
          </PublicRoute>
        )}
      />
      <Route
        path={ADVERTISER_APP_ROUTES.LOGIN}
        element={(
          <PublicRoute>
            <AdvertiserLoginPage />
          </PublicRoute>
        )}
      />
      <Route
        path={ADVERTISER_APP_ROUTES.VERIFY}
        element={(
          <PublicRoute>
            <AdvertiserLoginPage />
          </PublicRoute>
        )}
      />
      <Route path='/linkedin' element={<LinkedInCallback />} />
      <Route path='*' element={<NotFoundRedirect />} />
    </Routes>
  </Suspense>
);

export default Router;
