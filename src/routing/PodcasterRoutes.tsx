import React, { FC, lazy, Suspense } from 'react';
import {
  Routes, Route, Outlet, Navigate,
} from 'react-router-dom';
import APP_ROUTES, {
  PODCASTER_APP_ROUTES as PODCASTER,
} from '../constant/appRoute';

const PodcasterHome = lazy(
  () => import('../pages/podcaster/Home/PodcasterHomePage'),
);
const CreateProfile = lazy(() => import('../pages/Profile/CreateProfile'));
const SubscriptionScreen = lazy(
  () => import('../pages/podcaster/Subscription/Subscription'),
);
const Payment = lazy(() => import('../pages/podcaster/Payment/PaymentScreen'));
const TranscriptPage = lazy(
  () => import('../pages/podcaster/Transcript/TranscriptPage'),
);
const UpdateEpisodePage = lazy(
  () => import('../pages/podcaster/Episode/UpdateEpisodePage'),
);
const Profile = lazy(() => import('../pages/podcaster/Profile/Profile'));
const EditProfile = lazy(
  () => import('../pages/podcaster/Profile/EditProfile'),
);
const ChangePassword = lazy(() => import('../components/Login/ChangePassword'));
const PodcastDetailPage = lazy(
  () => import('../pages/podcaster/PodcastDetail/PodcastDetailPage'),
);
const EpisodePage = lazy(
  () => import('../pages/podcaster/Episode/EpisodePage'),
);
const PodcastPage = lazy(
  () => import('../pages/podcaster/Podcast/PodcastPage'),
);
const AnalyticsPage = lazy(
  () => import('../pages/podcaster/Analytics/AnalyticsPage'),
);
const TransactionHistory = lazy(
  () => import('../pages/podcaster/Analytics/TransactionHistory'),
);
const DistributionsPage = lazy(
  () => import('../pages/podcaster/Distributions/DistributionsPage'),
);
const AudioEditorPage = lazy(
  () => import('../pages/podcaster/AudioEditor/AudioEditorPage'),
);

const PodcasterRoutes: FC = () => (
  <Suspense fallback={null}>
    <Routes>
      <Route path={PODCASTER.ROOT} element={<Outlet />}>
        <Route element={<Outlet />}>
          <Route index element={<PodcasterHome />} />
          <Route path={PODCASTER.PODCAST_SLUG} element={<Outlet />}>
            <Route index element={<PodcastDetailPage />} />
            <Route path={APP_ROUTES.EDIT} element={<PodcastPage />} />
            <Route path={PODCASTER.ADD_EPISODE} element={<EpisodePage />} />
            <Route path={PODCASTER.EPISODE_ID} element={<Outlet />}>
              <Route index element={<h2>Episode Detail..</h2>} />
              <Route path={APP_ROUTES.EDIT} element={<Outlet />}>
                <Route index element={<EpisodePage />} />
                <Route
                  path={PODCASTER.TRANSCRIPT_ID}
                  element={<TranscriptPage />}
                />
              </Route>
            </Route>
          </Route>
        </Route>
        <Route path={PODCASTER.ADD_PODCAST} element={<PodcastPage />} />
        <Route path={PODCASTER.CREATE_PROFILE} element={<CreateProfile />} />

        <Route path={PODCASTER.PROFILE} element={<Outlet />}>
          <Route index element={<Profile />} />
          <Route path={PODCASTER.EDIT} element={<EditProfile />} />
        </Route>

        <Route path={PODCASTER.ANALYTICS} element={<Outlet />}>
          <Route index element={<AnalyticsPage />} />
          <Route
            path={PODCASTER.TRANSACTION_HISTORY}
            element={<TransactionHistory />}
          />
        </Route>
        <Route path={PODCASTER.DISTRIBUTION} element={<DistributionsPage />} />
        <Route path={PODCASTER.CONTINUE_EDIT} element={<AudioEditorPage />} />
        <Route
          path={PODCASTER.ANALYTICS}
          element={<h3>Podcaster Analytics</h3>}
        />

        <Route
          path={APP_ROUTES.SUBSCRIPTION}
          element={<SubscriptionScreen />}
        />
        <Route path={APP_ROUTES.PAYMENT} element={<Payment />} />

        <Route
          path={APP_ROUTES.NOT_FOUND}
          element={<Navigate to={PODCASTER.ROOT} />}
        />
      </Route>
      <Route
        path={APP_ROUTES.NOT_FOUND}
        element={<Navigate to={PODCASTER.ROOT} />}
      />
    </Routes>
  </Suspense>
);

export default PodcasterRoutes;
