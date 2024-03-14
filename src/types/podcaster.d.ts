import { Category, PodcastType } from './podcastInterface';

export interface IPodcast {
  categoryId: number;
  categoryName: string;
  episodeCount: number;
  name: string;
  podcastLanguage: string;
  podcastRating: number;
  podcastStatus: string;
  podcastTypeId: number;
  podcastTypeName: string;
  slugUrl: string | null;
  uuid: string | null;
  viewsCount: number;
}

export interface IPodcastsFilterItem {
  uuid: string | null;
  name: string;
  priority: number | null;
}

export interface IPodcastsFilter {
  podcastCategories: IPodcastsFilterItem[];
  podcastTypes: IPodcastsFilterItem[];
  podcastLanguages: string[];
  podcastStatuses: string[];
}

export interface IPodcastsFilterParams {
  categoryUuid: string[] | [];
  typeUuid: string[] | [];
  language: string[] | [];
  podcastStatus: string[] | [];
  startDate: null;
  endDate: null;
  featured: boolean;
}

export interface ITag {
  tagName: string;
  uuid: string | null;
}

export interface IPodcastDetailUser {
  averageRating: null | number;
  bio: string;
  email: string;
  episodeCount: null | number;
  firstName: string;
  lastName: string;
  podcastCount: null | number;
  uuid: null | string;
  profilePhotUrl: null | string;
  allMonetizedAllPodcast: boolean;
}

export interface IEpisodeLikeViewCount {
  likeCount: null | number;
  viewCount: null | number;
}

// export interface IUserTransfer {
//   country: string;
//   customerId: string;
//   dateOfBirth: string;
//   email: string;
//   firstName: string;
//   gender: string;
//   lastName: string;
//   monetizedAllPodcasts: boolean;
//   uuid: string | null;
// }

export interface ISentiMent {
  uuid: string | null;
  sentimentName: string;
}

export interface IEpisode {
  uuid: string | null;
  name: string;
  description: string;
  duration: number | null;
  episodeNo: number | null;
  episodeUrl: string;
  episodeStatus:string;
  episodeCoverImage: string;
  episodeThumbnailImage: string;
  podcastId: number | null;
  country: string;
  language: string;
  categoryName: string;
  episodeTags: ITag[] | [];
  sentiments: ISentiMent[] | [];
  episodeLikeViewCount: IEpisodeLikeViewCount;
  episodePublishedDate?: string;
  episodePublishedOrScheduleDate?: string | number;
}

export interface IPodcastDetail {
  uuid: string | null;
  name: string;
  description: string;
  podcastCoverImage: string;
  category: IPodcastsFilterItem;
  podcastStatus: string;
  publishedDate?: string | null;
  podcastType: IPodcastsFilterItem;
  podcastCountry: string;
  podcastLanguage: string;
  user: IPodcastDetailUser;
  episodes: IEpisode[] | [];
  podcastTags: ITag[] | [];
  podcastThumbnailImage: string;
  slugUrl: string;
  authorUuid: string | null;
  averageRating: number | null;
  numberOfViews: number | null;
  monetized: boolean;
  totalEpisodes: number;
}

export interface IPodcastOptions {
  categories: Category[] | [];
  types: PodcastType[] | [];
}

export interface IPodcastAnalytic {
  subscriptionCount: number;
  downloadCount: number;
  viewCount: number;
}

export interface IPodcastAnalyticsChart {
  chartData: [
    {
      date: number;
      reportCount: number;
    }
  ];
}

export interface chartDate {
  startDate: number;
  endDate: number;
}

export interface ITransactionHistory {
  firstName: string;
  lastName: string;
  transactionDate: number;
  invoiceId: string;
  amount: number;
  transactionStatus: string;
}

export interface IBankDetails {
  accountNumber: number | null;
  ifscCode: string | null;
  bankName: string | null;
  holderName: string | null;
}
