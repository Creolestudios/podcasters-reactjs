export const PODCASTER_API_ROUTES = {
  SIGN_UP: 'api/auth/podcaster',
  VERIFY: 'api/auth/podcaster/user-verify?token=',
  RESEND_EMAIL: 'api/auth/podcaster/resend-email?email=',
  USER_VERIFY: 'api/v1/users/verify',
  LOGIN: 'api/auth/podcaster/login',
  GOOGLE_LOGIN: 'api/v1/social/podcaster/login/google',
  LINKEDIN_LOGIN: 'api/v1/social/podcaster/login/linkedin',
  FACEBOOK_LOGIN: 'api/v1/social/podcaster/login/facebook',
  CHECK_EMAIL: 'api/auth/podcaster/check-email?email=',
  SEND_EMAIL: 'api/auth/podcaster/send-mail?email=',
};

export const USER_API_ROUTES = {
  FORGOT_PASSWORD: 'api/v1/users/forgotPassword',
  RESET_PASSWORD: 'api/v1/users/resetPassword',
  CHANGE_PASSWORD: 'api/v1/user/change-password',
  PODCASTER_DETAIL: 'api/v1/user/get-podcaster-details',
  ADMIN_DETAIL: 'api/v1/user/get-admin-details',
  ADVERTISER_DETAIL: 'api/v1/user/get-advertizer-details',
  LISTENER_DETAIL: 'api/v1/user/get-listener-details',
  BANK_DETAILS: 'api/v1/user/bank-details',
  INIVTED_USER_PASSWORD: 'api/v1/users/validateInvite',
};

export const SOCIAL_LOGIN = {
  GET_PODCASTER_TOKEN: 'api/v1/social/linkedin/access-token',
};

export const PODCASTER_SUBSCRIPTION_API_ROUTES = {
  SUBSCRIPTION_PLANS: 'api/plan/v1?role',
  SET_UP_INTENT: 'api/payment/v1/set-up-intent',
  ADD_PAYMENT_TO_SET_UP_INTENT: 'api/payment/v1/add-payment-method-to-setup-intent',
  ACTIVATE_PLAN: 'api/payment/v1/activate-plan',
  CHECK_COUPON: 'api/plan/v1/check-coupon?couponCode=',
  PAYMENT_PLAN_ACTION: 'api/payment/v1/payment-plan-action',
};

export const LISTENER_SUBSCRIPTION_API_ROUTES = {
  SUBSCRIPTION_PLANS: 'api/v1/listener/get-all-plan?role',
  SET_UP_INTENT: 'api/payment/v1/set-up-intent',
  ADD_PAYMENT_TO_SET_UP_INTENT: 'api/payment/v1/add-payment-method-to-setup-intent',
  ACTIVATE_PLAN: 'api/payment/v1/activate-plan',
  ACTIVE_TRAIL_PLAN: 'api/payment/v1/active-trial-plan',
  CANCEL_PLAN: 'api/payment/v1/cancel-plan',
};

export const PODCASTER_TRANSCRIPT_API_ROUTES = {
  GET_TRANSCRIPT: 'api/v1/transcript',
  UPDATE_TRANSCRIPT: 'api/v1/transcript',
};

export const LISTENER_API_ROUTES = {
  SIGN_UP: 'api/auth/listener',
  VERIFY: 'api/auth/listener/user-verify?token=',
  RESEND_EMAIL: 'api/auth/listener/resend-email?email=',
  LOGIN: 'api/auth/listener/login',
  GOOGLE_LOGIN: 'api/v1/social/listener/login/google',
  LINKEDIN_LOGIN: 'api/v1/social/listener/login/linkedin',
  FACEBOOK_LOGIN: 'api/v1/social/listener/login/facebook',
};

export const ADVERTISER_API_ROUTES = {
  SIGN_UP: 'api/auth/advertiser',
  VERIFY: 'api/auth/advertiser/user-verify?token=',
  LOGIN: 'api/auth/advertiser/login',
  RESEND_EMAIL: 'api/auth/advertiser/resend-email?email=',
  GOOGLE_LOGIN: 'api/v1/social/advertiser/login/google',
  LINKEDIN_LOGIN: 'api/v1/social/advertiser/login/linkedin',
  FACEBOOK_LOGIN: 'api/v1/social/advertiser/login/facebook',
};

