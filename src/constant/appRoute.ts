const appRoutes = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  ADD: 'add',
  ID: ':id',
  EDIT: 'edit',
  VIEW: 'view',
  PROFILE: 'profile',
  PASSWORD_UPDATE: 'password/update',
  HOME: 'home',
  NOT_FOUND: '*',
  ROOT: '/',
  SUBSCRIPTION: 'subscription-plan',
  PAYMENT: 'payment',
  PRIVACY_POLICY: '/privacy-policy',
  TERM_CONDITION: '/term-condition',
};

export const PODCASTER_APP_ROUTES = {
  SIGN_UP: 'podcaster/register',
  VERIFY: 'podcaster/verify-active/:token',
  ACTIVATION: 'podcaster/activation/:token',
  LOGIN: 'podcaster/login',
  FORGOT_PASSWORD: 'podcaster/forgot-password',
  CREATE_PROFILE: 'create-profile',
  DASHBOARD: 'dashboard',
  ROOT: '/podcaster',
  PODCAST_ROOT: 'podcast',
  EPISODE_ROOT: 'episode',
  ANALYTICS: 'analytics',
  CONTINUE_EDIT: 'continue-edit',
  ADD_PODCAST: 'podcast-add',
  PODCAST_SLUG: ':podcastSlug',
  EPISODE_ID: ':episodeId',
  TRANSCRIPT_ID: ':transcriptId',
  ADD_EPISODE: 'episode-add',
  PROFILE: 'profile',
  EDIT: 'edit',
  TRANSACTION_HISTORY: 'transaction-history',
  DISTRIBUTION: 'distributions',
};

export const ADMIN_APP_ROUTES = {
  ROOT: '/admin',
  LOGIN: 'admin/login',
  FORGOT_PASSWORD: 'admin/forgot-password',
  DASHBOARD: 'dashboard',
  PODCASTER: 'podcaster',
  PODCAST: ':podcasterUuid',
  LISTENER: 'listener',
  ADVERTISER: 'advertiser',
  CATEGORY: 'category',
  COMMENT: 'comment',
  SETTINGS: 'settings',
  PAYOUT: 'payout',
  PROMOCODE: 'promo-code',
  PROFILE: 'profile',
  MANAGE_ADMIN: 'admin',
  MANAGE_PLAN: 'plan',
};

export const LISTENER_APP_ROUTES = {
  SIGN_UP: 'listener/register',
  VERIFY: 'listener/verify-active/:token',
  ROOT: '/listener',
  LOGIN: 'login',
  FORGOT_PASSWORD: 'forgot-password',
  DOWNLOADS: 'downloads',
  MANAGE_PODCAST: 'podcast',
  CREATE_PROFILE: 'create-profile',
  PROFILE: 'profile',
  EDIT: 'edit',
  PODCAST_HISTORY: 'podcast-history',
  ALL_CATEGORIES: 'all-categories',
  CATEGORY: ':category',
  SUBSCRIPTIONS: 'subscriptions',
  SUBSCRIPTIONSOF: ':subscriptionsof',
  SEARCH: 'search',
  PLANS: 'plans',
  PODCAST_DETAIL: 'podcast-details',
  PODCAST_SLUG: ':podcastSlug',
  EPISODE_UUID: ':episodeUuid',
  FAVORITES: 'favorites',
  PAYMENT: 'payment',
  PODCASTERS: '/podcasters',
  PODCASTER_PODCAST: 'podcaster-podcast/:userUuid',
};

export const ADVERTISER_APP_ROUTES = {
  ROOT: 'advertiser',
  ANALYTICS: 'analytics',
  SIGN_UP: 'advertiser/register',
  LOGIN: 'advertiser/login',
  FORGOT_PASSWORD: 'advertiser/forgot-password',
  TRANSACTION_HISTORY: 'transactions',
  VERIFY: 'advertiser/verify-active/:token',
  CREATE_PROFILE: 'create-profile',
};

export const OPEN_APP_ROUTES = {
  SIGN_UP: 'register',
  VERIFY: '/listener/verify-active/:token',
  ROOT: '/',
  LOGIN: 'login',
  FORGOT_PASSWORD: 'forgot-password',
  PASSWORD_UPDATE: 'password/update',
  RESET_PASSWORD: '/reset-password/:token',
  DOWNLOADS: 'downloads',
  MANAGE_PODCAST: 'podcast',
  CREATE_PROFILE: 'create-profile',
  PROFILE: 'profile',
  EDIT: 'edit',
  ALL_CATEGORIES: 'all-categories',
  CATEGORY: ':category',
  SUBSCRIPTIONS: 'subscriptions',
  SUBSCRIPTIONSOF: ':subscriptionsof',
  SEARCH: 'search',
  PLANS: 'plans',
  PODCAST_DETAIL: 'podcast-details',
  PODCAST_SLUG: ':podcastSlug',
  EPISODE_UUID: ':episodeUuid',
  PODCASTERS: '/podcasters',
  INVITED_USER: '/invited-user/verify/:token',
  PODCASTER_PODCAST: 'podcaster-podcast/:userUuid',
};

export default appRoutes;