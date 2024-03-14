import React, { FC, Suspense, lazy } from 'react';
import {
  Routes, Route, Outlet, Navigate,
} from 'react-router-dom';

import APP_ROUTES, {
  LISTENER_APP_ROUTES as LISTENER,
  OPEN_APP_ROUTES,
} from '../constant/appRoute';
import PrivateRoute from '../components/auth/PrivateRoute';

const CreateProfile = lazy(() => import('../pages/Profile/CreateProfile'));
const Profile = lazy(() => import('../pages/listener/Profile/Profile'));
const EditProfile = lazy(() => import('../pages/listener/Profile/EditProfile'));
const Home = lazy(() => import('../pages/listener/Home'));
const Search = lazy(() => import('../pages/listener/Search/Search'));
const AllCategories = lazy(
  () => import('../pages/listener/Category/AllCategories'),
);
const Category = lazy(() => import('../pages/listener/Category/Category'));
const PodcastDetail = lazy(
  () => import('../pages/listener/PodcastDetail/PodcastDetail'),
);
const EpisodeDetail = lazy(
  () => import('../pages/listener/EpisodeDetail/EpisodeDetail'),
);
const PlanPage = lazy(() => import('../pages/listener/Plans/PlanPage'));
const PodcasterPage = lazy(
  () => import('../pages/listener/Podcasters/PodcasterPage'),
);
const PodcasterPodcasts = lazy(
  () => import('../pages/listener/PodcasterPodcasts/PodcasterPodcasts'),
);

const OpenRoutes: FC = () => (
  <Suspense fallback={null}>
    <Routes>
      <Route path={OPEN_APP_ROUTES.ROOT} element={<Home />} />
      <Route path={OPEN_APP_ROUTES.SEARCH} element={<Search />} />
      <Route path={`${OPEN_APP_ROUTES.PLANS}`} element={<PlanPage />} />
      <Route path={OPEN_APP_ROUTES.ALL_CATEGORIES} element={<Outlet />}>
        <Route index element={<AllCategories />} />
        <Route path={OPEN_APP_ROUTES.CATEGORY} element={<Category />} />
      </Route>

      <Route
        path={OPEN_APP_ROUTES.PODCASTER_PODCAST}
        element={<PodcasterPodcasts />}
      />
      <Route path={OPEN_APP_ROUTES.PODCAST_DETAIL} element={<Outlet />}>
        <Route
          path={OPEN_APP_ROUTES.PODCAST_SLUG}
          element={<PodcastDetail />}
        />
        <Route
          path={`${OPEN_APP_ROUTES.PODCAST_SLUG}/${OPEN_APP_ROUTES.EPISODE_UUID}`}
          element={<EpisodeDetail />}
        />
      </Route>
      <Route path={OPEN_APP_ROUTES.PODCASTERS} element={<PodcasterPage />} />

      <Route
        path={OPEN_APP_ROUTES.CREATE_PROFILE}
        element={(
          <PrivateRoute>
            <CreateProfile />
          </PrivateRoute>
        )}
      />

      <Route path={OPEN_APP_ROUTES.PROFILE} element={<Outlet />}>
        <Route
          index
          element={(
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          )}
        />

        <Route
          path={OPEN_APP_ROUTES.EDIT}
          element={(
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          )}
        />
      </Route>

      <Route
        path={APP_ROUTES.NOT_FOUND}
        element={<Navigate to={APP_ROUTES.ROOT} />}
      />
    </Routes>
  </Suspense>
);

export default OpenRoutes;
