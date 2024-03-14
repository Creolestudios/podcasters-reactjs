import APP_ROUTES, {
  PODCASTER_APP_ROUTES as PODCASTER_ROUTES,
  ADMIN_APP_ROUTES as ADMIN_ROUTES,
  LISTENER_APP_ROUTES as LISTENER_ROUTES,
  ADVERTISER_APP_ROUTES as ADVERTISER_ROUTES,
  OPEN_APP_ROUTES,
} from './appRoute';
import ProfileIcon from '../assets/svg/ProfileIcon';
import SvgIcons from '../assets/svg/SvgIcons';
import HomeIcon from '../assets/svg/HomeIcon';

export const TOASTER_STATUS = {
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  DELETE: 'DELETE',
  INFO: 'INFO',
};

export const SUCCESS_MESSAGE = {
  USER_SIGN_UP:
    'Verification link is sent on your registered email, click on it to activate your account.',
  USER_ACTIVATION:
    'Great news! Your account has been successfully activated, and you can now log in.',
  FORGOT_PASSWORD: 'Password Reset link sent on your email id.',
  RESET_PASSWORD: 'Password reset successfully.',
};

export const LINK_ARGS = {
  path: '',
  children: '',
};

export const USER_ROLE = {
  PODCASTER: 'ROLE_PODCASTER',
  LISTENER: 'ROLE_LISTENER',
  ADVERTISER: 'ROLE_ADVERTIZER',
  ADMIN: 'ROLE_ADMIN',
  USER: 'ROLE_USER',
};

export const APP_HOST = {
  PODCASTER: 'podcaster',
  LISTENER: 'listener',
  ADVERTISER: 'advertiser',
  ADMIN: 'admin',
};

export const NAV_MENU_ITEM = {
  PODCASTER: [
    { url: PODCASTER_ROUTES.ROOT, title: 'Podcasts' },
    {
      url: `${PODCASTER_ROUTES.ROOT}/${PODCASTER_ROUTES.ANALYTICS}`,
      title: 'Analytics',
    },
    {
      url: `${PODCASTER_ROUTES.ROOT}/${APP_ROUTES.SUBSCRIPTION}`,
      title: 'My Subscription Plan',
    },
  ],
  LISTENER: [
    { url: OPEN_APP_ROUTES.ROOT, title: 'Home' },
    {
      url: `/${OPEN_APP_ROUTES.DOWNLOADS}`,
      title: 'Downloads',
    },
  ],
  ADVERTISER: [
    { url: ADVERTISER_ROUTES.ROOT, title: 'Compaign' },
    {
      url: `${ADVERTISER_ROUTES.ROOT}/${ADVERTISER_ROUTES.ANALYTICS}`,
      title: 'Analytics',
    },
    {
      url: `${ADVERTISER_ROUTES.ROOT}/${ADVERTISER_ROUTES.TRANSACTION_HISTORY}`,
      title: 'Transaction History',
    },
  ],
};

export const NAV_DROPDOWN_ITEM = {
  PODCASTER: [
    { title: 'Home', url: '/', Icon: HomeIcon },
    { title: 'Profile', url: '/podcaster/profile', Icon: ProfileIcon },
  ],
  LISTENER: [
    { title: 'Profile', url: '/profile', Icon: ProfileIcon },
    {
      title: 'Subscriptions',
      url: '/subscriptions/podcasts',
      Icon: SvgIcons,
      iconType: 'subscription-icon',
    },
    {
      title: 'Favorites',
      url: '/favorites',
      Icon: SvgIcons,
      iconType: 'favorite-icon',
    },
    {
      title: 'Podcast History',
      url: '/podcast-history',
      Icon: SvgIcons,
      iconType: 'histroy-icon',
    },
  ],
  ADVERTISER: [
    {
      title: 'Profile',
      url: '/',
      Icon: ProfileIcon,
    },
  ],
  ADMIN: [
    {
      title: 'Profile',
      url: `${ADMIN_ROUTES.ROOT}/${ADMIN_ROUTES.PROFILE}`,
      Icon: ProfileIcon,
    },
    {
      title: 'Manage Admin',
      url: `${ADMIN_ROUTES.ROOT}/${ADMIN_ROUTES.MANAGE_ADMIN}`,
      Icon: SvgIcons,
      iconType: 'admin_manage',
    },
    {
      title: 'Manage Plan',
      url: `${ADMIN_ROUTES.ROOT}/${ADMIN_ROUTES.MANAGE_PLAN}`,
      Icon: SvgIcons,
      iconType: 'admin_manage_plans',
    },
  ],
};

