import { JsxElement } from 'typescript';
import { ITag } from './podcaster';
import { AudioControl, AudioPlay } from '../redux/types/audioEditor';

export interface ILink {
  path: string;
  children: string;
}

export interface IActivePlanUuidAndEndDate {
  activePlanUuid?: string | null;
  activePlanAmount: number;
  activePlanRenewalDate?: number;
  activePlanPeriod: string | null;
  activePlanEndDate?: number;
  freePurchasePlan?: boolean;
}

export interface ActivePlanUuidAndEndDate {
  activePlanUuidAndEndDate: IActivePlanUuidAndEndDate;
}

export interface IUser {
  email: string;
  roles: [string];
  userProfileCompleted: boolean;
  userPurchasedPlan: boolean;
  uuid: string;
  bio: string;
  country: string;
  dateOfBirth: string;
  episodeCount: number;
  firstName: string;
  gender: string;
  languageCode: null | string;
  lastName: string;
  monetizedAllPodcasts: boolean;
  podcastCount: number;
  profilePhotoUrl: null | string;
  downloadCount?: number;
  favoriteCount?: number;
  activePlanUuidAndEndDate: IActivePlanUuidAndEndDate | null;
  editorEpisodeCount: number;
}

export interface ChangePasswordInterface {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IUpdateUser {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  country: string;
  bio: string;
  email?: string;
  profilePhotoUrl?: string;
}

export interface IMonetizePodcast {
  monetizedAllPodcasts: boolean;
}

export interface IUpdateCount {
  episodeCount: number;
  podcastCount?: number;
}
export interface ISubscriptionPlanFeature {
  featureLimit: number;
  monetiseLimit: number;
  podcastsLimit: number;
}
export interface ISubscriptionPlan {
  activated: boolean;
  amount: number;
  autoRenew: boolean;
  caption: string;
  comments: string;
  created: string;
  currency: string;
  days: number;
  id: number;
  displayName: string;
  paymentPlatform: string;
  planTrialPeriodInDays: number;
  subscriptionPlanId: string;
  updated: string;
  planName: string;
  uuid: string;
  features: ISubscriptionPlanFeature;
  popularPlan: boolean;
}

export interface IStripeSecret {
  setUpIntentClientSecret: string;
  intentId: string;
}

export interface ISubscriptionSecret {
  plan: ISubscriptionPlan;
  stripeSecret: IStripeSecret;
}

export interface IAddPaymentToSetupIntent extends IStripeSecret {
  paymentMethodId: string;
}

export interface IActivatePlan {
  userUuid: string;
  planUuid: string;
  paymentMethodId: string;
  couponCode: string;
}

export interface IPaymentStatus {
  isSuccess: boolean;
  isFail: boolean;
}

export interface IStripe {
  isLoading: boolean;
  stripePromise: any;
}

interface INavMenuItem {
  url: string;
  title: string;
}

interface INavMenuDropdownItem extends INavMenuItem {
  Icon: any;
  iconType?: string;
}

export interface ISelectItem {
  label: string;
  value: string;
  icon?: any;
  key?: string;
}

export interface IActionMenuitem {
  label: string;
  iconType?: string;
  IconName?: any;
  url: string;
  hasIcon?: boolean;
  isButton: boolean;
  slug?: string | null;
}

export interface ITableAction {
  MenuIcon: any;
  items: IActionMenuitem[];
}

export interface IPagination {
  current: number;
  total: number | null;
  pageSize: number;
  onChange: (pageNumber: number) => void;
}

export interface IEpisodeCard {
  thumbnailUrl: null | string;
  title: string;
  description: string;
  duration: number | null;
  tags: ITag[] | [];
  id: string;
  date: string | number;
  episodeUrl?: string;
  episodeStatus: string;
  episodeLikeViewCount?: {
    likeCount: number | null;
    viewCount: number | null;
  };
  likedEpisode?: boolean;
  episodeNo?: number | null;
}

export interface IAudioEpisode {
  name: string;
  url: string;
  podcastId: number | null;
  number: number | null;
  duration: number | null;
  uuid: string | null;
  playedDuration?: number | null;
  episodeUrl?: string | null;
}

export interface IAudioPlayer {
  episodes: IAudioEpisode[] | [];
  activeEpisodeId: string;
  isOpen: boolean;
  isPlayTrack: boolean;
}

export interface ISchedule {
  date: string;
  time: string;
}

export interface ITranscript {
  transcriptData: string;
  s3Url: string;
  uuid: string;
}

export interface IMusicItem {
  uuid: string;
  name: string;
  url: string;
  duration: number;
  coverImage: null | string;
  musicType: string;
  artistName: string | null;
}

export interface IAudioEditor {
  data: any[];
  durationList: number[];
  playAudioTrack: AudioPlay;
  audioControls: [AudioControl] | [];
  renameAudio: number | null;
  episodeList: any[];
  musicList: IMusicItem[] | [];
  episodeId: string;
  recentlyUsedMusicList: IMusicItem[] | [];
  deletedTracks: string[] | [];
  history: any;
}
export interface IListenerSubscription {
  uuid: string;
  planName: string;
  displayName: string;
  days: number | null;
  subscriptionPlanId: string;
  caption: string | null;
  comments: string | null;
  amount: number;
  currency: string;
  planTrialPeriodInDays: number;
  paymentPlatform: string;
  autoRenew: boolean;
  features: {
    imageAds: boolean;
    audioAds: boolean;
    qualityAudio: boolean;
    downloadOnYourDevice: boolean;
    skipAds?: boolean;
  };
  popularPlan: boolean;
}

export interface IOpen {
  isOpen: boolean;
  id: null | string;
}