export const ADMIN_API_ROUTES = {
  LOGIN: 'api/auth/admin/login',
};

export const PODCASTER_HOME_API_ROUTES = {
  GET_PODCASTS_FILTER: 'api/v1/podcasts/get-filter-details',
};

export const PODCASTER_PODCAST_DETAIL_API_ROUTES = {
  GET_PODCAST_DETAIL: 'api/v1/podcasts/get-podcasts-with-episodes',
  BASE_PODCAST_URL: 'api/v1/podcasts',
  PODCAST_MONETIZE: 'podcast-monetized',
};

export const EPISODE_API_ROUTES = {
  GET_PRESIGNED_URL: 'api/v1/episodes/get-presigned-url',
  UPLOAD_FILE: '/api/v1/upload/transcript/',
  ADD_EPISODE: 'api/v1/episodes',
  COVER_IMAGE: 'api/v1/episodes/upload-episode-cover-image?id=',
  GET_EPISODE: 'api/v1/episodes',
  UPDATE_EPISODE: 'api/v1/episodes',
  UPLOAD_EPISODE_IMAGES: 'api/v1/episodes/upload-episode-images',
  DELETE_EPISODE: 'api/v1/episodes',
  UPLOAD_AUDIO_DURATION: 'api/v1/episodes/get-uploaded-allocated-duration',
  UPDATE_ENHANCE_DURATION: 'api/v1/episodes/save-audio-enhancement-duration',
};

export const LISTENER_HOME_API_ROUTES = {
  FEATURED_PODCAST: 'api/v1/listener/featured-podcasts',
  CONTINUE_LISTEN_EPISODE: 'api/v1/user/listener/continue-listening-episodes',
  GET_CATEGORIES: 'api/v1/listener/categories',
  GET_SUBSCRIBED_PODCAST: 'api/v1/user/listener/podcasts',
  NEWLY_ADDED_PODCAST: 'api/v1/listener/newly-added-podcast',
  TOP_PODCAST: 'api/v1/listener/top-podcasts',
  GET_SENTIMENTS: 'api/v1/listener/sentiments',
  LISTEN_AGAIN_PODCAST: 'api/v1/user/listener/listen-again-podcasts',
  PODCASTS_MAY_LIKE: 'api/v1/listener/podcasts-may-like',
  GET_PODCASTER: 'api/v1/listener/podcaster-for-listener',
  GET_PODCAST_YOU_FOLLOW: 'api/v1/user/listener/subscribed-podcast',
  SEARCH: 'api/v1/listener/search',
};

export const PODCAST_API_ROUTES = {
  ADD_PODCAST: 'api/v1/podcasts',
  UPDATE_PODCAST: 'api/v1/podcasts',
  GET_PODCAST: 'api/v1/podcasts',
  FEATURED: 'featured-podcast',
  UPDATE_PUBLISHED_PODCAST: 'api/v1/podcasts/published',
  CREATE_RSS_FEED: 'api/v1/podcasts/rss-feed',
  GET_PODCAST_RSS: 'api/v1/listener/get-podcast-rss',
  DELETE_PODCAST: 'api/v1/podcasts',
  GET_EPISODES: 'api/v1/episodes/get-episodes',
  UPLOAD_PODCAST_IMAGES: 'api/v1/podcasts/upload-podcast-images',
};

export const LISTNER_PODCAST_API_ROUTES = {
  CATEGORY_WITH_PODCAST: 'api/v1/listener/categories-with-podcast',
  PODCAST_WITH_SENTIMENTS: 'api/v1/listener/podcast-with-sentiments',
  PODCAST_BY_CATEGORY: 'api/v1/listener/podcasts-by-category',
  GET_PODCAST_WITH_EPISODE: 'api/v1/listener/get-podcasts-with-episodes',
  SUBSCRIBE_FAVORITE: 'api/v1/podcast/analytics',
  PODCAST_RATING: 'api/v1/podcasts/ratings',
  AUTHOR_SUBSCRIBE_RATING: 'api/v1/podcast/author',
  GET_EPISODES: 'api/v1/listener/get-episodes',
  GET_PODCAST_HISTORY: 'api/v1/user/listener/podcast-history',
  GET_FAVORITES_PODCAST: 'api/v1/user/listener/favourite-podcasts',
  GET_PODCASTER_PODCAST: 'api/v1/listener/podcaster-podcasts',
};