export const ADMIN_SIDEBAR_MENU = [
  {
    iconType: 'admin_dashboard',
    title: 'Dashboard',
    url: `${ADMIN_ROUTES.ROOT}/${ADMIN_ROUTES.DASHBOARD}`,
  },
  {
    iconType: 'admin_podcaster',
    title: 'Podcaster',
    url: `${ADMIN_ROUTES.ROOT}/${ADMIN_ROUTES.PODCASTER}`,
  },
  {
    iconType: 'admin_listener',
    title: 'Listener',
    url: `${ADMIN_ROUTES.ROOT}/${ADMIN_ROUTES.LISTENER}`,
  },
  {
    iconType: 'admin_advertiser',
    title: 'Advertiser',
    url: `${ADMIN_ROUTES.ROOT}/${ADMIN_ROUTES.ADVERTISER}`,
  },
  {
    iconType: 'admin_category',
    title: 'Category',
    url: `${ADMIN_ROUTES.ROOT}/${ADMIN_ROUTES.CATEGORY}`,
  },
  {
    iconType: 'admin_comment',
    title: 'Comment',
    url: `${ADMIN_ROUTES.ROOT}/${ADMIN_ROUTES.COMMENT}`,
  },
  {
    iconType: 'admin_settings',
    title: 'Settings',
    url: `${ADMIN_ROUTES.ROOT}/${ADMIN_ROUTES.SETTINGS}`,
  },
  {
    iconType: 'admin_payout',
    title: 'Payout',
    url: `${ADMIN_ROUTES.ROOT}/${ADMIN_ROUTES.PAYOUT}`,
  },
  {
    iconType: 'admin_promo_code',
    title: 'Promo Code',
    url: `${ADMIN_ROUTES.ROOT}/${ADMIN_ROUTES.PROMOCODE}`,
  },
];

export const PODCASTS_FILTER_ITEMS = [
  {
    label: 'featured',
    value: 'featured',
    hasSubMenu: false,
    paramsLabel: 'featured',
  },
  {
    label: 'category',
    value: 'podcastCategories',
    hasSubMenu: true,
    paramsLabel: 'categoryUuid',
  },
  {
    label: 'status',
    value: 'podcastStatuses',
    hasSubMenu: true,
    paramsLabel: 'podcastStatus',
  },
  {
    label: 'language',
    value: 'podcastLanguages',
    hasSubMenu: true,
    paramsLabel: 'language',
  },
  {
    label: 'type',
    value: 'podcastTypes',
    hasSubMenu: true,
    paramsLabel: 'typeUuid',
  },
];

export const PODCAST_STATUS = {
  PUBLISH: 'published',
  DRAFT: 'draft',
  SCHEDULE: 'scheduled',
};

export const WAVE_ACTION_MENU_ITEMS = [
  {
    label: 'download',
    IconName: SvgIcons,
    iconType: 'icon-export',
    hasIcon: true,
    isButton: true,
  },
  {
    label: 'duplicate',
    IconName: SvgIcons,
    iconType: 'copy',
    hasIcon: true,
    isButton: true,
  },
  {
    label: 'rename',
    IconName: SvgIcons,
    iconType: 'edit-track',
    hasIcon: true,
    isButton: true,
  },
  {
    label: 'split',
    IconName: SvgIcons,
    iconType: 'scissor',
    hasIcon: true,
    isButton: true,
  },
  {
    label: 'volume',
    hasIcon: true,
    isButton: true,
  },
  {
    label: 'delete',
    IconName: SvgIcons,
    iconType: 'delete-track',
    hasIcon: true,
    isButton: true,
  },
];

export const PLAN_ACTIONS = {
  GENERATE_SUMMARY: 'GENERATE_SUMMARY',
  ADD_BACKGROUND_MUSIC: 'ADD_BACKGROUND_MUSIC',
  ADD_EFFECT: 'ADD_EFFECT',
  DOWNLOAD_RECORDED_FILE: 'DOWNLOAD_RECORDED_FILE',
};
