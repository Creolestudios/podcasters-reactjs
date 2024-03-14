import React, { FC, Suspense, lazy } from 'react';
import {
  Routes, Route, Outlet, Navigate,
} from 'react-router-dom';

import APP_ROUTES, { LISTENER_APP_ROUTES as LISTENER, OPEN_APP_ROUTES } from '../constant/appRoute';

const CreateProfile = lazy(() => import('../pages/Profile/CreateProfile'));
const Profile = lazy(() => import('../pages/listener/Profile/Profile'));
const EditProfile = lazy(() => import('../pages/listener/Profile/EditProfile'));
const Home = lazy(() => import('../pages/listener/Home'));
const Search = lazy(() => import('../pages/listener/Search/Search'));
const PodcastHistoryPage = lazy(
  () => import('../pages/listener/PodcastHistory/PodcastHistoryPage'),
);
const AllCategories = lazy(() => import('../pages/listener/Category/AllCategories'));
const Category = lazy(() => import('../pages/listener/Category/Category'));
const PodcastDetail = lazy(() => import('../pages/listener/PodcastDetail/PodcastDetail'));
const EpisodeDetail = lazy(() => import('../pages/listener/EpisodeDetail/EpisodeDetail'));
const DownloadPage = lazy(() => import('../pages/listener/Download/DownloadPage'));
const SubscriptionPage = lazy(() => import('../pages/listener/Subscription/SubscriptionPage'));
const FavoritePage = lazy(() => import('../pages/listener/Favorite/FavoritePage'));
const PlanPage = lazy(() => import('../pages/listener/Plans/PlanPage'));
const PaymentScreen = lazy(() => import('../pages/listener/Payment/PaymentScreen'));
const PodcasterPage = lazy(() => import('../pages/listener/Podcasters/PodcasterPage'));
const PodcasterPodcasts = lazy(
  () => import('../pages/listener/PodcasterPodcasts/PodcasterPodcasts'),
);

const ListenerRoutes: FC = () => (
  <Suspense fallback={null}>
    <Routes>
      <Route path={APP_ROUTES.ROOT} element={<Outlet />}>
        <Route index element={<Home />} />
        <Route path={LISTENER.SEARCH} element={<Search />} />
        <Route path={LISTENER.PLANS} element={<PlanPage />} />
        <Route path={LISTENER.PODCAST_HISTORY} element={<PodcastHistoryPage />} />
        <Route path={LISTENER.ALL_CATEGORIES} element={<Outlet />}>
          <Route index element={<AllCategories />} />
          <Route path={LISTENER.CATEGORY} element={<Category />} />
        </Route>
        <Route path={LISTENER.PODCAST_DETAIL} element={<Outlet />}>
          <Route path={LISTENER.PODCAST_SLUG} element={<PodcastDetail />} />
          <Route
            path={`${LISTENER.PODCAST_SLUG}/${LISTENER.EPISODE_UUID}`}
            element={<EpisodeDetail />}
          />
        </Route>
        <Route path={LISTENER.SUBSCRIPTIONS} element={<Outlet />}>
          <Route path={LISTENER.SUBSCRIPTIONSOF} element={<SubscriptionPage />} />
        </Route>
        <Route path={LISTENER.PODCASTERS} element={<PodcasterPage />} />
        <Route path={LISTENER.FAVORITES} element={<FavoritePage />} />
        <Route path={LISTENER.PODCASTER_PODCAST} element={<PodcasterPodcasts />} />
        <Route path={LISTENER.CREATE_PROFILE} element={<CreateProfile />} />
        <Route path={LISTENER.PROFILE} element={<Outlet />}>
          <Route index element={<Profile />} />
          <Route path={LISTENER.EDIT} element={<EditProfile />} />
        </Route>
        <Route path={LISTENER.PAYMENT} element={<PaymentScreen />} />

        <Route path={LISTENER.DOWNLOADS} element={<DownloadPage />} />
        <Route path={LISTENER.MANAGE_PODCAST} element={<h2>Listener Manage Podcast</h2>} />
        <Route path={APP_ROUTES.NOT_FOUND} element={<Navigate to={OPEN_APP_ROUTES.ROOT} />} />
      </Route>
      <Route path={APP_ROUTES.NOT_FOUND} element={<Navigate to={OPEN_APP_ROUTES.ROOT} />} />
    </Routes>
  </Suspense>
);

export default ListenerRoutes;