export const LISTENER_EPISODE_API_ROUTES = {
  EPISODE: 'api/v1/listener/episode',
  GET_COMMENTS: 'api/v1/listener/comments',
  ADD_COMMENT: 'api/v1/episodes/comments/add',
  REPORT_COMMENT: 'api/v1/episodes/comments/report',
  EPISODE_ANALYTICS: 'api/v1/episodes/analytics',
  EPISODE_PLAYED: 'api/v1/listener/played',
  GET_EPISODES: 'api/v1/listener/get-next-episodes',
  GET_DOWNLOADED_EPISODES: 'api/v1/user/listener/downloaded-episode',
  DELETE_COMMENT: 'api/v1/episodes/comments',
};

export const PODCAST_ANALYTICS_API_ROUTES = {
  VIEW_DOWNLOADS_SUBSCRIBE_COUNT: 'api/v1/podcast/analytics/view-downloads-subscribe-count',
  VIEW_DOWNLOADS_SUBSCRIBE_CHART: 'api/v1/podcast/analytics/view-downloads',
  VIEW_DOWNLOADS_SUBSCRIBE_DOWNLOAD_EXCEL: 'api/v1/podcast/analytics/view-downloads/download/excel',
  TRANSACTION_HISTORY: 'api/v1/podcasts/transaction-history',
  REVENUE_COUNT: 'api/v1/podcast/analytics/revenue-analytics/count',
  REVENUE_ANALYSIS: 'api/v1/podcast/analytics/revenue-analysis',
  REVENUE_DOWNLOAD_EXCEL: 'api/v1/podcast/analytics/revenue-analysis/download/excel',
};

export const ADMIN_LISTENER_API_ROUTES = {
  GET_LISTENERS: 'api/v1/admin/listeners',
  INVITE_LISTENER: 'api/v1/admin/send-invite/listener',
  DELETE_LISTENER: 'api/v1/admin/delete',
  BLOCK_LISTENER: 'api/v1/admin/block',
  GET_ACTIVE_PLAN: 'api/v1/admin/user-active-plan',
  GET_PLANS: 'api/plan/v1',
  UPGRADE_PLAN: 'api/v1/admin/upgrade-plan',
};

export const ADMIN_PODCASTER_API_ROUTES = {
  GET_PODCASTERS: 'api/v1/admin/podcasters',
  GET_ACTIVE_PODCASTERS: 'api/v1/admin/active-podcasters',
  INVITE_PODCASTER: 'api/v1/admin/send-invite/podcaster',
  DELETE_PODCASTER: 'api/v1/admin/delete',
  BLOCK_PODCASTER: 'api/v1/admin/block',
  GET_ACTIVE_PLAN: 'api/v1/admin/user-active-plan',
  GET_PLANS: 'api/plan/v1',
  UPGRADE_PLAN: 'api/v1/admin/upgrade-plan',
};

export const ADMIN_PODCAST_API_ROUTES = {
  GET_PODCASTS: 'api/v1/admin/podcaster',
  BLOCK_PODCAST: 'api/v1/admin/block/podcast',
};

export const ADMIN_PROMOCODE_API_ROUTES = {
  GET_PROMOCODE: 'api/v1/admin/coupon',
  ADD_PROMOCODE: 'api/v1/admin/coupon',
  UPDATE_PROMOCODE: 'api/v1/admin/coupon',
  DELETE_PROMOCODE: 'api/v1/admin/coupon',
  CHECK_PROMOCODE: 'api/plan/v1/check-coupon',

};

export const AUDIO_EDITOR_API_ROUTES = {
  GET_EPISODE_AUDIOS: 'api/v1/episodes/audio-editor',
  GET_EPISODE_LIST: 'api/v1/episodes/audio-editor',
  GET_ALL_MUSIC: 'api/v1/audio-editor/music/all',
  UPDATE_EPISODE_AUDIO_TRACKS: 'api/v1/episodes/audio-editor',
  GET_PRESIGNED_URL: 'api/v1/episodes/audio-editor/get-presigned-url?extension=',
  GET_TRANSCRIPT_BY_EPISODE_UUID: 'api/v1/transcript/episode',
  GENERATE_REPORT_PDF: 'api/v1/transcript/generate/',
  EXPORT_AUDIO: 'api/v1/episodes/audio-editor/download-file',
  DELETE_TRACKS: 'delete-tracks',
};
